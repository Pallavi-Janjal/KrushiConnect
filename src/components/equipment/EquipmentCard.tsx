import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Equipment } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { MapPin, Zap, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { TranslatedText } from '../common/TranslatedText';
import { resolveImageUrl } from '../../services/api';

interface EquipmentCardProps {
  equipment: Equipment;
  onRentClick?: (equipment: Equipment) => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onRentClick }) => {
  const navigate = useNavigate();
  const { user, saveReturnIntent } = useAuth();
  const { t } = useLanguage();

  const handleRentNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      saveReturnIntent({
        returnTo: `/equipment/${equipment.id}`,
        action: 'RENT_NOW',
        equipmentId: equipment.id
      });
      navigate('/login');
      return;
    }

    if (onRentClick) {
      onRentClick(equipment);
    } else {
      navigate(`/equipment/${equipment.id}`);
    }
  };

  const translatedCategory = t(`cat.${equipment.category}`) || equipment.category;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group agri-card-hover">
      
      {/* Equipment Image & Badge Overlay */}
      <div className="relative h-56 xl:h-60 w-full overflow-hidden bg-slate-100">
        <Link to={`/equipment/${equipment.id}`} className="block w-full h-full cursor-pointer" title={equipment.name}>
          <img
            src={resolveImageUrl(equipment.images?.[0])}
            alt={equipment.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        
        {/* Category Pill Badge */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#166534] text-white shadow-xs tracking-wide">
            {translatedCategory}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3 pointer-events-none">
          {equipment.isAvailable ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {t('market.available')}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
              {t('market.booked')}
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          
          {/* Header Title & Rating */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link to={`/equipment/${equipment.id}`} className="font-bold text-slate-900 hover:text-[#166534] transition-colors line-clamp-2 text-base sm:text-lg leading-snug">
              <TranslatedText text={equipment.name} />
            </Link>
          </div>

          <div className="flex items-center justify-between mb-3.5">
            <RatingStars rating={equipment.rating} reviewCount={equipment.reviewCount} />
            <span className="text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              {equipment.hp} {t('common.hp')}
            </span>
          </div>

          {/* Location & Owner */}
          <div className="space-y-1.5 mb-4 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-4 h-4 text-[#166534] shrink-0" />
              <span className="truncate">{equipment.location}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">{t('market.owner')}: <span className="font-semibold text-slate-800">{equipment.ownerName}</span></span>
            </div>
          </div>

          {/* Operator included tag */}
          {equipment.operatorIncluded && (
            <div className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200/60">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('market.operatorIncluded')} (+₹{equipment.operatorCostPerDay}{t('market.perDay')})</span>
            </div>
          )}

        </div>

        {/* Card Footer Price & Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">{t('market.rentalRate')}</div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#166534]">
              ₹{equipment.pricePerDay.toLocaleString('en-IN')}
              <span className="text-xs sm:text-sm font-normal text-slate-500"> {t('market.perDay')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to={`/equipment/${equipment.id}`}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {t('market.details')}
            </Link>
            <button
              onClick={handleRentNow}
              className="px-4.5 py-2 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              {t('market.rentNow')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
