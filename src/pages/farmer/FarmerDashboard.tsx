import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { bookingService } from '../../services/bookingService';
import { Badge } from '../../components/common/Badge';
import { Tractor, Sparkles, TrendingUp, Calendar, ArrowRight, ShieldCheck, FileText, ClipboardList } from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { equipment, bookings } = useApp();
  const { t } = useLanguage();

  const [farmerBookings, setFarmerBookings] = React.useState<any[]>(bookings);

  React.useEffect(() => {
    if (user) {
      bookingService.getFarmerBookings(user.id).then(list => setFarmerBookings(list));
      const timer = setInterval(() => {
        bookingService.getFarmerBookings(user.id).then(list => setFarmerBookings(list));
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [user, bookings]);

  const isCompletedBooking = (b: any) => 
    b.status === 'COMPLETED' || 
    (b.paymentStatus === 'PAID' && (b.workCompleted || b.status === 'WORK_COMPLETED')) ||
    b.status === 'CANCELLED' ||
    b.status === 'REJECTED';

  const activeRentals = farmerBookings.filter(b => !isCompletedBooking(b));
  const completedRentals = farmerBookings.filter(b => isCompletedBooking(b));
  const totalSpent = completedRentals.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#166534] to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">{t('farmer.dashboard.badge')}</span>
          <h1 className="text-2xl sm:text-4xl font-extrabold">{t('farmer.dashboard.welcome')} {user?.name}!</h1>
          <p className="text-sm text-emerald-100/90 max-w-xl">
            {t('farmer.dashboard.subtitle')}
          </p>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#166534] flex items-center justify-center font-bold">
            <Tractor className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t('farmer.dashboard.activeRentals')}</div>
            <div className="text-2xl font-extrabold text-slate-900">{activeRentals.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t('farmer.dashboard.completedBookings')}</div>
            <div className="text-2xl font-extrabold text-slate-900">{completedRentals.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t('farmer.dashboard.totalSpent')}</div>
            <div className="text-2xl font-extrabold text-[#166534]">₹{totalSpent.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Link
          to="/equipment"
          className="p-4 bg-white hover:bg-emerald-50/50 rounded-xl border border-slate-200/80 hover:border-emerald-300 transition-all text-center space-y-2 group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#166534] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <Tractor className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">{t('farmer.dashboard.findEquipment')}</div>
        </Link>

        <Link
          to="/farmer/smart-match"
          className="p-4 bg-white hover:bg-amber-50/50 rounded-xl border border-slate-200/80 hover:border-amber-300 transition-all text-center space-y-2 group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">{t('farmer.dashboard.smartMatch')}</div>
        </Link>

        <Link
          to="/farmer/mandi"
          className="p-4 bg-white hover:bg-emerald-50/50 rounded-xl border border-slate-200/80 hover:border-emerald-300 transition-all text-center space-y-2 group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">{t('farmer.dashboard.mandiRates')}</div>
        </Link>

        <Link
          to="/farmer/rentals"
          className="p-4 bg-white hover:bg-lime-50/50 rounded-xl border border-slate-200/80 hover:border-lime-300 transition-all text-center space-y-2 group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">{t('farmer.dashboard.myRentals')}</div>
        </Link>

        <Link
          to="/farmer/receipts"
          className="p-4 bg-white hover:bg-indigo-50/50 rounded-xl border border-slate-200/80 hover:border-indigo-300 transition-all text-center space-y-2 group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">{t('nav.receipts')}</div>
        </Link>
      </div>

      {/* Active Rentals Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">{t('farmer.dashboard.recentRentals')}</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">{activeRentals.length}</span>
          </div>
          <Link to="/farmer/rentals" className="text-xs font-bold text-[#166534] hover:underline flex items-center gap-1">
            <span>{t('farmer.dashboard.viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeRentals.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <p className="text-sm text-slate-500">{t('farmer.dashboard.noRentals')}</p>
            <Link to="/equipment" className="inline-block px-4 py-2 rounded-lg bg-[#166534] text-white text-xs font-bold">
              {t('farmer.dashboard.browseNow')}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {activeRentals.map(bk => (
              <div key={bk.id} className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={bk.equipmentImage} alt="" className="w-14 h-14 rounded-lg object-cover bg-slate-200 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{bk.equipmentName}</h4>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {t('rentals.rentalPeriod')}: <span className="font-semibold text-slate-800">{bk.startDate}</span> {t('common.toDate')} <span className="font-semibold text-slate-800">{bk.endDate}</span> ({bk.totalDays} {t('rentals.days')})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-medium">{t('receipts.amount')}</div>
                    <div className="text-sm font-extrabold text-[#166534]">₹{bk.totalAmount.toLocaleString('en-IN')}</div>
                  </div>
                  <Badge status={bk.workCompleted && bk.paymentStatus !== 'PAID' ? 'WORK_COMPLETED' : bk.status} />
                  {bk.workCompleted && bk.paymentStatus !== 'PAID' && (
                    <Link
                      to="/farmer/rentals"
                      className="px-3.5 py-1.5 rounded-lg bg-[#166534] hover:bg-[#004C22] text-white text-xs font-bold shadow-xs transition-all"
                    >
                      Pay Now
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed & Past Rentals Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">{t('farmer.dashboard.completedRentals')}</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">{completedRentals.length}</span>
          </div>
          <Link to="/farmer/receipts" className="text-xs font-bold text-[#166534] hover:underline flex items-center gap-1">
            <span>{t('farmer.dashboard.viewReceipt')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {completedRentals.length === 0 ? (
          <div className="py-6 text-center text-sm text-slate-500">
            {t('farmer.dashboard.noCompleted')}
          </div>
        ) : (
          <div className="space-y-3">
            {completedRentals.map(bk => (
              <div key={bk.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={bk.equipmentImage} alt="" className="w-14 h-14 rounded-lg object-cover bg-slate-200 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{bk.equipmentName}</h4>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {t('rentals.rentalPeriod')}: <span className="font-semibold text-slate-800">{bk.startDate}</span> {t('common.toDate')} <span className="font-semibold text-slate-800">{bk.endDate}</span> ({bk.totalDays} {t('rentals.days')})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-medium">{t('receipts.amount')}</div>
                    <div className="text-sm font-extrabold text-[#166534]">₹{bk.totalAmount.toLocaleString('en-IN')}</div>
                  </div>
                  <Badge status={bk.paymentStatus === 'PAID' || bk.status === 'COMPLETED' ? 'COMPLETED' : bk.status} />
                  <Link
                    to="/farmer/receipts"
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t('farmer.dashboard.viewReceipt')}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
