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
 * Dynamic realistic budget calculation engine based on destination, duration, and budget tier.
 */
export function computeRealisticBudget(req: TripRequest) {
  const country = (req.destinationCountry || '').toLowerCase();
  const city = (req.destinationCity || '').toLowerCase();
  
  // 1. Determine cost-of-living multiplier by country/city
  let multiplier = 1.0; // standard / default
  
  // Tier 5: Extremely High Cost (Switzerland, Iceland, Norway, Zurich, Geneva, Reykjavik, Monaco, NY, Singapore, etc.)
  if (
    country.includes('switzerland') || 
    country.includes('iceland') || 
    country.includes('norway') || 
    country.includes('denmark') || 
    country.includes('monaco') || 
    city.includes('zurich') || 
    city.includes('geneva') || 
    city.includes('reykjavik') || 
    city.includes('oslo') || 
    city.includes('copenhagen') ||
    city.includes('new york') ||
    city.includes('singapore')
  ) {
    multiplier = 2.4;
  }
  // Tier 4: High Cost (Japan, France, UK, Germany, USA, Italy, UAE, Paris, Tokyo, Kyoto, London, Dubai, Berlin)
  else if (
    country.includes('japan') || 
    country.includes('france') || 
    country.includes('united kingdom') || 
    country.includes('uk') || 
    country.includes('germany') || 
    country.includes('united states') || 
    country.includes('usa') || 
    country.includes('italy') || 
    country.includes('united arab emirates') || 
    country.includes('uae') || 
    country.includes('australia') ||
    country.includes('canada') ||
    country.includes('sweden') ||
    city.includes('tokyo') || 
    city.includes('kyoto') || 
    city.includes('osaka') || 
    city.includes('paris') || 
    city.includes('lyon') || 
    city.includes('london') || 
    city.includes('dubai') || 
    city.includes('berlin') || 
    city.includes('rome') ||
    city.includes('venice') ||
    city.includes('tuscany') ||
    city.includes('sydney') ||
    city.includes('melbourne') ||
    city.includes('vancouver') ||
    city.includes('toronto')
  ) {
    multiplier = 1.6;
  }
  // Tier 2: Budget-friendly (India, Vietnam, Thailand, Bali, Morocco, Indonesia, Peru)
  else if (
    country.includes('india') || 
    country.includes('vietnam') || 
    country.includes('thailand') || 
    country.includes('indonesia') || 
    country.includes('morocco') || 
    country.includes('peru') || 
    country.includes('nepal') || 
    country.includes('cambodia') || 
    country.includes('laos') || 
    city.includes('goa') || 
    city.includes('bali') || 
    city.includes('darjeeling') || 
    city.includes('gangtok') || 
    city.includes('coorg') || 
    city.includes('munnar') || 
    city.includes('shillong') || 
    city.includes('kolkata') || 
    city.includes('mumbai') || 
    city.includes('delhi') || 
    city.includes('kerala') || 
    city.includes('rajasthan')
  ) {
    multiplier = 0.55;
  }
  // Tier 1: Ultra-Budget if explicitly obscure and small villages/towns in developing regions
  else if (
    city.includes('village') || 
    city.includes('town')
  ) {
    multiplier = 0.45;
  }
  
  const days = req.duration || 3;
  
  // Base daily costs per person in USD
  let dailyStay = 60;
  let dailyFood = 25;
  let dailyTransport = 12;
  let dailyActivities = 15;
  
  if (req.budget === 'luxury') {
    dailyStay = 350;
    dailyFood = 120;
    dailyTransport = 60;
    dailyActivities = 100;
  } else if (req.budget === 'premium') {
    dailyStay = 180;
    dailyFood = 70;
    dailyTransport = 35;
    dailyActivities = 50;
  } else if (req.budget === 'moderate') {
    dailyStay = 90;
    dailyFood = 40;
    dailyTransport = 18;
    dailyActivities = 25;
  } else { // economy
    dailyStay = 35;
    dailyFood = 15;
    dailyTransport = 8;
    dailyActivities = 10;
  }
  
  const stay = Math.round(dailyStay * days * multiplier);
  const food = Math.round(dailyFood * days * multiplier);
  const transport = Math.round(dailyTransport * days * multiplier);
  const activities = Math.round(dailyActivities * days * multiplier);
  const total = stay + food + transport + activities;
  
  return {
    stay: stay || 120,
    food: food || 60,
    transport: transport || 30,
    activities: activities || 40,
    total: total || 250
  };
}

