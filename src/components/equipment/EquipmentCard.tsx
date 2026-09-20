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
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group agri-card-hover">
      
      {/* Equipment Image & Badge Overlay */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
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
        <div className="absolute top-2.5 left-2.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#166534] text-white shadow-xs tracking-wide">
            {translatedCategory}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-2.5 right-2.5 pointer-events-none">
          {equipment.isAvailable ? (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {t('market.available')}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-300">
              {t('market.booked')}
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          
          {/* Header Title & Rating */}
          <div className="flex items-start justify-between gap-1.5 mb-1.5">
            <Link to={`/equipment/${equipment.id}`} className="font-bold text-slate-900 hover:text-[#166534] transition-colors line-clamp-1 text-sm sm:text-base leading-snug" title={equipment.name}>
              <TranslatedText text={equipment.name} />
            </Link>
          </div>

          <div className="flex items-center justify-between mb-2">
            <RatingStars rating={equipment.rating} reviewCount={equipment.reviewCount} />
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              {equipment.hp} {t('common.hp')}
            </span>
          </div>

          {/* Location & Owner */}
          <div className="space-y-1 mb-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#166534] shrink-0" />
              <span className="truncate">{equipment.location}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{t('market.owner')}: <span className="font-semibold text-slate-800">{equipment.ownerName}</span></span>
            </div>
          </div>

          {/* Operator included tag */}
          {equipment.operatorIncluded && (
            <div className="mb-2.5 inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200/60 truncate max-w-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{t('market.operatorIncluded')} (+₹{equipment.operatorCostPerDay})</span>
            </div>
          )}

        </div>

        {/* Card Footer Price & Buttons */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between mt-1.5">
          <div>
            <div className="text-[11px] text-slate-500 font-medium leading-none mb-0.5">{t('market.rentalRate')}</div>
            <div className="text-base sm:text-lg font-extrabold text-[#166534]">
              ₹{equipment.pricePerDay.toLocaleString('en-IN')}
              <span className="text-[11px] font-normal text-slate-500"> {t('market.perDay')}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              to={`/equipment/${equipment.id}`}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {t('market.details')}
            </Link>
            <button
              onClick={handleRentNow}
              className="px-3 py-1.5 rounded-lg bg-[#166534] hover:bg-[#004C22] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              {t('market.rentNow')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
