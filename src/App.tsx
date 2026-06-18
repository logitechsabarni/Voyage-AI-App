import { useState } from 'react';
import { TripPlan, WeatherData, RecommendationScore, TripRequest } from './types';
import HomeView from './components/HomeView';
import TripPlannerForm from './components/TripPlannerForm';
import DashboardView from './components/DashboardView';
import { Compass, Sparkles, MapPin, AlertCircle, RefreshCw, PlaneTakeoff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'planner' | 'dashboard'>('home');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('Analyzing flight plans...');
  const [error, setError] = useState<string | null>(null);
  
  // Storage for final compiled AI trip details packet
  const [tripData, setTripData] = useState<{
    plan: TripPlan;
    weather: WeatherData;
    recommendations: RecommendationScore[];
  } | null>(null);

  // Storage for templates selections
  const [prefilledDestination, setPrefilledDestination] = useState<{ city: string; country: string } | undefined>(undefined);
  const [activeRequest, setActiveRequest] = useState<TripRequest | null>(null);

  // Sequence loader messaging system for superior UX during generation
  const runVisualLoadingSteps = () => {
    const steps = [
      'Establishing Google Gemini API context...',
      'Synthesizing regional weather patterns...',
      'Mapping neighborhood proximity routes...',
      'Gathering signature micro-etiquette rules...',
      'Compiling culinary recommendations...',
      'Polishing custom financial budget sheets...'
    ];
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < steps.length) {
        setLoadingStep(steps[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1800);
    
    return interval;
  };

  const handleTripSubmission = async (request: TripRequest) => {
    setActiveRequest(request);
    setIsLoading(true);
    setError(null);
    setLoadingStep('Initializing AI travel planning engine...');
    
    const loadingInterval = runVisualLoadingSteps();

    try {
      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error('Travel Engine returned a server error');
      }

      const rawResult = await response.json();
      
      if (!rawResult.plan || !rawResult.weather) {
        throw new Error('A payload error took place in the travel compilation');
      }

      setTripData(rawResult);
      setCurrentView('dashboard');
    } catch (err: any) {
      console.error('[Client-Side App] Planning extraction faulted:', err);
      setError('The VoyageAI engine encountered temporary network throttling. Tap the retry button to restart the design or try offline parameters.');
    } finally {
      clearInterval(loadingInterval);
      setIsLoading(false);
    }
  };

  const handleSelectQuickTrip = (city: string, country: string) => {
    setPrefilledDestination({ city, country });
    setCurrentView('planner');
  };

  const handleBackToPlanner = () => {
    setCurrentView('planner');
  };

  const handleStartPlanning = () => {
    setPrefilledDestination(undefined);
    setCurrentView('planner');
  };

  const handleReturnHome = () => {
    setTripData(null);
    setPrefilledDestination(undefined);
    setCurrentView('home');
  };

  return (
    <div id="voyageai-pro-root" className="min-h-screen bg-[#0a0a0c] text-[#e1e1e1] flex flex-col font-sans transition-colors duration-300">
      
      {/* Dynamic Header navbar */}
      <header className="sticky top-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/10 shadow-lg px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          <div 
            onClick={handleReturnHome}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#d4af37] group-hover:bg-[#b0902c] shrink-0 flex items-center justify-center text-[#0a0a0c] transition-colors">
              <PlaneTakeoff className="w-5.5 h-5.5 rotate-12 group-hover:rotate-0 transition-transform" />
            </div>
            <div>
              <h1 className="font-display font-black text-lg tracking-tight text-[#e1e1e1] leading-none">
                Voyage<span className="text-[#d4af37]">AI</span> Pro
              </h1>
              <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-[#888] block mt-0.5">Travel intelligence</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-500 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
              Server Online
            </span>
            <button
              onClick={() => {
                if (currentView === 'home') handleStartPlanning();
                else handleReturnHome();
              }}
              className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#b0902c] text-[#0a0a0c] rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-md shadow-[#d4af37]/10"
            >
              {currentView === 'home' ? 'Plan Trip' : 'Return Home'}
            </button>
          </div>

        </div>
      </header>

      {/* Main Body view container with micro animations */}
      <main className="flex-1 px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          
          <AnimatePresence mode="wait">
            
            {/* 1. LOADING SCREEN DISPLAY STATE */}
            {isLoading && (
              <motion.div 
                key="loading-screen"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-16 text-center max-w-lg mx-auto space-y-8"
              >
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center bg-zinc-900/80 rounded-3xl shadow-xl border border-white/10">
                  <RefreshCw className="w-10 h-10 text-[#d4af37] animate-spin" />
                  <Sparkles className="w-4 h-4 text-[#d4af37] absolute top-4 right-4 animate-pulse" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold font-display text-[#e1e1e1]">AI Travel Core Planning Active</h3>
                  <div className="h-1.5 w-40 bg-zinc-800 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-[#d4af37] rounded-full animate-progress" style={{ width: '60%' }} />
                  </div>
                  <p className="text-xs text-[#d4af37] font-mono italic animate-pulse mt-2">{loadingStep}</p>
                </div>

                <p className="text-[11px] text-[#888] leading-relaxed font-light mt-4">
                  VoyageAI is consulting real-time weather grids, mapping high proximity neighborhood tracks, 
                  and packaging coordinates. This takes approximately 6-12 seconds on average.
                </p>
              </motion.div>
            )}

            {/* 2. FAULT DISPLAY OVERLAY STATE */}
            {!isLoading && error && (
              <motion.div 
                key="error-screen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-12 p-8 bg-zinc-900/90 border border-red-900/30 rounded-3xl shadow-xl max-w-md mx-auto text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-red-950/40 text-red-400 flex items-center justify-center mx-auto border border-red-900/20">
                  <AlertCircle className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-red-400">Platform Planning Error</h3>
                  <p className="text-xs text-[#aaa] leading-relaxed font-light">{error}</p>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleReturnHome}
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-[#e1e1e1] text-xs font-semibold cursor-pointer hover:bg-zinc-800 transition-colors"
                  >
                    Home Portal
                  </button>
                  <button
                    onClick={handleStartPlanning}
                    className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-[#0a0a0c] text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#b0902c] transition-colors"
                  >
                    Configure Trip
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. HOME VIEW ROUTER */}
            {!isLoading && !error && currentView === 'home' && (
              <motion.div
                key="home-screen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <HomeView 
                  onStartPlanning={handleStartPlanning} 
                  onSelectQuickTrip={handleSelectQuickTrip} 
                />
              </motion.div>
            )}

            {/* 4. PLANNER FORM ROUTER */}
            {!isLoading && !error && currentView === 'planner' && (
              <motion.div
                key="planner-screen"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.3 }}
              >
                <TripPlannerForm 
                  onSubmit={handleTripSubmission} 
                  isLoading={isLoading} 
                  prefillCity={prefilledDestination?.city} 
                  prefillCountry={prefilledDestination?.country}
                />
              </motion.div>
            )}

            {/* 5. FINISHED COMPILATION VIEW */}
            {!isLoading && !error && currentView === 'dashboard' && tripData && (
              <motion.div
                key="dashboard-screen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardView 
                  plan={tripData.plan}
                  weather={tripData.weather}
                  recommendations={tripData.recommendations}
                  tripRequest={activeRequest}
                  onBack={handleBackToPlanner}
                />
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </main>

      {/* Modern, clear, humble micro credit page footer */}
      <footer className="border-t border-white/5 bg-[#0a0a0c]/60 py-6 px-6 mt-16 text-center text-[11px] text-[#888] font-light flex flex-col sm:flex-row justify-between items-center max-w-6xl w-full mx-auto gap-4">
        <p>© 2026 VoyageAI Pro Travel Planning Platform. Enabled safely with Google Gemini Intelligence models.</p>
        <div className="flex gap-4">
          <a href="#voyageai-pro-root" className="hover:text-[#d4af37] transition-colors">Back to Top</a>
          <span>•</span>
          <span className="font-semibold text-[#888]">Enterprise Edition</span>
        </div>
      </footer>

    </div>
  );
}
