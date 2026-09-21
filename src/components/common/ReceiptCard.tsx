import React from 'react';
import { Receipt } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Tractor, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ReceiptCardProps {
  receipt: Receipt;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({ receipt }) => {
  const { t } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xl space-y-6 print:p-0 print:border-none print:shadow-none print:m-0">
      
      {/* Receipt Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#166534] text-white flex items-center justify-center font-bold shadow-md">
            <Tractor className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-[#166534] block leading-tight tracking-tight">
              KRUSHI CONNECT
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('receipts.officialReceipt')}
            </span>
          </div>
        </div>

        <div className="text-left sm:text-right space-y-0.5">
          <div className="text-xs text-slate-500 uppercase font-semibold">{t('receipts.receiptNumber')}</div>
          <div className="text-base font-mono font-black text-slate-900">{receipt.id}</div>
          <div className="text-xs text-slate-500">{t('receipts.date')}: <strong className="text-slate-800">{new Date(receipt.createdAt).toLocaleDateString()}</strong></div>
        </div>
      </div>

      {/* Lessor & Lessee Party Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
        
        {/* Owner Info */}
        <div className="space-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#166534] block mb-1">
            {t('receipts.lessor')}
          </span>
          <div className="text-sm font-bold text-slate-900">{receipt.ownerName}</div>
          <div className="text-xs text-slate-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{t('receipts.verifiedOwner')}</span>
          </div>
        </div>

        {/* Farmer Info */}
        <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#166534] block mb-1">
            {t('receipts.lessee')}
          </span>
          <div className="text-sm font-bold text-slate-900">{receipt.farmerName}</div>
          <div className="text-xs text-slate-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{t('receipts.registeredFarmer')}</span>
          </div>
        </div>

      </div>

      {/* Itemized Line Table */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
          {t('receipts.lineItems')}
        </h4>

        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">{t('receipts.description')}</th>
                <th className="p-3.5">{t('receipts.dates')}</th>
                <th className="p-3.5 text-right">{t('receipts.amount')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr>
                <td className="p-3.5 font-bold text-slate-900">{receipt.equipmentName}</td>
                <td className="p-3.5 text-slate-600">{receipt.startDate} {t('common.toDate')} {receipt.endDate}</td>
                <td className="p-3.5 text-right font-bold text-slate-900">₹{receipt.subtotal.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="p-3.5 text-slate-600" colSpan={2}>{t('receipts.platformFee')}</td>
                <td className="p-3.5 text-right font-semibold text-slate-800">₹{receipt.platformFee.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="p-3.5 text-slate-600" colSpan={2}>{t('receipts.tax')}</td>
                <td className="p-3.5 text-right font-semibold text-slate-800">₹{receipt.tax.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
            <tfoot className="bg-emerald-50 text-[#166534] font-black text-sm border-t border-emerald-200">
              <tr>
                <td className="p-4" colSpan={2}>{t('receipts.grandTotal')}</td>
                <td className="p-4 text-right text-lg">₹{receipt.total.toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Payment Confirmation Footer & Print Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{t('receipts.paidVia')}</span>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all print:hidden"
        >
          <Printer className="w-4 h-4" />
          <span>{t('receipts.print')}</span>
        </button>
      </div>

    </div>
  );
};
