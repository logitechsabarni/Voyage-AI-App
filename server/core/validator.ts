import { TripPlan, TripRequest } from '../../src/types';

/**
 * Clean & repair malformed JSON strings returned from LLMs
 */
export function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  
  // Remove markdown codeblock wrapper if it exists (e.g. ```json ... ```)
  const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    cleaned = jsonMatch[1].trim();
  }
  
  // Sometimes models return some preamble or postamble text before or after the JSON block.
  // We can try to slide to the first '{' and last '}'
  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  // Regex utility to clean trailing commas in objects or arrays
  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');

  return cleaned;
}

/**
 * Creates a beautiful guaranteed fallback TripPlan for ANY destination in the world
 */
export function getFallbackTripPlan(req: TripRequest): TripPlan {
  const dest = `${req.destinationCity}, ${req.destinationCountry}`;
  const days: any[] = [];
  
  // Generate custom days based on duration
  for (let d = 1; d <= req.duration; ++d) {
    const dDate = new Date(req.startDate);
    dDate.setDate(dDate.getDate() + (d - 1));
    const dateStr = dDate.toISOString().split('T')[0];
    
    days.push({
      day: d,
      date: dateStr,
      theme: d === 1 ? `Welcome to ${req.destinationCity} & Essential Highlights` : `Deep Dive into Local Spots & Highlights`,
      morning: {
        place: `Central ${req.destinationCity} Old Quarter Cafe`,
        activity: `Leisurely breakfast tasting traditional breakfast items and planning the neighborhood walk.`,
        duration: `2 hours`
      },
      afternoon: {
        place: `Downtown Historical Landmark & Gardens`,
        activity: `Exploration of famous buildings, architectural sightseeing, and photography representing the local culture.`,
        duration: `3.5 hours`
      },
      evening: {
        place: `Traditional Food Market & Skybar`,
        activity: `Sampling local street eats and watching the sunset with scenic city views.`,
        duration: `3 hours`
      }
    });
  }

  return {
    trip_summary: `Welcome to VoyageAI offline intelligence mode. We have generated a custom trip plan for your travel to ${dest}. This curated route features signature sights matching your travel personality "${req.personality}" and interests centered on ${req.interests.join(', ') || 'cultural highlights'}.`,
    destination_analysis: {
      culture: `A wonderful blend of rich history, unique local hospitality, and distinct geographical context. Travelers here appreciate respectful interactions.`,
      best_time: `Generally amazing during spring and early autumn seasons when crowds are mild and weather is optimal for outdoor tours.`,
      local_behavior: `Dress modestly when visiting ancient religious monuments. Tipping is appreciated but check if service charge is already included locally.`
    },
    itinerary: days,
    food_guide: {
      must_try_foods: [
        `Local signature soup & fresh bread (Traditional specialties)`,
        `Crispy native appetizers served hand-rolled with aromatic local herbs`,
        `Locally brewed tea or traditional direct-drip iced coffee`
      ],
      restaurants: [
        {
          name: `The Heritage Kitchen`,
          type: `Traditional local gourmet dishes`,
          price_level: req.budget === 'luxury' || req.budget === 'premium' ? `$$$` : `$$`,
          reason: `Highly rated local authentic restaurant featuring recipes passed down through multiple generations.`
        },
        {
          name: `Breezy Terrace Cafe & Diner`,
          type: `Modern bistro with panoramic skyline views`,
          price_level: `$$`,
          reason: `Excellent atmosphere matching the style of ${req.travelStyle} travelers seeking relaxed scenery.`
        }
      ]
    },
    stay_recommendations: [
      {
        area: `The historic Downtown District`,
        reason: `Very walking-friendly with instant access to direct public transportation, old cafes, and principal architecture.`,
        budget_level: req.budget
      },
      {
        area: `The Lakeside/Waterfront Quarter`,
        reason: `A premium area offering serene walkways, scenic sunrise vistas, and a host of local food hotspots.`,
        budget_level: req.budget
      }
    ],
    transport_plan: [
      `Purchase a standard day-pass or multi-day metro card for cost-effective transit.`,
      `Verified local taxi-hailing mobile apps are highly reliable and avoid tourist overcharges.`,
      `Walking is the fastest approach for navigating narrow ancient old streets.`
    ],
    budget_estimate: {
      stay: req.budget === 'luxury' ? 1200 : req.budget === 'premium' ? 650 : req.budget === 'moderate' ? 350 : 150,
      food: req.budget === 'luxury' ? 600 : req.budget === 'premium' ? 350 : req.budget === 'moderate' ? 200 : 90,
      transport: 50,
      activities: req.budget === 'luxury' ? 400 : req.budget === 'premium' ? 250 : req.budget === 'moderate' ? 120 : 50,
      total: req.budget === 'luxury' ? 2250 : req.budget === 'premium' ? 1300 : req.budget === 'moderate' ? 720 : 340
    },
    travel_tips: [
      `Keep physical cash handy as small neighborhood convenience stores often don't support international networks.`,
      `Bring comfortable weather-proof walking shoes to enjoy the old cobblestone paths.`,
      `Carry a portable backup battery to stay powered during long exploratory days.`
    ],
    hidden_gems: [
      {
        name: `The Secret Garden & Observatory`,
        description: `An amazing overgrown heritage site secluded from major tourist traffic, offering gorgeous quiet vistas.`,
        location: `Just 1.5km walking behind the main central park`,
        tip: `Best visited around 4:30 PM to enjoy magical golden hour lighting filters.`
      }
    ]
  };
}

