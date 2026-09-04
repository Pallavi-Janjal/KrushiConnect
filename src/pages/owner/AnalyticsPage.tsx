import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { analyticsService } from '../../services/analyticsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const analytics = analyticsService.getOwnerAnalytics(user?.id || '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#166534]">{t('analytics.badge')}</span>
        <h1 className="text-3xl font-extrabold text-slate-900">{t('analytics.title')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('analytics.subtitle')}</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-2">
          <div className="text-xs font-semibold text-slate-500">{t('analytics.grossEarnings')}</div>
          <div className="text-3xl font-black text-[#166534]">₹{analytics.totalEarnings.toLocaleString('en-IN')}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-2">
          <div className="text-xs font-semibold text-slate-500">{t('analytics.avgUtilization')}</div>
          <div className="text-3xl font-black text-amber-600">{analytics.utilizationRate}%</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-2">
          <div className="text-xs font-semibold text-slate-500">{t('analytics.activeMachinery')}</div>
          <div className="text-3xl font-black text-slate-900">{analytics.totalEquipmentCount}</div>
        </div>
      </div>

      {/* Monthly Revenue Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">{t('analytics.monthlyRevenue')}</h3>
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#166534', color: '#fff', borderRadius: '12px', border: 'none' }}
                formatter={(val: any) => [`₹${val.toLocaleString('en-IN')}`, 'Net Earnings']}
              />
              <Bar dataKey="earnings" fill="#166534" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Machine Revenue Comparison Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">{t('analytics.machineRevenue')}</h3>
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.equipmentPerformanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis type="number" stroke="#64748B" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} width={160} />
              <Tooltip
                contentStyle={{ backgroundColor: '#004C22', color: '#fff', borderRadius: '12px', border: 'none' }}
                formatter={(val: any) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#65A30D" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
