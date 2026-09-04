import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Equipment } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { MapPin, Zap, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { TranslatedText } from '../common/TranslatedText';

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
    if (onRentClick) {
      onRentClick(equipment);
    } else {
      if (!user) {
        saveReturnIntent({ returnTo: `/equipment/${equipment.id}`, action: 'RENT_NOW', equipmentId: equipment.id });
        navigate('/login');
      } else {
        navigate(`/equipment/${equipment.id}`);
      }
    }
  };

  const translatedCategory = t(`cat.${equipment.category}`) || equipment.category;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group agri-card-hover">
      
      {/* Equipment Image & Badge Overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={equipment.images[0] || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Category Pill Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#166534] text-white shadow-xs tracking-wide">
            {translatedCategory}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
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
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          
          {/* Header Title & Rating */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link to={`/equipment/${equipment.id}`} className="font-bold text-slate-900 hover:text-[#166534] transition-colors line-clamp-1 text-base">
              <TranslatedText text={equipment.name} />
            </Link>
          </div>

          <div className="flex items-center justify-between mb-3">
            <RatingStars rating={equipment.rating} reviewCount={equipment.reviewCount} />
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              {equipment.hp} {t('common.hp')}
            </span>
          </div>

          {/* Location & Owner */}
          <div className="space-y-1 mb-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#166534] shrink-0" />
              <span className="truncate">{equipment.location}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{t('market.owner')}: <span className="font-medium text-slate-800">{equipment.ownerName}</span></span>
            </div>
          </div>

          {/* Operator included tag */}
          {equipment.operatorIncluded && (
            <div className="mb-4 inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('market.operatorIncluded')} (+₹{equipment.operatorCostPerDay}{t('market.perDay')})</span>
            </div>
          )}

        </div>

        {/* Card Footer Price & Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
          <div>
            <div className="text-xs text-slate-500 font-medium">{t('market.rentalRate')}</div>
            <div className="text-lg font-extrabold text-[#166534]">
              ₹{equipment.pricePerDay.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-500"> {t('market.perDay')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/equipment/${equipment.id}`}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {t('market.details')}
            </Link>
            <button
              onClick={handleRentNow}
              className="px-3.5 py-1.5 rounded-lg bg-[#166534] hover:bg-[#004C22] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md"
            >
              {t('market.rentNow')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
