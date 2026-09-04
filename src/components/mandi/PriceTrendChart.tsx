import React from 'react';
import { MandiPrice } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, MapPin, Calendar } from 'lucide-react';

interface PriceTrendChartProps {
  selectedItem: MandiPrice;
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ selectedItem }) => {
  const isPositive = selectedItem.changePercent >= 0;
  const modal = selectedItem.modalPrice ?? selectedItem.currentPrice;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white bg-[#166534] px-2 py-0.5 rounded-full uppercase tracking-wider">
              7-Day Price Trend
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#166534]" />
              {selectedItem.mandiName}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            {selectedItem.commodity}
          </h2>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Today's Rate</span>
          <div className="text-2xl font-black text-[#166534] flex items-center gap-2">
            <span>₹{modal.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">/ quintal</span></span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-0.5 ${
              isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {isPositive ? '+' : ''}{selectedItem.changePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={selectedItem.trendHistory} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} />
            <YAxis domain={['auto', 'auto']} stroke="#64748B" fontSize={12} tickLine={false} width={50} />
            <Tooltip
              contentStyle={{ backgroundColor: '#166534', color: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
              formatter={(value: any) => [`₹${value.toLocaleString('en-IN')} / Quintal`, 'Market Rate']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#166534"
              strokeWidth={3.5}
              dot={{ fill: '#65A30D', r: 5 }}
              activeDot={{ r: 8, fill: '#166534' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Summary Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Last Updated: <strong className="text-slate-800">{selectedItem.updatedAt}</strong></span>
        </div>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          Source: Official Govt. Data Portal (data.gov.in API)
        </span>
      </div>

    </div>
  );
};
