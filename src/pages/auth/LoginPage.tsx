import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Tractor, Lock, Mail, AlertCircle, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const LoginPage: React.FC = () => {
  const { login, returnIntent, clearReturnIntent } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const user = await login(normalizedEmail, password);

      // Check if user came from a high-intent return action (e.g. Smart Match or Mandi)
      if (returnIntent && returnIntent.returnTo) {
        const dest = returnIntent.returnTo;
        clearReturnIntent();
        navigate(dest);
      } else {
        // Navigate based on role
        if (user.role === 'FARMER') {
          navigate('/farmer/dashboard');
        } else {
          navigate('/owner/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || t('auth.login.error'));
    } finally {
      setLoading(false);
    }
  };

  const getNoticeMessage = () => {
    if (!returnIntent) return null;
    if (returnIntent.returnTo.includes('smart-match')) {
      return (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Please log in first to access the <strong>Smart Match</strong> feature.</span>
        </div>
      );
    }
    if (returnIntent.returnTo.includes('mandi')) {
      return (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Please log in first to access <strong>Mandi Intelligence & Price Trends</strong>.</span>
        </div>
      );
    }
    return (
      <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>{t('auth.login.intentNotice')}</span>
      </div>
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xl space-y-6">
        
        {/* Brand Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#166534] text-white flex items-center justify-center mx-auto shadow-md">
            <Tractor className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">{t('auth.login.title')}</h2>
          <p className="text-xs text-slate-500">{t('auth.login.subtitle')}</p>
        </div>

        {/* Return Intent Notice if redirected */}
        {getNoticeMessage()}

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Standard Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.login.email')}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@krushi.com / owner@krushi.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.login.password')}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-sm font-bold shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? t('auth.login.submitting') : t('auth.login.submit')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Register Link */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          {t('auth.login.noAccount')}{' '}
          <Link to="/register" className="font-bold text-[#166534] hover:underline">
            {t('auth.login.registerLink')}
          </Link>
        </div>

      </div>
    </div>
  );
};

