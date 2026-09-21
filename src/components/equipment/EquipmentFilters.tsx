import React, { useState } from 'react';
import { Search, RotateCcw, MapPin, Sparkles, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { INDIAN_STATES, STATE_DISTRICTS_MAP, getTalukasForDistrict } from '../../data/indiaLocations';
import { FARMING_ACTIVITIES_CONFIG } from '../../utils/matchCalculator';

interface EquipmentFiltersProps {
  query: string;
  setQuery: (q: string) => void;
  category: string;
  setCategory: (c: string) => void;
  activity: string;
  setActivity: (a: string) => void;
  state: string;
  setState: (s: string) => void;
  district: string;
  setDistrict: (d: string) => void;
  taluka: string;
  setTaluka: (t: string) => void;
  village: string;
  setVillage: (v: string) => void;
  maxPrice: number;
  setMaxPrice: (p: number) => void;
  sortBy: 'priceAsc' | 'priceDesc' | 'rating' | 'newest';
  setSortBy: (s: 'priceAsc' | 'priceDesc' | 'rating' | 'newest') => void;
  onReset: () => void;
}

const CATEGORY_KEYS = ['All', 'Tractor', 'Harvester', 'Seeder', 'Sprayer', 'Rotavator', 'Tiller', 'Cultivator'];

export const EquipmentFilters: React.FC<EquipmentFiltersProps> = ({
  query, setQuery,
  category, setCategory,
  activity, setActivity,
  state, setState,
  district, setDistrict,
  taluka, setTaluka,
  village, setVillage,
  maxPrice, setMaxPrice,
  sortBy, setSortBy,
  onReset
}) => {
  const { t } = useLanguage();
  const [showLocationFilters, setShowLocationFilters] = useState(Boolean(district || taluka || village));

  const availableDistricts = state && state !== 'All' ? STATE_DISTRICTS_MAP[state] || [] : [];
  const availableTalukas = district && district !== 'All' ? getTalukasForDistrict(district) : [];

  const handleStateChange = (newState: string) => {
    setState(newState);
    setDistrict('All');
    setTaluka('All');
  };

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    setTaluka('All');
  };

  const isAnyFilterActive = query || (category && category !== 'All') || (activity && activity !== 'All') || (state && state !== 'All') || (district && district !== 'All') || (taluka && taluka !== 'All') || village || maxPrice > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      
      {/* Search Input, Activity Selector & Sort Dropdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        
        {/* Search Query Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, model, village, taluka, district..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#166534] text-xs sm:text-sm text-slate-900 bg-slate-50/50"
          />
        </div>

        {/* Farming Activity Filter */}
        <div className="md:col-span-3">
          <div className="relative">
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full py-2.5 pl-3 pr-8 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534] truncate"
            >
              <option value="All">🌾 All Farming Activities (सर्व शेती कामे)</option>
              {FARMING_ACTIVITIES_CONFIG.map(act => (
                <option key={act.id} value={act.name}>
                  {act.name} ({act.marathi})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort By Dropdown */}
        <div className="md:col-span-3 flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]"
          >
            <option value="rating">{t('market.highestRated')}</option>
            <option value="priceAsc">{t('market.priceLowToHigh')}</option>
            <option value="priceDesc">{t('market.priceHighToLow')}</option>
            <option value="newest">{t('market.newest')}</option>
          </select>
        </div>

      </div>

      {/* Category Pills & Location Toggle */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">{t('filter.category')}:</span>
          {CATEGORY_KEYS.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                category.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? t('cat.all') : t(`cat.${cat}`) || cat}
            </button>
          ))}
        </div>

        {/* Location Dropdown Toggle & Reset Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLocationFilters(!showLocationFilters)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              showLocationFilters || (district !== 'All' && district) || village
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#166534]" />
            <span>Village & Taluka Filter</span>
            {showLocationFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isAnyFilterActive && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('filter.reset')}</span>
            </button>
          )}
        </div>

      </div>

      {/* 4-Tier Location Proximity Filters (Expandable) */}
      {showLocationFilters && (
        <div className="pt-3 border-t border-slate-100 bg-slate-50/80 rounded-xl p-3.5 space-y-3 animate-fadeIn">
          
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#166534]" />
              <span>Filter by Granular Location: State &gt; District &gt; Taluka &gt; Village</span>
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              Nearest machinery matches will be prioritized
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            
            {/* 1. State */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">1. State</label>
              <select
                value={state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-1 focus:ring-[#166534]"
              >
                <option value="All">All States (सर्व राज्ये)</option>
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* 2. District */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">2. District (जिल्हा)</label>
              <select
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                disabled={state === 'All'}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white disabled:bg-slate-100 disabled:text-slate-400 focus:ring-1 focus:ring-[#166534]"
              >
                <option value="All">All Districts</option>
                {availableDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* 3. Taluka */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">3. Taluka / Tehsil (तालुका)</label>
              {availableTalukas.length > 0 ? (
                <select
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-1 focus:ring-[#166534]"
                >
                  <option value="All">All Talukas</option>
                  {availableTalukas.map(tName => (
                    <option key={tName} value={tName}>{tName}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={taluka === 'All' ? '' : taluka}
                  onChange={(e) => setTaluka(e.target.value || 'All')}
                  placeholder="Enter Taluka / Tehsil"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                />
              )}
            </div>

            {/* 4. Village */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">4. Village (गाव / ग्राम)</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g., Paithan, Ranjangaon"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-1 focus:ring-[#166534]"
              />
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
