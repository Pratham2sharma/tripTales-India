import { Request, Response } from "express";

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

    const prompt = `
You are a professional Indian travel planner.
Your task is to generate exactly 5 detailed itineraries for a trip.

INPUTS:
- Destination: "${destination}" (MUST appear in every itinerary and every day's description, never leave blank or use "undefined")
- Duration: ${duration} days
- Number of people: ${people}
- Total budget: ${budget} INR (for all ${people} people combined)

REQUIREMENTS:
- Generate exactly 5 unique itineraries.
- Each itinerary MUST include:
  1. Title (must include the destination "${destination}")
  2. Daily plan for all ${duration} days
     - Every day must include activities, sightseeing, and food/restaurant suggestions if relevant
     - The destination "${destination}" must be explicitly mentioned in every day's description. Never use "undefined" or leave the destination blank.
  3. Estimated total budget in INR (number, <= ${budget})

STRICT RULES:
- Never use the word "undefined" anywhere.
- Never leave the destination blank. Always use "${destination}".
- Do NOT include extra text, explanations, or markdown outside JSON.
- Do NOT include any keys or values as "undefined".
- If any input is missing, return an error JSON: {"error": "Missing input"}

OUTPUT FORMAT:
Return STRICTLY valid JSON ONLY, matching this schema:

{
  "itineraries": [
    {
      "title": "string",
      "days": ["Day 1: ...", "Day 2: ...", "... up to ${duration} days"],
      "estimated_budget": number
    }
  ]
}

IMPORTANT:
- The destination "${destination}" must appear explicitly in every itinerary title and every daily activity description.
- Do NOT include "undefined" or blank values anywhere.
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000", // change in production
          "X-Title": "Travel India Trip Planner",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo", // free model
          messages: [
            { role: "system", content: "You are a strict JSON generator." },
            { role: "user", content: prompt },
          ],
          temperature: 0.5,
          max_tokens: 1500, // increase to allow full itineraries
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).json({
        error: `OpenRouter API Error: ${response.status} ${response.statusText}`,
        details: errorText,
      });
    }

    const data = await response.json();
    let rawText = data.choices?.[0]?.message?.content?.trim() || "";

    // Robust JSON extraction
    let itineraries: TripResponse;
    try {
      itineraries = JSON.parse(rawText);
    } catch (error) {
      console.error("JSON Parse Error:", error);
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          itineraries = JSON.parse(jsonMatch[0]);
        } catch {
          itineraries = {
            itineraries: [
              { title: "Parse Error", days: [rawText], estimated_budget: 0 },
            ],
          };
        }
      } else {
        itineraries = {
          itineraries: [
            { title: "Parse Error", days: [rawText], estimated_budget: 0 },
          ],
        };
      }
    }

    res.json(itineraries);
  } catch (error) {
    console.error("Trip Planner Error:", error);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
};
