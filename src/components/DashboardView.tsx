import { useState } from 'react';
import { TripPlan, WeatherData, RecommendationScore } from '../types';
import WeatherWidget from './WeatherWidget';
import AnalyticsView from './AnalyticsView';
import { 
  Calendar, MapPin, Eye, Utensils, Hotel, ShieldCheck, Compass, 
  Map, ThumbsUp, Landmark, AlertCircle, Sparkles, BookOpen, Clock, Lightbulb 
} from 'lucide-react';

interface DashboardViewProps {
  plan: TripPlan;
  weather: WeatherData;
  recommendations: RecommendationScore[];
  onBack: () => void;
}

export default function DashboardView({ plan, weather, recommendations, onBack }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'discover' | 'analytics' | 'intelligence'>('itinerary');
  const [selectedDay, setSelectedDay] = useState<number>(1);
 
  // Filter recommendations based on tab choices
  const attractions = recommendations.filter(item => item.category === 'Attractions');
  const hiddengems = recommendations.filter(item => item.category === 'Hidden gems');
 
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Upper header action hub */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111115]/90 border border-white/10 p-6 rounded-3xl shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-spin-slow" />
            AI Travel Intel Ready
          </div>
          <h2 className="text-2xl font-bold font-display text-[#e1e1e1]">
            Explorer Portal — {weather.forecast[0] ? `${weather.forecast.length} Days tailored journey` : 'Trip Overview'}
          </h2>
          <p className="text-xs text-[#aaa] font-light max-w-lg leading-relaxed">
            {plan.trip_summary}
          </p>
        </div>
 
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-white/10 hover:bg-zinc-800 text-[#e1e1e1] font-semibold text-xs active:scale-95 transition-all cursor-pointer"
        >
          ← Change Parameters
        </button>
      </div>
 
      {/* Navigation tab links row */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-2">
        {[
          { id: 'itinerary', label: 'Dynamic Itinerary', icon: Calendar },
          { id: 'discover', label: 'Local Discovery Hub', icon: MapPin },
          { id: 'analytics', label: 'Travel Analytics', icon: Landmark },
          { id: 'intelligence', label: 'Cultural Deep Dive', icon: BookOpen }
        ].map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 flex items-center gap-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive 
                  ? 'bg-[#d4af37] border-[#d4af37] text-[#0a0a0c] shadow-lg font-black' 
                  : 'bg-zinc-950/30 border border-white/5 hover:border-[#d4af37]/35 text-[#aaa]'
              }`}
            >
              <IconComponent className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>
 
      {/* Primary Dynamic Content Frame */}
      <div className="space-y-8">
        
        {/* TABS 1: DYNAMIC ITINERARY TIMELINE */}
        {activeTab === 'itinerary' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Day horizontal selector card */}
            <div className="lg:col-span-1 space-y-4">
              <div className="p-6 bg-[#111115]/85 border border-white/10 rounded-3xl shadow-sm space-y-4">
                <h3 className="font-bold text-[#e1e1e1] text-xs uppercase tracking-wider font-display">Days of Exploration</h3>
                
                <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                  {plan.itinerary.map(item => (
                    <button
                      key={item.day}
                      onClick={() => setSelectedDay(item.day)}
                      className={`px-4 py-3 rounded-xl text-left select-none shrink-0 transition-all cursor-pointer font-medium text-xs flex items-center justify-between gap-3 min-w-[120px] lg:w-full ${
                        selectedDay === item.day
                          ? 'bg-[#d4af37]/15 border-l-4 border-l-[#d4af37] font-bold text-[#d4af37]'
                          : 'bg-zinc-900/40 hover:bg-zinc-850 text-[#aaa]'
                      }`}
                    >
                      <span className="truncate block">Day {item.day} — {new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-mono font-bold">Slot #{item.day}</span>
                    </button>
                  ))}
                </div>
              </div>
 
              {/* Weather Widget integrated next to days selection */}
              <WeatherWidget weather={weather} />
            </div>
 
            {/* Timelines block */}
            <div className="lg:col-span-2 space-y-6">
              {plan.itinerary.filter(day => day.day === selectedDay).map(day => (
                <div key={day.day} className="space-y-6">
                  
                  {/* Day motif card banner */}
                  <div className="p-6 rounded-2xl bg-[#16161a]/80 border border-white/5 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#aaa] block">Day {day.day} Theme</span>
                      <h4 className="font-bold text-[#e1e1e1] font-display text-base leading-tight mt-0.5">{day.theme}</h4>
                    </div>
                    <span className="px-3 py-1 bg-zinc-900 rounded-lg text-[10px] border border-white/10 font-mono font-bold text-[#aaa]">
                      {day.date}
                    </span>
                  </div>
 
                  {/* Day activity lists */}
                  <div className="relative border-l-2 border-l-[#d4af37]/25 pl-6 ml-4 space-y-8 py-2">
                    
                    {/* MORNING SLOT */}
                    <div className="relative">
                      <div className="absolute -left-[34px] top-1 w-8 h-8 rounded-full bg-zinc-900 text-[#d4af37] flex items-center justify-center font-bold text-xs ring-2 ring-white/10">
                        🌅
                      </div>
                      <div className="p-5 rounded-2xl bg-[#16161a]/60 border border-white/5 shadow-sm hover:border-[#d4af37]/40 hover:shadow-md transition-all space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#d4af37] block">Morning experience</span>
                            <h5 className="font-bold text-[#e1e1e1] font-display text-sm mt-0.5">{day.morning.place}</h5>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-white/5 text-[#aaa] text-[10px] font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            {day.morning.duration}
                          </span>
                        </div>
                        <p className="text-[#aaa] text-xs leading-relaxed font-light">{day.morning.activity}</p>
                      </div>
                    </div>
 
                    {/* AFTERNOON SLOT */}
                    <div className="relative">
                      <div className="absolute -left-[34px] top-1 w-8 h-8 rounded-full bg-zinc-900 text-[#d4af37] flex items-center justify-center font-bold text-xs ring-2 ring-white/10">
                        ☀️
                      </div>
                      <div className="p-5 rounded-2xl bg-[#16161a]/60 border border-white/5 shadow-sm hover:border-[#d4af37]/40 hover:shadow-md transition-all space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#d4af37] block">Afternoon travel slot</span>
                            <h5 className="font-bold text-[#e1e1e1] font-display text-sm mt-0.5">{day.afternoon.place}</h5>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-white/5 text-[#aaa] text-[10px] font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            {day.afternoon.duration}
                          </span>
                        </div>
                        <p className="text-[#aaa] text-xs leading-relaxed font-light">{day.afternoon.activity}</p>
                      </div>
                    </div>
 
                    {/* EVENING SLOT */}
                    <div className="relative">
                      <div className="absolute -left-[34px] top-1 w-8 h-8 rounded-full bg-zinc-900 text-[#d4af37] flex items-center justify-center font-bold text-xs ring-2 ring-white/10">
                        🌙
                      </div>
                      <div className="p-5 rounded-2xl bg-[#16161a]/60 border border-white/5 shadow-sm hover:border-[#d4af37]/40 hover:shadow-md transition-all space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#aaa] block">Night cap & dinner</span>
                            <h5 className="font-bold text-[#e1e1e1] font-display text-sm mt-0.5">{day.evening.place}</h5>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-white/5 text-[#aaa] text-[10px] font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            {day.evening.duration}
                          </span>
                        </div>
                        <p className="text-[#aaa] text-xs leading-relaxed font-light">{day.evening.activity}</p>
                      </div>
                    </div>
 
                  </div>
                </div>
              ))}
            </div>
 
          </div>
        )}
 
        {/* TABS 2: LOCAL DISCOVERY HUB */}
        {activeTab === 'discover' && (
          <div className="space-y-12">
            
            {/* Top Curated Recommendations Rank layout */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-display text-[#e1e1e1] flex items-center gap-2">
                <Landmark className="w-5.5 h-5.5 text-[#d4af37] animate-bounce-slow" />
                Tailored Attractions Rank Map
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {attractions.concat(hiddengems).slice(0, 4).map((rec, ix) => (
                  <div key={rec.place + ix} className="p-5 bg-[#16161a]/70 border border-white/5 rounded-3xl shadow-sm space-y-3 relative group hover:border-[#d4af37]/30 transition-all">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 bg-zinc-850 text-[#aaa] rounded-md text-[10px] font-bold uppercase">
                        {rec.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-[#d4af37]/10 text-[#d4af37] text-xs font-black font-mono border border-[#d4af37]/15">
                        {rec.score}% Match
                      </span>
                    </div>
 
                    <div>
                      <h4 className="font-bold text-[#e1e1e1] font-display text-sm">{rec.place}</h4>
                      <p className="text-xs text-[#aaa] leading-relaxed font-light mt-1.5">{rec.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Food guide details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-1 p-6 bg-[#1a1a20] border border-white/10 rounded-3xl space-y-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 text-[#d4af37] flex items-center justify-center mb-4">
                    <Utensils className="w-5 h-5 animate-pulse" />
                  </div>
                  <h4 className="text-[#e1e1e1] font-bold font-display">Must-Try Food List</h4>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed mt-1">
                    Signature regional gastronomic dishes you should seek out at markets and street stalls:
                  </p>
                </div>
 
                <ul className="space-y-3 my-4">
                  {plan.food_guide.must_try_foods.slice(0, 4).map((f, ix) => (
                    <li key={ix} className="flex gap-2 text-xs text-zinc-200">
                      <span className="text-[#d4af37] shrink-0 mt-0.5">●</span>
                      <span className="font-light">{f}</span>
                    </li>
                  ))}
                </ul>
 
                <span className="text-[10px] bg-white/5 text-zinc-400 block p-3 rounded-xl text-center">
                  Catered beautifully to your <strong>Food exploration</strong> personality
                </span>
              </div>
 
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-base font-bold text-[#e1e1e1] font-display uppercase tracking-wider text-xs">Highly Recommended Eateries</h4>
                
                <div className="space-y-4">
                  {plan.food_guide.restaurants.map((rest, ix) => (
                    <div key={rest.name + ix} className="p-5 bg-[#16161a]/60 border border-white/5 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-semibold text-[#e1e1e1] text-sm">{rest.name}</h5>
                          <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/45 text-emerald-400 font-bold border border-emerald-800/25">
                            {rest.price_level}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider block">{rest.type}</span>
                        <p className="text-xs text-[#aaa] font-light mt-2 leading-relaxed">{rest.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
 
            </div>
 
            {/* Smart stays accommodation quadrant */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="p-6 bg-[#16161a]/60 border border-white/5 rounded-3xl shadow-sm space-y-6">
                <h4 className="text-base font-bold text-[#e1e1e1] font-display uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <Hotel className="w-5 h-5 text-[#d4af37]" />
                  Staying Neighbourhoods Guide
                </h4>
 
                <div className="space-y-4">
                  {plan.stay_recommendations.map((stay, ix) => (
                    <div key={stay.area + ix} className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-[#d4af37]/30 transition-colors space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#d4af37] tracking-wider block">Recommended Area</span>
                      <h5 className="font-bold text-[#e1e1e1] text-xs">{stay.area}</h5>
                      <p className="text-xs text-[#aaa] font-light leading-relaxed pt-1">{stay.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
 
              <div className="p-6 bg-[#16161a]/60 border border-white/5 rounded-3xl shadow-sm space-y-6">
                <h4 className="text-base font-bold text-[#e1e1e1] font-display uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <Map className="w-5 h-5 text-[#d4af37] animate-spin-slow" />
                  Internal transit logistics
                </h4>
 
                <ul className="space-y-4">
                  {plan.transport_plan.map((t, ix) => (
                    <li key={ix} className="flex gap-3 text-xs leading-relaxed text-[#aaa] items-start">
                      <span className="w-5 h-5 rounded bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 border border-[#d4af37]/15">
                        {ix + 1}
                      </span>
                      <span className="font-light">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
 
            </div>
 
          </div>
        )}
 
        {/* TABS 3: ANALYTICS */}
        {activeTab === 'analytics' && (
          <AnalyticsView budget={plan.budget_estimate} recommendations={recommendations} />
        )}
 
        {/* TABS 4: CULTURAL INTELLIGENCE & HIDDEN GEMS */}
        {activeTab === 'intelligence' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left side analysis cards cultural etiquette */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="p-6 bg-[#16161a]/60 border border-white/5 rounded-3xl shadow-sm space-y-6">
                <h4 className="text-lg font-bold font-display text-[#e1e1e1] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#d4af37]" />
                  Cultural intelligence Report
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 p-5 rounded-2xl bg-zinc-900/50 border border-white/5">
                    <span className="text-xs font-bold text-[#aaa] uppercase block tracking-wider">Social dynamic ethos</span>
                    <p className="text-xs text-[#aaa] leading-relaxed font-light">{plan.destination_analysis.culture}</p>
                  </div>
                  
                  <div className="space-y-2 p-5 rounded-2xl bg-amber-950/20 border border-amber-800/20">
                    <span className="text-xs font-bold text-amber-400 uppercase block tracking-wider">Taboos & Behavior guide</span>
                    <p className="text-xs text-[#aaa] leading-relaxed font-light">{plan.destination_analysis.local_behavior}</p>
                  </div>
                </div>
 
                <div className="p-4 rounded-xl bg-zinc-950/50 border border-white/5 flex gap-3">
                  <Lightbulb className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5 animate-pulse" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">Seasonality Suitability Indices</span>
                    <p className="text-[11px] text-[#aaa] leading-relaxed font-light">{plan.destination_analysis.best_time}</p>
                  </div>
                </div>
              </div>
 
              {/* Local safety & packing checklists */}
              <div className="p-6 bg-[#16161a]/60 border border-white/5 rounded-3xl shadow-sm space-y-4">
                <h4 className="text-base font-bold text-[#e1e1e1] font-display uppercase tracking-wider text-xs flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#d4af37] animate-pulse" />
                  Traveler Safety & Packing tips
                </h4>
 
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plan.travel_tips.map((tip, ix) => (
                    <div key={ix} className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 flex gap-2 items-start text-xs text-[#aaa]">
                      <span className="text-[#d4af37] font-bold mt-0.5">✔</span>
                      <span className="font-light leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
 
            </div>
 
            {/* Right side hidden gems catalog display */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-[#131316] border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
                {/* Background blurred sphere indicator */}
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />
 
                <div>
                  <span className="text-xs uppercase font-bold text-[#d4af37] tracking-wider">Non-Touristy secrets</span>
                  <h4 className="text-lg font-bold font-display text-[#e1e1e1]">Off-Beaten Hidden Gems</h4>
                </div>
 
                {plan.hidden_gems.map((gem, ix) => (
                  <div key={gem.name + ix} className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-3 relative z-10">
                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/5">
                      <span className="text-xs font-bold truncate block text-white">{gem.name}</span>
                      <span className="text-[9px] uppercase tracking-wider text-[#d4af37] font-mono font-bold shrink-0">GEM #{ix + 1}</span>
                    </div>
                    
                    <p className="text-[11px] text-zinc-350 leading-relaxed font-light">{gem.description}</p>
                    
                    <div className="text-[10px] text-[#d4af37]/90 flex flex-col gap-1 pt-2 border-t border-white/5">
                      <span className="font-bold text-[#d4af37]">📍 Direct Location directions:</span>
                      <span className="text-zinc-400 font-mono font-light">{gem.location}</span>
                    </div>
 
                    <div className="text-[10px] bg-[#d4af37]/10 border border-[#d4af37]/20 p-2.5 rounded-lg text-[#d4af37] font-light flex gap-1.5 items-start">
                      <span className="mt-0.5">✦</span>
                      <span>{gem.tip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
          </div>
        )}

      </div>

    </div>
  );
}
