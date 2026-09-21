import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import {
  Tractor,
  Mail,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

type Step = 'EMAIL' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  /* ─── Step 1: Send OTP ─────────────────────────────── */
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: normalizedEmail })
      });
      setEmail(normalizedEmail);
      setStep('OTP');
      startResendCooldown();
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Resend OTP cooldown (60 s) ──────────────────── */
  const startResendCooldown = () => {
    setResendCooldown(60);
    const iv = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(iv); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      setLoading(true);
      setError(null);
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      startResendCooldown();
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Step 2: Verify OTP → go to step 3 ─────────── */
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6 || !/^\d{6}$/.test(otp.trim())) {
      setError('Please enter the 6-digit code sent to your email.');
      return;
    }
    setError(null);
    setStep('NEW_PASSWORD');
  };

  /* ─── Step 3: Reset password ─────────────────────── */
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setError('Password must contain at least one letter and one number.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setLoading(true);
      await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp: otp.trim(), newPassword })
      });
      setStep('SUCCESS');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Step indicator helper ──────────────────────── */
  const steps: Step[] = ['EMAIL', 'OTP', 'NEW_PASSWORD'];
  const stepIndex = steps.indexOf(step);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xl space-y-6">

        {/* Brand */}
        <div className="text-center space-y-2">
          <img
            src="/logo.png"
            alt="KrushiConnect Logo"
            className="h-16 w-auto mx-auto object-contain drop-shadow-sm"
          />
          <h2 className="text-2xl font-extrabold text-slate-900">
            {step === 'SUCCESS' ? 'Password Reset!' : 'Forgot Password'}
          </h2>
          <p className="text-xs text-slate-500">
            {step === 'EMAIL' && 'Enter your registered email to receive a reset code.'}
            {step === 'OTP' && `Enter the 6-digit code sent to ${email}`}
            {step === 'NEW_PASSWORD' && 'Set your new password below.'}
            {step === 'SUCCESS' && 'Your password has been updated successfully.'}
          </p>
        </div>

        {/* Step Indicator */}
        {step !== 'SUCCESS' && (
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  i < stepIndex
                    ? 'bg-[#166534] border-[#166534] text-white'
                    : i === stepIndex
                    ? 'border-[#166534] text-[#166534] bg-white'
                    : 'border-slate-200 text-slate-400 bg-white'
                }`}>
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded ${i < stepIndex ? 'bg-[#166534]' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ── STEP 1: Email ── */}
        {step === 'EMAIL' && (
          <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  required
                  autoFocus
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-sm font-bold shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Sending Code…' : 'Send Reset Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>A 6-digit code was sent to <strong>{email}</strong>. Check your inbox (and spam folder).</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Verification Code</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="• • • • • •"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm font-bold tracking-widest focus:ring-2 focus:ring-[#166534] focus:outline-none text-center"
                  required
                  autoFocus
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-3 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-sm font-bold shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>Verify Code</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-center text-xs text-slate-500">
              Didn't receive it?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className="font-bold text-[#166534] hover:underline disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: New Password ── */}
        {step === 'NEW_PASSWORD' && (
          <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min. 6 chars, 1 letter & 1 number"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength hints */}
              {newPassword.length > 0 && (
                <div className="mt-1.5 flex gap-2 text-[11px]">
                  <span className={newPassword.length >= 6 ? 'text-emerald-600' : 'text-rose-500'}>
                    {newPassword.length >= 6 ? '✓' : '✗'} 6+ chars
                  </span>
                  <span className={/[A-Za-z]/.test(newPassword) ? 'text-emerald-600' : 'text-rose-500'}>
                    {/[A-Za-z]/.test(newPassword) ? '✓' : '✗'} letter
                  </span>
                  <span className={/\d/.test(newPassword) ? 'text-emerald-600' : 'text-rose-500'}>
                    {/\d/.test(newPassword) ? '✓' : '✗'} number
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <p className={`mt-1 text-[11px] ${newPassword === confirmPassword ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-sm font-bold shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Resetting Password…' : 'Reset Password'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ── SUCCESS ── */}
        {step === 'SUCCESS' && (
          <div className="text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your password has been changed successfully. Please log in with your new credentials.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Back to login */}
        {step !== 'SUCCESS' && (
          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Remember your password?{' '}
            <Link to="/login" className="font-bold text-[#166534] hover:underline">
              Sign In
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
