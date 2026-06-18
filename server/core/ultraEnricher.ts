import { TripPlan, TripRequest, SmartFlight, HotelOption, LocalExperiencePack, SafetyScoreDetails, BookingReservations, DestinationComparison, CompanionScore } from '../../src/types';

/**
 * Dynamic realistic cost-of-living multiplier based on country and city
 */
function getCostMultiplier(city: string, country: string): number {
  const cnt = (country || '').toLowerCase();
  const cty = (city || '').toLowerCase();
  
  // Tier 5: Extremely High Cost (Switzerland, Iceland, Norway, Zurich, Geneva, Reykjavik, Monaco, NY, Singapore, etc.)
  if (
    cnt.includes('switzerland') || 
    cnt.includes('iceland') || 
    cnt.includes('norway') || 
    cnt.includes('denmark') || 
    cnt.includes('monaco') || 
    cty.includes('zurich') || 
    cty.includes('geneva') || 
    cty.includes('reykjavik') || 
    cty.includes('oslo') || 
    cty.includes('copenhagen') ||
    cty.includes('new york') ||
    cty.includes('singapore')
  ) {
    return 2.4;
  }
  // Tier 4: High Cost (Japan, France, UK, Germany, USA, Italy, UAE, Paris, Tokyo, Kyoto, London, Dubai, Berlin)
  if (
    cnt.includes('japan') || 
    cnt.includes('france') || 
    cnt.includes('united kingdom') || 
    cnt.includes('uk') || 
    cnt.includes('germany') || 
    cnt.includes('united states') || 
    cnt.includes('usa') || 
    cnt.includes('italy') || 
    cnt.includes('united arab emirates') || 
    cnt.includes('uae') || 
    cnt.includes('australia') ||
    cnt.includes('canada') ||
    cnt.includes('sweden') ||
    cty.includes('tokyo') || 
    cty.includes('kyoto') || 
    cty.includes('osaka') || 
    cty.includes('paris') || 
    cty.includes('lyon') || 
    cty.includes('london') || 
    cty.includes('dubai') || 
    cty.includes('berlin') || 
    cty.includes('rome') ||
    cty.includes('venice') ||
    cty.includes('tuscany') ||
    cty.includes('sydney') ||
    cty.includes('melbourne') ||
    cty.includes('vancouver') ||
    cty.includes('toronto')
  ) {
    return 1.6;
  }
  // Tier 2: Budget-friendly (India, Vietnam, Thailand, Bali, Morocco, Indonesia, Peru)
  if (
    cnt.includes('india') || 
    cnt.includes('vietnam') || 
    cnt.includes('thailand') || 
    cnt.includes('indonesia') || 
    cnt.includes('morocco') || 
    cnt.includes('peru') || 
    cnt.includes('nepal') || 
    cnt.includes('cambodia') || 
    cnt.includes('laos') || 
    cty.includes('goa') || 
    cty.includes('bali') || 
    cty.includes('darjeeling') || 
    cty.includes('gangtok') || 
    cty.includes('coorg') || 
    cty.includes('munnar') || 
    cty.includes('shillong') || 
    cty.includes('kolkata') || 
    cty.includes('mumbai') || 
    cty.includes('delhi') || 
    cnt.includes('kerala') || 
    cnt.includes('rajasthan')
  ) {
    return 0.55;
  }
  return 1.0;
}

/**
 * Generates an ultra-realistic flight search response
 */
