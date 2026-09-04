import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { maintenanceService } from '../../services/maintenanceService';
import { equipmentService } from '../../services/equipmentService';
import { MaintenanceRecord, MaintenanceHealth } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Plus } from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [ownerEquipment, setOwnerEquipment] = useState<any[]>([]);
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedEqId, setSelectedEqId] = useState('');
  const [healthStatus, setHealthStatus] = useState<MaintenanceHealth>('Healthy');
  const [serviceType, setServiceType] = useState('Routine Engine Oil & Filter Service');
  const [lastServiceDate, setLastServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextServiceDueDate, setNextServiceDueDate] = useState(new Date(Date.now() + 60*24*60*60*1000).toISOString().split('T')[0]);
  const [cost, setCost] = useState(4500);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (user) {
      equipmentService.getOwnerEquipment(user.id).then(eqList => {
        setOwnerEquipment(eqList);
        if (eqList.length > 0 && !selectedEqId) {
          setSelectedEqId(eqList[0].id);
        }
      });
    }
    maintenanceService.getMaintenanceRecords().then(recList => setRecords(recList));
  }, [user]);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const eq = ownerEquipment.find(e => e.id === selectedEqId) || ownerEquipment[0];
    if (!eq) return;

    const newRecord = await maintenanceService.addRecord({
      equipmentId: eq.id,
      equipmentName: eq.name,
      healthStatus,
      lastServiceDate,
      nextServiceDueDate,
      serviceType,
      cost: Number(cost),
      notes,
      status: 'Scheduled'
    });

    setRecords([newRecord, ...records]);
    setShowAddModal(false);
  };

  const handleMarkCompleted = async (id: string) => {
    const updated = await maintenanceService.updateRecordStatus(id, 'Completed', 'Healthy');
    setRecords(records.map(r => r.id === id ? updated : r));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#166534]">{t('maint.badge')}</span>
          <h1 className="text-3xl font-extrabold text-slate-900">{t('maint.title')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('maint.subtitle')}</p>
        </div>

        <button
          onClick={() => setShowAddModal(!showAddModal)}
          className="px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-xs font-bold shadow-md flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>{t('maint.addLog')}</span>
        </button>
      </div>

      {showAddModal && (
        <form onSubmit={handleAddRecord} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-md space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">{t('maint.addLog')}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('usage.selectMachine')}</label>
              <select
                value={selectedEqId}
                onChange={(e) => setSelectedEqId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
              >
                {ownerEquipment.map(eq => (
                  <option key={eq.id} value={eq.id}>{eq.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('maint.health')}</label>
              <select
                value={healthStatus}
                onChange={(e) => setHealthStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
              >
                <option value="Healthy">{t('maint.healthy')}</option>
                <option value="Due Soon">{t('maint.dueSoon')}</option>
                <option value="Maintenance">{t('maint.maintenance')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('maint.logType')}</label>
              <input
                type="text"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('maint.lastService')}</label>
              <input
                type="date"
                value={lastServiceDate}
                onChange={(e) => setLastServiceDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('maint.nextService')}</label>
              <input
                type="date"
                value={nextServiceDueDate}
                onChange={(e) => setNextServiceDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('maint.logCost')}</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('maint.logNotes')}</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Hydraulic filter changed"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <button type="submit" className="px-6 py-2.5 bg-[#166534] text-white text-xs font-bold rounded-lg shadow-sm">
            {t('maint.save')}
          </button>
        </form>
      )}

      {/* Health Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {records.map(rec => (
          <div key={rec.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{rec.equipmentName}</span>
              <Badge status={rec.healthStatus} />
            </div>

            <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl">
              <div><strong className="text-slate-900">{t('maint.logType')}:</strong> {rec.serviceType}</div>
              <div><strong className="text-slate-900">{t('maint.lastService')}:</strong> {rec.lastServiceDate}</div>
              <div><strong className="text-slate-900">{t('maint.nextService')}:</strong> {rec.nextServiceDueDate}</div>
              <div><strong className="text-slate-900">{t('maint.logCost')}:</strong> ₹{rec.cost.toLocaleString('en-IN')}</div>
              {rec.notes && <div><strong className="text-slate-900">{t('maint.logNotes')}:</strong> {rec.notes}</div>}
            </div>

            {rec.status !== 'Completed' && (
              <button
                onClick={() => handleMarkCompleted(rec.id)}
                className="w-full py-2 rounded-lg bg-emerald-50 text-[#166534] hover:bg-emerald-100 text-xs font-bold border border-emerald-200"
              >
                {t('plan.completed')}
              </button>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
