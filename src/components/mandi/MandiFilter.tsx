import React from 'react';
import { ArrowUpDown, MapPin, Building, Sprout } from 'lucide-react';
import { INDIAN_STATES, getDistrictsForState } from '../../data/indiaLocations';

export { INDIAN_STATES };

export const MANDI_CROPS = [
  { value: 'ALL', label: 'All Crops (All Commodities)', icon: '🌱' },
  { value: 'Soybean', label: 'Soybean (सोयाबीन)', icon: '🌱' },
  { value: 'Cotton', label: 'Cotton / Kapas (कापूस)', icon: '⚪' },
  { value: 'Onion', label: 'Onion (कांदा)', icon: '🧅' },
  { value: 'Wheat', label: 'Wheat / Gehu (गहू)', icon: '🌾' },
  { value: 'Gram', label: 'Gram / Chana (हरभरा)', icon: '🟡' },
  { value: 'Tur', label: 'Tur / Arhar (तूर)', icon: '🟡' },
  { value: 'Tomato', label: 'Tomato (टोमॅटो)', icon: '🍅' },
  { value: 'Potato', label: 'Potato (बटाटा)', icon: '🥔' },
  { value: 'Maize', label: 'Maize / Makka (मका)', icon: '🌽' },
  { value: 'Bajra', label: 'Bajra (बाजरी)', icon: '🌾' },
  { value: 'Jowar', label: 'Jowar (ज्वारी)', icon: '🌾' },
  { value: 'Sugarcane', label: 'Sugarcane (ऊस)', icon: '🎋' },
  { value: 'Pomegranate', label: 'Pomegranate (डाळिंब)', icon: '🍎' },
  { value: 'Grapes', label: 'Grapes (द्राक्षे)', icon: '🍇' },
  { value: 'Banana', label: 'Banana (केळी)', icon: '🍌' },
  { value: 'Rice', label: 'Rice / Paddy (धान)', icon: '🍚' },
  { value: 'Turmeric', label: 'Turmeric (हळद)', icon: '🟡' },
  { value: 'Chilli', label: 'Green Chilli (मिरची)', icon: '🌶️' },
  { value: 'Ginger', label: 'Ginger (आले)', icon: '🫚' },
  { value: 'Garlic', label: 'Garlic (लसूण)', icon: '🧄' }
];

interface MandiFilterProps {
  districts: string[];
  selectedState: string;
  onStateChange: (state: string) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  selectedCrop: string;
  onCropChange: (crop: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  showOnlyFavourites: boolean;
  onToggleFavouritesFilter: () => void;
}

export const MandiFilter: React.FC<MandiFilterProps> = ({
  districts,
  selectedState,
  onStateChange,
  selectedDistrict,
  onDistrictChange,
  selectedCrop,
  onCropChange,
  sortOrder,
  onSortOrderChange,
  showOnlyFavourites,
  onToggleFavouritesFilter,
}) => {
  // Always resolve all official districts for the chosen state from master locations
  const stateDistricts = selectedState !== 'ALL' ? getDistrictsForState(selectedState) : [];
  const activeDistricts = Array.from(new Set([...stateDistricts, ...(districts || [])])).sort();

  return (
    <div className="flex flex-wrap items-center gap-3">
      
      {/* Crop / Commodity Filter Dropdown */}
      <div className="relative">
        <select
          value={selectedCrop}
          onChange={(e) => onCropChange(e.target.value)}
          className="appearance-none bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 pr-8 text-xs font-bold text-[#166534] focus:outline-none focus:ring-2 focus:ring-[#166534] cursor-pointer"
        >
          {MANDI_CROPS.map((crop) => (
            <option key={crop.value} value={crop.value}>
              {crop.icon} {crop.label}
            </option>
          ))}
        </select>
        <Sprout className="w-3.5 h-3.5 text-[#166534] absolute right-2.5 top-3 pointer-events-none" />
      </div>

      {/* State Filter Dropdown */}
      <div className="relative">
        <select
          value={selectedState}
          onChange={(e) => onStateChange(e.target.value)}
          className="appearance-none bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 pr-8 text-xs font-bold text-[#166534] focus:outline-none focus:ring-2 focus:ring-[#166534] cursor-pointer"
        >
          <option value="ALL">All States (India)</option>
          {INDIAN_STATES.map((stateName) => (
            <option key={stateName} value={stateName}>
              📍 {stateName}
            </option>
          ))}
        </select>
        <MapPin className="w-3.5 h-3.5 text-[#166534] absolute right-2.5 top-3 pointer-events-none" />
      </div>

      {/* District Filter Dropdown (State-dependent) */}
      <div className="relative">
        <select
          value={selectedDistrict}
          onChange={(e) => onDistrictChange(e.target.value)}
          disabled={selectedState === 'ALL' && activeDistricts.length === 0}
          className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#166534] cursor-pointer disabled:opacity-60"
        >
          <option value="ALL">
            {selectedState === 'ALL' ? 'All Districts' : `All Districts in ${selectedState}`}
          </option>
          {activeDistricts.map((districtName) => (
            <option key={districtName} value={districtName}>
              🏙️ {districtName}
            </option>
          ))}
        </select>
        <Building className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
      </div>

      {/* Sort Order Toggle */}
      <button
        type="button"
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <ArrowUpDown className="w-3.5 h-3.5 text-[#166534]" />
        <span>Price: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}</span>
      </button>

      {/* Favourites Only Filter */}
      <button
        type="button"
        onClick={onToggleFavouritesFilter}
        className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all border ${
          showOnlyFavourites
            ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
        }`}
      >
        ⭐ Saved Favourites
      </button>

    </div>
  );
};