export function getSimulatedFlights(req: TripRequest): SmartFlight[] {
  const code = req.destinationCity.substring(0, 3).toUpperCase();
  const originCode = req.originCity.substring(0, 3).toUpperCase();
  const mult = getCostMultiplier(req.destinationCity, req.destinationCountry);
  
  // Decide active airlines based on countries
  const isIndia = req.originCountry.toLowerCase().includes('india') || req.destinationCountry.toLowerCase().includes('india');
  const isEurope = req.destinationCountry.toLowerCase().match(/(france|germany|italy|spain|uk|netherlands|switzerland|norway)/i);
  const isAsia = req.destinationCountry.toLowerCase().match(/(japan|singapore|thailand|vietnam|indonesia|malaysia)/i);

  const list: SmartFlight[] = [];

  // Cheapest Flight
  list.push({
    airline: isIndia ? 'IndiGo Airlines' : isAsia ? 'AirAsia' : 'Wizz Air / Frontier',
    duration: '8h 20m',
    stops: 1,
    departure: '06:15 AM',
    arrival: '02:35 PM',
    price: Math.round((req.budget === 'economy' ? 240 : req.budget === 'moderate' ? 420 : 680) * mult),
    tier: 'cheapest'
  });

  // Best Flight
  list.push({
    airline: isEurope ? 'Air France / Lufthansa' : isAsia ? 'Singapore Airlines' : 'Emirates',
    duration: '6h 10m',
    stops: 0,
    departure: '10:30 AM',
    arrival: '04:40 PM',
    price: Math.round((req.budget === 'economy' ? 380 : req.budget === 'moderate' ? 620 : 1200) * mult),
    tier: 'best'
  });

  // Fastest Flight
  list.push({
    airline: isIndia ? 'Air India' : 'British Airways / United',
    duration: '5h 45m',
    stops: 0,
    departure: '12:45 PM',
    arrival: '06:30 PM',
    price: Math.round((req.budget === 'economy' ? 450 : req.budget === 'moderate' ? 710 : 1450) * mult),
    tier: 'fastest'
  });

  // Value Option
  list.push({
    airline: 'Qatar Airways',
    duration: '7h 15m',
    stops: 1,
    departure: '09:00 PM',
    arrival: '04:15 AM (+1)',
    price: Math.round((req.budget === 'economy' ? 310 : req.budget === 'moderate' ? 530 : 920) * mult),
    tier: 'value'
  });

  return list;
}

/**
 * Generates beautiful custom hotel recommendations based on budget and region
 */
export function getSimulatedHotels(req: TripRequest): HotelOption[] {
  const city = req.destinationCity;
  const isIndia = req.destinationCountry.toLowerCase().includes('india');
  const mult = getCostMultiplier(req.destinationCity, req.destinationCountry);
  
  return [
    {
      name: isIndia ? `The Taj Residency Palace, ${city}` : `Grand Regent Plaza & Spa, ${city}`,
      area: 'Downtown Culture Circle',
      price: Math.round((req.budget === 'luxury' ? 450 : req.budget === 'premium' ? 280 : 160) * mult),
      rating: 4.8,
      reason: 'Ultimate luxury with high panoramic gardens and immediate transport access.',
      tier: 'luxury'
    },
    {
      name: isIndia ? `Zostel Premium Boutique Hub, ${city}` : `Citadines Urban Suites, ${city}`,
      area: 'Trendsetter Art District',
      price: Math.round((req.budget === 'luxury' ? 220 : req.budget === 'premium' ? 140 : 85) * mult),
      rating: 4.5,
      reason: 'Bustling artsy atmosphere paired with great single-origin visual café setups.',
      tier: 'premium'
    },
    {
      name: `City Heart Inn & Suites`,
      area: 'Historical Town Center',
      price: Math.round((req.budget === 'economy' ? 45 : 75) * mult),
      rating: 4.2,
      reason: 'Highly walk-friendly with traditional breakfasts and high security.',
      tier: 'moderate'
    },
    {
      name: `Nomad Backpacker Pods`,
      area: 'Metro station lines',
      price: Math.round((req.budget === 'economy' ? 22 : 40) * mult),
      rating: 4.0,
      reason: 'Clean smart capsule bedding, great workspace high-speed links.',
      tier: 'economy'
    }
  ];
}

/**
 * Returns customized lists of region-specific hidden treasures
 */
