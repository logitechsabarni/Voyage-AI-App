import { WeatherData, WeatherDay } from '../../src/types';

/**
 * Maps WMO weather code to standard friendly conditions
 */
function mapWmoCodeToCondition(code: number): string {
  if (code === 0) return 'Clear Sunny';
  if (code >= 1 && code <= 3) return 'Partly Cloudy';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Light Drizzle';
  if (code >= 61 && code <= 65) return 'Rain Showers';
  if (code >= 71 && code <= 77) return 'Snowfall';
  if (code >= 80 && code <= 82) return 'Passing Showers';
  if (code >= 85 && code <= 86) return 'Snow Showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Partly Cloudy';
}

/**
 * Determines outdoor appropriateness based on temperature and condition
 */
function getSuitability(temp: number, condition: string): 'excellent' | 'good' | 'fair' | 'poor' {
  if (condition.includes('Rain') || condition.includes('Thunderstorm')) return 'fair';
  if (temp > 33 || temp < 5) return 'good';
  return 'excellent';
}

/**
 * Resilient offline weather fallback engine in case of API outage or rate limits.
 * Implements highly realistic, localized, and context-aware climate modeling for any global destination.
 */
export function getFallbackWeather(city: string, country: string, duration: number, startDateStr: string): WeatherData {
  const normCity = city.toLowerCase().trim();
  const normCountry = country.toLowerCase().trim();
  const desc = `${normCity}, ${normCountry}`;
  
  // Extract month (0=Jan, 1=Feb, ... 5=Jun, 11=Dec)
  const travelDate = new Date(startDateStr);
  const month = isNaN(travelDate.getTime()) ? 5 : travelDate.getMonth(); // Default to June
  
  let baseTemp = 20; 
  let generalCondition = 'Partly Cloudy';
  let humidity = 60;
  let windSpeed = 12;
  let generalVerdict = 'Weather conditions are highly suitable for sightseeing and local walking tours.';

  // 1. Diagnose Climate Class based on geography and month context
  
  // A. ALPINE / HILL STATIONS / HIGH ELEVATION (Darjeeling, Gangtok, Munnar, Coorg, Shillong, Interlaken, Swiss, Zermatt, Hallstatt, Banff, Alps, Cusco, Andes, Himalayas)
  if (
    normCity.includes('darjeeling') ||
    normCity.includes('gangtok') ||
    normCity.includes('munnar') ||
    normCity.includes('coorg') ||
    normCity.includes('shillong') ||
    normCity.includes('interlaken') ||
    normCity.includes('zermatt') ||
    normCity.includes('hallstatt') ||
    normCity.includes('banff') ||
    normCity.includes('leh') ||
    normCity.includes('ladakh') ||
    normCity.includes('shimla') ||
    normCity.includes('manali') ||
    normCity.includes('ooty') ||
    normCity.includes('alpine') ||
    normCity.includes('andes') ||
    normCity.includes('cusco') ||
    normCity.includes('mountain') ||
    normCountry.includes('switzerland') ||
    normCountry.includes('austria')
  ) {
    // High altitude: cool
    if (month >= 4 && month <= 8) { // May to September (Summer/Monsoon)
      if (normCity.includes('darjeeling') || normCity.includes('gangtok') || normCity.includes('shillong') || normCity.includes('coorg') || normCity.includes('munnar') || normCountry.includes('india')) {
        // Indian Hill Station Monsoon
        baseTemp = 16;
        generalCondition = 'Heavy Monsoon Rain & Mist';
        humidity = 95;
        windSpeed = 15;
        generalVerdict = 'Peaking South-Asian Southwest monsoon. Cool misty temperatures with dense fog and daily rain showers. Carry high-quality waterproof gear and thermal layers.';
      } else {
        // Alpine Summer (Europe, Canada)
        baseTemp = 15;
        generalCondition = 'Clear Sunny & Crisp';
        humidity = 50;
        windSpeed = 10;
        generalVerdict = 'Crisp mountain breezes and highly clear skies. Incredible conditions for outdoor alpine trekking, exploration, and photography.';
      }
    } else { // Winter months
      baseTemp = 3;
      generalCondition = 'Snowfall & Overcast';
      humidity = 80;
      windSpeed = 22;
      generalVerdict = 'Heavy alpine winter freeze with mountain snow cycles. Extremely cold. Full thermal wear, heavy outerwear, and specialized snow boots are highly essential.';
    }
  }
  // B. TROPICAL MONSOON / HUMID EQUATORIAL (Kerala, Mumbai, Kolkata, Goa, Singapore, Bangkok, Phuket, Bali, Vietnam, Philippines, Maldives, Colombia, Amazon)
  else if (
    normCity.includes('kerala') ||
    normCity.includes('mumbai') ||
    normCity.includes('kolkata') ||
    normCity.includes('goa') ||
    normCity.includes('singapore') ||
    normCity.includes('bangkok') ||
    normCity.includes('phuket') ||
    normCity.includes('bali') ||
    normCity.includes('maldives') ||
    normCountry.includes('vietnam') ||
    normCountry.includes('thailand') ||
    normCountry.includes('philippines') ||
    normCountry.includes('indonesia') ||
    normCountry.includes('colombia') ||
    normCountry.includes('sri lanka')
  ) {
    // Tropical climate
    baseTemp = 29;
    humidity = 82;
    
    // Check if June-September South Asian Monsoon
    if ((month >= 5 && month <= 8) && (normCountry.includes('india') || normCity.includes('mumbai') || normCity.includes('kolkata') || normCity.includes('kerala') || normCity.includes('goa') || normCity.includes('bangkok') || normCountry.includes('thailand'))) {
      baseTemp = 26;
      generalCondition = 'Monsoon Thunderstorms';
      humidity = 90;
      windSpeed = 24;
      generalVerdict = 'Peak tropical monsoon winds and heavy thunderstorm downpours. High humidity levels. Indoor museums and covered localized restaurants are best during heavy afternoon cloud bursts.';
    } else {
      generalCondition = 'Tropical Warmth';
      windSpeed = 12;
      generalVerdict = 'Tropical high humidity with warm weather. Mild breezes from coastal banks. Perfect for tropical beachside experiences, evening pools, and light clothing.';
    }
  }
  // C. SCORCHING DESERT / SEMI-ARID (Dubai, Cairo, Egypt, Rajasthan, Delhi, Sahara, Vegas, Riyadh, Saudi Arabia, Kuwait)
  else if (
    normCity.includes('dubai') ||
    normCity.includes('cairo') ||
    normCity.includes('rajasthan') ||
    normCity.includes('delhi') ||
    normCity.includes('vegas') ||
    normCity.includes('riyadh') ||
    normCity.includes('marrakesh') ||
    normCountry.includes('egypt') ||
    normCountry.includes('morocco') ||
    normCountry.includes('saudi') ||
    normCountry.includes('kuwait') ||
    normCountry.includes('emirates') ||
    normCountry.includes('uae')
  ) {
    if (month >= 4 && month <= 8) { // Extreme Summer
      baseTemp = 41;
      generalCondition = 'Scorching Sun';
      humidity = 18;
      windSpeed = 14;
      generalVerdict = 'Extreme aridity and scorching solar heat index. Limit physical outdoor efforts entirely between 10 AM and 5 PM. Double up on hydration, sunscreen, and polarized shades.';
    } else { // Beautiful Desert Winter
      baseTemp = 22;
      generalCondition = 'Clear Sunny';
      humidity = 35;
      windSpeed = 10;
      generalVerdict = 'Beautiful mild sun during daytime, cooling down briskly at night. Absolutely perfect for desert camping and open-air bazaars.';
    }
  }
  // D. SUBARCTIC / HIGH LATITUDES (Reykjavik, Iceland, Greenland, Svalbard, Tromso, Norway, Sweden, Finland)
  else if (
    normCity.includes('reykjavik') ||
    normCountry.includes('iceland') ||
    normCountry.includes('greenland') ||
    normCity.includes('tromso') ||
    normCountry.includes('norway') ||
    normCity.includes('svalbard')
  ) {
    if (month >= 4 && month <= 8) { // Subarctic Summer (Midnight Sun)
      baseTemp = 11;
      generalCondition = 'Cool Daylight Breeze';
      humidity = 70;
      windSpeed = 18;
      generalVerdict = 'Cool crisp climate with 24-hour daylight. Mild oceanic winds. Essential to bring windproof layers and sleep masks for evening comfort.';
    } else { // Dark Frozen Winter
      baseTemp = -2;
      generalCondition = 'Snow Showers & Polar Gale';
      humidity = 85;
      windSpeed = 26;
      generalVerdict = 'Extreme subarctic winter freeze with frequent snow storms. Great chance to witness the Northern Lights. Heavy specialized outer survival parkas and spiked boots are crucial.';
    }
  }
  // E. MEDITERRANEAN / SUBTROPICAL COASTAL (California, Tuscany, Spain, Athens, Rome, Cape Town, Sydney)
  else if (
    normCity.includes('california') ||
    normCity.includes('tuscany') ||
    normCity.includes('rome') ||
    normCity.includes('barcelona') ||
    normCity.includes('athens') ||
    normCity.includes('santorini') ||
    normCity.includes('greece') ||
    normCity.includes('sydney') ||
    normCity.includes('cape town') ||
    normCountry.includes('italy') ||
    normCountry.includes('spain') ||
    normCountry.includes('portugal')
  ) {
    // Check if southern hemisphere (Sydney, Cape Town) where seasons are flipped
    const isSouthern = normCity.includes('sydney') || normCity.includes('cape town') || normCountry.includes('australia') || normCountry.includes('south africa');
    
    if ((month >= 4 && month <= 8 && !isSouthern) || ((month < 2 || month > 9) && isSouthern)) {
      // Warm Mediterranean Summer
      baseTemp = 28;
      generalCondition = 'Clear Sunny';
      humidity = 42;
      windSpeed = 8;
      generalVerdict = 'Beautiful, dry, sun-splashed Mediterranean warmth. Perfect for architectural sightseeing, terrace dining, coastal cruises, and classic light apparel.';
    } else {
      // Cool Moist Winter
      baseTemp = 13;
      generalCondition = 'Passing Showers';
      humidity = 70;
      windSpeed = 16;
      generalVerdict = 'Mildly cool and wet winter conditions. Great for local cultural galleries and indoor gastronomy trails. Carry a simple windbreaker coat.';
    }
  }
  // F. STANDARD TEMPERATE CONTROLLING (Paris, London, New York, Tokyo, Kyoto, Berlin)
  else {
    const isSouthern = normCity.includes('melbourne') || normCountry.includes('new zealand') || normCountry.includes('chile') || normCountry.includes('argentina');
    const isSummer = (month >= 5 && month <= 8 && !isSouthern) || ((month < 2 || month > 9) && isSouthern);
    
    if (isSummer) {
      baseTemp = 23;
      generalCondition = 'Sunny Intervals';
      humidity = 58;
      windSpeed = 10;
      generalVerdict = 'Splendid mild summer. Highly pleasant conditions. Ideal for urban parks, picnics, street exploration, and outdoor heritage walks.';
    } else {
      baseTemp = 6;
      generalCondition = 'Overcast Drizzle';
      humidity = 80;
      windSpeed = 18;
      generalVerdict = 'Crisp, chilly, and overcast winter skies. Ideal for visiting indoor libraries, historic castles, and sampling legendary local gourmet soups.';
    }
  }

  // 2. Generate daily forecasts consistent with modeled Base Temp inside bounds
  const forecasts: WeatherDay[] = [];
  const start = new Date(startDateStr);
  
  const weatherMixes = [
    { cond: generalCondition, h: humidity, w: windSpeed },
    { cond: 'Partly Cloudy', h: Math.min(100, Math.max(10, humidity - 8)), w: Math.max(4, windSpeed - 2) },
    { cond: generalCondition.includes('Rain') ? 'Rain Showers' : 'Clear Sunny', h: Math.min(100, Math.max(10, humidity + 5)), w: windSpeed + 3 },
    { cond: 'Overcast Breezes', h: Math.min(100, Math.max(10, humidity + 10)), w: Math.max(5, windSpeed + 4) },
    { cond: 'Passing Sun', h: Math.min(100, Math.max(10, humidity - 12)), w: Math.max(3, windSpeed - 5) },
    { cond: generalCondition, h: humidity, w: windSpeed },
    { cond: 'Deep Blue Skylines', h: Math.min(100, Math.max(10, humidity - 15)), w: Math.max(2, windSpeed - 1) }
  ];

  for (let i = 0; i < Math.min(duration, 7); i++) {
    const currentDay = new Date(start);
    currentDay.setDate(start.getDate() + i);
    
    const tempOffsetMin = Math.round(Math.sin(i * 1.5) * 3) - 2;
    const tempOffsetMax = Math.round(Math.cos(i * 1.5) * 4) + 2;
    
    const mix = weatherMixes[i % weatherMixes.length];
    
    forecasts.push({
      date: currentDay.toISOString().split('T')[0],
      tempMin: Math.max(-25, Math.round(baseTemp - 5 + tempOffsetMin)),
      tempMax: Math.round(baseTemp + 5 + tempOffsetMax),
      condition: mix.cond,
      humidity: mix.h,
      windSpeed: mix.w,
      suitability: getSuitability(baseTemp + tempOffsetMax, mix.cond)
    });
  }

  return {
    currentTemp: Math.round(baseTemp + 2),
    currentCondition: generalCondition,
    avgHumidity: humidity,
    generalVerdict,
    forecast: forecasts
  };
}

