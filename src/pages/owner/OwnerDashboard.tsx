import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { analyticsService, OwnerAnalyticsSummary } from '../../services/analyticsService';
import { bookingService } from '../../services/bookingService';
import { Booking } from '../../types';
import { Badge } from '../../components/common/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tractor, DollarSign, Calendar, TrendingUp, PlusCircle, Wrench, FileText, CheckCircle2, XCircle, KeyRound, MapPin, PhoneCall, Check, Clock } from 'lucide-react';

const DEFAULT_ANALYTICS: OwnerAnalyticsSummary = {
  totalEarnings: 0,
  monthlyEarnings: 0,
  activeBookingsCount: 0,
  totalEquipmentCount: 0,
  utilizationRate: 0,
  monthlyRevenueData: [],
  equipmentPerformanceData: []
};

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { refreshBookings } = useApp();
  const { t } = useLanguage();

  const [analytics, setAnalytics] = useState<OwnerAnalyticsSummary>(DEFAULT_ANALYTICS);
  const [ownerBookings, setOwnerBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // OTP Modal State
  const [otpModalBookingId, setOtpModalBookingId] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboardData = () => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      analyticsService.getOwnerAnalytics(user.id),
      bookingService.getOwnerBookings(user.id)
    ]).then(([an, bks]) => {
      setAnalytics(an);
      setOwnerBookings(bks);
    }).catch(() => {
      setAnalytics(DEFAULT_ANALYTICS);
      setOwnerBookings([]);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(() => {
      fetchDashboardData();
    }, 8000);
    return () => clearInterval(timer);
  }, [user]);

  const handleAcceptRequest = async (bookingId: string) => {
    try {
      setActionLoading(true);
      await bookingService.updateBookingStatus(bookingId, 'APPROVED');
      fetchDashboardData();
      refreshBookings();
      alert('Rental Request ACCEPTED! The farmer has been notified.');
    } catch (err: any) {
      alert(err.message || 'Failed to accept request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to decline this rental request?')) return;
    try {
      setActionLoading(true);
      await bookingService.updateBookingStatus(bookingId, 'REJECTED');
      fetchDashboardData();
      refreshBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestOtp = async (bookingId: string) => {
    try {
      setActionLoading(true);
      await bookingService.requestCompletionOtp(bookingId);
      fetchDashboardData();
      refreshBookings();
      alert('Work Completion OTP generated and sent to the farmer! Ask the farmer for their 4-digit OTP once work is verified.');
    } catch (err: any) {
      alert(err.message || 'Failed to request completion OTP');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpModalBookingId) return;
    try {
      setActionLoading(true);
      setOtpError(null);
      await bookingService.verifyOtp(otpModalBookingId, otpInput);
      setOtpModalBookingId(null);
      setOtpInput('');
      fetchDashboardData();
      refreshBookings();
      alert('Farming work completed and verified via OTP! Farmer payment option has been activated. Once payment is received, click "Confirm Payment Received".');
    } catch (err: any) {
      setOtpError(err.message || 'Invalid OTP code.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmPaymentReceived = async (bookingId: string) => {
    if (!window.confirm('Confirm that you have received payment from the farmer? This will complete the rental and generate the official receipt.')) return;
    try {
      setActionLoading(true);
      await bookingService.confirmPaymentReceived(bookingId);
      fetchDashboardData();
      refreshBookings();
      alert('Payment confirmed received! Rental is officially completed and receipt generated.');
    } catch (err: any) {
      alert(err.message || 'Failed to confirm payment');
    } finally {
      setActionLoading(false);
    }
  };

  const isBookingCompletedOrPast = (b: Booking) => {
    if (b.status === 'COMPLETED' || b.status === 'REJECTED' || b.status === 'CANCELLED') return true;
    if (b.paymentStatus === 'PAID' && (b.workCompleted || b.status === 'WORK_COMPLETED')) return true;
    return false;
  };

  const pendingBookings = ownerBookings.filter(b => b.status === 'PENDING' && !isBookingCompletedOrPast(b));
  const activeApprovedBookings = ownerBookings.filter(b => 
    !isBookingCompletedOrPast(b) && 
    (b.status === 'APPROVED' || b.status === 'ACTIVE' || b.status === 'WORK_COMPLETED' || b.workCompleted)
  );
  const pastBookings = ownerBookings.filter(b => isBookingCompletedOrPast(b));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#166534] to-emerald-800 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">{t('owner.dashboard.badge')}</span>
            <h1 className="text-2xl sm:text-4xl font-extrabold">{t('owner.dashboard.welcome')}, {user?.name}!</h1>
            <p className="text-sm text-emerald-100/90 max-w-xl">
              {t('owner.dashboard.subtitle')}
            </p>
          </div>

          <Link
            to="/owner/equipment/add"
            className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center gap-2 w-fit shrink-0"
          >
            <PlusCircle className="w-5 h-5 text-slate-950" />
            <span>{t('owner.dashboard.addEquipment')}</span>
          </Link>
        </div>
      </div>

      {/* Top Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#166534] flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t('owner.dashboard.totalEarnings')}</div>
            <div className="text-2xl font-extrabold text-[#166534]">₹{analytics.totalEarnings.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Tractor className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t('owner.dashboard.activeMachines')}</div>
            <div className="text-2xl font-extrabold text-slate-900">{analytics.totalEquipmentCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Pending Requests</div>
            <div className="text-2xl font-extrabold text-amber-700">{pendingBookings.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t('owner.dashboard.utilizationRate')}</div>
            <div className="text-2xl font-extrabold text-[#166534]">{analytics.utilizationRate}%</div>
          </div>
        </div>

      </div>

      {/* Owner Quick Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link to="/owner/equipment" className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200/80 text-center space-y-1 shadow-xs">
          <Tractor className="w-5 h-5 text-[#166534] mx-auto" />
          <span className="text-xs font-bold text-slate-900 block">{t('nav.myEquipment')}</span>
        </Link>
        <Link to="/owner/maintenance" className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200/80 text-center space-y-1 shadow-xs">
          <Wrench className="w-5 h-5 text-amber-600 mx-auto" />
          <span className="text-xs font-bold text-slate-900 block">{t('nav.maintenance')}</span>
        </Link>
        <Link to="/owner/analytics" className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200/80 text-center space-y-1 shadow-xs">
          <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto" />
          <span className="text-xs font-bold text-slate-900 block">{t('nav.analytics')}</span>
        </Link>
        <Link to="/owner/receipts" className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200/80 text-center space-y-1 shadow-xs">
          <FileText className="w-5 h-5 text-indigo-600 mx-auto" />
          <span className="text-xs font-bold text-slate-900 block">{t('nav.receipts')}</span>
        </Link>
      </div>

      {/* PENDING BOOKING REQUESTS (Requiring Owner Action) */}
      <div className="bg-amber-50/50 rounded-2xl border border-amber-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-amber-200 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-700" />
            <h3 className="text-lg font-bold text-slate-900">Incoming Rental Requests ({pendingBookings.length})</h3>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-amber-200 text-amber-900 rounded-full">Action Required</span>
        </div>

        {pendingBookings.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">No pending rental requests right now.</div>
        ) : (
          <div className="space-y-4">
            {pendingBookings.map(bk => (
              <div key={bk.id} className="p-5 bg-white rounded-xl border border-amber-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">ID: {bk.id}</span>
                    <h4 className="font-extrabold text-slate-900 text-base">{bk.equipmentName}</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-500">Farmer:</span> <strong className="text-slate-900">{bk.farmerName}</strong>
                    </div>
                    <div className="flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{bk.farmerPhone}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Delivery Location: <strong className="text-slate-800">{bk.location}</strong></span>
                    </div>
                    <div className="sm:col-span-2 text-slate-500">
                      Duration: <strong className="text-slate-900">{bk.startDate} to {bk.endDate} ({bk.totalDays} days)</strong> {bk.withOperator && <span className="text-emerald-700 font-semibold">(Includes Operator)</span>}
                    </div>
                    {bk.purpose && (
                      <div className="sm:col-span-2 italic text-slate-500 bg-slate-50 p-2 rounded">
                        "{bk.purpose}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-left lg:text-right">
                    <span className="text-[11px] text-slate-500 block">Payout Earnings</span>
                    <span className="text-xl font-black text-[#166534]">₹{(bk.totalAmount - bk.platformFee).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleRejectRequest(bk.id)}
                      disabled={actionLoading}
                      className="px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline</span>
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(bk.id)}
                      disabled={actionLoading}
                      className="px-5 py-2.5 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Request</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTIVE & APPROVED BOOKINGS (Ongoing Work & OTP Verification) */}
      {activeApprovedBookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900">Approved & Active Rentals ({activeApprovedBookings.length})</h3>
            <span className="text-xs font-semibold text-slate-500">In Operation</span>
          </div>

          <div className="space-y-3">
            {activeApprovedBookings.map(bk => (
              <div key={bk.id} className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 shrink-0 flex items-center justify-center text-emerald-800">
                    <Tractor className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{bk.equipmentName}</h4>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Renter: <span className="font-semibold text-slate-900">{bk.farmerName}</span> ({bk.farmerPhone}) — Location: <strong>{bk.location}</strong>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Dates: {bk.startDate} to {bk.endDate} ({bk.totalDays} days)
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between lg:justify-end">
                  <Badge status={bk.workCompleted ? 'WORK_COMPLETED' : bk.status} />

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Step 1: Work not completed yet */}
                    {!bk.workCompleted && (
                      <>
                        {!bk.otpRequested ? (
                          <button
                            onClick={() => handleRequestOtp(bk.id)}
                            disabled={actionLoading}
                            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                          >
                            <KeyRound className="w-4 h-4" />
                            <span>Request Work OTP</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setOtpModalBookingId(bk.id);
                                setOtpInput('');
                                setOtpError(null);
                              }}
                              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                            >
                              <KeyRound className="w-4 h-4" />
                              <span>Enter OTP (Verify Work)</span>
                            </button>
                            <button
                              onClick={() => handleRequestOtp(bk.id)}
                              disabled={actionLoading}
                              className="px-2.5 py-2 rounded-lg border border-amber-300 text-amber-800 hover:bg-amber-100 text-[11px] font-semibold"
                              title="Resend OTP to farmer"
                            >
                              Resend OTP
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    {/* Step 2: Work completed via OTP -> Confirm Payment Received button */}
                    {bk.workCompleted && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {bk.paymentStatus !== 'PAID' ? (
                          <button
                            onClick={() => handleConfirmPaymentReceived(bk.id)}
                            disabled={actionLoading}
                            className="px-4 py-2 rounded-lg bg-[#166534] hover:bg-[#004C22] text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                          >
                            <Check className="w-4 h-4 text-emerald-300" />
                            <span>Confirm Payment Received</span>
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Payment Received</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue Graph Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900">{t('owner.dashboard.monthlyRevenue')}</h2>
          <span className="text-xs text-slate-500 font-semibold">(₹)</span>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Loading chart...</div>
        ) : analytics.monthlyRevenueData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No revenue data yet.</div>
        ) : (
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.monthlyRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#166534', color: '#fff', borderRadius: '12px', border: 'none' }}
                  formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Earnings']}
                />
                <Bar dataKey="earnings" fill="#166534" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Past / Completed Bookings List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-900">Completed & Past Rentals</h3>
          <span className="text-xs font-semibold text-slate-500">{pastBookings.length}</span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-slate-400">Loading bookings...</div>
        ) : pastBookings.length === 0 ? (
          <div className="py-6 text-center text-sm text-slate-500">No completed rentals yet.</div>
        ) : (
          <div className="space-y-3">
            {pastBookings.map(bk => (
              <div key={bk.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-200 shrink-0 flex items-center justify-center">
                    <Tractor className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{bk.equipmentName}</h4>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Renter: <span className="font-semibold text-slate-800">{bk.farmerName}</span> ({bk.farmerPhone})
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Dates: {bk.startDate} to {bk.endDate} ({bk.totalDays} days)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-medium">Payout</div>
                    <div className="text-sm font-extrabold text-[#166534]">₹{(bk.totalAmount - bk.platformFee).toLocaleString('en-IN')}</div>
                  </div>
                  <Badge status={bk.paymentStatus === 'PAID' || bk.status === 'COMPLETED' ? 'COMPLETED' : bk.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OTP Verification Modal */}
      {otpModalBookingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold">Verify Work Completion OTP</h3>
              </div>
              <button onClick={() => setOtpModalBookingId(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Ask the farmer for their <strong>4-digit Work Completion OTP</strong> to confirm physical completion of farming work.
            </p>

            {otpError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-semibold">
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enter 4-Digit OTP</label>
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="e.g. 4829"
                  className="w-full text-center text-2xl tracking-widest font-mono p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOtpModalBookingId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || otpInput.length < 4}
                  className="flex-1 py-2.5 rounded-xl bg-[#166534] text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {actionLoading ? 'Verifying...' : 'Verify OTP & Complete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

