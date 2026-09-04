import React from 'react';
import { MandiPrice } from '../../types';
import { TrendingUp, TrendingDown, MapPin, Star, Calendar } from 'lucide-react';

interface MandiPriceCardProps {
  item: MandiPrice;
  isSelected: boolean;
  isFavourite: boolean;
  onSelect: (item: MandiPrice) => void;
  onToggleFavourite: (e: React.MouseEvent, item: MandiPrice) => void;
  onViewDetails: (e: React.MouseEvent, item: MandiPrice) => void;
}

export const MandiPriceCard: React.FC<MandiPriceCardProps> = ({
  item,
  isSelected,
  isFavourite,
  onSelect,
  onToggleFavourite,
  onViewDetails
}) => {
  const isPositive = item.changePercent >= 0;
  const modal = item.modalPrice ?? item.currentPrice;
  const min = item.minPrice ?? Math.round(modal * 0.93);
  const max = item.maxPrice ?? Math.round(modal * 1.07);

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer space-y-4 ${
        isSelected
          ? 'bg-white border-[#166534] ring-2 ring-[#166534]/20 shadow-md'
          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Top Header: Crop & Favourite Star */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
            {item.district ? `${item.district}, ${item.state}` : item.state}
          </span>
          <h3 className="font-extrabold text-slate-900 text-base leading-tight group-hover:text-[#166534] transition-colors">
            {item.commodity}
          </h3>
        </div>

        <button
          type="button"
          onClick={(e) => onToggleFavourite(e, item)}
          className={`p-1.5 rounded-full transition-transform active:scale-90 ${
            isFavourite ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-amber-400 hover:bg-slate-100'
          }`}
          title={isFavourite ? "Remove from favourites" : "Save as favourite"}
        >
          <Star className={`w-5 h-5 ${isFavourite ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Mandi Name & Date */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1 font-medium truncate max-w-[70%]">
          <MapPin className="w-3.5 h-3.5 text-[#166534] shrink-0" />
          <span className="truncate">{item.mandiName}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
          <Calendar className="w-3 h-3" />
          <span>{item.updatedAt}</span>
        </div>
      </div>

      {/* Modal Price Primary Display */}
      <div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Modal Price</div>
        <div className="flex items-baseline justify-between mt-0.5">
          <div className="text-2xl font-black text-[#166534] tracking-tight">
            ₹{modal.toLocaleString('en-IN')}
            <span className="text-xs font-medium text-slate-500 ml-1">/ quintal</span>
          </div>

          <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-0.5 ${
            isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {isPositive ? '+' : ''}{item.changePercent}%
          </span>
        </div>
      </div>

      {/* Price Range: Min & Max */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs">
        <div>
          <span className="text-[10px] text-slate-500 block uppercase font-bold">Min Price</span>
          <span className="font-extrabold text-slate-800">₹{min.toLocaleString('en-IN')}</span>
        </div>
        <div className="text-right border-l border-slate-200 pl-2">
          <span className="text-[10px] text-slate-500 block uppercase font-bold">Max Price</span>
          <span className="font-extrabold text-slate-800">₹{max.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-1 flex items-center justify-between text-xs">
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
          LIVE APMC DATA
        </span>
        <button
          type="button"
          onClick={(e) => onViewDetails(e, item)}
          className="text-[#166534] font-bold hover:underline inline-flex items-center gap-0.5 text-xs"
        >
          View Details &rarr;
        </button>
      </div>

    </div>
  );
};
