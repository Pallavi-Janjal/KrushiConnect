import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n/translations';
import { Tractor, Bell, PlusCircle, LogOut, LayoutDashboard, Sparkles, TrendingUp, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout, saveReturnIntent } = useAuth();
  const { unreadNotifsCount } = useApp();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAddEquipmentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      saveReturnIntent({ returnTo: '/owner/equipment/add', action: 'ADD_EQUIPMENT' });
      navigate('/login');
    } else if (user.role === 'EQUIPMENT_OWNER') {
      navigate('/owner/equipment/add');
    } else {
      navigate('/owner/equipment/add');
    }
  };

  const handleProtectedNavClick = (e: React.MouseEvent, targetPath: string) => {
    if (!user) {
      e.preventDefault();
      saveReturnIntent({ returnTo: targetPath });
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Top-Left Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#166534] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#166534] block leading-none">
                KRUSHI CONNECT
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                Smart Farming
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Center */}
          <nav className="hidden md:flex items-center space-x-5 text-sm font-medium">
            <Link 
              to="/equipment" 
              className={`transition-colors hover:text-[#166534] ${location.pathname === '/equipment' ? 'text-[#166534] font-bold border-b-2 border-[#166534] pb-1' : 'text-slate-600'}`}
            >
              {t('nav.browse')}
            </Link>
            
            <Link 
              to="/farmer/smart-match" 
              onClick={(e) => handleProtectedNavClick(e, '/farmer/smart-match')}
              className={`flex items-center gap-1 transition-colors hover:text-[#166534] ${location.pathname === '/farmer/smart-match' ? 'text-[#166534] font-bold border-b-2 border-[#166534] pb-1' : 'text-slate-600'}`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              {t('nav.smartMatch')}
            </Link>

            <Link 
              to="/mandi" 
              onClick={(e) => handleProtectedNavClick(e, '/mandi')}
              className={`flex items-center gap-1 transition-colors hover:text-[#166534] ${location.pathname === '/mandi' || location.pathname === '/farmer/mandi' ? 'text-[#166534] font-bold border-b-2 border-[#166534] pb-1' : 'text-slate-600'}`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              {t('nav.mandi')}
            </Link>
          </nav>

          {/* Top-Right Action Controls */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Add Equipment CTA Button — hidden for Farmers */}
            {(!user || user.role === 'EQUIPMENT_OWNER') && (
              <button
                onClick={handleAddEquipmentClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-[#166534] hover:bg-emerald-100 text-xs font-bold border border-emerald-200/80 transition-colors shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-[#166534]" />
                <span>{t('nav.addEquipment')}</span>
              </button>
            )}

            {/* Language Selector Dropdown */}
            <div className="flex items-center border-l border-slate-200 pl-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-extrabold text-slate-800 bg-slate-50 focus:ring-2 focus:ring-[#166534] focus:outline-none cursor-pointer"
              >
                <option value="en">🇬🇧 EN</option>
                <option value="hi">🇮🇳 हिंदी</option>
                <option value="mr">🇮🇳 मराठी</option>
              </select>
            </div>

            {!user ? (
              /* Unauthenticated State */
              <div className="flex items-center gap-2 pl-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-[#166534] transition-colors"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg bg-[#166534] hover:bg-[#004C22] text-white text-xs font-bold shadow-sm transition-all"
                >
                  {t('nav.register')}
                </Link>
              </div>
            ) : (
              /* Authenticated State */
              <div className="flex items-center gap-3 pl-2">
                
                {/* Notifications Bell */}
                <Link
                  to={user.role === 'FARMER' ? '/farmer/notifications' : '/owner/notifications'}
                  className="relative p-1.5 text-slate-600 hover:text-[#166534] hover:bg-slate-100 rounded-full transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                      {unreadNotifsCount}
                    </span>
                  )}
                </Link>

                {/* Dashboard Shortcut — icon only */}
                <Link
                  to={user.role === 'FARMER' ? '/farmer/dashboard' : '/owner/dashboard'}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                  title={t('nav.dashboard')}
                >
                  <LayoutDashboard className="w-5 h-5 text-[#166534]" />
                </Link>

                {/* User Avatar & Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div className="hidden lg:block text-xs text-left">
                    <span className="font-semibold text-slate-900 block leading-tight truncate max-w-[90px]">{user.name}</span>
                    <span className="text-[9px] text-slate-500 uppercase font-medium">{user.role.replace('_', ' ')}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                    title={t('nav.logout')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-2 py-1 rounded-md text-xs font-bold bg-slate-100 border border-slate-200"
            >
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link
            to="/equipment"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            {t('nav.browse')}
          </Link>
          <Link
            to="/farmer/smart-match"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleProtectedNavClick(e, '/farmer/smart-match');
            }}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            {t('nav.smartMatch')}
          </Link>
          <Link
            to="/farmer/mandi"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleProtectedNavClick(e, '/farmer/mandi');
            }}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            {t('nav.mandi')}
          </Link>

          {!user ? (
            <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-semibold rounded-lg bg-slate-100 text-slate-800"
              >
                {t('nav.signIn')}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-semibold rounded-lg bg-[#166534] text-white"
              >
                {t('nav.register')}
              </Link>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="px-3 py-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-500 uppercase">{user.role}</div>
                </div>
              </div>
              <Link
                to={user.role === 'FARMER' ? '/farmer/dashboard' : '/owner/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                {t('nav.dashboard')}
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                {t('nav.logout')}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
