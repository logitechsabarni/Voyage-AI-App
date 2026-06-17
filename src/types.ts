/**
 * VoyageAI Pro - Unified TypeScript Type Definitions
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

export interface BudgetEstimate {
  stay: number | string;
  food: number | string;
  transport: number | string;
  activities: number | string;
  total: number | string;
}

export interface HiddenGem {
  name: string;
  description: string;
  location: string;
  tip: string;
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