const KNOWN_COORDINATES: Record<string, { lat: number; lon: number; tz: string }> = {
  // India regions and cities
  'goa': { lat: 15.2993, lon: 74.1240, tz: 'Asia/Kolkata' },
  'mumbai': { lat: 19.0760, lon: 72.8777, tz: 'Asia/Kolkata' },
  'delhi': { lat: 28.6139, lon: 77.2090, tz: 'Asia/Kolkata' },
  'new delhi': { lat: 28.6139, lon: 77.2090, tz: 'Asia/Kolkata' },
  'kolkata': { lat: 22.5726, lon: 88.3639, tz: 'Asia/Kolkata' },
  'bangalore': { lat: 12.9716, lon: 77.5946, tz: 'Asia/Kolkata' },
  'bengaluru': { lat: 12.9716, lon: 77.5946, tz: 'Asia/Kolkata' },
  'chennai': { lat: 13.0827, lon: 80.2707, tz: 'Asia/Kolkata' },
  'hyderabad': { lat: 17.3850, lon: 78.4867, tz: 'Asia/Kolkata' },
  'jaipur': { lat: 26.9124, lon: 75.7873, tz: 'Asia/Kolkata' },
  'udaipur': { lat: 24.5854, lon: 73.7125, tz: 'Asia/Kolkata' },
  'jodhpur': { lat: 26.2389, lon: 73.0243, tz: 'Asia/Kolkata' },
  'kochi': { lat: 9.9312, lon: 76.2673, tz: 'Asia/Kolkata' },
  'cochin': { lat: 9.9312, lon: 76.2673, tz: 'Asia/Kolkata' },
  'munnar': { lat: 10.0889, lon: 77.0595, tz: 'Asia/Kolkata' },
  'kerala': { lat: 10.8505, lon: 76.2711, tz: 'Asia/Kolkata' },
  'coorg': { lat: 12.3375, lon: 75.8069, tz: 'Asia/Kolkata' },
  'madikeri': { lat: 12.4244, lon: 75.7382, tz: 'Asia/Kolkata' },
  'darjeeling': { lat: 27.0410, lon: 88.2627, tz: 'Asia/Kolkata' },
  'gangtok': { lat: 27.3314, lon: 88.6138, tz: 'Asia/Kolkata' },
  'sikkim': { lat: 27.5330, lon: 88.5122, tz: 'Asia/Kolkata' },
  'leh': { lat: 34.1526, lon: 77.5771, tz: 'Asia/Kolkata' },
  'ladakh': { lat: 34.1526, lon: 77.5771, tz: 'Asia/Kolkata' },
  'shimla': { lat: 31.1048, lon: 77.1734, tz: 'Asia/Kolkata' },
  'manali': { lat: 32.2396, lon: 77.1887, tz: 'Asia/Kolkata' },
  'shillong': { lat: 25.5788, lon: 91.8933, tz: 'Asia/Kolkata' },
  'ooty': { lat: 11.4102, lon: 76.6950, tz: 'Asia/Kolkata' },
  'pondicherry': { lat: 11.9416, lon: 79.8083, tz: 'Asia/Kolkata' },
  'agra': { lat: 27.1767, lon: 78.0081, tz: 'Asia/Kolkata' },
  'varanasi': { lat: 25.3176, lon: 82.9739, tz: 'Asia/Kolkata' },
  'srinagar': { lat: 34.0837, lon: 74.7973, tz: 'Asia/Kolkata' },

  // UK & Europe
  'london': { lat: 51.5074, lon: -0.1278, tz: 'Europe/London' },
  'paris': { lat: 48.8566, lon: 2.3522, tz: 'Europe/Paris' },
  'berlin': { lat: 52.5200, lon: 13.4050, tz: 'Europe/Berlin' },
  'munich': { lat: 48.1351, lon: 11.5820, tz: 'Europe/Berlin' },
  'rome': { lat: 41.9028, lon: 12.4964, tz: 'Europe/Rome' },
  'milan': { lat: 45.4642, lon: 9.1900, tz: 'Europe/Rome' },
  'venice': { lat: 45.4408, lon: 12.3155, tz: 'Europe/Rome' },
  'florence': { lat: 43.7695, lon: 11.2558, tz: 'Europe/Rome' },
  'tuscany': { lat: 43.7695, lon: 11.2558, tz: 'Europe/Rome' },
  'madrid': { lat: 40.4168, lon: -3.7038, tz: 'Europe/Madrid' },
  'barcelona': { lat: 41.3851, lon: 2.1734, tz: 'Europe/Madrid' },
  'amsterdam': { lat: 52.3676, lon: 4.9041, tz: 'Europe/Amsterdam' },
  'brussels': { lat: 50.8503, lon: 4.3517, tz: 'Europe/Brussels' },
  'vienna': { lat: 48.2082, lon: 16.3738, tz: 'Europe/Vienna' },
  'zurich': { lat: 47.3769, lon: 8.5417, tz: 'Europe/Zurich' },
  'geneva': { lat: 46.2044, lon: 6.1432, tz: 'Europe/Zurich' },
  'interlaken': { lat: 46.6863, lon: 7.8632, tz: 'Europe/Zurich' },
  'zermatt': { lat: 46.0207, lon: 7.7491, tz: 'Europe/Zurich' },
  'athens': { lat: 37.9838, lon: 23.7275, tz: 'Europe/Athens' },
  'santorini': { lat: 36.3932, lon: 25.4615, tz: 'Europe/Athens' },
  'prague': { lat: 50.0755, lon: 14.4378, tz: 'Europe/Prague' },
  'budapest': { lat: 47.4979, lon: 19.0402, tz: 'Europe/Budapest' },
  'lisbon': { lat: 38.7223, lon: -9.1393, tz: 'Europe/Lisbon' },
  'oslo': { lat: 59.9139, lon: 10.7522, tz: 'Europe/Oslo' },
  'copenhagen': { lat: 55.6761, lon: 12.5683, tz: 'Europe/Copenhagen' },
  'stockholm': { lat: 59.3293, lon: 18.0686, tz: 'Europe/Stockholm' },
  'helsinki': { lat: 60.1699, lon: 24.9384, tz: 'Europe/Helsinki' },
  'reykjavik': { lat: 64.1466, lon: -21.9426, tz: 'Atlantic/Reykjavik' },
  'dublin': { lat: 53.3498, lon: -6.2603, tz: 'Europe/Dublin' },
  'edinburgh': { lat: 55.9533, lon: -3.1883, tz: 'Europe/London' },

  // Americas
  'new york': { lat: 40.7128, lon: -74.0060, tz: 'America/New_York' },
  'los angeles': { lat: 34.0522, lon: -118.2437, tz: 'America/Los_Angeles' },
  'chicago': { lat: 41.8781, lon: -87.6298, tz: 'America/Chicago' },
  'san francisco': { lat: 37.7749, lon: -122.4194, tz: 'America/Los_Angeles' },
  'miami': { lat: 25.7617, lon: -80.1918, tz: 'America/New_York' },
  'boston': { lat: 42.3601, lon: -71.0589, tz: 'America/New_York' },
  'las vegas': { lat: 36.1716, lon: -115.1398, tz: 'America/Los_Angeles' },
  'vancouver': { lat: 49.2827, lon: -123.1207, tz: 'America/Vancouver' },
  'toronto': { lat: 43.6532, lon: -79.3832, tz: 'America/Toronto' },
  'montreal': { lat: 45.5017, lon: -73.5673, tz: 'America/Toronto' },
  'cancun': { lat: 21.1619, lon: -86.8515, tz: 'America/Cancun' },
  'mexico city': { lat: 19.4326, lon: -99.1332, tz: 'America/Mexico_City' },
  'rio de janeiro': { lat: -22.9068, lon: -43.1729, tz: 'America/Sao_Paulo' },
  'sao paulo': { lat: -23.5505, lon: -46.6333, tz: 'America/Sao_Paulo' },
  'buenos aires': { lat: -34.6037, lon: -58.3816, tz: 'America/Argentina/Buenos_Aires' },
  'santiago': { lat: -33.4489, lon: -70.6693, tz: 'America/Santiago' },
  'lima': { lat: -12.0464, lon: -77.0428, tz: 'America/Lima' },
  'cusco': { lat: -13.5320, lon: -71.9675, tz: 'America/Lima' },

  // Asia / Middle East
  'tokyo': { lat: 35.6762, lon: 139.6503, tz: 'Asia/Tokyo' },
  'kyoto': { lat: 35.0116, lon: 135.7681, tz: 'Asia/Tokyo' },
  'osaka': { lat: 34.6937, lon: 135.5023, tz: 'Asia/Tokyo' },
  'singapore': { lat: 1.3521, lon: 103.8198, tz: 'Asia/Singapore' },
  'bangkok': { lat: 13.7563, lon: 100.5018, tz: 'Asia/Bangkok' },
  'phuket': { lat: 7.8804, lon: 98.3923, tz: 'Asia/Bangkok' },
  'bali': { lat: -8.4095, lon: 115.1889, tz: 'Asia/Makassar' },
  'seoul': { lat: 37.5665, lon: 126.9780, tz: 'Asia/Seoul' },
  'beijing': { lat: 39.9042, lon: 116.4074, tz: 'Asia/Shanghai' },
  'shanghai': { lat: 31.2304, lon: 121.4737, tz: 'Asia/Shanghai' },
  'hong kong': { lat: 22.3193, lon: 114.1694, tz: 'Asia/Hong_Kong' },
  'dubai': { lat: 25.2048, lon: 55.2708, tz: 'Asia/Dubai' },
  'abu dhabi': { lat: 24.4539, lon: 54.3773, tz: 'Asia/Dubai' },
  'doha': { lat: 25.2854, lon: 51.5310, tz: 'Asia/Qatar' },
  'riyadh': { lat: 24.7136, lon: 46.6753, tz: 'Asia/Rihyadh' },
  'cairo': { lat: 30.0444, lon: 31.2357, tz: 'Africa/Cairo' },
  'istanbul': { lat: 41.0082, lon: 28.9784, tz: 'Europe/Istanbul' },
  'cappadocia': { lat: 38.6431, lon: 34.8288, tz: 'Asia/Istanbul' },
  'kathmandu': { lat: 27.7172, lon: 85.3240, tz: 'Asia/Kathmandu' },
  'maldives': { lat: 3.2028, lon: 73.2207, tz: 'Indian/Maldives' },

  // Oceania
  'sydney': { lat: -33.8688, lon: 151.2093, tz: 'Australia/Sydney' },
  'melbourne': { lat: -37.8136, lon: 144.9631, tz: 'Australia/Melbourne' },
  'brisbane': { lat: -27.4705, lon: 153.0260, tz: 'Australia/Brisbane' },
  'perth': { lat: -31.9505, lon: 115.8605, tz: 'Australia/Perth' },
  'auckland': { lat: -36.8485, lon: 174.7633, tz: 'Pacific/Auckland' },
  'queenstown': { lat: -45.0312, lon: 168.6626, tz: 'Pacific/Auckland' },
};

