import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { calculateSmartMatch } from '../../utils/matchCalculator';
import { SmartMatchResult, Equipment } from '../../types';
import { BookingModal } from '../../components/booking/BookingModal';
import { RatingStars } from '../../components/common/RatingStars';
import { Sparkles, Tractor, CheckCircle2, ArrowRight, MapPin, Zap } from 'lucide-react';
import { INDIAN_STATES, STATE_DISTRICTS_MAP } from '../../data/indiaLocations';

export const SmartMatchPage: React.FC = () => {
  const { equipment } = useApp();
  const { t } = useLanguage();

  const [crop, setCrop] = useState('Wheat');
  const [landArea, setLandArea] = useState<number>(15);
  const [activity, setActivity] = useState('Land Preparation & Deep Plowing');
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Chhatrapati Sambhajinagar');
  const [maxBudget, setMaxBudget] = useState<number>(4000);

  // When state changes, reset or pick first district
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const districts = STATE_DISTRICTS_MAP[newState] || [];
    setSelectedDistrict(districts[0] || '');
  };

  const getComputedLocation = () => {
    if (selectedDistrict && selectedState) {
      return `${selectedDistrict}, ${selectedState}`;
    }
    return selectedState || selectedDistrict || '';
  };

  const [matches, setMatches] = useState<SmartMatchResult[]>(() => 
    calculateSmartMatch(equipment, { 
      crop, 
      landArea, 
      activity, 
      location: 'Chhatrapati Sambhajinagar', 
      preferredDate: '', 
      maxBudget 
    })
  );

  const [selectedEquipmentForBooking, setSelectedEquipmentForBooking] = useState<Equipment | null>(null);

  const handleCalculateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = selectedDistrict || selectedState;
    const results = calculateSmartMatch(equipment, {
      crop,
      landArea,
      activity,
      location: loc,
      preferredDate: '',
      maxBudget
    });
    setMatches(results);
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-[#166534] to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-2 relative overflow-hidden">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 fill-amber-300" />
          <span>{t('smart.badge')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold">{t('smart.title')}</h1>
        <p className="text-sm text-emerald-100/90 max-w-2xl">
          {t('smart.subtitle')}
        </p>
      </div>

      {/* Main Grid: Form (4 cols) & Results (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Match Input Form */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5 h-fit">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t('smart.badge')}</span>
          </h2>

          <form onSubmit={handleCalculateMatch} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('smart.cropType')}</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
              >
                <option value="Wheat">Wheat</option>
                <option value="Paddy">Paddy / Rice</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Soybean">Soybean</option>
                <option value="Pulses">Pulses</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('smart.plotAcreage')}: <span className="font-bold text-[#166534]">{landArea} {t('common.acres')}</span></label>
              <input
                type="range"
                min={1}
                max={100}
                value={landArea}
                onChange={(e) => setLandArea(Number(e.target.value))}
                className="w-full accent-[#166534]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('smart.farmingActivity')}</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
              >
                <option value="Land Preparation & Deep Plowing">Land Preparation & Deep Plowing</option>
                <option value="Seedbed Tilling & Rotavator Pass">Seedbed Tilling & Rotavator Pass</option>
                <option value="Precision Sowing & Fertilizing">Precision Sowing & Fertilizing</option>
                <option value="Crop Spraying & Chemical Application">Crop Spraying & Chemical Application</option>
                <option value="Harvesting & Grain Threshing">Harvesting & Grain Threshing</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('smart.district')}</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                >
                  {(STATE_DISTRICTS_MAP[selectedState] || []).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>


            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('smart.budget')}</label>
              <input
                type="number"
                step={500}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t('smart.findMatch')}</span>
            </button>

          </form>
        </div>

        {/* Right Column: Scored Recommendation Results */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {t('smart.results')} ({matches.length})
            </h2>
          </div>

          {matches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-2">
              <Tractor className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-500">{t('smart.noResults')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map(({ equipment: item, matchScore, matchReasons }) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all space-y-4">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-4">
                      <img src={item.images[0]} alt="" className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                            {matchScore}% MATCH
                          </span>
                          <span className="text-xs font-semibold text-slate-500">{item.category}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base mt-1">{item.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <RatingStars rating={item.rating} reviewCount={item.reviewCount} size={14} />
                          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> {item.hp} {t('common.hp')}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#166534]" /> {item.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right sm:self-center shrink-0">
                      <div className="text-xl font-black text-[#166534]">₹{item.pricePerDay.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500"> {t('market.perDay')}</span></div>
                      <button
                        onClick={() => setSelectedEquipmentForBooking(item)}
                        className="mt-2 px-4 py-2 rounded-lg bg-[#166534] hover:bg-[#004C22] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                      >
                        <span>{t('smart.rentNow')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                  {/* Match Reasons List */}
                  <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-xs space-y-1">
                    <div className="font-bold text-[#166534] text-[11px] uppercase tracking-wider">{t('smart.whyMatch')}</div>
                    <ul className="space-y-1 text-slate-700">
                      {matchReasons.map((reason, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

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
