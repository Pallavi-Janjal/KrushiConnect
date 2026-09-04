import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { equipmentService } from '../../services/equipmentService';
import { Equipment } from '../../types';
import { Tractor, PlusCircle, Trash2, ToggleLeft, ToggleRight, MapPin, Zap, Pencil } from 'lucide-react';
import { EditEquipmentModal } from '../../components/equipment/EditEquipmentModal';
import { RatingStars } from '../../components/common/RatingStars';

export const MyEquipmentPage: React.FC = () => {
  const { user } = useAuth();
  const { equipment, toggleEquipmentAvailability, deleteEquipment } = useApp();
  const { t } = useLanguage();

  const [ownerEquipment, setOwnerEquipment] = React.useState<Equipment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedEditEquipment, setSelectedEditEquipment] = React.useState<Equipment | null>(null);

  const loadOwnerEquipment = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Primary: fetch from backend by ownerId
      const list = await equipmentService.getOwnerEquipment(user.id);
      
      // 2. Fallback: filter global equipment context by ownerId or matching name/phone if backend filter had ID type mismatch
      const globalMatches = equipment.filter(
        item => item.ownerId === user.id || item.ownerName === user.name
      );

      // Merge & deduplicate by ID
      const map = new Map<string, Equipment>();
      list.forEach(item => map.set(item.id, item));
      globalMatches.forEach(item => map.set(item.id, item));

      setOwnerEquipment(Array.from(map.values()));
    } catch (err) {
      console.error('Failed to fetch owner equipment:', err);
      const fallback = equipment.filter(
        item => item.ownerId === user?.id || item.ownerName === user?.name
      );
      setOwnerEquipment(fallback);
    } finally {
      setLoading(false);
    }
  }, [user, equipment]);

  React.useEffect(() => {
    loadOwnerEquipment();
  }, [loadOwnerEquipment]);

  const handleToggle = async (id: string) => {
    await toggleEquipmentAvailability(id);
    loadOwnerEquipment();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('myEq.deleteConfirm'))) {
      await deleteEquipment(id);
      loadOwnerEquipment();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#166534]">{t('myEq.badge')}</span>
          <h1 className="text-3xl font-extrabold text-slate-900">{t('myEq.title')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('myEq.subtitle')}</p>
        </div>

        <Link
          to="/owner/equipment/add"
          className="px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('myEq.addNew')}</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
          ))}
        </div>
      ) : ownerEquipment.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3 max-w-md mx-auto">
          <Tractor className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">{t('myEq.noEquipment')}</h3>
          <p className="text-xs text-slate-500">You haven't listed any equipment yet. Click below to add your first tractor or harvester.</p>
          <Link to="/owner/equipment/add" className="inline-block px-4 py-2 rounded-lg bg-[#166534] text-white text-xs font-bold">
            {t('myEq.addNew')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownerEquipment.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs space-y-3 flex flex-col justify-between">
              
              <div>
                <div className="relative h-44 w-full bg-slate-100">
                  <img src={item.images[0] || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&q=80&w=600'} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#166534] text-white">
                      {t(`cat.${item.category}`) || item.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 shadow-xs ${
                        item.isAvailable ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {item.isAvailable ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-rose-600" />}
                      <span>{item.isAvailable ? t('myEq.available') : t('myEq.unavailable')}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">{item.name}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <RatingStars rating={item.rating || 4.5} reviewCount={item.reviewCount || 0} size={14} />
                    <span className="font-semibold text-slate-700 flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-500" /> {item.hp} {t('common.hp')}</span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#166534]" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">{t('market.rentalRate')}</div>
                  <div className="text-base font-extrabold text-[#166534]">₹{item.pricePerDay.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500"> {t('market.perDay')}</span></div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedEditEquipment(item)}
                    className="p-2 rounded-lg border border-amber-200 text-amber-600 hover:bg-amber-50 text-xs font-semibold"
                    title={t('common.edit') || 'Edit'}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
                    title={t('myEq.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Edit Equipment Modal */}
      {selectedEditEquipment && (
        <EditEquipmentModal
          equipment={selectedEditEquipment}
          isOpen={!!selectedEditEquipment}
          onClose={() => setSelectedEditEquipment(null)}
          onUpdated={() => loadOwnerEquipment()}
        />
      )}

    </div>
  );
};
