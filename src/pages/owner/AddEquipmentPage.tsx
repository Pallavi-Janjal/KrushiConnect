import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { EquipmentCategory } from '../../types';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { INDIAN_STATES, STATE_DISTRICTS_MAP } from '../../data/indiaLocations';
import { ImageUpload } from '../../components/common/ImageUpload';

export const AddEquipmentPage: React.FC = () => {
  const { user } = useAuth();
  const { addEquipment } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<EquipmentCategory>('Tractor');
  const [brand, setBrand] = useState('Mahindra');
  const [model, setModel] = useState('');
  const [hp, setHp] = useState(45);
  const [fuelType] = useState('Diesel');
  const [description, setDescription] = useState('');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Chhatrapati Sambhajinagar');
  const [pricePerDay, setPricePerDay] = useState(2500);
  const [operatorIncluded, setOperatorIncluded] = useState(true);
  const [operatorCostPerDay, setOperatorCostPerDay] = useState(500);
  const [images, setImages] = useState<string[]>([]);

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const districts = STATE_DISTRICTS_MAP[stateName] || [];
    setSelectedDistrict(districts[0] || '');
  };


  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!name || !description || !pricePerDay) {
      setError(t('booking.errorContact'));
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const finalImages = images.length > 0 
        ? images 
        : ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'];

      await addEquipment({
        ownerId: user.id,
        ownerName: user.name,
        ownerPhone: user.phone,
        name,
        category,
        brand,
        model: model || `${brand} Standard`,
        hp: Number(hp),
        fuelType,
        description,
        location: `${selectedDistrict}, ${selectedState}`,
        state: selectedState,
        pricePerDay: Number(pricePerDay),
        operatorIncluded,
        operatorCostPerDay: operatorIncluded ? Number(operatorCostPerDay) : 0,
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('addEq.category')}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
              >
                <option value="Tractor">Tractor</option>
                <option value="Harvester">Harvester</option>
                <option value="Seeder">Seeder</option>
                <option value="Sprayer">Sprayer</option>
                <option value="Rotavator">Rotavator</option>
                <option value="Cultivator">Cultivator</option>
                <option value="Tiller">Power Tiller</option>
              </select>
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
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">{t('addEq.description')} & {t('addEq.location')}</h3>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('addEq.state')}</label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                required
              >
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('addEq.location')}</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                required
              >
                {(STATE_DISTRICTS_MAP[selectedState] || []).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Operator Options */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">{t('addEq.pricePerDay')}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('addEq.pricePerDay')}</label>
              <input
                type="number"
                step={100}
                value={pricePerDay}
                onChange={(e) => setPricePerDay(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-[#166534]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">{t('addEq.operatorIncluded')}</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={operatorIncluded}
                  onChange={(e) => setOperatorIncluded(e.target.checked)}
                  className="w-4 h-4 text-[#166534]"
                />
                <span className="text-xs font-medium text-slate-800">{t('booking.includeOperator')}</span>
              </div>
              {operatorIncluded && (
                <input
                  type="number"
                  step={50}
                  value={operatorCostPerDay}
                  onChange={(e) => setOperatorCostPerDay(Number(e.target.value))}
                  placeholder={t('addEq.operatorCostPerDay')}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs"
                />
              )}
            </div>
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
