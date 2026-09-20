import React, { useState } from 'react';
import { Equipment, EquipmentCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, AlertCircle, Save, CheckCircle2 } from 'lucide-react';
import { INDIAN_STATES, STATE_DISTRICTS_MAP, getTalukasForDistrict } from '../../data/indiaLocations';
import { ImageUpload } from '../common/ImageUpload';

interface EditEquipmentModalProps {
  equipment: Equipment;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updated: Equipment) => void;
}

const CATEGORIES: EquipmentCategory[] = [
  'Tractor',
  'Harvester',
  'Seeder',
  'Sprayer',
  'Tiller',
  'Rotavator',
  'Cultivator',
  'Balers',
  'Thresher',
  'Other'
];

export const EditEquipmentModal: React.FC<EditEquipmentModalProps> = ({
  equipment,
  isOpen,
  onClose,
  onUpdated
}) => {
  const { updateEquipment } = useApp();
  const { t } = useLanguage();

  const [name, setName] = useState(equipment.name);
  const [category, setCategory] = useState<EquipmentCategory>(equipment.category);
  const [brand, setBrand] = useState(equipment.brand);
  const [model, setModel] = useState(equipment.model);
  const [hp, setHp] = useState(equipment.hp);
  const [fuelType, setFuelType] = useState(equipment.fuelType);
  const [description, setDescription] = useState(equipment.description);

  // Parse existing location or fallback
  const existingState = equipment.state || 'Maharashtra';
  const existingDistrict = equipment.district || equipment.location?.split(',')[0]?.trim() || 'Chhatrapati Sambhajinagar';
  const existingTaluka = equipment.taluka || '';
  const existingVillage = equipment.village || '';

  const [selectedState, setSelectedState] = useState(existingState);
  const [selectedDistrict, setSelectedDistrict] = useState(existingDistrict);
  const talukasForDistrict = getTalukasForDistrict(selectedDistrict);
  const [selectedTaluka, setSelectedTaluka] = useState(
    existingTaluka && (talukasForDistrict.includes(existingTaluka) || !talukasForDistrict.length)
      ? existingTaluka
      : existingTaluka ? 'OTHER' : (talukasForDistrict[0] || '')
  );
  const [customTaluka, setCustomTaluka] = useState(
    existingTaluka && !talukasForDistrict.includes(existingTaluka) ? existingTaluka : ''
  );
  const [village, setVillage] = useState(existingVillage);

  const [pricePerDay, setPricePerDay] = useState(equipment.pricePerDay);
  const [pricingUnit, setPricingUnit] = useState<'PER_HECTARE' | 'PER_HOUR' | 'BOTH'>(
    equipment.pricingUnit || (equipment.pricePerHour && !equipment.pricePerHectare ? 'PER_HOUR' : 'PER_HECTARE')
  );
  const [pricePerHectare, setPricePerHectare] = useState(equipment.pricePerHectare || equipment.pricePerDay || 2000);
  const [pricePerHour, setPricePerHour] = useState(equipment.pricePerHour || 600);
  const [operatorIncluded, setOperatorIncluded] = useState(equipment.operatorIncluded);
  const [operatorCostPerHectare, setOperatorCostPerHectare] = useState(equipment.operatorCostPerDay || 400);
  const [operatorCostPerHour, setOperatorCostPerHour] = useState(equipment.operatorCostPerHour || 150);
  const [images, setImages] = useState<string[]>(equipment.images || []);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveTaluka = selectedTaluka === 'OTHER' || talukasForDistrict.length === 0 ? customTaluka.trim() : selectedTaluka.trim();

    if (!name.trim() || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!selectedDistrict || !effectiveTaluka || !village.trim()) {
      setError('Please provide State, District, Taluka, and Village for equipment location.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const locParts = [village.trim(), effectiveTaluka, selectedDistrict, selectedState].filter(Boolean);
      const formattedLocation = locParts.join(', ');
      const primaryRate = pricingUnit === 'PER_HOUR' ? Number(pricePerHour) : Number(pricePerHectare);

      const updateData: Partial<Equipment> = {
        name: name.trim(),
        category,
        brand: brand.trim(),
        model: model.trim() || `${brand} Standard`,
        hp: Number(hp),
        fuelType,
        description: description.trim(),
        state: selectedState,
        district: selectedDistrict,
        taluka: effectiveTaluka,
        village: village.trim(),
        location: formattedLocation,
        pricePerDay: primaryRate,
        pricePerHectare: Number(pricePerHectare),
        pricePerHour: Number(pricePerHour),
        pricingUnit,
        operatorIncluded,
        operatorCostPerDay: operatorIncluded ? Number(operatorCostPerHectare) : 0,
        operatorCostPerHour: operatorIncluded ? Number(operatorCostPerHour) : 0,
        images: images.length > 0 ? images : equipment.images,
        specifications: {
          ...equipment.specifications,
          Horsepower: `${hp} HP`,
          'Fuel Type': fuelType,
          Brand: brand,
          Model: model || 'Standard'
        }
      };

      const updated = await updateEquipment(equipment.id, updateData);
      setSuccess(true);
      setTimeout(() => {
        onUpdated(updated);
        onClose();
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Failed to update equipment details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#166534] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-bold text-white">
              {t('editEq.title') || 'Edit Equipment Details'}
            </h3>
            <p className="text-xs text-emerald-200">
              Update machinery specifications, rental rate, and photos
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Changes saved successfully to database!</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('addEq.equipmentName')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#166534] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('addEq.category')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EquipmentCategory)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-medium focus:ring-2 focus:ring-[#166534] focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {t(`cat.${cat}`) || cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Brand, Model, HP, Fuel */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('addEq.brand')}
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('addEq.model')}
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('addEq.hp')}
              </label>
              <input
                type="number"
                value={hp}
                onChange={(e) => setHp(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
              >
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('addEq.description')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none"
              required
            />
          </div>

          {/* Location: State, District, Taluka, Village */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('addEq.state')} *
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
                required
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('addEq.district')} *
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
                required
              >
                {(STATE_DISTRICTS_MAP[selectedState] || []).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('addEq.taluka')} *
              </label>
              {talukasForDistrict.length > 0 ? (
                <div className="space-y-1">
                  <select
                    value={selectedTaluka}
                    onChange={(e) => setSelectedTaluka(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
                    required
                  >
                    {talukasForDistrict.map((tal) => (
                      <option key={tal} value={tal}>
                        {tal}
                      </option>
                    ))}
                    <option value="OTHER">✏️ Other (Enter manually)</option>
                  </select>
                  {selectedTaluka === 'OTHER' && (
                    <input
                      type="text"
                      value={customTaluka}
                      onChange={(e) => setCustomTaluka(e.target.value)}
                      placeholder="Type taluka"
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
                  placeholder="Enter Taluka"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('addEq.village')} *
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Shivoor, Pachod"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Rental Rates & Operator */}
          <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pricing Basis *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPricingUnit('PER_HECTARE')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                    pricingUnit === 'PER_HECTARE'
                      ? 'bg-emerald-50 border-[#166534] text-[#166534] shadow-xs ring-1 ring-[#166534]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>🚜 Per Hectare</span>
                  <span className="text-[10px] font-normal text-slate-500">Per ha</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPricingUnit('PER_HOUR')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                    pricingUnit === 'PER_HOUR'
                      ? 'bg-emerald-50 border-[#166534] text-[#166534] shadow-xs ring-1 ring-[#166534]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>⏱️ Per Hour</span>
                  <span className="text-[10px] font-normal text-slate-500">Per hour</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPricingUnit('BOTH')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                    pricingUnit === 'BOTH'
                      ? 'bg-emerald-50 border-[#166534] text-[#166534] shadow-xs ring-1 ring-[#166534]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>✨ Both</span>
                  <span className="text-[10px] font-normal text-slate-500">Flexible</span>
                </button>
              </div>
            </div>

            {/* Rate Input Fields based on selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(pricingUnit === 'PER_HECTARE' || pricingUnit === 'BOTH') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rate Per Hectare (₹ / ha) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">₹</span>
                    <input
                      type="number"
                      step={50}
                      min={100}
                      value={pricePerHectare}
                      onChange={(e) => setPricePerHectare(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-[#166534] focus:ring-2 focus:ring-[#166534] focus:outline-none bg-white"
                      placeholder="e.g. 2000"
                      required
                    />
                  </div>
                </div>
              )}

              {(pricingUnit === 'PER_HOUR' || pricingUnit === 'BOTH') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rate Per Hour (₹ / hr) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">₹</span>
                    <input
                      type="number"
                      step={50}
                      min={50}
                      value={pricePerHour}
                      onChange={(e) => setPricePerHour(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-[#166534] focus:ring-2 focus:ring-[#166534] focus:outline-none bg-white"
                      placeholder="e.g. 600"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Operator Details */}
            <div className="pt-2 border-t border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-900 block">{t('addEq.operatorIncluded')}</label>
                  <span className="text-[11px] text-slate-500">{t('booking.includeOperator')}</span>
                </div>
                <input
                  type="checkbox"
                  checked={operatorIncluded}
                  onChange={(e) => setOperatorIncluded(e.target.checked)}
                  className="w-4 h-4 text-[#166534] rounded-xs cursor-pointer"
                />
              </div>

              {operatorIncluded && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {(pricingUnit === 'PER_HECTARE' || pricingUnit === 'BOTH') && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Operator Fee (₹ / ha)
                      </label>
                      <input
                        type="number"
                        step={50}
                        value={operatorCostPerHectare}
                        onChange={(e) => setOperatorCostPerHectare(Number(e.target.value))}
                        placeholder="e.g. 400"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  )}
                  {(pricingUnit === 'PER_HOUR' || pricingUnit === 'BOTH') && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Operator Fee (₹ / hr)
                      </label>
                      <input
                        type="number"
                        step={25}
                        value={operatorCostPerHour}
                        onChange={(e) => setOperatorCostPerHour(Number(e.target.value))}
                        placeholder="e.g. 150"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Photos Upload */}
          <div>
            <ImageUpload images={images} onChange={setImages} maxImages={5} />
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : (t('editEq.save') || 'Save Changes')}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
