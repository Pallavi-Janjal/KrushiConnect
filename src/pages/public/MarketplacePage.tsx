import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { EquipmentFilters } from '../../components/equipment/EquipmentFilters';
import { EquipmentGrid } from '../../components/equipment/EquipmentGrid';
import { BookingModal } from '../../components/booking/BookingModal';
import { Equipment } from '../../types';
import { equipmentService } from '../../services/equipmentService';

export const MarketplacePage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');
  const [maxPrice, setMaxPrice] = useState(0);
  const [sortBy, setSortBy] = useState<'priceAsc' | 'priceDesc' | 'rating' | 'newest'>('rating');
  const [selectedEquipmentForBooking, setSelectedEquipmentForBooking] = useState<Equipment | null>(null);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [loadingEq, setLoadingEq] = useState(true);

  useEffect(() => {
    setLoadingEq(true);
    equipmentService.searchAndFilter({ query, category, location, maxPrice: maxPrice > 0 ? maxPrice : undefined, sortBy })
      .then(list => setFilteredEquipment(list))
      .catch(() => setFilteredEquipment([]))
      .finally(() => setLoadingEq(false));
  }, [query, category, location, maxPrice, sortBy]);

  const handleReset = () => {
    setQuery('');
    setCategory('All');
    setLocation('All');
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
        location={location}
        setLocation={setLocation}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={handleReset}
      />

      {/* Results Count & Grid */}
      <div className="space-y-4">
        <div className="text-xs font-semibold text-slate-500">
          {loadingEq ? 'Loading...' : <>{t('market.showing')} <span className="text-slate-900 font-bold">{filteredEquipment.length}</span> {t('market.machineryListings')}</>}
        </div>

        <EquipmentGrid
          equipment={filteredEquipment}
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
