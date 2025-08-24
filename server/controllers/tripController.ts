import { Request, Response } from "express";
import OpenAI from "openai";

const openai = new OpenAI();

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

export const plantrip = async (req: Request, res: Response) => {
  try {
    const { budget, people, destination, duration } =
      req.body as TripRequestBody;

    // 3. The prompt can be slightly simplified as JSON formatting is now guaranteed
    const prompt = `
      You are a professional Indian travel planner.
      Your task is to generate exactly 5 detailed itineraries for a trip to "${destination}".

      Trip Details:
      - Destination: "${destination}"
      - Duration: ${duration} days
      - Number of people: ${people}
      - Total budget: ${budget} INR (for all ${people} people combined)

      Requirements:
      - Generate 5 unique itineraries.
      - Each itinerary must have a title, a daily plan for ${duration} days, and an estimated total budget in INR that is less than or equal to ${budget}.
      - The destination "${destination}" MUST appear in every itinerary title and daily description.
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

    try {
      const itineraries: TripResponse = JSON.parse(rawContent);
      res.json(itineraries);
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