/**
 * Creates a beautiful guaranteed fallback TripPlan for ANY destination in the world with daily variation
 */
export function getFallbackTripPlan(req: TripRequest): TripPlan {
  const dest = `${req.destinationCity}, ${req.destinationCountry}`;
  const days: any[] = [];

  const themes = [
    `Essential highlights & Architectural legacy`,
    `Artisanal neighborhoods, Local secrets & Craft legacy`,
    `Scenic vantage outlooks, Green sanctums & Local cuisines`,
    `Museum treasures, Historic lanes & Cultural landmarks`,
    `Bustling local markets, Custom workshops & Skyline panoramas`,
    `Coastal viewpoints, Riverfront walkways & Sunset harbors`,
    `Ancient cathedrals, Masonry alleys & Botanical oases`,
    `Modern architectural marvels, Urban districts & Gastronomy`,
    `High-altitude ridges, Panoramic parks & Cultural trails`,
    `Serene local quarters, Tea rooms & Craft workshops`
  ];

  const morningPlaces = [
    `Central ${req.destinationCity} Old Quarter Bakery`,
    `The Historic ${req.destinationCity} Gateway Plaza`,
    `High Ridge ${req.destinationCity} Sunrise Overlook`,
    `The Grand Memorial Museum Chambers`,
    `The Floating Waterfront Canal Cafe`,
    `Artisanal Botanical Conservatory & Orchids`,
    `The Legacy ${req.destinationCity} Tea Pavilion`,
    `Panoramic Summit Skydeck Coffee Shop`,
    `Quaint Cobblestone Artisan Lane Cafe`,
    `The Ancient Sanctuary Gardens Entrance`
  ];

  const morningActivities = [
    `Enjoy freshly baked local pastries paired with traditional roasted blends while discussing day route plans.`,
    `Take part in an early morning walking tour of historical masonry structures and monuments.`,
    `Capture beautiful initial golden hour colors above the horizon with local coffee.`,
    `Walk through quiet early gallery exhibitions and ancient local scrolls history guides.`,
    `Watch traditional wooden boat networks deploy while sampling local herbal drinks.`,
    `Observe beautiful floral arrangements and sample refreshing organic garden infusions.`,
    `Witness traditional beverage preparation ceremonies and taste rare local leaf brews.`,
    `Climb the architectural observation spire for 360-degree aerial photographs.`,
    `Stroll past dynamic workshops watching local silversmiths and leather artisans carve.`,
    `Participate in peaceful garden morning walks enjoying cool fog and clean air.`
  ];

  const afternoonPlaces = [
    `Downtown ${req.destinationCity} Cultural Center`,
    `The Historic ${req.destinationCity} Bazaar & Craft Alley`,
    `Scenic Riverside Boardwalk & Canopy Path`,
    `The Regal Sovereign Gardens & Fountain Courtyard`,
    `Ancient Guild Hall & Architectural Archive`,
    `Panoramic Hillside Lookout Tower`,
    `The Legacy Crafts & Weaving Cooperative`,
    `Modern Industrial Arts Block & Gallery`,
    `Serene Nature Forest Reserve Entrance`,
    `The Maritime Heritage Dockyards & Pier`
  ];

  const afternoonActivities = [
    `Explore classic galleries, modern sculptures, and interactive regional displays.`,
    `Walk through vibrant colorful alleyways admiring traditional spice racks, ceramics, and textiles.`,
    `Rent a local cruiser bike and pedal under giant shade trees alongside the central river.`,
    `Rest by the hand-sculpted stone fountains while enjoying local fruit ice and historic sculptures.`,
    `Study original building blueprints, ancient town maps, and historical timber framing designs.`,
    `Hike up the winding historic stone steps to trace medieval rampart boundaries.`,
    `Learn about regional dye-making, fabric weaving, and handmade clay pottery history.`,
    `Wander through converted old brick houses hosting cutting-edge contemporary visual arts.`,
    `Discover hidden rock-hewn caves, mossy wooden bridges, and clean clear creeks.`,
    `Tour a beautifully restored custom merchant ship model detailing early trade accounts.`
  ];

  const eveningPlaces = [
    `Saffron Heritage Rooftop Club`,
    `The ${req.destinationCity} Waterfront Lantern Lounge`,
    `Sunset Peak Panorama Grill`,
    `The Gastronomy Boulevard Market`,
    `High-Speed Skydeck Observatory Restaurant`,
    `The Botanical Garden Greenhouse Conservatory Lounge`,
    `The Floating Harbor Pier & Tapas Bar`,
    `Art Deco Theater & Music Plaza Cafe`,
    `The Lantern-Lit Courtyard Tavern`,
    `The Cliffedge Horizon Tavern`
  ];

  const eveningActivities = [
    `Taste traditional wood-fired legacy dishes and review the daily travel log.`,
    `Dine on fresh riverside catch drizzled in local lemon herbs under soft lighting.`,
    `Enjoy slow-charred barbecue platters looking down at twinkling city street lights.`,
    `Sample 6 different street snacks from legacy stalls, including local coconut sweets.`,
    `Indulge in fusion culinary treats while witnessing night cityscapes materialize.`,
    `Sip organic forest drinks surrounded by exotic illuminated floral architectures.`,
    `Savor toasted seafood breads and traditional slow-brewed mocktails at the docks.`,
    `Watch a traditional puppet, music, or dramatic display while eating seasoned grains.`,
    `Relax to acoustic chord strings inside the vintage brick wine cellar.`,
    `Appreciate panoramic twilight skies over coastal waves with regional appetizers.`
  ];
  
  // Generate custom days based on duration with high variations
  for (let d = 1; d <= req.duration; ++d) {
    const dDate = new Date(req.startDate);
    dDate.setDate(dDate.getDate() + (d - 1));
    const dateStr = dDate.toISOString().split('T')[0];
    
    const idx = (d - 1) % themes.length;
    
    days.push({
      day: d,
      date: dateStr,
      theme: `Day ${d}: ${themes[idx]}`,
      morning: {
        place: morningPlaces[idx],
        activity: morningActivities[idx],
        duration: `2.5 hours`
      },
      afternoon: {
        place: afternoonPlaces[idx],
        activity: afternoonActivities[idx],
        duration: `3.5 hours`
      },
      evening: {
        place: eveningPlaces[idx],
        activity: eveningActivities[idx],
        duration: `3 hours`
      }
    });
  }

  return {
    trip_summary: `Welcome to VoyageAI premium dynamic intelligence. We have generated an ultra-custom trip plan for your travel to ${dest}. This curated route features signature sights matching your travel personality "${req.personality}" and interests centered on ${req.interests.join(', ') || 'local culture exploration'}.`,
    destination_analysis: {
      culture: `A wonderful blend of rich history, unique local hospitality, and distinct geographical context. Travelers in ${req.destinationCity} appreciate respectful and genuine interactions.`,
      best_time: `Generally amazing during spring and early autumn seasons when crowds are mild, weather is optimal, and seasonal activities peaks.`,
      local_behavior: `Dress appropriately when visiting ancient religious monuments. Tipping is highly appreciated locally but check first if service details are included.`
    },
    itinerary: days,
    food_guide: {
      must_try_foods: [
        `Local signature herb-grilled delicacies (Traditional specialities of ${req.destinationCity})`,
        `Crispy native appetizers served hand-rolled with aromatic local herbs`,
        `Locally brewed traditional direct-drip iced coffee`
      ],
      restaurants: [
        {
          name: `The ${req.destinationCity} Heritage Kitchen`,
          type: `Traditional local gourmet dishes of ${req.destinationCountry}`,
          price_level: req.budget === 'luxury' || req.budget === 'premium' ? `$$$` : `$$`,
          reason: `Highly rated local authentic restaurant featuring recipes passed down through multiple generations.`
        },
        {
          name: `Breezy Terrace Cafe & Diner`,
          type: `Modern bistro with panoramic city views`,
          price_level: `$$`,
          reason: `Excellent atmosphere matching the style of ${req.travelStyle} travelers seeking relaxed scenery.`
        }
      ]
    },
    stay_recommendations: [
      {
        area: `The historic ${req.destinationCity} Downtown District`,
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
      `Purchase a standard day-pass or multi-day metro card for cost-effective transit around ${req.destinationCity}.`,
      `Verified local taxi-hailing mobile apps are highly reliable and avoid tourist overcharges.`,
      `Walking is the fastest approach for navigating narrow ancient old streets.`
    ],
    budget_estimate: computeRealisticBudget(req),
    travel_tips: [
      `Keep physical cash handy as small neighborhood convenience stores often don't support international networks.`,
      `Bring comfortable weather-proof walking shoes to enjoy the old cobblestone paths of ${req.destinationCity}.`,
      `Carry a portable backup battery to stay powered during long exploratory days.`
    ],
    hidden_gems: [
      {
        name: `The Secret Garden & Observatory of ${req.destinationCity}`,
        description: `An amazing overgrown heritage site secluded from major tourist traffic, offering gorgeous quiet vistas.`,
        location: `Just 1.5km walking behind the main central park`,
        tip: `Best visited around 4:30 PM to enjoy magical golden hour lighting filters.`
      }
    ],
    local_gems: {
      street_food: [
        `Local signature grilled spices of ${req.destinationCity}`,
        `Freshly rolled crispy native hot pockets`,
        `Sweet glazed honey treats`,
        `Artisanal signature cold brews`
      ],
      instagram_spots: [
        `The Old Town masonry historic gate of ${req.destinationCity}`,
        `High panoramic sky-lounge viewing platforms`,
        `Quaint neon-lit canals or rustic wooden arches`
      ],
      sunrise_spots: [
        `The highest hilltop Citadel observatory`,
        `Quiet eastern sandy waterfront coast`
      ],
      sunset_spots: [
        `Historic bridge overlooking river lanes`,
        `Scenic rooftop café patios`
      ]
    },
    comparison_engine: {
      winner: req.destinationCity,
      runnerUp: `${req.destinationCity} Neighbors`,
      bestBudget: `${req.destinationCity} Suburbs`,
      bestLuxury: req.destinationCity,
      bestFamily: req.destinationCity,
      bestAdventure: req.destinationCity,
      bestRomantic: req.destinationCity,
      explanation: `Based on your chosen criteria, ${req.destinationCity} delivers the absolute optimal balance of localized cultural experiences and beautiful walking accessibility.`,
      options: [
        {
          destination: req.destinationCity,
          scores: {
            budget: req.budget === 'economy' ? 85 : 68,
            weather: 88,
            crowd: 65,
            flight_cost: 72,
            food_cost: 74,
            safety: 90,
            visa: 94,
            attractions: 96,
            overall: 88
          },
          pros: [`Direct customized fit`, `Highest matching index`, `Excellent accessibility`]
        }
      ]
    }
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
      budget_estimate: computeRealisticBudget(req),
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
          ],
      local_gems: parsed.local_gems && Array.isArray(parsed.local_gems.street_food)
        ? parsed.local_gems
        : getFallbackTripPlan(req).local_gems,
      comparison_engine: parsed.comparison_engine && parsed.comparison_engine.winner
        ? parsed.comparison_engine
        : getFallbackTripPlan(req).comparison_engine
    };

    return safePlan;
  } catch (err) {
    console.warn(`JSON validation/repair failed. Recovering using premium fallback templates:`, err);
    return getFallbackTripPlan(req);
  }
}
