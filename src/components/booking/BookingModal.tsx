import React, { useState } from 'react';
import { Equipment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, UserCheck, CheckCircle2, AlertCircle, PhoneCall, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TranslatedText } from '../common/TranslatedText';

interface BookingModalProps {
  equipment: Equipment;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ equipment, isOpen, onClose }) => {
  const { user } = useAuth();
  const { createBooking } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(nextWeek);
  const [hectares, setHectares] = useState(2);
  const [withOperator, setWithOperator] = useState(equipment.operatorIncluded);
  const [farmerName, setFarmerName] = useState(user?.name || '');
  const [farmerPhone, setFarmerPhone] = useState(user?.phone || '');
  const [deliveryLocation, setDeliveryLocation] = useState(user?.location || equipment.location);
  const [purpose, setPurpose] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<any | null>(null);

  if (!isOpen) return null;

  // Calculate pricing breakdown based on hectares
  const validHectares = Math.max(0.5, Number(hectares) || 1);
  const baseRateTotal = Math.round(equipment.pricePerDay * validHectares);
  const operatorTotal = withOperator ? Math.round(equipment.operatorCostPerDay * validHectares) : 0;
  const subtotal = baseRateTotal + operatorTotal;
  const platformFee = Math.round(subtotal * 0.03);
  const grandTotal = subtotal + platformFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!farmerName || !farmerPhone || !deliveryLocation) {
      setError('Please provide your name, phone number, and delivery location.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const booking = await createBooking({
        equipmentId: equipment.id,
        farmerId: user.id,
        farmerName,
        farmerPhone,
        startDate,
        endDate,
        withOperator,
        location: deliveryLocation,
        purpose
      });

      setCreatedBooking(booking);
    } catch (err: any) {
      setError(err.message || t('booking.errorFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#166534] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 block">RENTAL REQUIREMENT REQUEST</span>
            <h3 className="text-lg font-bold text-white truncate max-w-[340px]"><TranslatedText text={equipment.name} /></h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen */}
        {createdBooking ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-extrabold text-slate-900">Rental Request Submitted!</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your rental request for <span className="font-bold text-slate-900"><TranslatedText text={equipment.name} /></span> has been sent to owner <span className="font-bold text-[#166534]">{equipment.ownerName}</span>. 
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 text-left space-y-2">
              <div className="flex items-center justify-between font-bold border-b border-amber-200/80 pb-1.5 text-amber-950">
                <span>Request Status:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold text-[11px]">PENDING (Awaiting Owner Approval)</span>
              </div>
              <div><span className="font-bold">Rental Duration:</span> {startDate} to {endDate} ({diffDays} days)</div>
              <div><span className="font-bold">Delivery Location:</span> {deliveryLocation}</div>
              <div><span className="font-bold">Estimated Cost:</span> ₹{grandTotal.toLocaleString('en-IN')} <span className="text-[11px] font-normal text-amber-800">(Pay after work completion)</span></div>
              <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-slate-700">
                <span className="font-bold text-amber-950">Work Verification OTP:</span>
                <span className="text-xs text-amber-900 bg-amber-200/60 px-2.5 py-1 rounded-md font-medium">Invoked by owner upon field completion</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2 text-left">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>No upfront payment required.</strong> Payment options (Online / Cash) will unlock once the owner accepts and work is completed!</span>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  onClose();
                  navigate('/farmer/rentals');
                }}
                className="flex-1 py-3 rounded-xl bg-[#166534] text-white font-bold text-xs shadow-md hover:bg-[#004C22]"
              >
                Track Request in My Rentals →
              </button>
            </div>
          </div>
        ) : (
          /* Requirement Form Content */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Notice */}
            <div className="p-3 bg-amber-50 border border-amber-200/80 text-amber-900 rounded-xl text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Submit your requirements to owner <strong>{equipment.ownerName}</strong> for approval. No payment required now!</span>
            </div>

            {/* Dates Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('booking.startDate')}</label>
                <input
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('booking.endDate')}</label>
                <input
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Delivery / Farming Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Equipment Delivery / Farming Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="Village, Tehsil / District where equipment is required"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Farm Area in Hectares */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('booking.hectares') || 'Farm Area (Hectares)'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={hectares}
                  onChange={(e) => setHectares(Math.max(0.5, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-[#166534] focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  required
                />
              </div>
              <div className="flex flex-col justify-end">
                <span className="text-[11px] text-slate-500 pb-2">
                  Rate: ₹{equipment.pricePerDay} / ha
                </span>
              </div>
            </div>

            {/* Operator Selection */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-[#166534]" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{t('booking.includeOperator')}</span>
                  <span className="text-[11px] text-slate-500">₹{equipment.operatorCostPerDay}/hectare operator fee</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={withOperator}
                onChange={(e) => setWithOperator(e.target.checked)}
                className="w-4 h-4 text-[#166534] rounded-xs focus:ring-[#166534]"
              />
            </div>

            {/* Farmer Contact Info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="Ramesh Patel"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Mobile Number</label>
                <input
                  type="text"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Farming Purpose / Acreage Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Farming Operation / Purpose Notes</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g., Wheat harvesting, 2 hectares land in Chhatrapati Sambhajinagar"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none"
              />
            </div>

            {/* Price Estimate Breakdown */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 text-xs">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wide border-b border-slate-200 pb-1 flex justify-between">
                <span>Estimated Rental Cost</span>
                <span className="text-[#166534]">({validHectares} ha)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Equipment Rate (₹{equipment.pricePerDay} × {validHectares} ha)</span>
                <span className="font-semibold text-slate-800">₹{baseRateTotal.toLocaleString('en-IN')}</span>
              </div>
              {withOperator && (
                <div className="flex justify-between text-slate-600">
                  <span>Operator Fee (₹{equipment.operatorCostPerDay} × {validHectares} ha)</span>
                  <span className="font-semibold text-slate-800">₹{operatorTotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-extrabold text-[#166534] pt-1.5 border-t border-slate-200">
                <span>Estimated Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-2/3 py-3 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting Request...' : 'Send Rental Request →'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