export function getLocalExperiencePack(city: string, req: TripRequest): LocalExperiencePack {
  const normCity = city.toLowerCase();

  // Custom hotspots
  if (normCity.includes('goa')) {
    return {
      street_food: ['Rava Fried Fish', 'Choriz Pao crusts', 'Poi bread sliders', 'Bebinca Custard dessert'],
      instagram_spots: ['Colorful lanes of Fontainhas Quarter', 'Sunset over Cabo de Rama Cliff', 'Chapora Fort heights'],
      sunrise_spots: ['Querim Beach serene sands', 'Dudhsagar Fall morning mist'],
      sunset_spots: ['Vagator Rock lookouts', 'Cola Beach freshwater lagoon']
    };
  }
  if (normCity.includes('tokyo')) {
    return {
      street_food: ['Zesty Lemon Yuzu Ramen', 'Hot Octopus Takoyaki ball', 'Crispy Matcha Melonpan', 'Golden Yakitori'],
      instagram_spots: ['Shibuya Crossing High viewpoint', 'TeamLab borderless light chambers', 'Meguro River Cherry branches'],
      sunrise_spots: ['Tokyo Skytree high deck', 'Tsukiji Outer Market lanes'],
      sunset_spots: ['Shibuya Sky roof observation deck', 'Odaiba Seaside Park artificial bay']
    };
  }

  // Universal dynamic recommendations customized to country/city
  return {
    street_food: [
      `Local signature grilled spices of ${city}`,
      `Freshly rolled crispy native hot pockets`,
      `Sweet glazed local honey treats`,
      `Artisanal signature cold brews`
    ],
    instagram_spots: [
      `The Old Town masonry historic gate of ${city}`,
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
  };
}

/**
 * Generates beautiful safety metrics matching parameters
 */
export function getSafetyScores(req: TripRequest): SafetyScoreDetails {
  const destLower = req.destinationCity.toLowerCase();
  
  // Custom baseline scores
  let baseSafety = 88;
  let baseWeather = 85;
  let baseVisa = 90;

  if (destLower.match(/(paris|london|rome)/)) {
    baseSafety = 84;
    baseVisa = 85;
    baseWeather = 80;
  } else if (destLower.match(/(tokyo|kyoto|singapore)/)) {
    baseSafety = 97;
    baseVisa = 92;
    baseWeather = 88;
  } else if (destLower.match(/(bangkok|phuket|bali|goa)/)) {
    baseSafety = 82;
    baseVisa = 95;
    baseWeather = 86;
  }

  return {
    safety: baseSafety,
    budget: req.budget === 'economy' ? 95 : req.budget === 'moderate' ? 82 : req.budget === 'premium' ? 70 : 55,
    weather: baseWeather,
    ease: 89,
    crowd: req.travelStyle === 'relaxed' ? 70 : req.travelStyle === 'packed' ? 45 : 60,
    visa: baseVisa,
    overall: Math.round((baseSafety + baseWeather + baseVisa + 90) / 4)
  };
}

/**
 * Generates 10+ intelligent custom Travel insights tailored dynamically
 */
export function getIntelligentInsights(req: TripRequest): string[] {
  const dest = req.destinationCity;
  const isIndia = req.destinationCountry.toLowerCase().includes('india') || req.originCountry.toLowerCase().includes('india');
  const currencySymbol = req.currency === 'INR' ? '₹' : req.currency === 'EUR' ? '€' : '$';

  return [
    `VoyageAI Predictive Costing: Booking flights exactly 24 days prior saved an estimated 18% on final outlays.`,
    `Smart Timing Alert: Shifting your return departure 2 days forward sidesteps high commercial weekday spikes.`,
    `Currency Insight: Exchanging cash at downstream downtown post-offices saves up to 4.5% compared to airport booths.`,
    `Localized Transport: Choosing the city's integrated rapid transit line over private taxis boosts travel efficiency by 30%.`,
    `Cultural Connection: Your traveler personality "${req.personality}" is well represented in the historic neighborhoods.`,
    `Weather Wisdom: Packing a breathable, high-performance windbreaker acts as the perfect versatile layer for changing conditions.`,
    `Dining Strategy: The local culinary spots located two blocks off the central avenue provide identical authenticity at half price.`,
    `Language Advantage: Learning just three polite greeting words of the destination's language unlocks warmer hospitality.`,
    `Power Grid Alert: Standard electrical plugs here require specialized adapters. A small multi-socket universal box is recommended.`,
    `Data Connectivity: Pre-ordering a local digital eSIM online avoids long physical passport lines at airport arrival lounges.`,
    `Crowd Peak Advisor: Exploring the primary museum before 09:15 AM guarantees a significantly lower crowd-level count.`
  ];
}

/**
 * Generates beautiful confirmation booking reservation details
 */
export function getSimulatedBookings(req: TripRequest): BookingReservations {
  const destCode = req.destinationCity.substring(0, 3).toUpperCase();
  const randNum = () => Math.floor(100000 + Math.random() * 900000);
  const randAlpha = (len: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let res = '';
    for (let i = 0; i < len; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  return {
    flights: {
      id: `FL-${randNum()}`,
      pnr: randAlpha(6),
      code: `VAI-${randAlpha(4)}`,
      details: `Simulated Flight confirmation: Outbound Departure on ${req.startDate}. Checked baggage included.`
    },
    hotels: {
      id: `HT-${randNum()}`,
      code: `VCH-${randAlpha(5)}`,
      details: `Simulated Hotel voucher: Rooms booked matching your "${req.budget}" tier. Check-in from 02:00 PM.`
    },
    transport: {
      id: `TR-${randNum()}`,
      code: `CAB-${randAlpha(4)}`,
      details: `Simulated Shuttle Voucher: Driver meets you holding a personalized sign at the arrival corridor.`
    },
    activity: {
      id: `AC-${randNum()}`,
      code: `TKT-${randAlpha(6)}`,
      details: `Simulated Unified Experience Pass: Guaranteed priority front-of-line skip entry to the Old Town highlights.`
    }
  };
}

/**
 * Generates high-fidelity side-by-side Destination Comparison scorecard
 */
export function getDestinationComparisons(req: TripRequest): DestinationComparison {
  const primary = req.destinationCity;
  let companion1 = 'Bali';
  let companion2 = 'Thailand';

  if (primary.toLowerCase().includes('tokyo') || primary.toLowerCase().includes('japan')) {
    companion1 = 'Singapore';
    companion2 = 'South Korea';
  } else if (primary.toLowerCase().includes('paris') || primary.toLowerCase().includes('france')) {
    companion1 = 'Rome (Italy)';
    companion2 = 'London (UK)';
  } else if (primary.toLowerCase().includes('goa') || req.destinationCountry.toLowerCase().includes('india')) {
    companion1 = 'Kerala (India)';
    companion2 = 'Darjeeling (India)';
  }

  const optPrimary: CompanionScore = {
    destination: primary,
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
    pros: [`Direct customized fit`, `Matches interests in ${req.interests.slice(0, 2).join(', ') || 'sightseeing'}`, `Top personality match`]
  };

  const opt1: CompanionScore = {
    destination: companion1,
    scores: {
      budget: 85,
      weather: 84,
      crowd: 72,
      flight_cost: 80,
      food_cost: 82,
      safety: 84,
      visa: 90,
      attractions: 88,
      overall: 84
    },
    pros: [`Outstanding budget elasticity`, `Rich tropical atmosphere`, `Very easy local logistics`]
  };

  const opt2: CompanionScore = {
    destination: companion2,
    scores: {
      budget: 78,
      weather: 82,
      crowd: 60,
      flight_cost: 75,
      food_cost: 78,
      safety: 88,
      visa: 88,
      attractions: 90,
      overall: 82
    },
    pros: [`Remarkable food markets`, `Striking cultural landmarks`, `Modern high-speed rail transit`]
  };

  return {
    winner: primary,
    runnerUp: companion1,
    bestBudget: req.budget === 'economy' ? companion1 : 'Bali / Thailand Local',
    bestLuxury: req.budget === 'luxury' || req.budget === 'premium' ? primary : companion1,
    bestFamily: 'Family vacation' === req.personality ? primary : companion1,
    bestAdventure: 'Adventure expedition' === req.personality ? primary : companion2,
    bestRomantic: 'Romantic escape' === req.personality ? primary : companion1,
    explanation: `Based on your chosen criteria (Mood, Travelers Age, and Budget level), ${primary} wins representing a ${optPrimary.scores.overall}% match against its close competitors ${companion1} and ${companion2}. While ${companion1} delivers superb local budget flexibility, ${primary} offers premium cultural immersion and unmatched architectural preservation.`,
    options: [optPrimary, opt1, opt2]
  };
}

/**
 * Enterprise-grade Travel plan enricher. Multiplies standard structures with ultra premium layers
 */
export function enrichPlan(parsed: TripPlan, req: TripRequest): TripPlan {
  // Ensure night is populated for every single itinerary day to fulfill complete day plans
  const enrichedItinerary = parsed.itinerary.map(day => {
    if (!day.night) {
      day.night = {
        place: `Relaxing Local Lounge / Night Market spot`,
        activity: `Sipping signature cocktails or enjoying a quiet stroll catching vibrant twinkling skylines reflecting the evening vibe of the neighborhood.`,
        duration: `1.5 hours`
      };
    }
    return day;
  });

  return {
    ...parsed,
    itinerary: enrichedItinerary,
    flights: getSimulatedFlights(req),
    hotels: getSimulatedHotels(req),
    local_gems: getLocalExperiencePack(req.destinationCity, req),
    safety_and_risk: getSafetyScores(req),
    insights: getIntelligentInsights(req),
    simulated_bookings: getSimulatedBookings(req),
    comparison_engine: getDestinationComparisons(req)
  };
}
