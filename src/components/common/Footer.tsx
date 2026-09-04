import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tractor, Shield, PhoneCall, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { user, saveReturnIntent } = useAuth();
  const navigate = useNavigate();

  const handleProtectedClick = (e: React.MouseEvent, targetPath: string) => {
    if (!user) {
      e.preventDefault();
      saveReturnIntent({ returnTo: targetPath });
      navigate('/login');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#166534] flex items-center justify-center text-white">
                <Tractor className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">KRUSHI CONNECT</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              "{t('hero.tagline')}"
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-md w-fit">
              <Shield className="w-3.5 h-3.5" />
              <span>{t('hero.statInsured')}</span>
            </div>
          </div>

          {/* Quick Links for Farmers */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer.farmers')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/equipment" className="hover:text-emerald-400 transition-colors">{t('footer.browse')}</Link></li>
              <li><Link to="/farmer/smart-match" onClick={(e) => handleProtectedClick(e, '/farmer/smart-match')} className="hover:text-emerald-400 transition-colors">{t('footer.smartMatch')}</Link></li>
              <li><Link to="/farmer/mandi" onClick={(e) => handleProtectedClick(e, '/farmer/mandi')} className="hover:text-emerald-400 transition-colors">{t('footer.mandiRates')}</Link></li>
              <li><Link to="/farmer/planning" onClick={(e) => handleProtectedClick(e, '/farmer/planning')} className="hover:text-emerald-400 transition-colors">{t('footer.farmPlanning')}</Link></li>
            </ul>
          </div>

          {/* Quick Links for Owners */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer.owners')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/owner/equipment/add" className="hover:text-emerald-400 transition-colors">{t('footer.listEquipment')}</Link></li>
              <li><Link to="/owner/dashboard" className="hover:text-emerald-400 transition-colors">{t('nav.dashboard')}</Link></li>
              <li><Link to="/owner/maintenance" className="hover:text-emerald-400 transition-colors">{t('footer.maintenance')}</Link></li>
              <li><Link to="/owner/analytics" className="hover:text-emerald-400 transition-colors">{t('footer.analytics')}</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+91 1800 123 4567 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>support@krushi.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>AgriTech Innovation Hub, India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {t('footer.copyright')}</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>{t('footer.madeWith')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
