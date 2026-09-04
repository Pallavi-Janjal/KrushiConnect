import React, { useState, useEffect } from 'react';
import { mandiService } from '../../services/mandiService';
import { MandiPrice } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { MandiPriceCard } from '../../components/mandi/MandiPriceCard';
import { CropSearch } from '../../components/mandi/CropSearch';
import { MandiFilter } from '../../components/mandi/MandiFilter';
import { PriceTrendChart } from '../../components/mandi/PriceTrendChart';
import { MandiDetailModal } from '../../components/mandi/MandiDetailModal';
import { Sprout, Star, RefreshCw, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

export const MandiIntelligencePage: React.FC = () => {
  const { t } = useLanguage();
  const [mandiPrices, setMandiPrices] = useState<MandiPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<MandiPrice | null>(null);

  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showOnlyFavourites, setShowOnlyFavourites] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // Favourites state synced with localStorage
  const [favourites, setFavourites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('krushi_mandi_favourites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal State
  const [detailModalItem, setDetailModalItem] = useState<MandiPrice | null>(null);

  // Fetch Mandi Rates from live API endpoint
  const fetchRates = async (pageToFetch: number = 1) => {
    setLoading(true);
    try {
      const res = await mandiService.getMandiPrices({
        state: selectedState,
        district: selectedDistrict,
        search: searchTerm,
        page: pageToFetch,
        limit: 40
      });

      setMandiPrices(res.rates);
      setTotalPages(res.totalPages || 1);
      setTotalRecords(res.total || res.rates.length);
      setCurrentPage(res.page || 1);

      // Extract unique districts from returned records
      if (res.rates.length > 0) {
        const dists = Array.from(new Set(res.rates.map(r => r.district).filter(Boolean))) as string[];
        setAvailableDistricts(dists);

        setSelectedItem((prev) => {
          const exists = res.rates.find(r => r.id === prev?.id);
          return exists || res.rates[0];
        });
      } else {
        setAvailableDistricts([]);
      }
    } catch (err) {
      console.error('Failed to load mandi prices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchRates(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [selectedState, selectedDistrict, searchTerm]);

  // Handle State change (reset district selection)
  const handleStateChange = (newStat: string) => {
    setSelectedState(newStat);
    setSelectedDistrict('ALL');
    setCurrentPage(1);
  };

  // Sync Favourites to LocalStorage
  const toggleFavourite = (e: React.MouseEvent, item: MandiPrice) => {
    e.stopPropagation();
    setFavourites((prev) => {
      let updated: string[];
      if (prev.includes(item.id)) {
        updated = prev.filter((id) => id !== item.id);
      } else {
        updated = [...prev, item.id];
      }
      try {
        localStorage.setItem('krushi_mandi_favourites', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  // Sorted items
  const filteredPrices = mandiPrices
    .filter((item) => {
      return !showOnlyFavourites || favourites.includes(item.id);
    })
    .sort((a, b) => {
      const priceA = a.modalPrice ?? a.currentPrice;
      const priceB = b.modalPrice ?? b.currentPrice;
      return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });

  // Favourites list
  const favouriteItems = mandiPrices.filter((item) => favourites.includes(item.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      
      {/* Mandi Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-[#166534] font-bold">
              🌾
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#166534]">
              {t('mandi.badge')} — All-India District Intelligence
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mt-1">🌾 Mandi Prices & District Insights</h1>
          <p className="text-xs text-slate-500 mt-1">
            Access live APMC crop rates with state & district filters and AI market selling advisories across India.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="text-right text-xs">
            <span className="text-slate-400 block font-medium">Live Database Records:</span>
            <span className="font-extrabold text-[#166534]">
              {totalRecords > 0 ? `${totalRecords.toLocaleString()} Markets` : 'Live API Connected'}
            </span>
          </div>
          <button
            onClick={() => fetchRates(currentPage)}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            title="Refresh Live API Prices"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search, State & District Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <CropSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <MandiFilter
            districts={availableDistricts}
            selectedState={selectedState}
            onStateChange={handleStateChange}
            selectedDistrict={selectedDistrict}
            onDistrictChange={(dist) => {
              setSelectedDistrict(dist);
              setCurrentPage(1);
            }}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            showOnlyFavourites={showOnlyFavourites}
            onToggleFavouritesFilter={() => setShowOnlyFavourites(!showOnlyFavourites)}
          />
        </div>
      </div>

      {/* Favourite Crops Quick Strip (If any saved) */}
      {favouriteItems.length > 0 && !showOnlyFavourites && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Your Favourite Crops ({favouriteItems.length})</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {favouriteItems.map((fav) => (
              <div
                key={fav.id}
                onClick={() => setSelectedItem(fav)}
                className={`shrink-0 px-4 py-2.5 bg-white border rounded-xl shadow-xs cursor-pointer flex items-center gap-3 transition-all ${
                  selectedItem?.id === fav.id ? 'border-[#166534] ring-2 ring-[#166534]/20' : 'border-slate-200'
                }`}
              >
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">{fav.commodity}</span>
                  <span className="text-[10px] text-slate-500">{fav.mandiName}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#166534]">
                    ₹{(fav.modalPrice ?? fav.currentPrice).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">/qtl</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid of Mandi Crop Price Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[#166534]" />
            <span>
              Market Listings {selectedDistrict !== 'ALL' ? `in ${selectedDistrict} District` : selectedState !== 'ALL' ? `in ${selectedState}` : 'across India'} ({filteredPrices.length})
            </span>
          </h2>
          {showOnlyFavourites && (
            <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              Showing Saved Favourites Only
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-48 bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
            ))}
          </div>
        ) : filteredPrices.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <p className="text-slate-500 text-sm font-semibold">No crop market rates found for your selected state/district filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedState('ALL');
                setSelectedDistrict('ALL');
                setShowOnlyFavourites(false);
              }}
              className="px-4 py-2 bg-[#166534] text-white text-xs font-extrabold rounded-xl"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredPrices.map((item) => (
              <MandiPriceCard
                key={item.id}
                item={item}
                isSelected={selectedItem?.id === item.id}
                isFavourite={favourites.includes(item.id)}
                onSelect={(selected) => setSelectedItem(selected)}
                onToggleFavourite={toggleFavourite}
                onViewDetails={(_e, detailsItem) => setDetailModalItem(detailsItem)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Control Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 text-xs font-bold text-slate-700">
          <div>
            Page <strong className="text-[#166534]">{currentPage}</strong> of <strong>{totalPages}</strong> ({totalRecords.toLocaleString()} total APMC markets)
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1 || loading}
              onClick={() => fetchRates(currentPage - 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              disabled={currentPage >= totalPages || loading}
              onClick={() => fetchRates(currentPage + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 flex items-center gap-1 text-[#166534]"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Selected Crop 7-Day Price Trend Visualizer */}
      {selectedItem && <PriceTrendChart selectedItem={selectedItem} />}

      {/* Detail Modal */}
      <MandiDetailModal
        item={detailModalItem}
        isFavourite={detailModalItem ? favourites.includes(detailModalItem.id) : false}
        onClose={() => setDetailModalItem(null)}
        onToggleFavourite={toggleFavourite}
      />

    </div>
  );
};
