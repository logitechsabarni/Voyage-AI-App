import { Compass, Globe, Sparkles, MapPin, ArrowRight, ShieldCheck, Sun, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  onStartPlanning: () => void;
  onSelectQuickTrip: (city: string, country: string) => void;
}

const TRENDING_DESTINATIONS = [
  { city: 'Tokyo', country: 'Japan', desc: 'Neon skylines and ancient temples', rating: 4.9, tag: 'Cultural & Tech' },
  { city: 'Paris', country: 'France', desc: 'Art, boulangeries and romance', rating: 4.8, tag: 'Art & Food' },
  { city: 'Rome', country: 'Italy', desc: 'Historic streets and pasta masterclasses', rating: 4.9, tag: 'History & Culture' },
  { city: 'London', country: 'United Kingdom', desc: 'Royal heritage and cozy waterways', rating: 4.7, tag: 'Urban Explorer' },
];

export default function HomeView({ onStartPlanning, onSelectQuickTrip }: HomeViewProps) {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-[#111115] border border-white/10 text-white shadow-2xl">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a35_1px,transparent_1px),linear-gradient(to_bottom,#2a2a35_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />
        
        <div className="relative z-10 px-6 py-20 text-center sm:px-12 sm:py-28 max-w-4xl mx-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/35 text-[#d4af37] text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            Empowering Adventure with Deep AI
          </motion.div>
 
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-display font-bold tracking-tight leading-tight"
          >
            Your Ultimate AI <span className="text-[#d4af37]">Travel Architect</span>
          </motion.h1>
 
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-[#aaa] font-light leading-relaxed max-w-2xl mx-auto"
          >
            Craft enterprise-grade, hyper-personalized itineraries powered by Google Gemini AI. 
            Enjoy predictive travel forecasting, deep cultural profiles, and custom financial analytics.
          </motion.p>
 
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <button
              id="btn-hero-start"
              onClick={onStartPlanning}
              className="px-8 py-4 w-full sm:w-auto rounded-xl bg-[#d4af37] hover:bg-[#b0902c] text-[#0a0a0c] font-black shadow-lg hover:shadow-[#d4af37]/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <Compass className="w-5 h-5 animate-spin-slow" />
              Design New Voyage
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#trending"
              className="px-6 py-4 w-full sm:w-auto rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-white font-medium active:scale-95 transition-all text-center"
            >
              Explore Hotspots
            </a>
          </motion.div>
        </div>
      </div>
 
      {/* Core Platform Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl bg-[#16161a]/60 border border-white/5 shadow-sm relative group hover:border-[#d4af37]/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center mb-6">
            <Globe className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-[#e1e1e1] font-display mb-2">Global Destination Intel</h3>
          <p className="text-[#aaa] text-sm leading-relaxed">
            Instant insights on local etiquette, behavioral taboos, seasonal cycles, and custom safety parameters for any coordinates.
          </p>
        </div>
        
        <div className="p-8 rounded-2xl bg-[#16161a]/60 border border-white/5 shadow-sm relative group hover:border-[#d4af37]/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#e1e1e1] font-display mb-2">Google Gemini AI Engine</h3>
          <p className="text-[#aaa] text-sm leading-relaxed">
            Advanced reasoning analyzes your detailed interests, budget restrictions, and travel tempo to build logical geographical trails.
          </p>
        </div>
 
        <div className="p-8 rounded-2xl bg-[#16161a]/60 border border-white/5 shadow-sm relative group hover:border-[#d4af37]/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#e1e1e1] font-display mb-2">Automated Repair Mechanism</h3>
          <p className="text-[#aaa] text-sm leading-relaxed">
            Enterprise-grade validator automatically cleans malformed payloads and activates resilient offline backup modes in poor telemetry.
          </p>
        </div>
      </div>
 
      {/* Trending Destination Quick Builders */}
      <div id="trending" className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-2xl font-bold text-[#e1e1e1] font-display">Instant AI Templates</h2>
            <p className="text-[#888] text-sm">Select a major hotspot to run pre-analyzed AI planning pipelines instantly</p>
          </div>
          <span className="px-3 py-1 rounded-md bg-emerald-950/40 border border-emerald-800/20 text-emerald-400 text-xs font-semibold">
            ● Real-Time Ready
          </span>
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRENDING_DESTINATIONS.map((dest) => (
            <div 
              key={dest.city}
              onClick={() => onSelectQuickTrip(dest.city, dest.country)}
              className="group cursor-pointer overflow-hidden p-5 rounded-2xl bg-[#16161a]/50 border border-white/5 hover:border-[#d4af37]/45 hover:shadow-lg hover:shadow-black/60 transition-all space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1 text-[#d4af37]">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">{dest.country}</span>
                </div>
                <div className="flex items-center gap-1 text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded text-xs font-medium">
                  <Star className="w-3 h-3 fill-[#d4af37]" />
                  {dest.rating}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-[#e1e1e1] group-hover:text-[#d4af37] transition-colors">{dest.city}</h4>
                <p className="text-[#aaa] text-xs mt-1 leading-relaxed line-clamp-2">{dest.desc}</p>
              </div>
 
              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <span className="text-[11px] px-2 py-0.5 bg-[#1e1e24] rounded-full font-medium text-[#aaa]">{dest.tag}</span>
                <span className="text-xs text-[#d4af37] font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Draft
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
