import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { bookingService } from '../../services/bookingService';
import { ReceiptCard } from '../../components/common/ReceiptCard';
import { Receipt } from '../../types';
import { FileText, Tractor, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FarmerReceiptsPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [farmerReceipts, setFarmerReceipts] = useState<Receipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  React.useEffect(() => {
    const fetchReceipts = async () => {
      if (!user) return;
      try {
        const [allReceipts, farmerBookings] = await Promise.all([
          bookingService.getReceipts(),
          bookingService.getFarmerBookings(user.id)
        ]);
        const farmerBookingIds = new Set(farmerBookings.map(b => b.id));
        const filtered = allReceipts.filter(r => farmerBookingIds.has(r.bookingId) || r.farmerName === user.name);
        setFarmerReceipts(filtered);
        if (filtered.length > 0) setSelectedReceipt(filtered[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReceipts();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#166534]">{t('nav.receipts')}</span>
        <h1 className="text-3xl font-extrabold text-slate-900">{t('receipts.title')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('receipts.subtitle')}</p>
      </div>

      {farmerReceipts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center my-6 max-w-md mx-auto space-y-3 shadow-xs">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">{t('receipts.noReceipts')}</h3>
          <p className="text-xs text-slate-500">Rent machinery from the marketplace to generate official receipts.</p>
          <Link to="/equipment" className="inline-block px-4 py-2 rounded-xl bg-[#166534] text-white text-xs font-bold shadow-md">
            {t('nav.browse')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Ledger Column */}
          <div className="lg:col-span-4 space-y-3 print:hidden">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{t('receipts.ledger')} ({farmerReceipts.length})</h3>
            
            <div className="space-y-3">
              {farmerReceipts.map(r => (
                <div
                  key={r.id}
                  onClick={() => setSelectedReceipt(r)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedReceipt?.id === r.id
                      ? 'bg-white border-[#166534] ring-2 ring-[#166534]/20 shadow-md'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#166534]">{r.id}</span>
                    <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm truncate">{r.equipmentName}</div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Owner: {r.ownerName}</span>
                    <strong className="text-[#166534] font-extrabold">₹{r.total.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Receipt Display Column */}
          <div className="lg:col-span-8">
            {selectedReceipt ? (
              <ReceiptCard receipt={selectedReceipt} />
            ) : (
              <ReceiptCard receipt={farmerReceipts[0]} />
            )}
          </div>

        </div>
      )}

    </div>
  );
};
