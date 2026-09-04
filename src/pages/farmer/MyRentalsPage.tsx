import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { bookingService } from '../../services/bookingService';
import { reviewService } from '../../services/reviewService';
import { Badge } from '../../components/common/Badge';
import { Tractor, PhoneCall, Star, CreditCard, Banknote, ShieldCheck, KeyRound, MapPin, CheckCircle2, AlertCircle, X, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyRentalsPage: React.FC = () => {
  const { user } = useAuth();
  const { bookings, refreshBookings } = useApp();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('ALL');

  const [reviewModalBooking, setReviewModalBooking] = useState<any | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Payment Modal State
  const [paymentModalBooking, setPaymentModalBooking] = useState<any | null>(null);
  const [paymentTab, setPaymentTab] = useState<'ONLINE' | 'CASH'>('ONLINE');
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  const [farmerBookings, setFarmerBookings] = useState<any[]>(bookings);

  React.useEffect(() => {
    if (user) {
      bookingService.getFarmerBookings(user.id).then(list => setFarmerBookings(list));
      const timer = setInterval(() => {
        bookingService.getFarmerBookings(user.id).then(list => setFarmerBookings(list));
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [user, bookings]);

  const isCompleted = (b: any) => b.status === 'COMPLETED' || (b.paymentStatus === 'PAID' && (b.workCompleted || b.status === 'WORK_COMPLETED'));
  const isCancelled = (b: any) => b.status === 'CANCELLED' || b.status === 'REJECTED';

  const filteredBookings = farmerBookings.filter(b => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'ACTIVE') return !isCompleted(b) && !isCancelled(b);
    if (activeTab === 'COMPLETED') return isCompleted(b);
    if (activeTab === 'CANCELLED') return isCancelled(b);
    return true;
  });

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this equipment booking?')) {
      await bookingService.updateBookingStatus(bookingId, 'CANCELLED');
      refreshBookings();
    }
  };

  const handleProcessPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalBooking) return;

    try {
      setPaymentSubmitting(true);
      await bookingService.processPayment(
        paymentModalBooking.id,
        paymentTab,
        paymentTab === 'ONLINE' ? utrNumber : `CASH-${Date.now()}`
      );
      setPaymentModalBooking(null);
      setUtrNumber('');
      refreshBookings();
      if (user) {
        bookingService.getFarmerBookings(user.id).then(list => setFarmerBookings(list));
      }
      alert('Payment confirmed! Receipt generated.');
    } catch (err: any) {
      alert(err.message || 'Payment processing failed');
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalBooking || !user) return;

    try {
      setSubmittingReview(true);
      setReviewError(null);
      await reviewService.addReview({
        bookingId: reviewModalBooking.id,
        equipmentId: reviewModalBooking.equipmentId,
        farmerId: user.id,
        farmerName: user.name,
        rating,
        comment
      });
      setReviewModalBooking(null);
      setComment('');
      alert('Thank you! Your review has been published.');
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#166534]">{t('rentals.badge')}</span>
        <h1 className="text-3xl font-extrabold text-slate-900">{t('rentals.title')}</h1>
        <p className="text-sm text-slate-500 mt-1">Track your equipment rental requests, verification OTPs, and post-work payment details.</p>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === tab
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab === 'ALL' ? t('rentals.all') : tab === 'ACTIVE' ? t('rentals.active') : tab === 'COMPLETED' ? t('rentals.completed') : t('rentals.cancelled')}
          </button>
        ))}
      </div>

      {/* Rentals List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center my-6 max-w-md mx-auto shadow-xs">
          <Tractor className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">{t('rentals.noRentals')}</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">{t('rentals.subtitle')}</p>
          <Link to="/equipment" className="px-4 py-2 rounded-lg bg-[#166534] text-white text-xs font-bold">
            {t('rentals.browseEquipment')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(bk => (
            <div key={bk.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <img src={bk.equipmentImage} alt="" className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#166534] uppercase tracking-wider block">{t('rentals.bookingId')}: {bk.id}</span>
                    <Link to={`/equipment/${bk.equipmentId}`} className="font-bold text-slate-900 text-base hover:text-[#166534]">
                      {bk.equipmentName}
                    </Link>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{t('market.owner')}: <strong className="text-slate-800">{bk.ownerName}</strong> ({bk.farmerPhone})</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <Badge status={bk.status} />
                  <div className="text-base font-black text-[#166534]">
                    ₹{bk.totalAmount.toLocaleString('en-IN')}
                    <span className="text-[10px] font-normal text-slate-400 block">
                      {bk.paymentStatus === 'PAID' ? '✅ Paid' : '⏳ Payment Post-Work'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rental Details Line */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500 block">{t('booking.startDate')}</span>
                  <span className="font-bold text-slate-900">{bk.startDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t('booking.endDate')}</span>
                  <span className="font-bold text-slate-900">{bk.endDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t('rentals.rentalPeriod')}</span>
                  <span className="font-bold text-slate-900">{bk.totalDays} {t('rentals.days')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{bk.location}</span>
                  </span>
                </div>
              </div>

              {/* OTP & Work Status Banners for Farmer */}
              {bk.workCompleted ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span><strong>Work Completed & Verified via OTP:</strong> Farming work is confirmed done! You can now pay online or cash.</span>
                </div>
              ) : bk.otpRequested && bk.completionOtp && (bk.status === 'APPROVED' || bk.status === 'ACTIVE') ? (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <span className="font-bold block text-slate-900">Work Completion Verification OTP</span>
                      <span className="text-slate-600">The owner has requested work verification. Check the work and give this OTP to the owner:</span>
                    </div>
                  </div>
                  <span className="font-mono font-black text-lg bg-amber-200 text-slate-950 px-3.5 py-1 rounded-lg w-fit shrink-0 tracking-widest border border-amber-300">
                    {bk.completionOtp}
                  </span>
                </div>
              ) : (bk.status === 'APPROVED' || bk.status === 'ACTIVE') ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-xs text-slate-600">
                  <Tractor className="w-4 h-4 text-[#166534] shrink-0" />
                  <span>Work in progress. Once field work is finished, the owner will invoke a completion OTP for your verification.</span>
                </div>
              ) : null}

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <Link
                  to={`/equipment/${bk.equipmentId}`}
                  className="text-xs font-bold text-slate-600 hover:text-[#166534]"
                >
                  {t('market.details')} →
                </Link>

                <div className="flex items-center gap-3 flex-wrap">
                  {bk.paymentStatus === 'PENDING' && (bk.status === 'APPROVED' || bk.status === 'ACTIVE' || bk.status === 'WORK_COMPLETED' || bk.status === 'COMPLETED') && (
                    <>
                      {!bk.workCompleted ? (
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold border border-slate-200" title="Payment unlocks only after owner completes work and verifies OTP">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Pay Now (Unlocks After OTP Verification)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => setPaymentModalBooking(bk)}
                            className="px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 animate-pulse"
                          >
                            <CreditCard className="w-4 h-4 text-emerald-300" />
                            <span>Pay Post-Work (Online / Cash)</span>
                          </button>
                          {bk.paymentMethod === 'CASH' && (
                            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                              Cash Selected — Handover to owner
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {bk.paymentStatus === 'PAID' && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Paid & Confirmed</span>
                    </span>
                  )}

                  {(bk.status === 'ACTIVE' || bk.status === 'APPROVED' || bk.status === 'PENDING') && (
                    <button
                      onClick={() => handleCancelBooking(bk.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
                    >
                      {t('rentals.cancelBooking')}
                    </button>
                  )}

                  {bk.status === 'COMPLETED' && (
                    <button
                      onClick={() => setReviewModalBooking(bk)}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5 fill-white" />
                      <span>{t('rentals.writeReview')}</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Post-Work Payment Modal */}
      {paymentModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#166534]">POST-WORK PAYMENT</span>
                <h3 className="text-lg font-bold text-slate-900">{paymentModalBooking.equipmentName}</h3>
              </div>
              <button onClick={() => setPaymentModalBooking(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Equipment Owner:</span>
                <strong className="text-slate-900">{paymentModalBooking.ownerName}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Rental Duration:</span>
                <strong className="text-slate-900">{paymentModalBooking.totalDays} Days</strong>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#166534] pt-1.5 border-t border-slate-200">
                <span>Total Amount Payable:</span>
                <span>₹{paymentModalBooking.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setPaymentTab('ONLINE')}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  paymentTab === 'ONLINE' ? 'bg-white text-[#166534] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Online Bank / UPI</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentTab('CASH')}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  paymentTab === 'CASH' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Cash Payment (Offline)</span>
              </button>
            </div>

            <form onSubmit={handleProcessPaymentSubmit} className="space-y-4">
              {paymentTab === 'ONLINE' ? (
                <div className="space-y-3 bg-emerald-50/50 p-4 border border-emerald-200/80 rounded-xl text-xs">
                  <h4 className="font-extrabold text-[#166534] text-xs uppercase tracking-wide">Owner Bank Account Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-500 block">Bank Name:</span>
                      <strong className="text-slate-900">{paymentModalBooking.bankDetails?.bankName || 'HDFC Bank'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Account Holder:</span>
                      <strong className="text-slate-900">{paymentModalBooking.ownerName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Account Number:</span>
                      <strong className="font-mono text-slate-900">{paymentModalBooking.bankDetails?.accountNumber || '5010048291029'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">IFSC Code:</span>
                      <strong className="font-mono text-slate-900">{paymentModalBooking.bankDetails?.ifscCode || 'HDFC0001829'}</strong>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-emerald-200/60">
                      <span className="text-slate-500 block">UPI ID:</span>
                      <strong className="font-mono text-[#166534]">{paymentModalBooking.bankDetails?.upiId || 'owner@upi'}</strong>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mt-2 mb-1">Transaction UTR / Reference ID (Optional)</label>
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. 384920194820"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#166534] focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-900">
                  <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
                    <Banknote className="w-5 h-5 text-amber-700" />
                    <span>Pay Cash Directly to Owner</span>
                  </div>
                  <p className="leading-relaxed">
                    Handover <strong>₹{paymentModalBooking.totalAmount.toLocaleString('en-IN')}</strong> cash to owner <strong>{paymentModalBooking.ownerName}</strong> on the farm. 
                  </p>
                  <p className="text-[11px] text-amber-800 italic">
                    Once you pay cash, click the button below or ask the owner to confirm receipt using your 4-digit OTP.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalBooking(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paymentSubmitting}
                  className="flex-1 py-3 rounded-xl bg-[#166534] text-white text-xs font-bold shadow-md hover:bg-[#004C22]"
                >
                  {paymentSubmitting ? 'Processing Payment...' : paymentTab === 'ONLINE' ? 'Confirm Online Payment' : 'Confirm Cash Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {reviewModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">{t('rentals.writeReview')}</h3>
            <p className="text-xs text-slate-500">{reviewModalBooking.equipmentName}</p>

            {reviewError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
                {reviewError}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rating (1-5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-800 ml-2">{rating} / 5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('rentals.writeReview')}</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('rentals.reviewPlaceholder')}
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalBooking(null)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700"
                >
                  {t('booking.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1 py-2.5 rounded-lg bg-[#166534] text-white text-xs font-bold shadow-md"
                >
                  {submittingReview ? 'Submitting...' : t('rentals.submitReview')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

