import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { EquipmentFilters } from '../../components/equipment/EquipmentFilters';
import { EquipmentGrid } from '../../components/equipment/EquipmentGrid';
import { BookingModal } from '../../components/booking/BookingModal';
import { Equipment } from '../../types';
import { equipmentService } from '../../services/equipmentService';
import { FARMING_ACTIVITIES_CONFIG } from '../../utils/matchCalculator';

export const MarketplacePage: React.FC = () => {
  const { t } = useLanguage();
  const { equipment: globalEquipment } = useApp();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialActivity = searchParams.get('activity') || 'All';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [activity, setActivity] = useState(initialActivity);
  const [state, setState] = useState('All');
  const [district, setDistrict] = useState('All');
  const [taluka, setTaluka] = useState('All');
  const [village, setVillage] = useState('');
  const [maxPrice, setMaxPrice] = useState(0);
  const [sortBy, setSortBy] = useState<'priceAsc' | 'priceDesc' | 'rating' | 'newest'>('rating');
  const [selectedEquipmentForBooking, setSelectedEquipmentForBooking] = useState<Equipment | null>(null);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [loadingEq, setLoadingEq] = useState(true);

  // Client-side fallback filter logic
  const filterClientSide = (list: Equipment[]) => {
    return list.filter(item => {
      // 1. Text Query
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchesQuery = 
          (item.name && item.name.toLowerCase().includes(q)) ||
          (item.brand && item.brand.toLowerCase().includes(q)) ||
          (item.location && item.location.toLowerCase().includes(q)) ||
          (item.state && item.state.toLowerCase().includes(q)) ||
          (item.district && item.district.toLowerCase().includes(q)) ||
          (item.taluka && item.taluka.toLowerCase().includes(q)) ||
          (item.village && item.village.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // 2. Category
      if (category !== 'All' && item.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }

      // 3. Farming Activity
      if (activity !== 'All') {
        const actConfig = FARMING_ACTIVITIES_CONFIG.find(a => 
          a.name.toLowerCase() === activity.toLowerCase() ||
          activity.toLowerCase().includes(a.id)
        );
        if (actConfig) {
          const itemCat = item.category.toLowerCase();
          const itemText = `${item.name} ${item.category} ${item.description} ${item.location}`.toLowerCase();
          const isPrimary = actConfig.primaryCategories.includes(itemCat);
          const isSecondary = actConfig.secondaryCategories.includes(itemCat);
          const hasKeyword = actConfig.keywords.some(kw => itemText.includes(kw));
          if (!isPrimary && !isSecondary && !hasKeyword) {
            return false;
          }
        }
      }

      // 4. State
      if (state !== 'All') {
        const s = state.toLowerCase();
        const itemState = (item.state || '').toLowerCase();
        const itemLoc = (item.location || '').toLowerCase();
        if (!itemState.includes(s) && !itemLoc.includes(s)) return false;
      }

      // 5. District
      if (district !== 'All') {
        const d = district.toLowerCase();
        const itemDist = (item.district || '').toLowerCase();
        const itemLoc = (item.location || '').toLowerCase();
        if (!itemDist.includes(d) && !itemLoc.includes(d) && !(d.includes('chhatrapati') && itemLoc.includes('aurangabad'))) {
          return false;
        }
      }

      // 6. Taluka
      if (taluka !== 'All' && taluka.trim() !== '') {
        const tVal = taluka.toLowerCase();
        const itemTaluka = (item.taluka || '').toLowerCase();
        const itemLoc = (item.location || '').toLowerCase();
        if (!itemTaluka.includes(tVal) && !itemLoc.includes(tVal)) return false;
      }

      // 7. Village
      if (village.trim()) {
        const v = village.toLowerCase().trim();
        const itemVillage = (item.village || '').toLowerCase();
        const itemLoc = (item.location || '').toLowerCase();
        if (!itemVillage.includes(v) && !itemLoc.includes(v)) return false;
      }

      // 8. Max Price
      if (maxPrice > 0 && item.pricePerDay > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'priceAsc') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'priceDesc') return b.pricePerDay - a.pricePerDay;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  };

  useEffect(() => {
    setLoadingEq(true);
    equipmentService.searchAndFilter({
      query,
      category,
      activity: activity !== 'All' ? activity : undefined,
      state: state !== 'All' ? state : undefined,
      district: district !== 'All' ? district : undefined,
      taluka: taluka !== 'All' ? taluka : undefined,
      village: village.trim() || undefined,
      maxPrice: maxPrice > 0 ? maxPrice : undefined,
      sortBy
    })
      .then(list => {
        if (list && list.length > 0) {
          setFilteredEquipment(list);
        } else {
          // Fallback to client filtering over global equipment store
          const clientMatches = filterClientSide(globalEquipment);
          setFilteredEquipment(clientMatches);
        }
      })
      .catch(() => {
        const clientMatches = filterClientSide(globalEquipment);
        setFilteredEquipment(clientMatches);
      })
      .finally(() => setLoadingEq(false));
  }, [query, category, activity, state, district, taluka, village, maxPrice, sortBy, globalEquipment]);

  const handleReset = () => {
    setQuery('');
    setCategory('All');
    setActivity('All');
    setState('All');
    setDistrict('All');
    setTaluka('All');
    setVillage('');
    setMaxPrice(0);
    setSortBy('rating');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Filters Bar */}
      <EquipmentFilters
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        activity={activity}
        setActivity={setActivity}
        state={state}
        setState={setState}
        district={district}
        setDistrict={setDistrict}
        taluka={taluka}
        setTaluka={setTaluka}
        village={village}
        setVillage={setVillage}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={handleReset}
      />

      {/* Results Count & Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>
            {loadingEq ? 'Loading...' : (
              <>
                {t('market.showing')} <span className="text-slate-900 font-bold">{filteredEquipment.length}</span> {t('market.machineryListings')}
                {activity !== 'All' && <span className="ml-1.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">Activity: {activity}</span>}
                {district !== 'All' && <span className="ml-1.5 px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">District: {district}</span>}
                {taluka !== 'All' && <span className="ml-1.5 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">Taluka: {taluka}</span>}
                {village.trim() && <span className="ml-1.5 px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold">Village: {village}</span>}
              </>
            )}
          </span>
        </div>

        <EquipmentGrid
          equipment={filteredEquipment}
          loading={loadingEq}
          onRentClick={(eq) => setSelectedEquipmentForBooking(eq)}
        />
      </div>

      {/* Booking Modal */}
      {selectedEquipmentForBooking && (
        <BookingModal
          equipment={selectedEquipmentForBooking}
          isOpen={!!selectedEquipmentForBooking}
          onClose={() => setSelectedEquipmentForBooking(null)}
        />
      )}

    </div>
  );
};
