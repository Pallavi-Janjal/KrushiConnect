import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { calculateSmartMatch } from '../../utils/matchCalculator';
import { SmartMatchResult, Equipment } from '../../types';
import { BookingModal } from '../../components/booking/BookingModal';
import { RatingStars } from '../../components/common/RatingStars';
import { Sparkles, Tractor, CheckCircle2, ArrowRight, MapPin, Zap, Navigation } from 'lucide-react';
import { INDIAN_STATES, STATE_DISTRICTS_MAP, getTalukasForDistrict } from '../../data/indiaLocations';
import { resolveImageUrl, getCategoryFallbackImage } from '../../services/api';

export const SmartMatchPage: React.FC = () => {
  const { equipment } = useApp();
  const { t } = useLanguage();

  const [crop, setCrop] = useState('Wheat');
  const [landArea, setLandArea] = useState<number>(15);
  const [activity, setActivity] = useState('Land Preparation & Deep Plowing');
  const [customActivity, setCustomActivity] = useState('');
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Chhatrapati Sambhajinagar');
  const [selectedTaluka, setSelectedTaluka] = useState<string>('');
  const [customTaluka, setCustomTaluka] = useState<string>('');
  const [village, setVillage] = useState<string>('');
  const [maxBudget, setMaxBudget] = useState<number>(4000);

  // Available talukas for chosen district
  const [availableTalukas, setAvailableTalukas] = useState<string[]>(() => 
    getTalukasForDistrict('Chhatrapati Sambhajinagar')
  );

  // When state changes, reset or pick first district and update talukas
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const districts = STATE_DISTRICTS_MAP[newState] || [];
    const firstDist = districts[0] || '';
    setSelectedDistrict(firstDist);
    const talukas = getTalukasForDistrict(firstDist);
    setAvailableTalukas(talukas);
    setSelectedTaluka(talukas[0] || '');
    setCustomTaluka('');
  };

  // When district changes, update talukas
  const handleDistrictChange = (newDistrict: string) => {
    setSelectedDistrict(newDistrict);
    const talukas = getTalukasForDistrict(newDistrict);
    setAvailableTalukas(talukas);
    setSelectedTaluka(talukas[0] || '');
    setCustomTaluka('');
  };

  const getEffectiveTaluka = () => {
    if (selectedTaluka === 'OTHER') return customTaluka.trim();
    return selectedTaluka;
  };

  const runSmartMatch = useCallback(() => {
    const effTaluka = selectedTaluka === 'OTHER' ? customTaluka.trim() : selectedTaluka;
    const locParts = [village.trim(), effTaluka, selectedDistrict, selectedState].filter(Boolean);
    const formattedLoc = locParts.join(', ');

    const results = calculateSmartMatch(equipment, {
      crop,
      landArea,
      activity,
      customActivity: activity === 'Other' ? customActivity : undefined,
      location: formattedLoc,
      state: selectedState,
      district: selectedDistrict,
      taluka: effTaluka,
      village: village.trim(),
      preferredDate: '',
      maxBudget
    });
    return results;
  }, [equipment, crop, landArea, activity, customActivity, selectedState, selectedDistrict, selectedTaluka, customTaluka, village, maxBudget]);

  const [matches, setMatches] = useState<SmartMatchResult[]>(() => runSmartMatch());
  const [selectedEquipmentForBooking, setSelectedEquipmentForBooking] = useState<Equipment | null>(null);

  // Re-run match whenever equipment loads or filters change
  useEffect(() => {
    setMatches(runSmartMatch());
  }, [equipment, runSmartMatch]);

  const handleCalculateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    setMatches(runSmartMatch());
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
          AI-powered matching by granular location (Village &gt; Taluka &gt; District &gt; State), farming activities, and plot requirements.
        </p>
      </div>

      {/* Main Grid: Form (5 cols) & Results (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Match Input Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5 h-fit">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Match Criteria</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Location-First AI
            </span>
          </h2>

          <form onSubmit={handleCalculateMatch} className="space-y-4">
            
            {/* Crop Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('smart.cropType')}</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
              >
                <option value="Wheat">Wheat (गहू)</option>
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Cotton">Cotton / Kapas (कापूस)</option>
                <option value="Sugarcane">Sugarcane (ऊस)</option>
                <option value="Gram">Gram / Chana (हरभरा)</option>
                <option value="Tur">Tur / Arhar (तूर)</option>
                <option value="Paddy">Paddy / Rice (धान)</option>
                <option value="Onion">Onion (कांदा)</option>
                <option value="Maize">Maize / Makka (मका)</option>
                <option value="Pulses">Other Pulses (डाळी)</option>
              </select>
            </div>

            {/* Plot Area Slider */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex justify-between">
                <span>{t('smart.plotAcreage')}</span>
                <span className="font-bold text-[#166534]">{landArea} {t('common.acres')}</span>
              </label>
              <input
                type="range"
                min={1}
                max={100}
                value={landArea}
                onChange={(e) => setLandArea(Number(e.target.value))}
                className="w-full accent-[#166534]"
              />
            </div>

            {/* Farming Activity Dropdown with 'Other' write-in option */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('smart.farmingActivity')}</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
              >
                <option value="Land Preparation & Deep Plowing">🚜 Land Preparation & Deep Plowing (नांगरणी)</option>
                <option value="Seedbed Tilling & Rotavator Pass">🌱 Seedbed Tilling & Rotavator Pass (रोटाव्हेटर)</option>
                <option value="Precision Sowing & Fertilizing">🌾 Precision Sowing & Fertilizing (पेरणी)</option>
                <option value="Crop Spraying & Chemical Application">💧 Crop Spraying & Chemical Application (फवारणी)</option>
                <option value="Harvesting & Grain Threshing">🌾 Harvesting & Grain Threshing (कापणी व मळणी)</option>
                <option value="Weeding & Inter-row Cultivation">🌿 Weeding & Inter-row Cultivation (खुरपणी / कोळपणी)</option>
                <option value="Baling & Crop Residue Management">📦 Baling & Crop Residue Management (बेलिंग)</option>
                <option value="Irrigation & Water Pumping">💦 Irrigation & Water Pumping (पाणी उपसा)</option>
                <option value="Other">✍️ Other (Write Custom Activity)</option>
              </select>

              {/* Custom Activity Text Box (appears when Other is selected) */}
              {activity === 'Other' && (
                <div className="animate-fadeIn">
                  <input
                    type="text"
                    required
                    value={customActivity}
                    onChange={(e) => setCustomActivity(e.target.value)}
                    placeholder="Enter your farming activity (e.g., Sugarcane cutting, Trenching, Ditching)..."
                    className="w-full px-3 py-2 rounded-lg border-2 border-emerald-500 text-xs font-semibold text-slate-800 bg-emerald-50/50 focus:bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none transition-all"
                  />
                  <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
                    ✨ AI will search equipment descriptions and implements matching this activity
                  </span>
                </div>
              )}
            </div>

            {/* 4-Tier Location Hierarchy: State, District, Taluka, Village */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 border-b border-slate-200/80 pb-2">
                <Navigation className="w-3.5 h-3.5 text-[#166534]" />
                <span>Smart Proximity Location (4 Tiers)</span>
              </div>

              {/* State & District (Row 1) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">1. State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                  >
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">2. District (जिल्हा)</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                  >
                    {(STATE_DISTRICTS_MAP[selectedState] || []).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Taluka & Village (Row 2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">3. Taluka / Tehsil (तालुका)</label>
                  {availableTalukas.length > 0 ? (
                    <select
                      value={selectedTaluka}
                      onChange={(e) => setSelectedTaluka(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                    >
                      <option value="">All Talukas</option>
                      {availableTalukas.map(tName => (
                        <option key={tName} value={tName}>{tName}</option>
                      ))}
                      <option value="OTHER">Other (Specify below)</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={customTaluka}
                      onChange={(e) => setCustomTaluka(e.target.value)}
                      placeholder="Enter Taluka / Tehsil"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                    />
                  )}
                  {selectedTaluka === 'OTHER' && (
                    <input
                      type="text"
                      required
                      value={customTaluka}
                      onChange={(e) => setCustomTaluka(e.target.value)}
                      placeholder="Type custom taluka name"
                      className="w-full mt-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-400 text-xs font-semibold text-slate-800 bg-emerald-50/50"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">4. Village (गाव / ग्राम)</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Enter Village Name (e.g., Paithan, Ranjangaon)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-1 focus:ring-[#166534]"
                  />
                </div>
              </div>

              <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-1">
                <span>🎯 Priority Sort:</span>
                <span className="font-extrabold text-[#166534]">Village Match #1 &gt; Taluka #2 &gt; District #3 &gt; State #4</span>
              </div>
            </div>

            {/* Daily Budget */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('smart.budget')}</label>
              <input
                type="number"
                step={500}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#166534] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t('smart.findMatch')} (Run Smart Proximity Match)</span>
            </button>

          </form>
        </div>

        {/* Right Column: Scored Recommendation Results */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {t('smart.results')} ({matches.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Sorted by Nearest Location &amp; Match %
            </span>
          </div>

          {matches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-2">
              <Tractor className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">{t('smart.noResults')}</p>
              <p className="text-xs text-slate-500">Try broadening your location or budget criteria to see more available equipment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map(({ equipment: item, matchScore, matchReasons }, index) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden">
                  
                  {/* Top Rank Ribbon for #1 Result */}
                  {index === 0 && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-white text-[10px] font-black px-3 py-0.5 rounded-bl-xl shadow-xs flex items-center gap-1">
                      <span>🏆 #1 TOP MATCH</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-4">
                      <img
                        src={resolveImageUrl(item.images?.[0], item.category)}
                        alt={item.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getCategoryFallbackImage(item.category);
                        }}
                        className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                            {matchScore}% MATCH
                          </span>
                          <span className="text-xs font-semibold text-slate-500">{item.category}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base mt-1">{item.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                          <RatingStars rating={item.rating} reviewCount={item.reviewCount} size={14} />
                          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> {item.hp} {t('common.hp')}</span>
                          <span className="flex items-center gap-1 text-[#166534] font-medium"><MapPin className="w-3 h-3 text-[#166534]" /> {item.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right sm:self-center shrink-0">
                      <div className="text-xl font-black text-[#166534]">₹{item.pricePerDay.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500"> {t('market.perDay')}</span></div>
                      <button
                        onClick={() => setSelectedEquipmentForBooking(item)}
                        className="mt-2 px-4 py-2 rounded-lg bg-[#166534] hover:bg-[#004C22] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
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

