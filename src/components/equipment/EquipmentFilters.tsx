import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface EquipmentFiltersProps {
  query: string;
  setQuery: (q: string) => void;
  category: string;
  setCategory: (c: string) => void;
  location: string;
  setLocation: (l: string) => void;
  maxPrice: number;
  setMaxPrice: (p: number) => void;
  sortBy: 'priceAsc' | 'priceDesc' | 'rating' | 'newest';
  setSortBy: (s: 'priceAsc' | 'priceDesc' | 'rating' | 'newest') => void;
  onReset: () => void;
}

const CATEGORY_KEYS = ['All', 'Tractor', 'Harvester', 'Seeder', 'Sprayer', 'Rotavator', 'Tiller', 'Cultivator'];
const LOCATIONS = ['All', 'Maharashtra', 'Punjab', 'Haryana', 'Gujarat', 'Madhya Pradesh', 'Uttar Pradesh', 'Rajasthan', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Bihar'];

export const EquipmentFilters: React.FC<EquipmentFiltersProps> = ({
  query, setQuery, category, setCategory, location, setLocation,
  maxPrice, setMaxPrice, sortBy, setSortBy, onReset
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 mb-8 shadow-xs space-y-4">
      
      {/* Top Search Bar & Sort Dropdown */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('market.searchPlaceholder')}
            className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#166534] text-sm text-slate-900 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">{t('filter.sortBy')}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]"
          >
            <option value="rating">{t('market.highestRated')}</option>
            <option value="priceAsc">{t('market.priceLowToHigh')}</option>
            <option value="priceDesc">{t('market.priceHighToLow')}</option>
            <option value="newest">{t('market.newest')}</option>
          </select>
        </div>

      </div>

      {/* Category Pills & Filters Bar */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">{t('filter.category')}:</span>
          {CATEGORY_KEYS.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                category.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? t('cat.all') : t(`cat.${cat}`) || cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">{t('filter.state')}:</span>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-2.5 py-1 rounded-md border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
            >
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc === 'All' ? t('filter.all') : loc}</option>
              ))}
            </select>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('filter.reset')}</span>
          </button>

        </div>

      </div>

    </div>
  );
};
