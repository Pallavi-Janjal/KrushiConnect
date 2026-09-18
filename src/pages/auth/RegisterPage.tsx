import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { authService } from '../../services/authService';
import { UserRole } from '../../types';
import { Tractor, User, Mail, Phone, MapPin, Lock, AlertCircle, ArrowRight, CheckCircle2, ShieldCheck, KeyRound, Loader2 } from 'lucide-react';
import { INDIAN_STATES, STATE_DISTRICTS_MAP } from '../../data/indiaLocations';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const NAME_REGEX = /^[a-zA-Z\s'.]{2,50}$/;

export const RegisterPage: React.FC = () => {
  const { register, returnIntent, clearReturnIntent } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState<UserRole>('FARMER');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Chhatrapati Sambhajinagar');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OTP Verification States
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 60-second Countdown Timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const districts = STATE_DISTRICTS_MAP[stateName] || [];
    setSelectedDistrict(districts[0] || '');
  };

  // Trigger Send / Resend OTP to Email
  const handleSendOtp = async () => {
    setServerError(null);
    setOtpSuccessMsg(null);
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrors(prev => ({ ...prev, email: 'Email address is required to send verification code.' }));
      return;
    }
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address (e.g. user@example.com).' }));
      return;
    }

    try {
      setSendingOtp(true);
      const res = await authService.sendOtp(normalizedEmail);
      setOtpSent(true);
      setCountdown(60); // 60s cooldown
      setOtpSuccessMsg(res.message || 'Verification code sent to your email!');
      setErrors(prev => ({ ...prev, email: '', otp: '' }));
    } catch (err: any) {
      setServerError(err.message || 'Failed to send verification code. Please check your email and try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};

    const trimmedName = name.trim();
    if (!trimmedName) newErrors.name = 'Full Name is required.';
    else if (!NAME_REGEX.test(trimmedName)) newErrors.name = 'Name must be 2-50 characters containing only letters.';

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) newErrors.email = 'Email address is required.';
    else if (!EMAIL_REGEX.test(normalizedEmail)) newErrors.email = 'Please enter a valid email address.';

    const sanitizedPhone = phone.replace(/^(\+91|91)/, '').replace(/[\s\-\(\)]/g, '').trim();
    if (!sanitizedPhone) newErrors.phone = 'Mobile number is required.';
    else if (!PHONE_REGEX.test(sanitizedPhone)) newErrors.phone = 'Enter a valid 10-digit mobile number.';

    if (!otpSent) {
      newErrors.otp = 'Please verify your email address by requesting a verification code.';
    } else if (!otp.trim() || otp.trim().length !== 6) {
      newErrors.otp = 'Please enter the 6-digit verification code received on your email.';
    }

    if (!selectedState) newErrors.location = 'State is required.';
    else if (!selectedDistrict) newErrors.location = 'District is required.';

    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 6 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      newErrors.password = 'Password must be at least 6 characters with letters and numbers.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateInputs()) return;

    try {
      setLoading(true);
      const sanitizedPhone = phone.replace(/^(\+91|91)/, '').replace(/[\s\-\(\)]/g, '').trim();
      const formattedLocation = `${selectedDistrict}, ${selectedState}`;

      const user = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: sanitizedPhone,
        role,
        location: formattedLocation,
        password,
        otp: otp.trim()
      });

      if (returnIntent && returnIntent.returnTo) {
        const dest = returnIntent.returnTo;
        const isRentIntent = returnIntent.action === 'RENT_NOW' || returnIntent.action === 'BOOK';
        clearReturnIntent();
        navigate(dest, { state: { autoOpenBooking: isRentIntent } });
      } else {
        if (user.role === 'FARMER') {
          navigate('/farmer/dashboard');
        } else {
          navigate('/owner/dashboard');
        }
      }
    } catch (err: any) {
      setServerError(err.message || 'Registration failed. Please check the OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#166534] text-white flex items-center justify-center mx-auto shadow-md">
            <Tractor className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">{t('auth.register.title')}</h2>
          <p className="text-xs text-slate-500">{t('auth.register.subtitle')}</p>
        </div>

        {/* Global Error & Success Alerts */}
        {serverError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {otpSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{otpSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          
          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t('auth.register.role')}</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setRole('FARMER')}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  role === 'FARMER' ? 'bg-white text-[#166534] shadow-xs' : 'text-slate-600'
                }`}
              >
                🌾 {t('common.farmerRole')}
              </button>
              <button
                type="button"
                onClick={() => setRole('EQUIPMENT_OWNER')}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  role === 'EQUIPMENT_OWNER' ? 'bg-white text-[#166534] shadow-xs' : 'text-slate-600'
                }`}
              >
                🚜 {t('common.ownerRole')}
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.register.fullName')}</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                placeholder="Ramesh Patel"
                className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-xs focus:ring-2 focus:outline-none ${
                  errors.name ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 focus:ring-[#166534]'
                }`}
              />
            </div>
            {errors.name && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.name}</p>}
          </div>

          {/* Email Address with Send OTP Button */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.register.email')}</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="your.email@example.com"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-xs focus:ring-2 focus:outline-none ${
                    errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 focus:ring-[#166534]'
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp || countdown > 0 || !email.trim()}
                className="px-3.5 py-2.5 bg-[#166534] hover:bg-[#004C22] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-lg transition-all shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer disabled:cursor-not-allowed"
              >
                {sendingOtp ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : countdown > 0 ? (
                  <span>Resend in {countdown}s</span>
                ) : (
                  <span>{otpSent ? 'Resend Code' : 'Send Code'}</span>
                )}
              </button>
            </div>
            {errors.email && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.email}</p>}
          </div>

          {/* Conditional 6-Digit Email OTP Input */}
          {otpSent && (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Enter 6-Digit Email Verification Code</span>
                </label>
                <span className="text-[11px] text-emerald-700 font-medium">Valid for 10 mins</span>
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    if (errors.otp) setErrors(prev => ({ ...prev, otp: '' }));
                  }}
                  placeholder="123456"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm tracking-widest font-black text-slate-800 bg-white focus:ring-2 focus:outline-none ${
                    errors.otp ? 'border-rose-500 focus:ring-rose-500' : 'border-emerald-300 focus:ring-emerald-600'
                  }`}
                />
              </div>
              <p className="text-[11px] text-emerald-700 font-medium">
                {otpSuccessMsg || 'A 6-digit verification code was sent to your email.'}
              </p>
              {errors.otp && <p className="text-[11px] text-rose-600 font-medium">{errors.otp}</p>}
            </div>
          )}

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.register.phone')}</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                maxLength={10}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, ''));
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                }}
                placeholder="9876543210"
                className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-xs focus:ring-2 focus:outline-none ${
                  errors.phone ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 focus:ring-[#166534]'
                }`}
              />
            </div>
            {errors.phone && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.phone}</p>}
          </div>

          {/* State & District Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={selectedState}
                  onChange={(e) => {
                    handleStateChange(e.target.value);
                    if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
                  }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none bg-white font-medium text-slate-800"
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
                  }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none bg-white font-medium text-slate-800"
                >
                  {(STATE_DISTRICTS_MAP[selectedState] || []).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {errors.location && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.location}</p>}

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.register.password')}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                placeholder="Must include letters & numbers"
                className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-xs focus:ring-2 focus:outline-none ${
                  errors.password ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 focus:ring-[#166534]'
                }`}
              />
            </div>
            {errors.password && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                placeholder="Re-enter your password"
                className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-xs focus:ring-2 focus:outline-none ${
                  errors.confirmPassword ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 focus:ring-[#166534]'
                }`}
              />
            </div>
            {errors.confirmPassword && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !otpSent || otp.length !== 6}
            className="w-full py-3 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-sm font-bold shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>{loading ? t('auth.register.submitting') : 'Verify OTP & Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          {t('auth.register.hasAccount')}{' '}
          <Link to="/login" className="font-bold text-[#166534] hover:underline">
            {t('auth.register.loginLink')}
          </Link>
        </div>

      </div>
    </div>
  );
};
