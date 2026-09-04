import React from 'react';
import { ArrowUpDown, MapPin, Building } from 'lucide-react';

export const INDIAN_STATES = [
  'ALL',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Keralam',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Puducherry',
  'Jammu and Kashmir'
];

interface MandiFilterProps {
  districts: string[];
  selectedState: string;
  onStateChange: (state: string) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
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
  sortOrder,
  onSortOrderChange,
  showOnlyFavourites,
  onToggleFavouritesFilter,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      
      {/* State Filter Dropdown */}
      <div className="relative">
        <select
          value={selectedState}
          onChange={(e) => onStateChange(e.target.value)}
          className="appearance-none bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 pr-8 text-xs font-bold text-[#166534] focus:outline-none focus:ring-2 focus:ring-[#166534] cursor-pointer"
        >
          <option value="ALL">All States (India)</option>
          {INDIAN_STATES.filter(s => s !== 'ALL').map((stateName) => (
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
          disabled={selectedState === 'ALL' && districts.length === 0}
          className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#166534] cursor-pointer disabled:opacity-60"
        >
          <option value="ALL">
            {selectedState === 'ALL' ? 'All Districts' : `All Districts in ${selectedState}`}
          </option>
          {districts.map((districtName) => (
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
