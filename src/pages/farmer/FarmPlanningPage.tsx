import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { planningService } from '../../services/planningService';
import { FarmPlan } from '../../types';
import { Calendar, Plus, Trash2, Tractor } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FarmPlanningPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [plans, setPlans] = useState<FarmPlan[]>(() => user ? planningService.getFarmerPlans(user.id) : []);

  const [showAddForm, setShowAddForm] = useState(false);
  const [cropName, setCropName] = useState('Wheat (PBW 550)');
  const [landAreaAcres, setLandAreaAcres] = useState(15);
  const [activity, setActivity] = useState('Deep Plowing & Land Tilling');
  const [requiredEquipmentCategory, setRequiredEquipmentCategory] = useState('Tractor');
  const [plannedStartDate, setPlannedStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [plannedEndDate, setPlannedEndDate] = useState(new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newPlan = await planningService.createPlan({
      farmerId: user.id,
      cropName,
      landAreaAcres,
      activity,
      requiredEquipmentCategory,
      plannedStartDate,
      plannedEndDate,
      status: 'PLANNED',
      notes
    });

    setPlans([newPlan, ...plans]);
    setShowAddForm(false);
    setNotes('');
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PLANNED' ? 'IN_PROGRESS' : currentStatus === 'IN_PROGRESS' ? 'COMPLETED' : 'PLANNED';
    const updated = await planningService.updatePlanStatus(id, nextStatus as any);
    setPlans(plans.map(p => p.id === id ? updated : p));
  };

  const handleDeletePlan = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this farm activity plan?')) {
      await planningService.deletePlan(id);
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#166534]">{t('plan.badge')}</span>
          <h1 className="text-3xl font-extrabold text-slate-900">{t('plan.title')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('plan.subtitle')}</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? t('common.close') : t('plan.addActivity')}</span>
        </button>
      </div>

      {/* Add Plan Form */}
      {showAddForm && (
        <form onSubmit={handleAddPlan} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-md space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">{t('plan.addActivity')}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('plan.cropName')}</label>
              <input
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g. Wheat PBW 550"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('smart.plotAcreage')}</label>
              <input
                type="number"
                value={landAreaAcres}
                onChange={(e) => setLandAreaAcres(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('plan.equipmentNeeded')}</label>
              <select
                value={requiredEquipmentCategory}
                onChange={(e) => setRequiredEquipmentCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
              >
                <option value="Tractor">Tractor</option>
                <option value="Harvester">Harvester</option>
                <option value="Seeder">Seeder</option>
                <option value="Sprayer">Sprayer</option>
                <option value="Rotavator">Rotavator</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('plan.activity')}</label>
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="e.g. Land Preparation"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('plan.startDate')}</label>
              <input
                type="date"
                value={plannedStartDate}
                onChange={(e) => setPlannedStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('plan.endDate')}</label>
              <input
                type="date"
                value={plannedEndDate}
                onChange={(e) => setPlannedEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('plan.notes')}</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Require high torque tractor"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#166534] text-white text-xs font-bold rounded-lg shadow-sm"
          >
            {t('plan.save')}
          </button>
        </form>
      )}

      {/* Plans List */}
      <div className="space-y-4">
        {plans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm text-slate-500">{t('plan.noPlans')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {p.cropName} ({p.landAreaAcres} {t('common.acres')})
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1">{p.activity}</h3>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(p.id, p.status)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold cursor-pointer border ${
                      p.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      p.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                      'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {p.status === 'COMPLETED' ? t('plan.completed') : p.status === 'IN_PROGRESS' ? t('plan.inProgress') : t('plan.planned')}
                  </button>
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl">
                  <div><strong className="text-slate-900">{t('receipts.dates')}:</strong> {p.plannedStartDate} {t('common.toDate')} {p.plannedEndDate}</div>
                  <div><strong className="text-slate-900">{t('plan.equipmentNeeded')}:</strong> {p.requiredEquipmentCategory}</div>
                  {p.notes && <div><strong className="text-slate-900">{t('plan.notes')}:</strong> {p.notes}</div>}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Link
                    to={`/equipment?category=${encodeURIComponent(p.requiredEquipmentCategory)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#166534] hover:underline"
                  >
                    <Tractor className="w-3.5 h-3.5" />
                    <span>{t('market.catalogBtn')} →</span>
                  </Link>

                  <button
                    onClick={() => handleDeletePlan(p.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