/**
 * Intelligent Weather Engine with geographical awareness & live public Open-Meteo APIs
 */
export async function getDestinationWeather(city: string, country: string, duration: number, startDateStr: string): Promise<WeatherData> {
  try {
    const cleanCity = city.toLowerCase().trim();
    let lat: number | null = null;
    let lon: number | null = null;
    let tz: string = 'auto';

    // 1. Check our robust pre-programmed coordinates dictionary representing major destinations
    // Try exact or substring matches against our dictionary keys
    const matchKey = Object.keys(KNOWN_COORDINATES).find(key => 
      cleanCity === key || cleanCity.includes(key) || key.includes(cleanCity)
    );

    if (matchKey) {
      lat = KNOWN_COORDINATES[matchKey].lat;
      lon = KNOWN_COORDINATES[matchKey].lon;
      tz = KNOWN_COORDINATES[matchKey].tz;
    }

    // 2. If not found in our preloaded coordinates cache, run dynamic lookup via Open-Meteo's Geocoding endpoint
    if (lat === null || lon === null) {
      const searchName = country ? `${city}, ${country}` : city;
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchName)}&count=1&language=en&format=json`;
      
      const geoResponse = await fetch(geoUrl);
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        if (geoData.results && geoData.results.length > 0) {
          const bestMatch = geoData.results[0];
          lat = bestMatch.latitude;
          lon = bestMatch.longitude;
          tz = bestMatch.timezone || 'auto';
        } else {
          // Rescue search with city name only
          const rescueUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
          const rescueResponse = await fetch(rescueUrl);
          if (rescueResponse.ok) {
            const rescueData = await rescueResponse.json();
            if (rescueData.results && rescueData.results.length > 0) {
              const rescueMatch = rescueData.results[0];
              lat = rescueMatch.latitude;
              lon = rescueMatch.longitude;
              tz = rescueMatch.timezone || 'auto';
            }
          }
        }
      }
    }

    // 3. Fallback coordinates if still not matching any geocoding results
    if (lat === null || lon === null) {
      // Default to approximate coordinates based on standard regions or general default
      lat = 20.5937; // Standard general coordinates (India default center)
      lon = 78.9629;
      tz = 'Asia/Kolkata';
    }

    // 4. Fetch LIVE atmospheric data from Open-Meteo forecast REST API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code,relative_humidity_2m_max,wind_speed_10m_max&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=${encodeURIComponent(tz)}`;
    
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error(`Forecast request failed with status ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;
    const daily = weatherData.daily;

    if (current && daily) {
      const currentTemp = Math.round(current.temperature_2m);
      const currentCondition = mapWmoCodeToCondition(current.weather_code);
      const avgHumidity = Math.round(current.relative_humidity_2m);
      const windSpeed = Math.round(current.wind_speed_10m);

      let generalVerdict = `Highly suitable for walking, sightseeing, and standard outdoor explorations in ${city}.`;
      if (currentCondition.includes('Rain') || currentCondition.includes('Thunderstorm') || currentCondition.includes('Drizzle')) {
        generalVerdict = `Possibility of precipitation present in ${city}. Carry a compact umbrella and wear durable outerwear.`;
      } else if (currentTemp > 30) {
        generalVerdict = `Warm sunny intervals in ${city}. Stay fully hydrated and schedule outdoor tours during early morning hours.`;
      } else if (currentTemp < 9) {
        generalVerdict = `Bracing cold temperatures expected. Dress in thermal outerwear layers and pack travel gloves.`;
      }

      const forecasts: WeatherDay[] = [];
      const start = new Date(startDateStr);
      const apiMaxDays = daily.time.length;
      const requestedDays = Math.min(duration, 7);

      for (let i = 0; i < requestedDays; i++) {
        let dateStr = '';
        let tMin = 15;
        let tMax = 25;
        let cond = 'Partly Cloudy';
        let hum = 60;
        let ws = 10;

        if (i < apiMaxDays) {
          dateStr = daily.time[i];
          tMin = Math.round(daily.temperature_2m_min[i]);
          tMax = Math.round(daily.temperature_2m_max[i]);
          cond = mapWmoCodeToCondition(daily.weather_code[i]);
          hum = Math.round(daily.relative_humidity_2m_max ? daily.relative_humidity_2m_max[i] : avgHumidity);
          ws = Math.round(daily.wind_speed_10m_max ? daily.wind_speed_10m_max[i] : windSpeed);
        } else {
          const currentDay = new Date(start);
          currentDay.setDate(start.getDate() + i);
          dateStr = currentDay.toISOString().split('T')[0];
          tMin = Math.round(currentTemp - 4);
          tMax = Math.round(currentTemp + 4);
          cond = currentCondition;
          hum = avgHumidity;
          ws = windSpeed;
        }

        forecasts.push({
          date: dateStr,
          tempMin: tMin,
          tempMax: tMax,
          condition: cond,
          humidity: hum,
          windSpeed: ws,
          suitability: getSuitability(tMax, cond)
        });
      }

      return {
        currentTemp,
        currentCondition,
        avgHumidity,
        generalVerdict,
        forecast: forecasts
      };
    }
    
    throw new Error('No weather measurements found in API response');
  } catch (error) {
    console.warn(`[VoyageAI] Fetching live weather failed. Falling back to climate intelligence:`, error);
    return getFallbackWeather(city, country, duration, startDateStr);
  }
}
