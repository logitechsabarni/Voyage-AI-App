import { WeatherData } from '../types';
import { Sun, Cloud, CloudRain, Droplets, Wind, Sparkles, AlertCircle } from 'lucide-react';

interface WeatherWidgetProps {
  weather: WeatherData;
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  // Utility to match icons to condition strings
  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('sunny') || cond.includes('clear')) {
      return <Sun className="w-8 h-8 text-[#d4af37] animate-spin-slow" />;
    }
    if (cond.includes('rain') || cond.includes('shower') || cond.includes('storm')) {
      return <CloudRain className="w-8 h-8 text-sky-400 animate-pulse" />;
    }
    return <Cloud className="w-8 h-8 text-zinc-500" />;
  };
 
  return (
    <div className="bg-[#131316] border border-white/10 text-white rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl relative overflow-hidden">
      {/* Decorative ambient blurred backing orb */}
      <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-[#d4af37]/5 blur-3xl pointer-events-none" />
 
      {/* Header metrics card row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <span className="text-xs uppercase font-bold text-[#d4af37] tracking-wider">Live Destination Intelligence</span>
          <h3 className="text-xl font-bold font-display mt-0.5 text-[#e1e1e1]">Atmospheric Forcast</h3>
        </div>
        
        {/* current unified badge */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl">
          {getWeatherIcon(weather.currentCondition)}
          <div>
            <span className="text-2xl font-bold font-display text-white">{weather.currentTemp}°C</span>
            <span className="text-xs text-[#aaa] block capitalize mt-0.5">{weather.currentCondition}</span>
          </div>
        </div>
      </div>
 
      {/* Verdict block */}
      <div className="p-4 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex gap-3 items-start relative z-10">
        <Sparkles className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#d4af37]">Voyage Weather Suitability Report</h4>
          <p className="text-xs text-[#aaa] leading-relaxed font-light">{weather.generalVerdict}</p>
        </div>
      </div>
 
      {/* Grid of secondary statistics */}
      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#d4af37]">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-450 block font-medium">Avg Humidity</span>
            <span className="text-sm font-bold font-mono text-white">{weather.avgHumidity}%</span>
          </div>
        </div>
 
         <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#d4af37]">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-450 block font-medium">Breeze Intensity</span>
            <span className="text-sm font-bold font-mono text-white">{weather.forecast[0]?.windSpeed || 15} km/h</span>
          </div>
        </div>
      </div>
 
      {/* Multi-day mini forecast strip */}
      <div className="space-y-3 relative z-10 pt-2">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-display">Weekly Forecast strip</h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weather.forecast.map((day, ix) => {
            const isExcellent = day.suitability === 'excellent';
            const isGood = day.suitability === 'good';
            
            return (
              <div 
                key={day.date + ix}
                className="p-3 rounded-2xl bg-zinc-950/40 border border-white/5 flex flex-col justify-between items-center text-center gap-2 hover:bg-white/10 transition-colors"
              >
                <span className="text-[10px] text-zinc-400 font-medium font-mono">
                  {new Date(day.date).toLocaleDateString([], { weekday: 'short', day: 'numeric' })}
                </span>
                
                <div className="my-1">
                  {getWeatherIcon(day.condition)}
                </div>
 
                <div>
                  <span className="text-xs font-bold block text-white">{day.tempMax}°</span>
                  <span className="text-[10px] text-zinc-500 block">{day.tempMin}°</span>
                </div>
 
                <span 
                  className={`px-2 py-0.5 rounded-full text-[9px] font-black mt-1 uppercase tracking-wider ${
                    isExcellent 
                      ? 'bg-emerald-950/45 text-emerald-400 border border-emerald-900/20' 
                      : isGood 
                        ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/20' 
                        : 'bg-amber-950/45 text-amber-500 border border-amber-900/20'
                  }`}
                >
                  {day.suitability}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
