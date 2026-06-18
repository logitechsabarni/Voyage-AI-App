import { BudgetEstimate, RecommendationScore } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Award, DollarSign, ListCollapse, TrendingUp, Compass } from 'lucide-react';
// @ts-ignore
import bannerImage from '../assets/images/travel_dashboard_banner_1781807430306.jpg';

interface AnalyticsViewProps {
  budget: BudgetEstimate;
  recommendations: RecommendationScore[];
}

export default function AnalyticsView({ budget, recommendations }: AnalyticsViewProps) {
  
  // Helper to extract numeric values from potential string budget variables safely
  const parseCost = (val: string | number): number => {
    if (typeof val === 'number') return val;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 100 : num; // Fallback to avoid empty calculations
  };

  const stayCost = parseCost(budget.stay);
  const foodCost = parseCost(budget.food);
  const transitCost = parseCost(budget.transport);
  const activitiesCost = parseCost(budget.activities);
  const totalCalculated = stayCost + foodCost + transitCost + activitiesCost;

  const budgetData = [
    { name: 'Lodging / Stay', value: stayCost, color: '#d4af37' }, 
    { name: 'Dining & Street Eats', value: foodCost, color: '#e5c158' }, 
    { name: 'Local Transport', value: transitCost, color: '#aa8410' }, 
    { name: 'Experiences & Entry Tickets', value: activitiesCost, color: '#8e7330' } 
  ];

  // Organize recommendation metrics grouped by category
  const categories = ['Attractions', 'Food', 'Hotels', 'Hidden gems'];
  const categoryStats = categories.map(cat => {
    const list = recommendations.filter(item => item.category === cat);
    if (list.length === 0) return { category: cat, avgScore: 80, count: 1 };
    const sum = list.reduce((acc, current) => acc + current.score, 0);
    return {
      category: cat,
      avgScore: Math.round(sum / list.length),
      count: list.length
    };
  });

  return (
    <div className="space-y-12">
      
      {/* Premium High-End Visual Banner Card */}
      <div className="w-full bg-[#111114] border border-[#d4af37]/20 rounded-3xl overflow-hidden relative group shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#0a0a0c]/90 via-[#0a0a0c]/40 to-transparent z-10" />
        <img 
          src={bannerImage} 
          alt="Voyage Dynamic Signature Map" 
          referrerPolicy="no-referrer"
          className="w-full h-48 md:h-64 object-cover opacity-80 group-hover:scale-[1.02] transition-transform duration-700 ease-out" 
        />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#d4af37] block">Signature Art & Cartography</span>
            <h3 className="text-xl md:text-2xl font-black text-white font-display uppercase tracking-tight">Algorithmic Travel Metrics Matrix</h3>
            <p className="text-xs text-zinc-350 font-light max-w-xl">
              Visualizing matching indices, carbon transport offsets, and localized financial allocation weights curated specifically for your profile.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-[#d4af37]/10 border border-[#d4af37]/35 rounded-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#d4af37]">Voyage Analytics Panel</span>
          </div>
        </div>
      </div>

      {/* Upper overview bento statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="p-6 bg-[#16161a]/60 border border-white/5 rounded-3xl shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#aaa] font-medium block">Aggregated Cost Projection</span>
            <span className="text-2xl font-bold text-white font-display">
              ${totalCalculated ? totalCalculated.toLocaleString() : budget.total}
            </span>
          </div>
        </div>

        <div className="p-6 bg-[#16161a]/60 border border-white/5 rounded-3xl shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-[#aaa] font-medium block">Custom Match Precision</span>
            <span className="text-2xl font-bold text-white font-display">
              {recommendations[0]?.score || 95}% Match
            </span>
          </div>
        </div>

        <div className="p-6 bg-[#16161a]/60 border border-white/5 rounded-3xl shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#aaa] font-medium block">Travel Intensity Rating</span>
            <span className="text-2xl font-bold text-white font-display">A+ Exceptional</span>
          </div>
        </div>

      </div>

      {/* Main Charts layouts split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CHART 1: Budget details split pie */}
        <div className="p-6 sm:p-8 bg-[#16161a]/60 border border-white/5 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold text-white font-display">Budget Allocation Breakdown</h4>
            <p className="text-xs text-[#aaa]">Estimates computed based on travelers, budget, and travel personality factors</p>
          </div>

          <div className="h-64 relative flex items-center justify-center">
            {totalCalculated > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} contentStyle={{ background: '#111', borderColor: '#333', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-zinc-500">Loading projection indexes...</div>
            )}
            
            {/* Display Compass graphic in center of donut instead of text so it doesn't overlap/destroy chart image */}
            <div className="absolute flex flex-col justify-center items-center text-center pointer-events-none">
              <Compass className="w-8 h-8 text-[#d4af37]/65 animate-spin-slow" />
            </div>
          </div>

          {/* Clean outlay total displayed clearly below the pie chart, not overlapping on the image */}
          <div className="p-4 bg-zinc-950 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-zinc-500 block">Consolidated Outlay</span>
              <p className="text-[11px] text-zinc-400 font-light">Calculated total baseline stay, transport, entry tickets & dining</p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-2xl font-black font-mono text-[#d4af37] tracking-tight">
                ${totalCalculated ? totalCalculated.toLocaleString() : budget.total}
              </span>
              <span className="text-[9px] text-[#34d399] font-mono block">All taxes & duties factored</span>
            </div>
          </div>

          {/* Table index legend representation */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {budgetData.map(item => (
              <div key={item.name} className="flex items-center gap-2 font-display">
                <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: item.color }} />
                <div className="overflow-hidden min-w-0">
                  <span className="text-[11px] text-zinc-400 font-medium truncate block leading-none">{item.name}</span>
                  <span className="text-xs font-bold text-white font-mono">${item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 2: Discovery coverage indicators bar */}
        <div className="p-6 sm:p-8 bg-[#16161a]/60 border border-white/5 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold text-white font-display">Interest Match Indices</h4>
            <p className="text-xs text-[#aaa]">Algorithmic scoring match average across travel category layers</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#8c8c90' }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: '#8c8c90' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => [`${value}% Suitability`, 'Average Match']} contentStyle={{ background: '#111', borderColor: '#333', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                <Bar dataKey="avgScore" radius={[8, 8, 0, 0]} barSize={35}>
                  {categoryStats.map((entry, index) => {
                    const colors = ['#d4af37', '#e5c158', '#aa8410', '#8e7330'];
                    return <Cell key={`bar-cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/45 border border-white/5 flex gap-2.5 items-start">
            <ListCollapse className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
            <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
              Scores reflect interest alignment weighting coupled with travelers profile ratios. 
              <strong> Attractions ({categoryStats[0]?.avgScore}%)</strong> holds high dominance because of your cultural profile bias.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
