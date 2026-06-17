import React, { useState } from 'react';
import { TripRequest } from '../types';
import { MapPin, Calendar, Users, Briefcase, Heart, Rocket, Coins, Sparkles, Compass, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface TripPlannerFormProps {
  onSubmit: (data: TripRequest) => void;
  isLoading: boolean;
  prefillCity?: string;
  prefillCountry?: string;
}

const PERSONALITIES = [
  { name: 'Romantic escape', description: 'Serene moments & candlelit dinners', icon: Heart },
  { name: 'Adventure expedition', description: 'Thrilling action & trail mapping', icon: Rocket },
  { name: 'Cultural exploration', description: 'Deep heritage & historical learning', icon: Compass },
  { name: 'Food journey', description: 'Local street crawls & gourmet dining', icon: Sparkles },
  { name: 'Family vacation', description: 'Stroller-friendly, playful activities', icon: Users },
  { name: 'Digital nomad', description: 'Highly connected, cozy cafe work hubs', icon: Briefcase },
];

const INTERESTS_PRESETS = [
  'Historical places', 'Beaches', 'Mountains', 'Shopping', 'Nightlife', 
  'Local cuisine', 'Photography', 'Hidden gems', 'Museums & Art', 
  'Relaxation & Spas', 'Hiking & Trails', 'Wine Tasting', 'Local Folklore'
];

export default function TripPlannerForm({ onSubmit, isLoading, prefillCity = '', prefillCountry = '' }: TripPlannerFormProps) {
  const [step, setStep] = useState(1);
  
  // Initialize state with sensible defaults
  const [formData, setFormData] = useState<Partial<TripRequest>>({
    originCity: 'New York',
    originCountry: 'USA',
    destinationCity: prefillCity || 'Tokyo',
    destinationCountry: prefillCountry || 'Japan',
    startDate: new Date().toISOString().split('T')[0],
    endDate: (() => {
      const future = new Date();
      future.setDate(future.getDate() + 5);
      return future.toISOString().split('T')[0];
    })(),
    duration: 5,
    travelers: 1,
    ageGroup: 'adult',
    travelStyle: 'relaxed',
    budget: 'moderate',
    personality: 'Cultural exploration',
    interests: ['Historical places', 'Local cuisine', 'Hidden gems', 'Photography'],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Keep duration synced when dates change
      if (name === 'startDate' || name === 'endDate') {
        const start = new Date(updated.startDate || '');
        const end = new Date(updated.endDate || '');
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        updated.duration = Math.min(15, Math.max(1, diffDays));
      }
      
      return updated;
    });
  };

  const toggleInterest = (interest: string) => {
    const current = formData.interests || [];
    const isSelected = current.includes(interest);
    let updated: string[];
    
    if (isSelected) {
      updated = current.filter(item => item !== interest);
    } else {
      updated = [...current, interest];
    }
    
    setFormData(prev => ({ ...prev, interests: updated }));
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && formData.destinationCity) {
      // Re-evaluate duration before submit
      const start = new Date(formData.startDate || '');
      const end = new Date(formData.endDate || '');
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      
      const finishedData: TripRequest = {
        originCity: formData.originCity || 'New York',
        originCountry: formData.originCountry || 'USA',
        destinationCity: formData.destinationCity,
        destinationCountry: formData.destinationCountry || '',
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        duration: diffDays || formData.duration || 5,
        travelers: Number(formData.travelers) || 1,
        ageGroup: formData.ageGroup as any || 'adult',
        travelStyle: formData.travelStyle as any || 'active',
        budget: formData.budget as any || 'moderate',
        personality: formData.personality as any || 'Cultural exploration',
        interests: formData.interests || [],
      };
      
      onSubmit(finishedData);
    }
  };

  return (
    <div className="bg-[#111115]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-3xl mx-auto">
      {/* Dynamic wizard indicators */}
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] flex items-center justify-center font-display font-semibold">
            {step}
          </div>
          <div>
            <h3 className="font-bold text-[#e1e1e1] leading-tight-none font-display">Step {step} of 3</h3>
            <p className="text-xs text-[#888]">
              {step === 1 && 'Destinations & Timeframe'}
              {step === 2 && 'Traveler Profile & Cadence'}
              {step === 3 && 'Aesthetic Tone & Goals'}
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <span className={`w-6 h-1.5 rounded-full transition-colors ${step >= 1 ? 'bg-[#d4af37]' : 'bg-zinc-800'}`} />
          <span className={`w-6 h-1.5 rounded-full transition-colors ${step >= 2 ? 'bg-[#d4af37]' : 'bg-zinc-800'}`} />
          <span className={`w-6 h-1.5 rounded-full transition-colors ${step >= 3 ? 'bg-[#d4af37]' : 'bg-zinc-800'}`} />
        </div>
      </div>
 
      <form onSubmit={handleSubmitForm} className="space-y-8">
        
        {/* STEP 1: DESTINATIONS & TIME */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-display text-[#e1e1e1] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#d4af37]" />
              Where are we flying today?
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Origin City</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-[#888] text-sm">📍</span>
                  <input
                    type="text"
                    name="originCity"
                    required
                    placeholder="e.g., Paris"
                    value={formData.originCity}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/15 text-white font-medium placeholder-zinc-500 bg-zinc-950/40"
                  />
                </div>
              </div>
 
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Origin Country</label>
                <input
                  type="text"
                  name="originCountry"
                  required
                  placeholder="e.g., France"
                  value={formData.originCountry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/15 text-white font-medium placeholder-zinc-500 bg-zinc-950/40"
                />
              </div>
            </div>
 
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Destination City</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-[#888] text-sm">✈️</span>
                  <input
                    type="text"
                    name="destinationCity"
                    required
                    placeholder="e.g., Tokyo"
                    value={formData.destinationCity}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/15 text-white font-medium placeholder-zinc-500 bg-zinc-950/40"
                  />
                </div>
              </div>
 
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Destination Country</label>
                <input
                  type="text"
                  name="destinationCountry"
                  required
                  placeholder="e.g., Japan"
                  value={formData.destinationCountry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/15 text-white font-medium placeholder-zinc-500 bg-zinc-950/40"
                />
              </div>
            </div>
 
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#888] uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                  Departure Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-[#d4af37] text-white font-medium bg-zinc-950/40"
                />
              </div>
 
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#888] uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                  Return Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-[#d4af37] text-white font-medium bg-zinc-950/40"
                />
              </div>
            </div>
 
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex justify-between items-center animate-pulse">
              <span className="text-sm font-medium text-[#aaa]">Calculated Itinerary Timeframe</span>
              <span className="px-3.5 py-1.5 bg-[#d4af37] text-[#0a0a0c] rounded-lg text-xs font-black uppercase tracking-wider">
                {formData.duration} Day(s) Selected
              </span>
            </div>
          </div>
        )}
 
        {/* STEP 2: TRAVELER PROFILE & STYLE */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-display text-[#e1e1e1] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#d4af37]" />
              Who is on board & how do you travel?
            </h2>
 
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Number of Travelers</label>
                <select
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 text-[#e1e1e1] font-medium bg-zinc-950/80 focus:border-[#d4af37]"
                >
                  <option value={1} className="bg-zinc-950">Single Traveler</option>
                  <option value={2} className="bg-zinc-950">Couple / 2 Travelers</option>
                  <option value={4} className="bg-zinc-950">Small Group / Family of 4</option>
                  <option value={6} className="bg-zinc-950">Large Expedition / 6+</option>
                </select>
              </div>
 
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Traveler Age Group</label>
                <select
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 text-[#e1e1e1] font-medium bg-zinc-950/80 focus:border-[#d4af37]"
                >
                  <option value="youth" className="bg-zinc-950">Youth seeking adventure (18-29)</option>
                  <option value="adult" className="bg-zinc-950">Working adults (30-55)</option>
                  <option value="senior" className="bg-zinc-950">Seniors / Leisurely paces (56+)</option>
                  <option value="family" className="bg-zinc-950">Multi-generational with Kids</option>
                </select>
              </div>
            </div>
 
            <div className="space-y-4 pt-2">
              <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block">Travel Cadence Style</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'relaxed', title: 'Slow & Leisurely', desc: 'Savour lazy breakfasts, long lunches, and 1-2 major sights a day.' },
                  { key: 'active', title: 'Balanced & Exploration', desc: 'Standard healthy pace. Balanced mix of culture, walks, and relaxation.' },
                  { key: 'packed', title: 'Fully Loaded / Hyper-active', desc: 'No-waste scheduled routing. Maximum landmarks, early starts, high energy.' },
                  { key: 'immersive', title: 'Neighborhood Culture', desc: 'Unpack in deep hidden residential districts, tasting hyper-local spots.' }
                ].map(style => (
                  <div
                    key={style.key}
                    onClick={() => setFormData(prev => ({ ...prev, travelStyle: style.key as any }))}
                    className={`p-4 rounded-xl border cursor-pointer select-none transition-all ${
                      formData.travelStyle === style.key 
                        ? 'border-[#d4af37] bg-[#d4af37]/10 shadow-inner' 
                        : 'border-white/5 bg-zinc-900/40 hover:border-white/20 hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[#e1e1e1] text-sm">{style.title}</span>
                      {formData.travelStyle === style.key && <span className="w-4 h-4 rounded-full bg-[#d4af37] flex items-center justify-center text-[#0a0a0c] text-[10px] font-bold">✓</span>}
                    </div>
                    <p className="text-xs text-[#aaa] leading-relaxed font-light">{style.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
 
        {/* STEP 3: BUDGET, PERSONALITY & MOTIFS */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-display text-[#e1e1e1] flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#d4af37]" />
              Budget Tier & Architectural Personality
            </h2>
 
            {/* Budget selectors */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block">Your Financial Budget Tier</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { level: 'economy', label: 'Economy', price: '$', bg: 'Stay simple, hostels, transit card' },
                  { level: 'moderate', label: 'Moderate', price: '$$', bg: 'Comfortable hotels, bistros' },
                  { level: 'premium', label: 'Premium', price: '$$$', bg: 'Boutique hubs, nice cuisines' },
                  { level: 'luxury', label: 'High Luxury', price: '$$$$', bg: '5-Star lodging, private guides' }
                ].map(tier => (
                  <div
                    key={tier.level}
                    onClick={() => setFormData(prev => ({ ...prev, budget: tier.level as any }))}
                    className={`p-4 rounded-xl border cursor-pointer text-center select-none transition-all ${
                      formData.budget === tier.level
                        ? 'border-[#d4af37] bg-[#d4af37]/15 shadow-md shadow-[#d4af37]/5'
                        : 'border-white/5 bg-zinc-900/40 hover:bg-zinc-800'
                    }`}
                  >
                    <span className="text-xs text-[#888] block font-semibold mb-0.5">{tier.label}</span>
                    <span className="text-lg font-black text-[#d4af37] block">{tier.price}</span>
                    <span className="text-[9px] text-[#aaa] block leading-tight mt-1 font-light">{tier.bg}</span>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Personality selector */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block">Trip Narrative Personality</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PERSONALITIES.map(item => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={item.name}
                      onClick={() => setFormData(prev => ({ ...prev, personality: item.name as any }))}
                      className={`p-4 rounded-xl border cursor-pointer select-none transition-all flex items-start gap-3 ${
                        formData.personality === item.name
                          ? 'border-[#d4af37] bg-[#d4af37]/15'
                          : 'border-white/5 bg-zinc-900/40 hover:bg-zinc-800'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${formData.personality === item.name ? 'bg-[#d4af37] text-[#0a0a0c]' : 'bg-zinc-800 text-[#aaa]'}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#e1e1e1] block">{item.name}</span>
                        <span className="text-xs text-[#aaa] block leading-tight mt-0.5 font-light">{item.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
 
            {/* Interests checklist */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block">Specific Travel Interests</label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS_PRESETS.map(interest => {
                  const isChecked = (formData.interests || []).includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold select-none cursor-pointer transition-all border flex items-center gap-1.5 ${
                        isChecked 
                          ? 'bg-[#d4af37] border-[#d4af37] text-[#0a0a0c]' 
                          : 'bg-zinc-950/20 border-white/10 hover:border-white/30 text-[#aaa]'
                      }`}
                    >
                      {isChecked ? <Check className="w-3.5 h-3.5" /> : null}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
 
        {/* Action Controls */}
        <div className="flex justify-between items-center pt-6 border-t border-white/5">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-5 py-3 rounded-xl border border-white/10 hover:bg-zinc-900 text-[#e1e1e1] text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
          ) : (
            <div />
          )}
 
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading || !formData.destinationCity}
              className={`px-8 py-4 rounded-xl bg-[#d4af37] hover:bg-[#b0902c] text-[#0a0a0c] font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-[#d4af37]/10 active:scale-95 transition-all text-xs ${
                isLoading ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#0a0a0c]" />
              {isLoading ? 'Architecting Voyage...' : 'Generate Travel Itinerary'}
            </button>
          )}
        </div>
 
      </form>
    </div>
  );
}
