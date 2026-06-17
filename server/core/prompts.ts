import { TripRequest } from '../../src/types';

/**
 * Enterprise Prompt Engineering for VoyageAI Pro
 */
export function getTripPlanningPrompt(req: TripRequest): string {
  const interestsList = req.interests.join(', ') || 'general sightseeing, local secrets';
  
  return `You are VoyageAI Pro, an enterprise-grade travel planner. 
Generate a comprehensive, highly personalized, and realistic trip plan based strictly on the following parameters:

ORIGIN: ${req.originCity}, ${req.originCountry}
DESTINATION: ${req.destinationCity}, ${req.destinationCountry}
DATES: From ${req.startDate} to ${req.endDate} (${req.duration} days)
TRAVELERS: ${req.travelers} traveler(s)
TRAVELER PROFILE: Age Group: ${req.ageGroup}, Travel Style: ${req.travelStyle} (e.g. relaxed, active, packed, immersive)
BUDGET TIER: ${req.budget} (economy, moderate, premium, luxury)
TRIP PERSONALITY: ${req.personality}
SPECIFIC INTERESTS: ${interestsList}

Instructions:
1. Ensure the itineraries have logical flow, matching the ${req.travelStyle} style:
   - 'relaxed' style should have leisurely gaps, short durations, and fewer dense sights.
   - 'active' or 'packed' style should include early starts, energetic activities, and tightly timed events.
2. Daily dates must correspond sequentially starting from ${req.startDate}.
3. Limit travel times by listing activities in geographically coherent clusters.
4. Cater foods, stay spots, and hidden gems to the ${req.personality} personality and ${req.budget} budget.
5. Provide actual, specific local names for restaurants, hotels/areas, and attractions—no placeholders like "Local Restaurant A" or "Hotel ABC".
6. The response MUST be ONLY a strict JSON object matches this exact block structure without any markdown wrap or extra text:

{
  "trip_summary": "A cohesive narrative description summarizing this tailored trip, outlining what makes it unique for their style.",
  "destination_analysis": {
    "culture": "A deep culinary, relational, and cultural guide of the destination.",
    "best_time": "When to visit, highlighting local seasons, weather patterns, and festivals.",
    "local_behavior": "Key etiquette guidelines, tipping advice, and behavioral taboos."
  },
  "itinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "theme": "Core theme of this day",
      "morning": {
        "place": "Name of historic place, landmark, or cafe",
        "activity": "Detailed activity explanation custom to interests",
        "duration": "Duration in hours, e.g. '2.5 hours'"
      },
      "afternoon": {
        "place": "Name of park, museum, or market",
        "activity": "Detailed afternoon experience",
        "duration": "Duration in hours"
      },
      "evening": {
        "place": "Specific authentic restaurant, event, or view point",
        "activity": "Authentic night cap activity",
        "duration": "Duration in hours"
      }
    }
  ],
  "food_guide": {
    "must_try_foods": ["Dish 1 with description", "Dish 2 with description"],
    "restaurants": [
      {
        "name": "Authentic Restaurant Name",
        "type": "Cuisine type and special dish",
        "price_level": "$, $$, $$$, or $$$$ matching budget",
        "reason": "Why it fits their traveler profile and interests"
      }
    ]
  },
  "stay_recommendations": [
    {
      "area": "Specific well-known district or neighborhood",
      "reason": "Why this area suits their style and budget",
      "budget_level": "Budget match Tier"
    }
  ],
  "transport_plan": [
    "Specific public transport or taxi advice for inside the destination",
    "Estimated costs or smart travel routes"
  ],
  "budget_estimate": {
    "stay": "Total estimated lodging costs as a number or string description",
    "food": "Total food cost estimation",
    "transport": "Internal transit estimation",
    "activities": "Total entry tickets / experience fees",
    "total": "Sum total travel budget estimation"
  },
  "travel_tips": [
    "Specific local tips on transport safety, packing, power plugs, and local SIMs"
  ],
  "hidden_gems": [
    {
      "name": "Intriguing non-touristy local landmark or experience",
      "description": "Deep description of why it is spectacular",
      "location": "Vague or specific coordinates/address details",
      "tip": "How to get there or avoid crowds"
    }
  ]
}

Ensure to output exact numeric indexes for day starting at 1 up to ${req.duration}. Avoid empty arrays or nulls.`;
}