/**
 * Validates, repairs, and sanitizes Gemini generator responses
 */
export function validateAiResponse(rawText: string, req: TripRequest): TripPlan {
  if (!rawText || rawText.trim() === '') {
    return getFallbackTripPlan(req);
  }

  try {
    const cleaned = cleanJsonString(rawText);
    const parsed = JSON.parse(cleaned);

    // Ensure core fields exist, fill with fallback structures if not
    const safePlan: TripPlan = {
      trip_summary: parsed.trip_summary || `A tailormade travel plan designed explicitly for exploring ${req.destinationCity}.`,
      destination_analysis: {
        culture: parsed.destination_analysis?.culture || `Deep historic context with vibrant modern developments.`,
        best_time: parsed.destination_analysis?.best_time || `Optimal times include spring and transition seasons.`,
        local_behavior: parsed.destination_analysis?.local_behavior || `Always greet vendors politely: a smile goes a long way.`
      },
      itinerary: Array.isArray(parsed.itinerary) && parsed.itinerary.length > 0 
        ? parsed.itinerary.map((item: any, index: number) => ({
            day: item.day || (index + 1),
            date: item.date || req.startDate,
            theme: item.theme || `Exploring highlights`,
            morning: {
              place: item.morning?.place || `Central Landmark/Cafe`,
              activity: item.morning?.activity || `Interactive regional walk`,
              duration: item.morning?.duration || `2 hours`
            },
            afternoon: {
              place: item.afternoon?.place || `Scenic Neighborhood`,
              activity: item.afternoon?.activity || `Cultural museum immersion`,
              duration: item.afternoon?.duration || `3 hours`
            },
            evening: {
              place: item.evening?.place || `Skyline Restaurant`,
              activity: item.evening?.activity || `Sunset dinner and evening views`,
              duration: item.evening?.duration || `2 hours`
            }
          }))
        : getFallbackTripPlan(req).itinerary,
      food_guide: {
        must_try_foods: Array.isArray(parsed.food_guide?.must_try_foods) && parsed.food_guide.must_try_foods.length > 0
          ? parsed.food_guide.must_try_foods
          : [`Traditional street pastries`, `Locally roasted single-origin artisanal coffee`],
        restaurants: Array.isArray(parsed.food_guide?.restaurants) && parsed.food_guide.restaurants.length > 0
          ? parsed.food_guide.restaurants
          : [
              {
                name: `The City Taverna`,
                type: `Traditional local dishes`,
                price_level: `$$`,
                reason: `Highly popular spot with authentic regional flavor profiles.`
              }
            ]
      },
      stay_recommendations: Array.isArray(parsed.stay_recommendations) && parsed.stay_recommendations.length > 0
        ? parsed.stay_recommendations
        : [
            {
              area: `Central Historic Quarter`,
              reason: `Unbeatable proximity to ancient sights and local markets.`,
              budget_level: req.budget
            }
          ],
      transport_plan: Array.isArray(parsed.transport_plan) && parsed.transport_plan.length > 0
        ? parsed.transport_plan
        : [`Utilize the local urban transit line.`, `Walk as much as possible to fully connect with local vibes.`],
      budget_estimate: {
        stay: parsed.budget_estimate?.stay || (req.budget === 'luxury' ? 1000 : 300),
        food: parsed.budget_estimate?.food || (req.budget === 'luxury' ? 500 : 200),
        transport: parsed.budget_estimate?.transport || 60,
        activities: parsed.budget_estimate?.activities || 100,
        total: parsed.budget_estimate?.total || (req.budget === 'luxury' ? 1900 : 660)
      },
      travel_tips: Array.isArray(parsed.travel_tips) && parsed.travel_tips.length > 0
        ? parsed.travel_tips
        : [
            `Keep some coins or smaller bills ready.`,
            `Comfortable trainers are essential for exploring.`
          ],
      hidden_gems: Array.isArray(parsed.hidden_gems) && parsed.hidden_gems.length > 0
        ? parsed.hidden_gems
        : [
            {
              name: `The Secret Garden Overlook`,
              description: `A fantastic elevated garden that provides peaceful panoramic photos away from the common tourist crowds.`,
              location: `Behind the historic town hall archways`,
              tip: `Perfect for quiet sunsets.`
            }
          ]
    };

    return safePlan;
  } catch (err) {
    console.warn(`JSON validation/repair failed. Recovering using premium fallback templates:`, err);
    return getFallbackTripPlan(req);
  }
}
