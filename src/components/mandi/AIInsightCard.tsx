import React from 'react';
import { MandiPrice } from '../../types';
import { Sparkles, Lightbulb, TrendingUp, AlertTriangle, MapPin, Building } from 'lucide-react';

interface AIInsightCardProps {
  selectedItem: MandiPrice;
  selectedState?: string;
  selectedDistrict?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  selectedItem,
  selectedState = 'ALL',
  selectedDistrict = 'ALL'
}) => {
  const isPositive = selectedItem.changePercent >= 0;
  const isHighGrowth = selectedItem.changePercent >= 3.0;

  const districtName = selectedItem.district || (selectedDistrict !== 'ALL' ? selectedDistrict : 'Local APMC');
  const stateName = selectedItem.state || (selectedState !== 'ALL' ? selectedState : 'India');

  let insightTitle = `District Market Advisory — ${districtName}`;
  let insightText = `${selectedItem.commodity} prices are maintaining a steady modal rate (₹${(selectedItem.modalPrice ?? selectedItem.currentPrice).toLocaleString('en-IN')}/qtl) in ${districtName} (${stateName}). Demand is steady across local mandis.`;
  let recommendation = 'Steady District Demand';

  if (isPositive) {
    if (isHighGrowth) {
      insightTitle = `🔥 High Price Spike in ${districtName} District`;
      insightText = `${selectedItem.commodity} prices surged (+${selectedItem.changePercent}%) at ${selectedItem.mandiName} in ${districtName}! APMC traders report high buyer demand this week. Farmers in ${districtName} are advised to sell high-grade stock now to maximize profit margins.`;
      recommendation = `Strong District Sell Opportunity`;
    } else {
      insightTitle = `📈 Positive Price Trend in ${districtName}`;
      insightText = `${selectedItem.commodity} rates in ${districtName} are trending upward (+${selectedItem.changePercent}%). Favorable market conditions for regional growers looking to schedule transport.`;
      recommendation = `Favorable District Market Window`;
    }
  } else {
    insightTitle = `⚠️ Price Dip Advisory for ${districtName}`;
    insightText = `${selectedItem.commodity} prices in ${districtName} experienced a temporary rate decline (${selectedItem.changePercent}%). Farmers are advised to utilize district APMC godown facilities or wait for market recovery.`;
    recommendation = `Hold Stock in ${districtName}`;
  }

  return (
    <div className="p-5 bg-linear-to-r from-emerald-900 via-[#166534] to-emerald-800 text-white rounded-2xl shadow-md space-y-3 relative overflow-hidden">
      
      {/* Background Icon */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Sparkles className="w-32 h-32 text-white" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-700/80 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 flex items-center gap-1">
              🤖 Krushi AI District Intelligence <span className="text-amber-300 font-extrabold">• {districtName}, {stateName}</span>
            </span>
            <h3 className="font-extrabold text-sm text-white">{insightTitle}</h3>
          </div>
        </div>

        <span className="self-start sm:self-center px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-emerald-100 border border-white/15">
          {recommendation}
        </span>
      </div>

      <p className="text-xs text-emerald-50/90 leading-relaxed font-normal">
        {insightText}
      </p>

      <div className="pt-2 border-t border-emerald-700/60 flex items-center justify-between text-[11px] text-emerald-200">
        <span className="flex items-center gap-1 font-medium truncate">
          {isPositive ? <TrendingUp className="w-3.5 h-3.5 text-emerald-300 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
          Selected Crop: <strong className="text-white ml-0.5">{selectedItem.commodity}</strong>
        </span>
        <span className="font-bold text-amber-300 flex items-center gap-1 shrink-0">
          <Building className="w-3.5 h-3.5" /> {selectedItem.mandiName}
        </span>
      </div>

    </div>
  );
};
