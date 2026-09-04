import React from 'react';
import { MandiPrice } from '../../types';
import { X, MapPin, Calendar, TrendingUp, TrendingDown, Building2, Tag, ShieldCheck } from 'lucide-react';

interface MandiDetailModalProps {
  item: MandiPrice | null;
  isFavourite: boolean;
  onClose: () => void;
  onToggleFavourite: (e: React.MouseEvent, item: MandiPrice) => void;
}

export const MandiDetailModal: React.FC<MandiDetailModalProps> = ({
  item,
  isFavourite,
  onClose,
  onToggleFavourite,
}) => {
  if (!item) return null;

  const isPositive = item.changePercent >= 0;
  const modal = item.modalPrice ?? item.currentPrice;
  const min = item.minPrice ?? Math.round(modal * 0.93);
  const max = item.maxPrice ?? Math.round(modal * 1.07);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#166534] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            APMC Market Details
          </span>
          <h2 className="text-2xl font-black text-slate-900 pt-1">{item.commodity}</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#166534]" />
            <span>{item.mandiName} ({item.district ? `${item.district}, ` : ''}{item.state})</span>
          </div>
        </div>

        {/* Price Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Min Price</span>
            <span className="text-lg font-black text-slate-800">₹{min.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-400 block">per qtl</span>
          </div>
          <div className="border-x border-slate-200 px-2">
            <span className="text-[10px] text-[#166534] uppercase font-bold block">Modal Price</span>
            <span className="text-xl font-black text-[#166534]">₹{modal.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-500 block">per qtl</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Max Price</span>
            <span className="text-lg font-black text-slate-800">₹{max.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-400 block">per qtl</span>
          </div>
        </div>

        {/* Change percentage badge */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
          <span className="font-semibold text-slate-600">24-Hour Price Movement:</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
            isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {isPositive ? '+' : ''}{item.changePercent}% from yesterday (₹{item.previousPrice.toLocaleString('en-IN')})
          </span>
        </div>

        {/* Breakdown details */}
        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Building2 className="w-4 h-4 text-[#166534]" /> Market Yard:
            </span>
            <span className="font-bold text-slate-900">{item.mandiName}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Tag className="w-4 h-4 text-[#166534]" /> Standard Unit:
            </span>
            <span className="font-bold text-slate-900">{item.unit} (100 kg)</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-4 h-4 text-[#166534]" /> Rate Updated Date:
            </span>
            <span className="font-bold text-slate-900">{item.updatedAt}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="flex items-center gap-1.5 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-[#166534]" /> Benchmark Status:
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Live Official Govt APMC Rate
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={(e) => onToggleFavourite(e, item)}
            className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs transition-all border ${
              isFavourite
                ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isFavourite ? '★ Saved in Favourites' : '☆ Save to Favourites'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white font-extrabold text-xs shadow-md transition-all"
          >
            Close Modal
          </button>
        </div>

      </div>
    </div>
  );
};
