import React, { useState } from 'react';
import { Equipment, EquipmentCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, AlertCircle, Save, CheckCircle2 } from 'lucide-react';
import { INDIAN_STATES, STATE_DISTRICTS_MAP } from '../../data/indiaLocations';
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
  const existingDistrict = equipment.location?.split(',')[0]?.trim() || 'Chhatrapati Sambhajinagar';

  const [selectedState, setSelectedState] = useState(existingState);
  const [selectedDistrict, setSelectedDistrict] = useState(existingDistrict);

  const [pricePerDay, setPricePerDay] = useState(equipment.pricePerDay);
  const [operatorIncluded, setOperatorIncluded] = useState(equipment.operatorIncluded);
  const [operatorCostPerDay, setOperatorCostPerDay] = useState(equipment.operatorCostPerDay);
  const [images, setImages] = useState<string[]>(equipment.images || []);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const districts = STATE_DISTRICTS_MAP[stateName] || [];
    setSelectedDistrict(districts[0] || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !pricePerDay) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const formattedLocation = `${selectedDistrict}, ${selectedState}`;

      const updateData: Partial<Equipment> = {
        name: name.trim(),
        category,
        brand: brand.trim(),
        model: model.trim() || `${brand} Standard`,
        hp: Number(hp),
        fuelType,
        description: description.trim(),
        state: selectedState,
        location: formattedLocation,
        pricePerDay: Number(pricePerDay),
        operatorIncluded,
        operatorCostPerDay: operatorIncluded ? Number(operatorCostPerDay) : 0,
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

          {/* Location: State & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('addEq.state')}
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
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
                {t('addEq.location')}
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
              >
                {(STATE_DISTRICTS_MAP[selectedState] || []).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rental Rate & Operator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('addEq.pricePerDay')}
              </label>
              <input
                type="number"
                step="50"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-[#166534] focus:ring-2 focus:ring-[#166534] focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                {t('addEq.operatorIncluded')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={operatorIncluded}
                  onChange={(e) => setOperatorIncluded(e.target.checked)}
                  className="w-4 h-4 text-[#166534] rounded-xs"
                />
                <span className="text-xs text-slate-700">
                  {t('booking.includeOperator')}
                </span>
              </div>
              {operatorIncluded && (
                <input
                  type="number"
                  step="50"
                  value={operatorCostPerDay}
                  onChange={(e) => setOperatorCostPerDay(Number(e.target.value))}
                  placeholder={t('addEq.operatorCostPerDay')}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
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
