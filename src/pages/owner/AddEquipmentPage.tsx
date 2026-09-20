import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { EquipmentCategory } from '../../types';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { INDIAN_STATES, STATE_DISTRICTS_MAP, getTalukasForDistrict } from '../../data/indiaLocations';
import { ImageUpload } from '../../components/common/ImageUpload';
import { getCategoryFallbackImage } from '../../services/api';

export const AddEquipmentPage: React.FC = () => {
  const { user } = useAuth();
  const { addEquipment } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tractor');
  const [customCategory, setCustomCategory] = useState('');
  const [brand, setBrand] = useState('Mahindra');
  const [model, setModel] = useState('');
  const [hp, setHp] = useState(45);
  const [fuelType] = useState('Diesel');
  const [description, setDescription] = useState('');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Chhatrapati Sambhajinagar');
  const initialTalukas = getTalukasForDistrict('Chhatrapati Sambhajinagar');
  const [selectedTaluka, setSelectedTaluka] = useState(initialTalukas[0] || 'Vaijapur');
  const [customTaluka, setCustomTaluka] = useState('');
  const [village, setVillage] = useState('');
  const [pricingUnit, setPricingUnit] = useState<'PER_HECTARE' | 'PER_HOUR' | 'BOTH'>('PER_HECTARE');
  const [pricePerHectare, setPricePerHectare] = useState(2000);
  const [pricePerHour, setPricePerHour] = useState(600);
  const [operatorIncluded, setOperatorIncluded] = useState(true);
  const [operatorCostPerHectare, setOperatorCostPerHectare] = useState(400);
  const [operatorCostPerHour, setOperatorCostPerHour] = useState(150);
  const [images, setImages] = useState<string[]>([]);

  const talukasForDistrict = getTalukasForDistrict(selectedDistrict);

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const districts = STATE_DISTRICTS_MAP[stateName] || [];
    const newDistrict = districts[0] || '';
    setSelectedDistrict(newDistrict);
    const talukas = getTalukasForDistrict(newDistrict);
    setSelectedTaluka(talukas[0] || '');
    setCustomTaluka('');
  };

  const handleDistrictChange = (districtName: string) => {
    setSelectedDistrict(districtName);
    const talukas = getTalukasForDistrict(districtName);
    setSelectedTaluka(talukas[0] || '');
    setCustomTaluka('');
  };

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    const effectiveTaluka = selectedTaluka === 'OTHER' || talukasForDistrict.length === 0 ? customTaluka.trim() : selectedTaluka.trim();
    const effectiveCategory = selectedCategory === 'Other' ? customCategory.trim() : selectedCategory.trim();

    if (!name || !description) {
      setError('Please provide equipment name and description.');
      return;
    }

    if (selectedCategory === 'Other' && !customCategory.trim()) {
      setError('Please write down your custom equipment category.');
      return;
    }

    if (!selectedDistrict || !effectiveTaluka || !village.trim()) {
      setError('Please provide State, District, Taluka, and Village for equipment location.');
      return;
    }

    if (pricingUnit === 'PER_HECTARE' && !pricePerHectare) {
      setError('Please provide rate per hectare.');
      return;
    }

    if (pricingUnit === 'PER_HOUR' && !pricePerHour) {
      setError('Please provide rate per hour.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const finalImages = images.length > 0 
        ? images 
        : [getCategoryFallbackImage(category)];

      const primaryRate = pricingUnit === 'PER_HOUR' ? Number(pricePerHour) : Number(pricePerHectare);
      const locParts = [village.trim(), effectiveTaluka, selectedDistrict, selectedState].filter(Boolean);
      const formattedLocation = locParts.join(', ');

      await addEquipment({
        ownerId: user.id,
        ownerName: user.name,
        ownerPhone: user.phone,
        name,
        category: effectiveCategory as any,
        brand,
        model: model || `${brand} Standard`,
        hp: Number(hp),
        fuelType,
        description,
        location: formattedLocation,
        state: selectedState,
        district: selectedDistrict,
        taluka: effectiveTaluka,
        village: village.trim(),
        pricePerDay: primaryRate,
        pricePerHectare: Number(pricePerHectare),
        pricePerHour: Number(pricePerHour),
        pricingUnit,
        operatorIncluded,
        operatorCostPerDay: operatorIncluded ? Number(operatorCostPerHectare) : 0,
        operatorCostPerHour: operatorIncluded ? Number(operatorCostPerHour) : 0,
        isAvailable: true,
        images: finalImages,
        specifications: {
          'Horsepower': `${hp} HP`,
          'Fuel Type': fuelType,
          'Brand': brand,
          'Model': model || 'Standard'
        }
      });

      navigate('/owner/my-equipment');
    } catch (err: any) {
      setError(err.message || 'Failed to add equipment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-1 text-xs font-bold text-[#166534] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('booking.back')}</span>
      </button>

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900">{t('addEq.title')}</h1>
        <p className="text-xs text-slate-500">{t('addEq.subtitle')}</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">{t('addEq.title')}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('addEq.equipmentName')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mahindra 575 DI 45 HP Tractor"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('addEq.category')} *</label>
              <div className="space-y-1.5">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
                >
                  <option value="Tractor">Tractor</option>
                  <option value="Harvester">Harvester</option>
                  <option value="Seeder">Seeder</option>
                  <option value="Sprayer">Sprayer</option>
                  <option value="Rotavator">Rotavator</option>
                  <option value="Cultivator">Cultivator</option>
                  <option value="Tiller">Power Tiller</option>
                  <option value="Balers">Balers</option>
                  <option value="Thresher">Thresher</option>
                  <option value="Other">Other (Specify below)</option>
                </select>

                {selectedCategory === 'Other' && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom equipment category (e.g. Laser Leveler, Digger)"
                    className="w-full px-3.5 py-2 rounded-lg border border-emerald-500 bg-emerald-50/40 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#166534] focus:outline-none"
                    required
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('addEq.brand')}</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Mahindra / John Deere"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('addEq.model')}</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="575 DI PowerPlus"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('addEq.hp')}</label>
              <input
                type="number"
                value={hp}
                onChange={(e) => setHp(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs"
                required
              />
            </div>
          </div>
        </div>

        {/* Description & Location */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            {t('addEq.description')} & Equipment Location
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('addEq.description')}</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('addEq.descriptionPlaceholder')}
              className="w-full p-3 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none"
              required
            />
          </div>

          {/* 4 Location Fields: State, District, Taluka, Village */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. State */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('addEq.state')} *</label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
                required
              >
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* 2. District */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('addEq.district')} *</label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
                required
              >
                {(STATE_DISTRICTS_MAP[selectedState] || []).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* 3. Taluka */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('addEq.taluka')} *</label>
              {talukasForDistrict.length > 0 ? (
                <div className="space-y-1.5">
                  <select
                    value={selectedTaluka}
                    onChange={(e) => setSelectedTaluka(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
                    required
                  >
                    {talukasForDistrict.map(tal => (
                      <option key={tal} value={tal}>{tal}</option>
                    ))}
                    <option value="OTHER">✏️ Other (Enter manually)</option>
                  </select>
                  {selectedTaluka === 'OTHER' && (
                    <input
                      type="text"
                      value={customTaluka}
                      onChange={(e) => setCustomTaluka(e.target.value)}
                      placeholder="Type taluka name"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
                      required
                    />
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={customTaluka}
                  onChange={(e) => setCustomTaluka(e.target.value)}
                  placeholder="Enter Taluka / Tehsil"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  required
                />
              )}
            </div>

            {/* 4. Village */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('addEq.village')} *</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Shivoor, Pachod"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing Basis & Rate Options */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-base font-bold text-slate-900">Rental Rates & Pricing Basis</h3>
            <span className="text-xs text-slate-500">Choose Hour, Hectare, or Both</span>
          </div>

          {/* Pricing Unit Selector Pills */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">How would you like to charge for this equipment?</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPricingUnit('PER_HECTARE')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  pricingUnit === 'PER_HECTARE'
                    ? 'bg-emerald-50 border-[#166534] text-[#166534] shadow-xs ring-1 ring-[#166534]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>🚜 Per Hectare</span>
                <span className="text-[10px] font-normal text-slate-500">Charge per ha</span>
              </button>
              <button
                type="button"
                onClick={() => setPricingUnit('PER_HOUR')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  pricingUnit === 'PER_HOUR'
                    ? 'bg-emerald-50 border-[#166534] text-[#166534] shadow-xs ring-1 ring-[#166534]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>⏱️ Per Hour</span>
                <span className="text-[10px] font-normal text-slate-500">Charge per hour</span>
              </button>
              <button
                type="button"
                onClick={() => setPricingUnit('BOTH')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  pricingUnit === 'BOTH'
                    ? 'bg-emerald-50 border-[#166534] text-[#166534] shadow-xs ring-1 ring-[#166534]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>✨ Both (Flexible)</span>
                <span className="text-[10px] font-normal text-slate-500">Farmer decides</span>
              </button>
            </div>
          </div>

          {/* Rate Input Fields based on selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(pricingUnit === 'PER_HECTARE' || pricingUnit === 'BOTH') && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Equipment Rate Per Hectare (₹ / hectare) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    step={50}
                    min={100}
                    value={pricePerHectare}
                    onChange={(e) => setPricePerHectare(Number(e.target.value))}
                    className="w-full pl-7 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-[#166534] focus:ring-2 focus:ring-[#166534] focus:outline-none"
                    placeholder="e.g. 2000"
                    required
                  />
                </div>
              </div>
            )}

            {(pricingUnit === 'PER_HOUR' || pricingUnit === 'BOTH') && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Equipment Rate Per Hour (₹ / hour) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    step={50}
                    min={50}
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(Number(e.target.value))}
                    className="w-full pl-7 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-[#166534] focus:ring-2 focus:ring-[#166534] focus:outline-none"
                    placeholder="e.g. 600"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Operator Details */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-900 block">{t('addEq.operatorIncluded')}</label>
                <span className="text-[11px] text-slate-500">Provide an experienced driver / operator with this machine</span>
              </div>
              <input
                type="checkbox"
                checked={operatorIncluded}
                onChange={(e) => setOperatorIncluded(e.target.checked)}
                className="w-4 h-4 text-[#166534] rounded-xs cursor-pointer"
              />
            </div>

            {operatorIncluded && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                {(pricingUnit === 'PER_HECTARE' || pricingUnit === 'BOTH') && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Operator Fee (₹ / hectare)
                    </label>
                    <input
                      type="number"
                      step={50}
                      value={operatorCostPerHectare}
                      onChange={(e) => setOperatorCostPerHectare(Number(e.target.value))}
                      placeholder="e.g. 400"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                )}
                {(pricingUnit === 'PER_HOUR' || pricingUnit === 'BOTH') && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Operator Fee (₹ / hour)
                    </label>
                    <input
                      type="number"
                      step={25}
                      value={operatorCostPerHour}
                      onChange={(e) => setOperatorCostPerHour(Number(e.target.value))}
                      placeholder="e.g. 150"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <ImageUpload images={images} onChange={setImages} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-sm font-bold shadow-md transition-all disabled:opacity-50"
        >
          {submitting ? t('addEq.submitting') : t('addEq.submit')}
        </button>

      </form>

    </div>
  );
};
