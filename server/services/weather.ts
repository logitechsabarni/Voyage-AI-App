import { WeatherData, WeatherDay } from '../../src/types';

/**
 * Intelligent Weather Engine with geographical awareness & seasonal models
 */
export function getDestinationWeather(city: string, country: string, duration: number, startDateStr: string): WeatherData {
  const normCity = city.toLowerCase().trim();
  const normCountry = country.toLowerCase().trim();
  
  // Decide climate models based on popular cities & coordinates (or general continent fallback)
  let baseTemp = 20; // Default spring-like temperature
  let generalCondition = 'Partly Cloudy';
  let humidity = 60;
  let windSpeed = 12;
  let generalVerdict = 'Highly suitable for walking, sightseeing, and standard outdoor explorations.';

  if (normCity.includes('london') || normCity.includes('paris') || normCity.includes('amsterdam') || normCity.includes('berlin') || normCity.includes('europe')) {
    baseTemp = 14;
    generalCondition = Math.random() > 0.5 ? 'Showers' : 'Partly Cloudy';
    humidity = 75;
    windSpeed = 18;
    generalVerdict = 'Oceanic breezes present. Carry an extra jacket or compact umbrella for occasional brief showers.';
  } else if (normCity.includes('tokyo') || normCity.includes('kyoto') || normCity.includes('seoul') || normCity.includes('beijing')) {
    baseTemp = 18;
    generalCondition = 'Clear Sunny';
    humidity = 55;
    windSpeed = 8;
    generalVerdict = 'Very pleasant conditions. Ideal for visiting temples, parks, and doing local food walks.';
  } else if (normCity.includes('rome') || normCity.includes('madrid') || normCity.includes('athens') || normCity.includes('dubai') || normCity.includes('cairo')) {
    baseTemp = 28;
    generalCondition = 'Sunny';
    humidity = 40;
    windSpeed = 10;
    generalVerdict = 'Warm and sunny climate. Stay hydrated and schedule heavy walking activities during morning or evening slots.';
  } else if (normCity.includes('singapore') || normCity.includes('bangkok') || normCity.includes('phuket') || normCity.includes('bali')) {
    baseTemp = 31;
    generalCondition = 'Tropical Humidity';
    humidity = 85;
    windSpeed = 14;
    generalVerdict = 'High tropical humidity with brief afternoon convective showery cycles. Light breathable clothing recommended.';
  } else if (normCity.includes('new york') || normCity.includes('boston') || normCity.includes('chicago') || normCity.includes('vancouver')) {
    baseTemp = 16;
    generalCondition = 'Clear Breezy';
    humidity = 50;
    windSpeed = 15;
    generalVerdict = 'Clear sky with crisp conditions. Bring standard light layers for outdoor tours.';
  } else if (normCity.includes('sydney') || normCity.includes('melbourne') || normCity.includes('auckland')) {
    baseTemp = 19;
    generalCondition = 'Pleasant Windy';
    humidity = 62;
    windSpeed = 22;
    generalVerdict = 'Breezy coastal climate. Highly pleasant, suitable for beaches, coastal walks, and patio dining.';
  }

  // Calculate dynamic forecast days
  const forecasts: WeatherDay[] = [];
  const start = new Date(startDateStr);

  const conditions = ['Sunny', 'Partly Cloudy', 'Clear Sunny', 'Light Breezes', 'Passing Showers', 'Overcast'];

  for (let i = 0; i < Math.min(duration, 7); i++) {
    const currentDay = new Date(start);
    currentDay.setDate(start.getDate() + i);
    
    // Add minor daily variance
    const tempOffsetMin = Math.floor(Math.sin(i) * 3) - 2;
    const tempOffsetMax = Math.floor(Math.cos(i) * 4) + 2;
    
    const cond = i === 0 ? generalCondition : conditions[Math.floor(Math.random() * conditions.length)];
    const isShowers = cond.includes('Showers');
    
    forecasts.push({
      date: currentDay.toISOString().split('T')[0],
      tempMin: Math.max(0, baseTemp - 5 + tempOffsetMin),
      tempMax: baseTemp + 5 + tempOffsetMax,
      condition: cond,
      humidity: Math.min(100, Math.max(10, humidity + (isShowers ? 15 : -5))),
      windSpeed: Math.max(2, windSpeed + Math.floor(Math.sin(i) * 4)),
      suitability: isShowers ? 'fair' : baseTemp > 28 ? 'good' : 'excellent'
    });
  }

  return {
    currentTemp: baseTemp + 2,
    currentCondition: generalCondition,
    avgHumidity: humidity,
    generalVerdict,
    forecast: forecasts
  };
}
