import { Request, Response } from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import User from "../models/User";
import redis from "../lib/redis";
dotenv.config();

const openai = new OpenAI();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

interface TripRequestBody {
  budget: number;
  people: number;
  destination: string;
  duration: number;
}

interface Itinerary {
  title: string;
  days: string[];
  estimated_budget: number;
}

interface TripResponse {
  itineraries: Itinerary[];
}

export const plantrip = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { budget, people, destination, duration } =
      req.body as TripRequestBody;

    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // 1. Create a unique and consistent cache key
    const normalizedDestination = destination
      .toLowerCase()
      .replace(/\s+/g, "-");
    // "Bucket" the budget to increase cache hits
    const budgetBucket = Math.floor(budget / 5000) * 5000;
    const cacheKey = `trip-plan:${normalizedDestination}:${duration}d:${people}p:${budgetBucket}inr`;

    // 2. Check the cache first
    const cachedPlan = await redis.get(cacheKey);

    if (cachedPlan) {
      console.log(`Cache HIT for ${cacheKey}!`);
      const parsedPlan = typeof cachedPlan === 'string' 
        ? JSON.parse(cachedPlan) 
        : cachedPlan;
      const isPremiumActive =
        user?.subscription.plan === "premium" &&
        user.subscription.expiresAt &&
        user.subscription.expiresAt > new Date();

      // We still need to send back the user's current remaining plan count
      return res.json({
        ...parsedPlan,
        remainingPlans: isPremiumActive
          ? "Unlimited"
          : 5 - (user?.planGeneratedCount || 0),
        servedFromCache: true, // Optional: for debugging
      });
    }

    // 3. CACHE MISS: If not in cache, proceed with paywall and AI generation
    console.log(`Cache MISS for ${cacheKey}. Checking access and calling API.`);

    // ++ PAYWALL LOGIC (NOW INSIDE CACHE MISS) ++

    const hasFreePlansLeft = user.planGeneratedCount < 5;
    const isPremiumActive =
      user.subscription.plan === "premium" &&
      user.subscription.expiresAt &&
      user.subscription.expiresAt > new Date();

    if (!hasFreePlansLeft && !isPremiumActive) {
      return res.status(402).json({
        error:
          "You have used all your free trip plans. Please subscribe for unlimited access.",
      });
    }
    // ++ PAYWALL LOGIC END ++

    // 3. The prompt can be slightly simplified as JSON formatting is now guaranteed
    const prompt = `
  You are an expert Indian travel consultant and master itinerary crafter. You specialize in creating diverse and memorable travel experiences across India.
  Your goal is to generate 5 distinct, high-quality travel itineraries for a user planning a trip to "${destination}". These plans must be practical, inspiring, and cater to different travel styles.

  ### Trip Details:
  - Destination: "${destination}"
  - Duration: ${duration} days
  - Number of people: ${people}
  - Total budget: ${budget} INR (for all ${people} people combined)

  ### Guiding Principles for Itinerary Generation:
  1.  **Themed Itineraries**: To ensure the 5 itineraries are truly unique, base each one on a different travel theme. Examples of themes include:
      - "Luxury & Relaxation"
      - "Adventure & Thrill-Seeker"
      - "Budget Backpacker's Journey"
      - "Family Fun & Entertainment"
      - "Cultural & Historical Deep Dive"
      - "Foodie's Paradise"
      Select 5 diverse themes that are appropriate for "${destination}".

  2.  **Practical Details**: The daily plan should be more than a list of places. Include practical suggestions like specific famous landmarks, recommended types of local cuisine to try, and logistical tips (e.g., "take a 30-minute auto-rickshaw ride to the old city," "best visited in the morning to avoid crowds").

  3.  **Budget Realism**: The estimated budget for each itinerary must be strictly less than or equal to the total budget of ${budget} INR. To make the budget realistic, briefly mention how it's allocated within the daily descriptions (e.g., "Stay in budget guesthouses," "Dine at local cafes," "Splurge on a fine-dining experience").

  ### Output Requirements:
  - Generate exactly 5 itineraries.
  - Each itinerary must contain a 'title', a 'days' array, and an 'estimated_budget'.
  - The 'title' must be creative and reflect its theme (e.g., "A Luxurious 5-Day Retreat in Goa" instead of just "Goa Trip").
  - The 'days' array must contain a detailed string for each of the ${duration} days.
  - Conclude each itinerary's description (perhaps on the last day's plan) with a unique **"Pro Tip"** relevant to that travel style in "${destination}".
   - **Formatting**: In the string for each day's plan, you MUST use Markdown to make the day number and the budget bold. For example: "**Day 1:** ... **Budget:** 15000 INR."
`;

    // 4. Use the OpenAI SDK client to make the API call
    const completion = await openai.chat.completions.create({
      // 5. Update the model to gpt-4o-mini
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful travel assistant for an Indian travel website. You must respond with a valid JSON object that follows this exact schema: {"itineraries": [{"title": "string", "days": ["Day 1: ..."], "estimated_budget": number}]}`,
        },
        { role: "user", content: prompt },
      ],
      // 6. Enable JSON Mode! This is the most important change.
      response_format: { type: "json_object" },
      temperature: 0.7, // A little creativity is good for itineraries
      max_tokens: 4096, // Give it plenty of space for detailed plans
    });

    const rawContent = completion.choices[0].message.content;

    // 7. With JSON mode, parsing is now simple and safe
    if (!rawContent) {
      return res.status(500).json({ error: "API returned empty content." });
    }

    // 4. Store the NEW result in the cache for 30 days
    await redis.set(cacheKey, rawContent, { ex: 2592000 }); // 30 days in seconds
    console.log(`SUCCESS: New plan for ${cacheKey} stored in cache.`);

    try {
      const itineraries: TripResponse = JSON.parse(rawContent);
      // ++ INCREMENT FREE PLAN COUNTER BEFORE RESPONDING ++
      // 4. If the trip was generated using a free plan, update the count.
      if (hasFreePlansLeft && !isPremiumActive) {
        user.planGeneratedCount += 1;
        await user.save();
      }

      res.json({
        ...itineraries,
        // Optionally send back the remaining plan count to the frontend
        remainingPlans: isPremiumActive
          ? "Unlimited"
          : 5 - user.planGeneratedCount,
      });
      // ++ END INCREMENT LOGIC ++
    } catch (error) {
      console.error(
        "Final JSON Parse Error (should not happen with JSON mode):",
        error
      );
      res.status(500).json({
        error: "Failed to parse the itinerary from the AI response.",
        details: rawContent,
      });
    }
  } catch (error) {
    // The OpenAI SDK provides more detailed error objects
    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API Error:", error.status, error.message);
      return res.status(error.status).json({ error: error.message });
    }
    console.error("Trip Planner Error:", error);
    res.status(500).json({
      error: "An unexpected error occurred while generating the itinerary.",
    });
  }
};
