/**
 * VoyageAI X Ultra - Unified TypeScript Type Definitions
 */

export interface TripRequest {
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  startDate: string;
  endDate: string;
  duration: number;
  travelers: number;
  ageGroup: 'youth' | 'adult' | 'senior' | 'family';
  travelStyle: 'relaxed' | 'active' | 'packed' | 'immersive';
  budget: 'economy' | 'moderate' | 'premium' | 'luxury';
  personality: 'Romantic escape' | 'Adventure expedition' | 'Cultural exploration' | 'Food journey' | 'Family vacation' | 'Digital nomad' | 'Business travel';
  interests: string[];
  mood?: string;
  currency?: 'INR' | 'USD' | 'EUR';
  naturalQuery?: string;
}

export interface ActivitySlot {
  place: string;
  activity: string;
  duration: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  theme: string;
  morning: ActivitySlot;
  afternoon: ActivitySlot;
  evening: ActivitySlot;
  night?: ActivitySlot;
}

export interface RestaurantItem {
  name: string;
  type: string;
  price_level: string;
  reason: string;
}

export interface FoodGuide {
  must_try_foods: string[];
  restaurants: RestaurantItem[];
}

export interface StayRecommendation {
  area: string;
  reason: string;
  budget_level: string;
}

export interface BudgetEstimateItem {
  inr: number;
  usd: number;
  eur: number;
}

export interface BudgetEstimate {
  stay: number | string;
  food: number | string;
  transport: number | string;
  activities: number | string;
  visa?: number | string;
  insurance?: number | string;
  shopping?: number | string;
  emergency_fund?: number | string;
  taxes?: number | string;
  total: number | string;
}

export interface HiddenGem {
  name: string;
  description: string;
  location: string;
  tip: string;
}

export interface SmartFlight {
  airline: string;
  duration: string;
  stops: number;
  departure: string;
  arrival: string;
  price: number; // in base USD
  tier: 'cheapest' | 'best' | 'fastest' | 'value';
}

export interface HotelOption {
  name: string;
  area: string;
  price: number; // in base USD per night
  rating: number;
  reason: string;
  tier: 'economy' | 'moderate' | 'premium' | 'luxury';
}

export interface LocalExperiencePack {
  street_food: string[];
  instagram_spots: string[];
  sunrise_spots: string[];
  sunset_spots: string[];
}

export interface SafetyScoreDetails {
  safety: number;
  budget: number;
  weather: number;
  ease: number;
  crowd: number;
  visa: number;
  overall: number;
}

export interface BookingVoucher {
  id: string;
  pnr?: string;
  code: string;
  details: string;
}

export interface BookingReservations {
  flights: BookingVoucher;
  hotels: BookingVoucher;
  transport: BookingVoucher;
  activity: BookingVoucher;
}

export interface CompanionScore {
  destination: string;
  scores: {
    budget: number;
    weather: number;
    crowd: number;
    flight_cost: number;
    food_cost: number;
    safety: number;
    visa: number;
    attractions: number;
    overall: number;
  };
  pros: string[];
}

export interface DestinationComparison {
  winner: string;
  runnerUp: string;
  bestBudget: string;
  bestLuxury: string;
  bestFamily: string;
  bestAdventure: string;
  bestRomantic: string;
  explanation: string;
  options: CompanionScore[];
}

export interface TripPlan {
  trip_summary: string;
  destination_analysis: {
    culture: string;
    best_time: string;
    local_behavior: string;
  };
  itinerary: ItineraryDay[];
  food_guide: FoodGuide;
  stay_recommendations: StayRecommendation[];
  transport_plan: string[];
  budget_estimate: BudgetEstimate;
  travel_tips: string[];
  hidden_gems: HiddenGem[];
  
  // VoyageAI X Ultra additions
  flights?: SmartFlight[];
  hotels?: HotelOption[];
  local_gems?: LocalExperiencePack;
  safety_and_risk?: SafetyScoreDetails;
  insights?: string[];
  simulated_bookings?: BookingReservations;
  comparison_engine?: DestinationComparison;
}

export interface WeatherDay {
  date: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  suitability: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface WeatherData {
  currentTemp: number;
  currentCondition: string;
  avgHumidity: number;
  generalVerdict: string;
  forecast: WeatherDay[];
}

export interface RecommendationScore {
  place: string;
  score: number;
  reason: string;
  category: 'Attractions' | 'Food' | 'Hotels' | 'Hidden gems';
  price_level?: string;
}

export interface DestinationMetrics {
  overallScore: number;
  difficultyScore: number;
  weatherScore: number;
  budgetSuitability: number;
  interestsMatch: number;
}
