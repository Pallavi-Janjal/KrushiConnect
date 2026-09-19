import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { EquipmentGrid } from '../../components/equipment/EquipmentGrid';
import { Equipment } from '../../types';
import { BookingModal } from '../../components/booking/BookingModal';
import { Search, ArrowRight, Tractor, Cog, Sprout } from 'lucide-react';

const HarvesterIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14h10v3H4z" />
    <path d="M14 11h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
    <path d="M2 13v-3l3-2h4v5" />
    <path d="M1 11h3" />
  </svg>
);

const GreenCheckBadge: React.FC<{ text: string }> = ({ text }) => (
  <div className="inline-flex items-center gap-1.5 font-semibold text-slate-700 text-xs sm:text-sm">
    <svg className="w-4 h-4 text-[#15803d] shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
    <span>{text}</span>
  </div>
);

export const HomePage: React.FC = () => {
  const { equipment, refreshEquipment, loading } = useApp();
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

  const handleQuickCategorySelect = (categoryName: string) => {
    setSelectedCategory(selectedCategory.toLowerCase() === categoryName.toLowerCase() ? 'All' : categoryName);
    const target = document.getElementById('marketplace-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="hero-glow-border relative bg-gradient-to-r from-[#f7faf5] via-[#fcfefb] to-[#edf4ea] text-slate-900 min-h-[580px] lg:min-h-[620px] flex flex-col justify-center px-4 sm:px-8 lg:px-14 overflow-hidden rounded-2xl mx-2 sm:mx-4 my-3 shadow-xl">
        
        {/* Seamless Full-Width Background Tractor */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="/hero-tractor-smooth.png"
            alt="Modern Farm Tractor"
            className="absolute inset-0 w-full h-full object-cover object-right"
          />
          {/* Full-width continuous gradient overlay - completely eliminates any vertical seam or white line */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7faf5] via-[#f7faf5]/90 via-35% to-transparent to-80%"></div>
        </div>

        {/* Bottom Left Decorative Hill & Sprout */}
        <div className="absolute -bottom-1 -left-1 pointer-events-none z-10 w-36 sm:w-44 h-24 sm:h-32">
          <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M-10 150 C 40 95, 110 120, 170 150 Z" fill="#65a30d" opacity="0.85" />
            <path d="M-10 150 C 20 75, 80 100, 130 150 Z" fill="#15803d" />
            {/* Primary leaf */}
            <path d="M42 90 C 38 66, 56 42, 73 39 C 76 56, 66 80, 42 90 Z" fill="#4ade80" />
            <path d="M45 88 C 55 76, 61 60, 73 39" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
            {/* Secondary leaf */}
            <path d="M35 100 C 22 86, 20 70, 26 62 C 36 64, 40 80, 35 100 Z" fill="#86efac" />
          </svg>
        </div>

        {/* Bottom Right Decorative Sprout */}
        <div className="absolute -bottom-1 -right-1 pointer-events-none z-10 w-24 sm:w-32 h-20 sm:h-28">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M85 125 C 75 90, 95 60, 115 55 C 120 80, 108 110, 85 125 Z" fill="#84cc16" opacity="0.9" />
            <path d="M88 123 C 98 105, 104 85, 115 55" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M72 125 C 60 105, 55 88, 62 76 C 75 80, 78 102, 72 125 Z" fill="#4ade80" opacity="0.85" />
          </svg>
        </div>

        {/* Main Content Column */}
        <div className="max-w-xl lg:max-w-2xl relative z-10 py-12 sm:py-16 space-y-6 text-left">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#e8f5e5] border border-[#cde8c9] text-[#15803d] text-xs sm:text-sm font-semibold shadow-xs">
            <div className="w-6 h-6 rounded-full bg-[#15803d]/15 flex items-center justify-center shrink-0">
              <Tractor className="w-3.5 h-3.5 text-[#15803d]" />
            </div>
            <span>{t('hero.tagline')}</span>
          </div>

          {/* Headlines */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl lg:text-[3.35rem] font-extrabold tracking-tight text-[#111827] leading-[1.12]">
              {t('hero.headline')}
            </h1>
            <h2 className="text-3xl sm:text-5xl lg:text-[3.35rem] font-extrabold tracking-tight text-[#15803d] leading-[1.12]">
              {t('hero.headlineSpan')}
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-lg">
            {t('hero.subtitle')}
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleHeroSearch} className="max-w-lg pt-1">
            <div className="bg-white rounded-full p-1.5 sm:p-2 shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 border border-slate-200/90 text-slate-800">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                className="w-full py-2 px-1 sm:px-2 focus:outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent"
              />
              <button
                type="submit"
                className="bg-[#15803d] hover:bg-[#166534] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all shrink-0 flex items-center gap-2 group cursor-pointer"
              >
                <span>{t('hero.findBtn')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </form>

          {/* Category Quick Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            {[
              { id: 'Tractor', label: 'Tractors', icon: Tractor },
              { id: 'Harvester', label: 'Harvesters', icon: HarvesterIcon },
              { id: 'Rotavator', label: 'Rotavators', icon: Cog },
              { id: 'Seeder', label: 'Seeders', icon: Sprout },
            ].map(cat => {
              const IconComp = cat.icon;
              const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleQuickCategorySelect(cat.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#15803d] text-white shadow-md'
                      : 'bg-[#eef7ec] hover:bg-[#e2f2e0] text-slate-800 border border-[#d6ebd2]'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#15803d]/15 text-[#15803d]'
                  }`}>
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Value Propositions / Trust Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
            <GreenCheckBadge text="Verified Owners" />
            <span className="hidden sm:inline text-slate-300">|</span>
            <GreenCheckBadge text="Flexible Rentals" />
            <span className="hidden sm:inline text-slate-300">|</span>
            <GreenCheckBadge text="Fair Prices" />
          </div>

        </div>
      </section>

      {/* Available Equipment Marketplace */}
      <section id="marketplace-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
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
          loading={loading}
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
