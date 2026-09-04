import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { usageService } from '../../services/usageService';
import { equipmentService } from '../../services/equipmentService';
import { UsageLog } from '../../types';
import { Plus } from 'lucide-react';

export const UsageLoggingPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [ownerEquipment, setOwnerEquipment] = useState<any[]>([]);
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [selectedEqId, setSelectedEqId] = useState('');
  const [hoursUsed, setHoursUsed] = useState(8);
  const [fuelConsumedLiters, setFuelConsumedLiters] = useState(25);
  const [acresCovered, setAcresCovered] = useState(12);
  const [operatorName, setOperatorName] = useState('Gurdeep Singh');
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
    usageService.getUsageLogs().then(logList => setLogs(logList));
  }, [user]);

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    const eq = ownerEquipment.find(e => e.id === selectedEqId) || ownerEquipment[0];
    if (!eq) return;

    const newLog = await usageService.addUsageLog({
      equipmentId: eq.id,
      equipmentName: eq.name,
      date: new Date().toISOString().split('T')[0],
      hoursUsed: Number(hoursUsed),
      fuelConsumedLiters: Number(fuelConsumedLiters),
      acresCovered: Number(acresCovered),
      operatorName,
      notes
    });

    setLogs([newLog, ...logs]);
    setShowForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#166534]">{t('usage.badge')}</span>
          <h1 className="text-3xl font-extrabold text-slate-900">{t('usage.title')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('usage.subtitle')}</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-[#166534] text-white text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{t('usage.addLog')}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddLog} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-md space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">{t('usage.addLog')}</h3>

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
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('usage.engineHours')}</label>
              <input
                type="number"
                step={0.5}
                value={hoursUsed}
                onChange={(e) => setHoursUsed(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('usage.fuelConsumed')}</label>
              <input
                type="number"
                value={fuelConsumedLiters}
                onChange={(e) => setFuelConsumedLiters(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('usage.acresCovered')}</label>
              <input
                type="number"
                value={acresCovered}
                onChange={(e) => setAcresCovered(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('usage.operatorName')}</label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('usage.notes')}</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Smooth operation"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <button type="submit" className="px-6 py-2.5 bg-[#166534] text-white text-xs font-bold rounded-lg shadow-sm">
            {t('usage.save')}
          </button>
        </form>
      )}

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-900 text-base">{t('usage.history')}</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">{t('usage.date')}</th>
                <th className="p-3.5">{t('usage.equipment')}</th>
                <th className="p-3.5">{t('usage.hours')}</th>
                <th className="p-3.5">{t('usage.fuel')}</th>
                <th className="p-3.5">{t('usage.acres')}</th>
                <th className="p-3.5">{t('usage.operator')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="p-3.5 font-bold">{log.date}</td>
                  <td className="p-3.5 font-semibold text-slate-900">{log.equipmentName}</td>
                  <td className="p-3.5 font-bold text-[#166534]">{log.hoursUsed} {t('common.hours')}</td>
                  <td className="p-3.5">{log.fuelConsumedLiters} {t('common.liters')}</td>
                  <td className="p-3.5">{log.acresCovered} {t('common.acres')}</td>
                  <td className="p-3.5 font-medium">{log.operatorName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
