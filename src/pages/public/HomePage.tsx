import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { EquipmentGrid } from '../../components/equipment/EquipmentGrid';
import { Equipment } from '../../types';
import { BookingModal } from '../../components/booking/BookingModal';
import { Search, ArrowRight, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { equipment, refreshEquipment } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEquipmentForBooking, setSelectedEquipmentForBooking] = useState<Equipment | null>(null);

  React.useEffect(() => {
    refreshEquipment();
  }, [refreshEquipment]);

  const filteredEquipment = equipment.filter(item => {
    const matchesCategory = selectedCategory === 'All' || 
      (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery = query === '' || 
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.brand && item.brand.toLowerCase().includes(query)) ||
      (item.location && item.location.toLowerCase().includes(query)) ||
      (item.state && item.state.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  const categories = ['All', 'Tractor', 'Harvester', 'Seeder', 'Sprayer', 'Rotavator', 'Tiller', 'Cultivator'];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/equipment?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#166534] via-[#004C22] to-slate-900 text-white min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-xl">
        
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs sm:text-sm font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t('hero.tagline')}</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            {t('hero.headline')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-lime-300 to-amber-300">
              {t('hero.headlineSpan')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-emerald-100/90 max-w-2xl mx-auto font-normal">
            {t('hero.subtitle')}
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto pt-4">
            <div className="bg-white rounded-2xl p-2 shadow-2xl flex items-center gap-2 border border-white/30 text-slate-800">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                className="w-full py-2.5 px-2 focus:outline-none text-sm text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="bg-[#166534] hover:bg-[#004C22] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all shrink-0 flex items-center gap-2"
              >
                <span>{t('hero.findBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>




        </div>
      </section>

      {/* Available Equipment Marketplace */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#166534]">{t('market.badge')}</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{t('market.title')}</h2>
          </div>
          
          <Link
            to="/equipment"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#166534] hover:text-[#004C22] group"
          >
            <span>{t('market.catalogBtn')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#166534] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'All' ? t('cat.all') : t(`cat.${cat}`) || cat}
            </button>
          ))}
        </div>

        {/* Equipment Cards Grid */}
        <EquipmentGrid
          equipment={filteredEquipment}
          onRentClick={(eq) => setSelectedEquipmentForBooking(eq)}
        />

      </section>

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
