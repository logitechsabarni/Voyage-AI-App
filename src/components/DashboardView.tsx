import { useState, useEffect, useRef } from 'react';
import { TripPlan, WeatherData, RecommendationScore, SmartFlight, HotelOption, BookingReservations } from '../types';
import WeatherWidget from './WeatherWidget';
import AnalyticsView from './AnalyticsView';
import { 
  Calendar, MapPin, Eye, Utensils, Hotel, ShieldCheck, Compass, 
  Map, ThumbsUp, Landmark, AlertCircle, Sparkles, BookOpen, Clock, Lightbulb,
  Plane, DollarSign, Send, MessageSquare, Briefcase, BarChart4, CheckSquare, ShieldAlert, BadgeInfo, Receipt, FileText
} from 'lucide-react';

interface DashboardViewProps {
  plan: TripPlan;
  weather: WeatherData;
  recommendations: RecommendationScore[];
  tripRequest?: any;
  onBack: () => void;
}

export default function DashboardView({ plan, weather, recommendations, tripRequest, onBack }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'comparison' | 'marketplace' | 'discover' | 'analytics' | 'chat'>('itinerary');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedFlight, setSelectedFlight] = useState<string>('best');
  const [selectedHotel, setSelectedHotel] = useState<string>('luxury');
  
  const [isTripBooked, setIsTripBooked] = useState<boolean>(false);
  const [isBookingInProcess, setIsBookingInProcess] = useState<boolean>(false);
  
  // Multi-currency details
  const [activeCurrency, setActiveCurrency] = useState<'INR' | 'USD' | 'EUR'>(tripRequest?.currency || 'USD');
  const currencyRate = activeCurrency === 'INR' ? 83 : activeCurrency === 'EUR' ? 0.92 : 1;
  const currencySymbol = activeCurrency === 'INR' ? '₹' : activeCurrency === 'EUR' ? '€' : '$';

  // Format currency helper
  const formatCostValue = (val: string | number): string => {
    let raw = 0;
    if (typeof val === 'number') {
      raw = val;
    } else {
      const cleaned = String(val).replace(/[^0-9.]/g, '');
      raw = parseFloat(cleaned) || 200;
    }
    return Math.round(raw * currencyRate).toLocaleString();
  };

  // Document checklists state
  const [checklist, setChecklist] = useState({
    passport: true,
    visa: false,
    flight: true,
    hotel: true,
    card: false,
    insurance: true
  });

  // Active chat state
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: `Greetings! I am your VoyageAI X Ultra travel pilot. I've compiled your customized trip data. How can I help you adjust your plans or organize local details?`
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle Chat Input Command
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    if (!customText) setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          tripRequest,
          tripPlan: plan,
          history: chatMessages
        })
      });

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Apologies, I encountered a connection glitch. Let me try compiling again.' }]);
    } catch (err) {
      console.error('Chat failed:', err);
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Fallback mode: Sure thing! I would recommend packing standard warm/cool garments, bringing electrical adapters, and leaving 1.5 hours advance window for flight boardings.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Fallback defaults for lists in VoyagerAI X Ultra
  const flightsList: SmartFlight[] = plan.flights || [
    { airline: 'Emirates', duration: '6h 10m', stops: 0, departure: '10:30 AM', arrival: '04:40 PM', price: 620, tier: 'best' },
    { airline: 'IndiGo Airlines', duration: '8h 20m', stops: 1, departure: '06:15 AM', arrival: '02:35 PM', price: 420, tier: 'cheapest' },
    { airline: 'Air India', duration: '5h 45m', stops: 0, departure: '12:45 PM', arrival: '06:30 PM', price: 710, tier: 'fastest' },
    { airline: 'Qatar Airways', duration: '7h 15m', stops: 1, departure: '09:00 PM', arrival: '04:15 AM', price: 530, tier: 'value' }
  ];

  const hotelsList: HotelOption[] = plan.hotels || [
    { name: 'Grand Regent Palace & Spa', area: 'Downtown Culture Circle', price: 280, rating: 4.8, reason: 'Luxurious resort featuring indoor thermal baths and immediate transport access.', tier: 'luxury' },
    { name: 'Citadines Urban Suites', area: 'Trendsetter Art District', price: 140, rating: 4.5, reason: 'Superb location flanked by specialty bakeries and aesthetic crafts.', tier: 'premium' },
    { name: 'City Heart Inn & Suites', area: 'Historical Town Center', price: 75, rating: 4.2, reason: 'Cozy walk-friendly quarters with warm complimentary breakfasts.', tier: 'moderate' },
    { name: 'Nomad Backpacker Pods', area: 'Metro station lines', price: 30, rating: 4.0, reason: 'Highly rated social capsule pods featuring zesty workstations.', tier: 'economy' }
  ];

  const safetyDetails = plan.safety_and_risk || {
    safety: 92,
    budget: 85,
    weather: 88,
    ease: 90,
    crowd: 65,
    visa: 95,
    overall: 89
  };

  const bookingVouchers = plan.simulated_bookings || {
    flights: { id: 'FL-289123', pnr: 'P6Q8YL', code: 'VAI-EMR8', details: 'Simulated Outbound Flight booked successfully.' },
    hotels: { id: 'HT-489012', code: 'VCH-REGX', details: 'Palace Room booked. Includes complimentary local high tea.' },
    transport: { id: 'TR-119022', code: 'CAB-HURR', details: 'Pre-paid Shuttle. Meet driver in arrival corridor.' },
    activity: { id: 'AC-105562', code: 'TKT-FAST', details: 'Fast-pass skipping unified experience voucher.' }
  };

  const comparisonData = plan.comparison_engine || {
    winner: plan.destination_analysis ? tripRequest?.destinationCity || 'Primary Choice' : 'Goa (India)',
    runnerUp: 'Bali (Indonesia)',
    bestBudget: 'Bali (Indonesia)',
    bestLuxury: 'Goa Premium Suites',
    bestFamily: 'Goa (India)',
    bestAdventure: 'Thailand Islands',
    bestRomantic: 'Goa Heritage Palms',
    explanation: `Your parameters match Goa exceptionally well, scoring 90% in terms of family comfort, beautiful mild winter weather, and excellent transportation links. Bali provides a fabulous runner-up destination with similar tropical activities.`,
    options: [
      {
        destination: tripRequest?.destinationCity || 'Primary Destination',
        scores: { budget: 88, weather: 90, crowd: 70, flight_cost: 85, food_cost: 88, safety: 92, visa: 95, attractions: 94, overall: 90 },
        pros: ['Customized match details', 'Includes premium hotel options', 'High family suitability']
      },
      {
        destination: 'Bali (Indonesia)',
        scores: { budget: 82, weather: 84, crowd: 62, flight_cost: 72, food_cost: 80, safety: 88, visa: 90, attractions: 92, overall: 84 },
        pros: ['Remarkable surfing options', 'Stunning scenic rice terraces', 'Slightly higher flights cost']
      },
      {
        destination: 'Thailand Coast',
        scores: { budget: 86, weather: 82, crowd: 58, flight_cost: 78, food_cost: 85, safety: 84, visa: 92, attractions: 88, overall: 82 },
        pros: ['Outstanding local street dishes', 'Easy short flight connections', 'Mild early afternoon rains']
      }
    ]
  };

  const experiencePack = plan.local_gems || {
    street_food: ['Glazed Crispy Pockets', 'Artisanal Spiced Broth', 'Sweet Coconut Crepes', 'Signature Cold Drip'],
    instagram_spots: ['Historic Archway viewpoint', 'Overlooking cliff edge', 'Colorfully painted heritage lane'],
    sunrise_spots: ['Central ancient citadel', 'Quiet eastern beach docks'],
    sunset_spots: ['Rooftop botanical café balcony', 'Panoramic stone bridge walkway']
  };

  const customInsights = plan.insights || [
    'Save 15% on dining costs by wandering just two blocks off the main tourist promenade.',
    'Integrated metro system pass is 45% cheaper than hailing single point-to-point taxis.',
    'Book local entry attraction tickets before 09:00 AM to bypass the bulk of tour groups.',
    'Carry a universal electrical adapter to handle different pin inputs smoothly.',
    'Local eSIMs available at the train terminals are half the price of airport stalls.'
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* 1. TOP PREMIUM CONFIRMATION HEADER BAR */}
      <div className="relative overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-emerald-950/50 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-800/30 flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              VoyageAI X Ultra — Trip Confirmed
            </span>
            <span className="text-[10px] bg-zinc-900 text-zinc-400 px-2.5 py-1 rounded-lg border border-white/5 font-mono">
              REF: {bookingVouchers.flights.pnr}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight leading-none">
            {tripRequest?.destinationCity || 'Your Destination'} Operating Portal
          </h2>
          <p className="text-xs text-zinc-400 font-light max-w-xl leading-relaxed">
            {plan.trip_summary}
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-zinc-350 text-xs">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
              <strong>Departure:</strong> {tripRequest?.startDate || 'Incoming'}
            </div>
            <div className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
              <strong>Style:</strong> {tripRequest?.personality || 'Custom Explorer'}
            </div>
            <div className="flex items-center gap-1 col-span-2">
              <Briefcase className="w-3.5 h-3.5 text-[#d4af37]" />
              <strong>Active Budget Plan:</strong> {tripRequest?.budget?.toUpperCase() || 'MODERATE'}
            </div>
          </div>
        </div>

        {/* Currency & Back row action */}
        <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-3 w-full md:w-auto relative z-10 shrink-0">
          <div className="bg-zinc-950/80 border border-white/5 p-2 rounded-2xl flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-zinc-450 uppercase pl-2">Display Wallet:</span>
            <div className="flex gap-1">
              {(['USD', 'INR', 'EUR'] as const).map(curr => (
                <button
                  key={curr}
                  onClick={() => setActiveCurrency(curr)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer select-none ${
                    activeCurrency === curr 
                      ? 'bg-[#d4af37] text-zinc-950 shadow-md font-black' 
                      : 'hover:bg-zinc-900 text-zinc-400'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full text-center px-4 py-3 bg-[#d4af37] hover:bg-[#c39e26] text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all font-sans cursor-pointer active:scale-95 shadow-lg shadow-[#d4af37]/15"
          >
            ← Modify Search Criteria
          </button>
        </div>
      </div>

      {/* 2. NAVIGATION BAR (VOYAGEAI INTEGRATED DIRECTORY) */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'itinerary', label: 'Travel OS Hub', icon: Calendar },
          { id: 'comparison', label: 'AI Sibling Comparison', icon: Landmark },
          { id: 'marketplace', label: 'AI Travel Marketplace', icon: Plane },
          { id: 'discover', label: 'Local Discovery & Gems', icon: MapPin },
          { id: 'analytics', label: 'Plotly Analytics Room', icon: BarChart4 },
          { id: 'chat', label: 'AI Copilot Chat', icon: MessageSquare }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 flex items-center gap-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap scroll-mx-4 ${
                isActive 
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#e6c253] text-[#0a0a0c] lg:scale-102 font-black shadow-lg shadow-[#d4af37]/10' 
                  : 'bg-zinc-950/40 border border-white/5 hover:border-[#d4af37]/30 text-zinc-450 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3. PRIMARY ENGINES ROUTING INTERFACE */}
      <div className="space-y-8 animate-fade-in">

        {/* ==================== TAB A: TRAVEL OS HUB ==================== */}
        {activeTab === 'itinerary' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* L-1: BOARDING PASS CARD & CHECKLISTS column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Voyage Summary Checklist & Checkout Button Panel */}
              <div className="bg-[#111114] border border-[#d4af37]/30 rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#d4af37] block">Voyage Checkout OS</span>
                    <h4 className="text-sm font-black text-white font-display uppercase tracking-tight">Booking & billing Summary</h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold border uppercase transition-colors shrink-0 ${
                    isTripBooked
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-[#d4af37] border-[#d4af37]/20 animate-pulse'
                  }`}>
                    {isTripBooked ? '● Confirmed & Secured' : '● Standby Offer'}
                  </span>
                </div>

                {/* Total amount display with dynamic multi-currency converter */}
                <div className="p-4 bg-zinc-950 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[11px] font-medium text-zinc-400">Total Price ({activeCurrency}):</span>
                    <span className="text-3xl font-black font-mono text-white tracking-tight flex items-center gap-0.5">
                      {currencySymbol}{formatCostValue(plan.budget_estimate.total || 1450)}
                    </span>
                  </div>
                  
                  {/* Small sub-breakdown bar */}
                  <div className="pt-2 border-t border-white/5 grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="bg-zinc-900/40 p-2 rounded-xl border border-white/5">
                      <span className="text-[8px] text-zinc-500 block uppercase font-mono tracking-wider mb-0.5">Stays</span>
                      <span className="font-bold text-zinc-200 font-mono">{currencySymbol}{formatCostValue(plan.budget_estimate.stay || 450)}</span>
                    </div>
                    <div className="bg-zinc-900/40 p-2 rounded-xl border border-white/5">
                      <span className="text-[8px] text-zinc-500 block uppercase font-mono tracking-wider mb-0.5">Flights</span>
                      <span className="font-bold text-zinc-200 font-mono">{currencySymbol}{formatCostValue((flightsList[0]?.price || 320) + (flightsList[1]?.price || 400) / 2)}</span>
                    </div>
                    <div className="bg-zinc-900/40 p-2 rounded-xl border border-white/5">
                      <span className="text-[8px] text-zinc-500 block uppercase font-mono tracking-wider mb-0.5">Transit</span>
                      <span className="font-bold text-zinc-200 font-mono">{currencySymbol}{formatCostValue(plan.budget_estimate.transport || 120)}</span>
                    </div>
                  </div>
                </div>

                {/* Booking status & interactive trigger */}
                <div className="space-y-3">
                  {isBookingInProcess ? (
                    <div className="w-full py-3.5 px-4 bg-zinc-950 text-center rounded-xl text-xs text-zinc-400 font-mono flex items-center justify-center gap-2.5 border border-white/5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
                      Securing block seats & room allocations...
                    </div>
                  ) : isTripBooked ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs font-light rounded-xl leading-relaxed">
                        🎉 <strong className="font-bold">Voyage Secure Confirmation:</strong> Your live seat holds and central hotel allocations are active under simulated booking sequence ID <strong className="font-bold font-mono">P6Q-9921Y</strong>.
                      </div>
                      <button
                        onClick={() => {
                          alert(`DOWNLOAD METADATA: Unified boarding credentials and stay confirmation voucher pdf downloaded for ${tripRequest?.destinationCity || 'your destination'}.`);
                        }}
                        className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Download E-Tickets (PDF)
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsBookingInProcess(true);
                        setTimeout(() => {
                          setIsBookingInProcess(false);
                          setIsTripBooked(true);
                        }, 1500);
                      }}
                      className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] to-[#e6c253] hover:from-[#c39e26] hover:to-[#dbb53f] text-[#0a0a0c] font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#d4af37]/25 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Plane className="w-4 h-4 shrink-0" />
                      Book This Entire Trip Now
                    </button>
                  )}
                  <p className="text-[9px] text-zinc-500 text-center font-light leading-snug">
                    VoyageAI guarantees complete reservation holdings for 72h. Instant local transit card codes generated automatically upon confirmation.
                  </p>
                </div>
              </div>

              {/* Voucher Boarding Ticket */}
              <div className="bg-[#111114] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="p-5 bg-gradient-to-r from-zinc-900 to-zinc-950 border-b border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-[11px] font-black uppercase text-white font-mono tracking-widest">Boarding Pass Voucher</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-mono">Simulated</span>
                </div>

                <div className="p-6 space-y-6">
                  {/* Origin -> Destination Banner */}
                  <div className="flex justify-between items-center text-center font-display relative">
                    <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-dashed bg-zinc-800 -z-10" />
                    <div className="text-left bg-[#111114] pr-3">
                      <span className="text-2xl font-black font-mono text-[#d4af37]">
                        {tripRequest?.originCity?.substring(0,3).toUpperCase() || 'DEL'}
                      </span>
                      <span className="text-[9px] block text-zinc-500 tracking-wider font-light mt-0.5">{tripRequest?.originCity || 'Delhi'}</span>
                    </div>
                    
                    <span className="bg-zinc-900 p-2 rounded-full border border-white/5 font-mono text-[9px] text-[#d4af37] z-10 px-3">
                      NON-STOP
                    </span>

                    <div className="text-right bg-[#111114] pl-3">
                      <span className="text-2xl font-black font-mono text-[#d4af37]">
                        {tripRequest?.destinationCity?.substring(0,3).toUpperCase() || 'GOA'}
                      </span>
                      <span className="text-[9px] block text-zinc-500 tracking-wider font-light mt-0.5">{tripRequest?.destinationCity || 'Goa'}</span>
                    </div>
                  </div>

                  {/* Booking parameters row */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-zinc-500 uppercase font-light block">Flight PNR Code</span>
                      <span className="font-bold text-xs text-white font-mono">{bookingVouchers.flights.pnr}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-zinc-500 uppercase font-light block">Hotel Voucher ID</span>
                      <span className="font-bold text-xs text-white font-mono">{bookingVouchers.hotels.code}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-zinc-500 uppercase font-light block">Shuttle Code</span>
                      <span className="font-bold text-xs text-white font-mono">{bookingVouchers.transport.code}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-zinc-500 uppercase font-light block">Unified Activity Voucher</span>
                      <span className="font-bold text-xs text-white font-mono">{bookingVouchers.activity.code}</span>
                    </div>
                  </div>

                  {/* Safety & risk dials overlay */}
                  <div className="p-4 bg-zinc-950 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Voyage Safety Rating</span>
                      <span className="text-xs font-black font-mono text-[#d4af37]">{safetyDetails.safety}% Trust score</span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-[#d4af37] h-1.5" style={{ width: `${safetyDetails.safety}%` }} />
                    </div>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="bg-white p-4 h-16 flex flex-col justify-center items-center gap-1 opacity-90 border-t border-zinc-200">
                  <div className="w-full h-8 bg-mono-barcode" style={{ content: '""', backgroundImage: 'repeating-linear-gradient(90deg, #111, #111 2px, transparent 2px, transparent 6px)' }} />
                  <span className="text-[9px] font-mono font-bold text-zinc-700 uppercase">VoyageAI-Ultra2.5-VouchersPackage-Verified</span>
                </div>
              </div>

              {/* Countdown & Doc Checklist */}
              <div className="bg-[#111114]/85 border border-white/10 rounded-3xl p-6 space-y-4 shadow-sm">
                <h3 className="font-bold font-display text-[#e1e1e1] text-xs uppercase tracking-wider flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#d4af37]" />
                  Departure Readiness Checklist
                </h3>

                <div className="space-y-2.5">
                  {[
                    { key: 'passport', label: 'Passport valid > 6 months' },
                    { key: 'visa', label: `Visa documents ready` },
                    { key: 'flight', label: 'Simulated boarding tickets downloaded' },
                    { key: 'hotel', label: 'Simulated hotel voucher saved' },
                    { key: 'card', label: 'International transaction limits configured' },
                    { key: 'insurance', label: 'Emergency medical travel insurance active' }
                  ].map(item => (
                    <label key={item.key} className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-950/50 hover:bg-zinc-900 border border-white/5 cursor-pointer selection-none transition-colors">
                      <input
                        type="checkbox"
                        checked={(checklist as any)[item.key]}
                        onChange={(e) => setChecklist(prev => ({ ...prev, [item.key]: e.target.checked }))}
                        className="w-4 h-4 rounded border-zinc-800 text-[#d4af37] focus:ring-[#d4af37]/50 accent-[#d4af37]"
                      />
                      <span className={`text-xs font-light ${ (checklist as any)[item.key] ? 'line-through text-zinc-500 font-normal' : 'text-zinc-350' }`}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* L-2: TIMELINES & ACTIVE SELECTION SLOT (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Day Horiz select list */}
              <div className="flex flex-col sm:flex-row gap-4 p-5 bg-[#111114]/90 border border-white/10 rounded-3xl shadow-sm justify-between items-stretch sm:items-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37]">Time Slot Itinerary</span>
                  <h4 className="text-sm font-bold text-white font-display">Day-by-Day Activity timeline</h4>
                </div>
                
                {/* Horizontal day strip */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full sm:max-w-[400px]">
                  {plan.itinerary.map(item => (
                    <button
                      key={item.day}
                      onClick={() => setSelectedDay(item.day)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none shrink-0 border uppercase font-mono ${
                        selectedDay === item.day
                          ? 'bg-[#d4af37] border-[#d4af37] text-zinc-950 font-black shadow'
                          : 'bg-zinc-950/40 border-white/5 hover:border-[#d4af37]/30 text-zinc-400'
                      }`}
                    >
                      Day {item.day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Day timeline items */}
              {plan.itinerary.filter(day => day.day === selectedDay).map(day => (
                <div key={day.day} className="space-y-6">
                  
                  {/* Theme info banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#d4af37] block">Active Day Theme</span>
                      <h4 className="font-bold text-white font-display text-sm leading-tight">{day.theme}</h4>
                    </div>
                    <span className="px-3 py-1 bg-zinc-950/80 rounded-lg text-[10px] border border-white/5 font-mono font-bold text-zinc-400 self-start sm:self-auto">
                      Date: {day.date}
                    </span>
                  </div>

                  {/* The Timeline line */}
                  <div className="relative border-l-2 border-l-[#d4af37]/25 pl-6 ml-4 space-y-6 py-2">
                    
                    {/* Slot 1: MORNING */}
                    <div className="relative">
                      <div className="absolute -left-[35px] top-1.5 w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-xs border border-white/10 shadow shadow-amber-500/20">
                        🌅
                      </div>
                      <div className="p-5 rounded-2xl bg-[#111114]/70 border border-white/5 shadow-sm hover:border-[#d4af37]/35 transition-all space-y-2">
                        <div className="flex justify-between items-start gap-4 flex-wrap">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#d4af37] block">Morning slot — 08:00 to 12:00</span>
                            <h5 className="font-bold text-white font-display text-xs">{day.morning.place}</h5>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-zinc-950 border border-white/5 text-zinc-400 text-[10px] font-mono flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            {day.morning.duration}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs leading-relaxed font-light">{day.morning.activity}</p>
                      </div>
                    </div>

                    {/* Slot 2: AFTERNOON */}
                    <div className="relative">
                      <div className="absolute -left-[35px] top-1.5 w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-xs border border-white/10 shadow shadow-amber-500/20">
                        ☀️
                      </div>
                      <div className="p-5 rounded-2xl bg-[#111114]/70 border border-white/5 shadow-sm hover:border-[#d4af37]/35 transition-all space-y-2">
                        <div className="flex justify-between items-start gap-4 flex-wrap">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#d4af37] block">Afternoon travel slot — 12:00 to 16:00</span>
                            <h5 className="font-bold text-white font-display text-xs">{day.afternoon.place}</h5>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-zinc-950 border border-white/5 text-zinc-400 text-[10px] font-mono flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            {day.afternoon.duration}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs leading-relaxed font-light">{day.afternoon.activity}</p>
                      </div>
                    </div>

                    {/* Slot 3: EVENING */}
                    <div className="relative">
                      <div className="absolute -left-[35px] top-1.5 w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-xs border border-white/10 shadow shadow-amber-500/20">
                        🌙
                      </div>
                      <div className="p-5 rounded-2xl bg-[#111114]/70 border border-white/5 shadow-sm hover:border-[#d4af37]/35 transition-all space-y-2">
                        <div className="flex justify-between items-start gap-4 flex-wrap">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#d4af37] block">Evening sunsets — 16:00 to 20:00</span>
                            <h5 className="font-bold text-white font-display text-xs">{day.evening.place}</h5>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-zinc-950 border border-white/5 text-zinc-400 text-[10px] font-mono flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            {day.evening.duration}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs leading-relaxed font-light">{day.evening.activity}</p>
                      </div>
                    </div>

                    {/* Slot 4: NIGHT (MANDATORY YER REPRESENTATION FOR VOYAGEAI X ULTRA) */}
                    <div className="relative">
                      <div className="absolute -left-[35px] top-1.5 w-8 h-8 rounded-full bg-zinc-950 text-[#d4af37] flex items-center justify-center font-bold text-xs border border-white/10 shadow shadow-amber-500/20">
                        ✨
                      </div>
                      <div className="p-5 rounded-2xl bg-[#111114]/70 border border-white/5 shadow-sm hover:border-[#d4af37]/35 transition-all space-y-2">
                        <div className="flex justify-between items-start gap-4 flex-wrap">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#d4af37] block">Late night cap — 20:00 onwards</span>
                            <h5 className="font-bold text-white font-display text-xs">
                              {day.night?.place || `Traditional ${tripRequest?.destinationCity || 'Local'} Night market`}
                            </h5>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-zinc-950 border border-white/5 text-zinc-400 text-[10px] font-mono flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            {day.night?.duration || '2 hours'}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs leading-relaxed font-light">
                          {day.night?.activity || `Wander through colorful lantern alleys, sample signature regional sweets, and enjoy standard evening music vibes.`}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              ))}

              {/* Integrated active weather widget below timelines */}
              <WeatherWidget weather={weather} />

            </div>

          </div>
        )}

        {/* ==================== TAB B: AI SIBLING COMPARISON ==================== */}
        {activeTab === 'comparison' && (
          <div className="space-y-8">
            <div className="bg-[#111114] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6">
              
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/5 pb-6">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-extrabold text-[#d4af37] tracking-wider block">VoyageAI Sibling Scorecard Engine</span>
                  <h3 className="text-2xl font-black font-display text-white">Compare Alternative Destinations</h3>
                  <p className="text-xs text-zinc-400 max-w-xl">
                    We compared your custom journey choice against leading regional rivals matching your constraints. Here is our scorecard layout:
                  </p>
                </div>
                
                <div className="p-4 bg-zinc-950 border border-white/5 rounded-2xl flex items-center gap-3 self-start md:self-auto uppercase">
                   <div className="w-4 h-4 bg-[#d4af37] rounded-full animate-ping shrink-0" />
                   <span className="text-[11px] font-mono font-bold text-white">Recommended Winner: <strong className="text-[#d4af37]">{comparisonData.winner}</strong></span>
                </div>
              </div>

              {/* Grid of options side by side */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {comparisonData.options.map((opt, idx) => (
                  <div key={opt.destination} className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                    idx === 0 
                      ? 'bg-gradient-to-b from-[#111114] to-zinc-950 border-[#d4af37]/35 shadow-lg shadow-[#d4af37]/5' 
                      : 'bg-[#111114]/60 border-white/5 hover:border-white/15'
                  }`}>
                    
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37] font-extrabold">Option #{idx + 1}</span>
                        {idx === 0 && <span className="px-2 py-0.5 bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/25 rounded text-[9px] font-black uppercase">Active Plan</span>}
                      </div>

                      <h4 className="text-xl font-bold text-white font-display uppercase tracking-tight">{opt.destination}</h4>
                      
                      {/* Metric lines with scores */}
                      <div className="space-y-3.5 my-6">
                        {[
                          { label: 'Overall Match', score: opt.scores.overall },
                          { label: 'Budget Comfort', score: opt.scores.budget },
                          { label: 'Weather Index', score: opt.scores.weather },
                          { label: 'Food Scene', score: opt.scores.food_cost },
                          { label: 'Safety & Trust', score: opt.scores.safety },
                          { label: 'Visa Simplicity', score: opt.scores.visa }
                        ].map(metric => (
                          <div key={metric.label} className="space-y-1">
                            <div className="flex justify-between text-[10px] text-zinc-400 font-medium font-mono">
                              <span>{metric.label}</span>
                              <span className="text-white font-bold">{metric.score}/100</span>
                            </div>
                            <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
                              <span className="bg-[#d4af37] h-1 block rounded-full" style={{ width: `${metric.score}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pros lists */}
                    <div className="pt-4 border-t border-white/5 space-y-2">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Key Highlights:</span>
                      <ul className="space-y-1">
                        {opt.pros.map((p, pIdx) => (
                          <li key={pIdx} className="text-[11px] text-zinc-300 font-light flex gap-1.5 items-start">
                            <span className="text-emerald-500 font-bold shrink-0">✔</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                ))}
              </div>

              {/* Analysis Explanation Summary */}
              <div className="p-5 bg-zinc-950 rounded-2xl border border-white/5 flex gap-4 items-start leading-relaxed text-xs">
                <Lightbulb className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-white block uppercase tracking-wider text-[10px]">VoyageAI Expert Verification</span>
                  <p className="text-zinc-400 font-light">{comparisonData.explanation}</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== TAB C: AI TRAVEL MARKETPLACE ==================== */}
        {activeTab === 'marketplace' && (
          <div className="space-y-8">
            <div className="bg-[#111114] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6">
              
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-extrabold text-[#d4af37] tracking-wider block">AI-Powered Travel Combos</span>
                  <h3 className="text-2xl font-black font-display text-white">The AI Travel Marketplace</h3>
                  <p className="text-xs text-zinc-400 max-w-xl">
                    Compare full flight, hotel, and itinerary packages side-by-side. Save dynamic currency options. Simulated checkout vouchers verified directly.
                  </p>
                </div>
                
                {/* Simulated bookings toggle state */}
                <div className="px-3.5 py-1.5 bg-zinc-950 border border-white/5 rounded-xl text-xs text-zinc-400">
                  Base Conversion Rate: <strong className="text-white">1 USD = {formatCostValue(1)} {activeCurrency}</strong>
                </div>
              </div>

              {/* Side-by-side Marketplace columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Economy combo */}
                <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/20 transition-all flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-[#111114] p-3 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">Economy Adventurer</span>
                      <span className="text-[9px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase">Best Price</span>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Flight Recommendation:</span>
                      <div className="flex justify-between text-xs font-bold text-white">
                        <span>{flightsList.find(f => f.tier === 'cheapest')?.airline || 'AirAsia'}</span>
                        <span className="text-[#d4af37] font-mono">{currencySymbol}{formatCostValue(flightsList.find(f => f.tier === 'cheapest')?.price || 420)}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-light">Direct budget shuttle transport. Light hand bags check included.</p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Accommodation:</span>
                      <div className="flex justify-between text-xs font-bold text-white">
                        <span>{hotelsList.find(h => h.tier === 'economy')?.name || 'Hostel Pod Box'}</span>
                        <span className="text-[#d4af37] font-mono">{currencySymbol}{formatCostValue((hotelsList.find(h => h.tier === 'economy')?.price || 30) * (tripRequest?.duration || 5))}/total</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-light">Modern shared kitchen, workspace hubs, walking distance to train depot.</p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Experience route style:</span>
                      <p className="text-xs text-zinc-200">Local Street Food Tour, self-guided exploration walks, free access spots.</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-baseline font-display">
                      <span className="text-xs text-zinc-400 font-medium">Aggregated Combo:</span>
                      <span className="text-2xl font-black text-white font-mono">
                        {currencySymbol}{formatCostValue(Number(flightsList.find(f => f.tier === 'cheapest')?.price || 420) + Number(hotelsList.find(h => h.tier === 'economy')?.price || 30) * (tripRequest?.duration || 5))}
                      </span>
                    </div>
                    <button
                      onClick={() => alert(`SIMULATION: Economy Adventurer Combination booked! Code Voucher generated: VAI-EC-291`)}
                      className="w-full py-3 bg-zinc-900 border border-white/5 hover:bg-[#d4af37] hover:text-zinc-950 font-bold text-xs uppercase tracking-wider text-zinc-300 rounded-xl cursor-pointer"
                    >
                      Book Combination
                    </button>
                  </div>
                </div>

                {/* Classic combo */}
                <div className="bg-zinc-950/40 border border-[#d4af37]/30 rounded-3xl p-6 relative flex flex-col justify-between shadow shadow-[#d4af37]/5">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#d4af37] text-zinc-950 rounded-full text-[9px] font-black uppercase tracking-wider">
                    Most Popular Combo
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-[#111114] p-3 rounded-2xl border border-[#d4af37]/15">
                      <span className="text-[10px] font-bold uppercase text-[#d4af37] tracking-wider">Classic Explorer</span>
                      <span className="text-[9px] font-mono bg-[#d4af37]/15 border border-[#d4af37]/20 text-[#d4af37] px-2 py-0.5 rounded uppercase">Best Value</span>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Flight Recommendation:</span>
                      <div className="flex justify-between text-xs font-bold text-white">
                        <span>{flightsList.find(f => f.tier === 'best')?.airline || 'Qatar Airways'}</span>
                        <span className="text-[#d4af37] font-mono">{currencySymbol}{formatCostValue(flightsList.find(f => f.tier === 'best')?.price || 620)}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-light">Short stopovers, complimentary hot lunch tray, checked bags ready.</p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Accommodation:</span>
                      <div className="flex justify-between text-xs font-bold text-white">
                        <span>{hotelsList.find(h => h.tier === 'premium')?.name || 'Citadines Suites'}</span>
                        <span className="text-[#d4af37] font-mono">{currencySymbol}{formatCostValue((hotelsList.find(h => h.tier === 'premium')?.price || 140) * (tripRequest?.duration || 5))}/total</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-light">Private balcony overlook, signature pool access, high-speed Wi-Fi links.</p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Experience route style:</span>
                      <p className="text-xs text-zinc-200">Unified Skip-The-Line Pass, guided history walks, evening skyline dinner reservation.</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-baseline font-display">
                      <span className="text-xs text-zinc-400 font-medium">Aggregated Combo:</span>
                      <span className="text-2xl font-black text-white font-mono">
                        {currencySymbol}{formatCostValue(Number(flightsList.find(f => f.tier === 'best')?.price || 620) + Number(hotelsList.find(h => h.tier === 'premium')?.price || 140) * (tripRequest?.duration || 5))}
                      </span>
                    </div>
                    <button
                      onClick={() => alert(`SIMULATION: Classic Explorer Combo booked! Vouchers active. Code references: VAI-CL-480`)}
                      className="w-full py-3 bg-[#d4af37] hover:bg-[#c4a12c] text-zinc-950 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Book Combination
                    </button>
                  </div>
                </div>

                {/* Luxury Elite Combo */}
                <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 hover:border-[#d4af37]/20 transition-all flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-[#111114] p-3 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-bold uppercase text-[#d4af37] tracking-wider">Voyage Ultra Elite</span>
                      <span className="text-[9px] font-mono bg-amber-500/10 border border-amber-500/20 text-[#d4af37] px-2 py-0.5 rounded uppercase">Elite Premium</span>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Flight Recommendation:</span>
                      <div className="flex justify-between text-xs font-bold text-white">
                        <span>{flightsList.find(f => f.tier === 'fastest')?.airline || 'Emirates First'}</span>
                        <span className="text-[#d4af37] font-mono">{currencySymbol}{formatCostValue(flightsList.find(f => f.tier === 'fastest')?.price || 1200)}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-light">Lie-flat private suite capsule, premium lounge credentials, fast customs track.</p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Accommodation:</span>
                      <div className="flex justify-between text-xs font-bold text-white">
                        <span>{hotelsList.find(h => h.tier === 'luxury')?.name || 'Grand Palace Hotel'}</span>
                        <span className="text-[#d4af37] font-mono">{currencySymbol}{formatCostValue((hotelsList.find(h => h.tier === 'luxury')?.price || 280) * (tripRequest?.duration || 5))}/total</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-light">Luxury suite with private concierge services and gourmet breakfast buffet.</p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Experience route style:</span>
                      <p className="text-xs text-zinc-200">Exclusive private tour guides, custom molecular gastronomic diners, luxury yacht sunset cruise.</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-baseline font-display">
                      <span className="text-xs text-zinc-400 font-medium">Aggregated Combo:</span>
                      <span className="text-2xl font-black text-white font-mono">
                        {currencySymbol}{formatCostValue(Number(flightsList.find(f => f.tier === 'fastest')?.price || 1200) + Number(hotelsList.find(h => h.tier === 'luxury')?.price || 280) * (tripRequest?.duration || 5))}
                      </span>
                    </div>
                    <button
                      onClick={() => alert(`SIMULATION: Voyage Ultra Elite Suite booked successfully! VIP vouchers active. References: VAI-HP-995`)}
                      className="w-full py-3 bg-zinc-900 border border-white/5 hover:bg-[#d4af37] hover:text-zinc-950 font-bold text-xs uppercase tracking-wider text-zinc-300 rounded-xl cursor-pointer"
                    >
                      Book Combination
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ==================== TAB D: LOCAL DISCOVERY & GEMS ==================== */}
        {activeTab === 'discover' && (
          <div className="space-y-8">
            {/* Top ranked attractions mapping list */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white font-display flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-[#d4af37]" />
                  Custom attractions matching analysis
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendations.slice(0, 4).map((rec, ix) => (
                    <div key={rec.place + ix} className="p-5 bg-zinc-950/40 border border-white/5 rounded-3xl shadow-sm relative group hover:border-[#d4af37]/30 transition-all flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="px-2 py-0.5 bg-zinc-900 text-[#aaa] rounded text-[9px] font-bold uppercase">
                            {rec.category}
                          </span>
                          <span className="text-xs font-mono text-[#d4af37] font-black">{rec.score}% Match</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-white font-display text-sm leading-snug">{rec.place}</h4>
                          <p className="text-[11px] text-zinc-400 font-light mt-1.5 leading-relaxed">{rec.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Street Food Guide checklist */}
              <div className="lg:col-span-1 p-6 bg-zinc-950/40 border border-white/10 rounded-3xl space-y-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center mb-4">
                    <Utensils className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <h4 className="text-white font-bold font-display text-sm uppercase tracking-wide">Gastronomy Bucket List</h4>
                  <p className="text-[11px] text-zinc-400 font-light leading-relaxed mt-1">
                    Signature street eats and delicacies you absolutely must seek out to capture authentic regional flavors:
                  </p>
                </div>

                <div className="space-y-2 my-4">
                  {experiencePack.street_food.map((food, idx) => (
                    <div key={idx} className="flex gap-2 items-center p-2.5 rounded-xl bg-zinc-950/80 border border-white/5 text-xs text-zinc-200">
                      <span className="text-[#d4af37] text-xs font-mono">0{idx + 1}.</span>
                      <span className="font-light">{food}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] bg-zinc-900 p-3 rounded-xl border border-white/5 text-zinc-400 text-center uppercase tracking-wider">
                  Catered to food journey enthusiast profile
                </div>
              </div>

            </div>

            {/* Sunrise / Sunset or Instagram quadrant catalog */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Instagram spots */}
              <div className="p-6 bg-zinc-950/40 border border-white/5 rounded-3xl space-y-4">
                <span className="text-[10px] uppercase text-[#d4af37] font-black tracking-wider block">Instagram Worthy Locations</span>
                <div className="space-y-2">
                  {experiencePack.instagram_spots.map((spot, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#111114] border border-white/5 text-xs font-light text-zinc-400 flex gap-2 items-center">
                      <span className="text-emerald-400 font-bold font-mono">✦</span>
                      <span>{spot}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sunrise spots */}
              <div className="p-6 bg-zinc-950/40 border border-white/5 rounded-3xl space-y-4">
                <span className="text-[10px] uppercase text-[#d4af37] font-black tracking-wider block">Morning Golden Hour Views</span>
                <div className="space-y-2">
                  {experiencePack.sunrise_spots.map((spot, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#111114] border border-white/5 text-xs font-light text-zinc-400 flex gap-2 items-center">
                      <span className="text-emerald-400 font-bold font-mono">☀</span>
                      <span>{spot}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sunset spots */}
              <div className="p-6 bg-zinc-950/40 border border-white/5 rounded-3xl space-y-4">
                <span className="text-[10px] uppercase text-[#d4af37] font-black tracking-wider block">Scenic Sunset Backdrops</span>
                <div className="space-y-2">
                  {experiencePack.sunset_spots.map((spot, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#111114] border border-white/5 text-xs font-light text-zinc-400 flex gap-2 items-center">
                      <span className="text-amber-500 font-bold font-mono">🌅</span>
                      <span>{spot}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

             {/* Neighborhood stay guide details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="p-6 bg-[#111114] border border-white/10 rounded-3xl shadow-sm space-y-4">
                <h4 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-[#d4af37]" />
                  Best Neighborhood Districts For Lodging Stays
                </h4>
                <div className="space-y-3">
                  {plan.stay_recommendations.map((stay, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-zinc-950/50 border border-white/5 space-y-1">
                      <span className="text-[9px] uppercase font-bold text-[#d4af37]">Recommended Lodging Quarter</span>
                      <h5 className="font-bold text-white text-xs">{stay.area}</h5>
                      <p className="text-xs text-zinc-400 font-light pt-0.5 leading-relaxed">{stay.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-[#111114] border border-white/10 rounded-3xl shadow-sm space-y-4">
                <h4 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#d4af37]" />
                  Intelligent Transit Logistics Plan
                </h4>
                <div className="space-y-2">
                  {plan.transport_plan.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-zinc-950/50 border border-white/5 text-xs text-zinc-350 leading-relaxed font-light flex gap-3">
                      <span className="w-5 h-5 bg-[#d4af37]/10 text-[#d4af37] font-semibold border border-[#d4af37]/20 flex items-center justify-center rounded-lg text-[9px] shrink-0 font-mono mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB E: RECHARTS / ANALYTICS ==================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <AnalyticsView budget={plan.budget_estimate} recommendations={recommendations} />

            {/* 10+ Intelligent custom insight lines tailored */}
            <div className="bg-[#111114] border border-white/10 p-6 md:p-8 rounded-3xl shadow-sm space-y-4">
              <h4 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#d4af37]" />
                VoyageAI 10+ Granular Intelligence Insights Report
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {customInsights.map((insight, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 text-xs text-zinc-450 leading-relaxed font-light flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/25 font-bold flex items-center justify-center text-[10px] shrink-0 font-mono">
                      {idx + 1}
                    </span>
                    <span className="text-zinc-350">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB F: AI COPILOT CHAT ==================== */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side suggested commands */}
            <div className="lg:col-span-4 p-6 bg-[#111114]/90 border border-white/10 rounded-3xl space-y-4">
              <div>
                <span className="text-[9px] uppercase font-bold text-[#d4af37]">Instant Assistance</span>
                <h4 className="text-sm font-bold font-display text-white">Suggested Travel Queries</h4>
              </div>

              <div className="space-y-2 flex flex-col items-stretch">
                {[
                  { text: 'Suggest standard packing checklist', action: 'Suggest standard packing checklist' },
                  { text: 'Are there any visa or entry barriers?', action: 'Are there any visa or entry barriers?' },
                  { text: 'Help modify Day 3 to include more nature', action: 'Help modify Day 3 to include more nature' },
                  { text: 'Give me top five budget savings tricks', action: 'Give me top five budget savings tricks' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.action)}
                    className="w-full text-left p-3.5 rounded-xl bg-zinc-950 hover:bg-[#d4af37] hover:text-zinc-950 font-medium text-xs text-zinc-400 border border-white/5 cursor-pointer transition-all self-stretch text-wrap truncate"
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat screen display (8 cols) */}
            <div className="lg:col-span-8 bg-[#111114] border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[550px]">
              
              {/* Message hub */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-thin">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse text-right' : 'text-left'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border text-xs ${
                      msg.role === 'user' ? 'bg-[#d4af37] border-[#d4af37] text-zinc-950 font-black' : 'bg-zinc-950 border-white/10 text-[#d4af37]'
                    }`}>
                      {msg.role === 'user' ? 'U' : 'V'}
                    </div>

                    <div className={`p-4 rounded-3xl text-xs leading-relaxed space-y-1.5 ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-zinc-900 to-zinc-950 border border-white/10 text-white rounded-tr-none' 
                        : 'bg-zinc-950 border border-white/5 text-zinc-350 rounded-tl-none font-light'
                    }`}>
                      <span>{msg.content}</span>
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex gap-3 max-w-[85%] items-center text-xs text-zinc-500 font-mono animate-pulse">
                    <div className="w-8 h-8 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center text-[#d4af37]">...</div>
                    <span>VoyageAI parsing dynamic travel databases...</span>
                  </div>
                )}
                
                <div ref={chatBottomRef} />
              </div>

              {/* Chat typing bar */}
              <div className="p-4 bg-zinc-950 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask any travel, hotel, flight or itinerary questions..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="px-5 py-3 bg-[#d4af37] hover:bg-[#c39e26] text-zinc-950 rounded-xl transition-all font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Ask Live
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
