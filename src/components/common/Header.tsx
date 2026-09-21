import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Language } from '../../i18n/translations';
import { Tractor, Bell, PlusCircle, LogOut, LayoutDashboard, Sparkles, TrendingUp, Menu, X, Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout, saveReturnIntent } = useAuth();
  const { unreadNotifsCount } = useApp();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
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
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs print:hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Top-Left Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#166534] dark:bg-emerald-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#166534] dark:text-emerald-400 block leading-none">
                KRUSHI CONNECT
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                Smart Farming
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Center */}
          <nav className="hidden md:flex items-center space-x-5 text-sm font-medium">
            <Link 
              to="/equipment" 
              className={`transition-colors ${location.pathname === '/equipment' ? 'text-[#166534] dark:text-emerald-400 font-bold border-b-2 border-[#166534] dark:border-emerald-400 pb-1' : 'text-slate-600 dark:text-slate-300 hover:text-[#166534] dark:hover:text-emerald-400'}`}
            >
              {t('nav.browse')}
            </Link>
            
            <Link 
              to="/farmer/smart-match" 
              onClick={(e) => handleProtectedNavClick(e, '/farmer/smart-match')}
              className={`flex items-center gap-1 transition-colors ${location.pathname === '/farmer/smart-match' ? 'text-[#166534] dark:text-emerald-400 font-bold border-b-2 border-[#166534] dark:border-emerald-400 pb-1' : 'text-slate-600 dark:text-slate-300 hover:text-[#166534] dark:hover:text-emerald-400'}`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              {t('nav.smartMatch')}
            </Link>

            <Link 
              to="/mandi" 
              onClick={(e) => handleProtectedNavClick(e, '/mandi')}
              className={`flex items-center gap-1 transition-colors ${location.pathname === '/mandi' || location.pathname === '/farmer/mandi' ? 'text-[#166534] dark:text-emerald-400 font-bold border-b-2 border-[#166534] dark:border-emerald-400 pb-1' : 'text-slate-600 dark:text-slate-300 hover:text-[#166534] dark:hover:text-emerald-400'}`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {t('nav.mandi')}
            </Link>
          </nav>

          {/* Top-Right Action Controls */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Add Equipment CTA Button — hidden for Farmers */}
            {(!user || user.role === 'EQUIPMENT_OWNER') && (
              <button
                onClick={handleAddEquipmentClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#166534] dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-bold border border-emerald-200/80 dark:border-emerald-800/80 transition-colors shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#166534] dark:text-emerald-400" />
                <span>{t('nav.addEquipment')}</span>
              </button>
            )}

            {/* Language Selector Dropdown */}
            <div className="flex items-center border-l border-slate-200 dark:border-slate-800 pl-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#166534] dark:focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="en">🇬🇧 EN</option>
                <option value="hi">🇮🇳 हिंदी</option>
                <option value="mr">🇮🇳 मराठी</option>
              </select>
            </div>

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              type="button"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#166534] dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {!user ? (
              /* Unauthenticated State */
              <div className="flex items-center gap-2 pl-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#166534] dark:hover:text-emerald-400 transition-colors"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg bg-[#166534] hover:bg-[#004C22] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
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
                  className="relative p-1.5 text-slate-600 dark:text-slate-300 hover:text-[#166534] dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
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
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title={t('nav.dashboard')}
                >
                  <LayoutDashboard className="w-5 h-5 text-[#166534] dark:text-emerald-400" />
                </Link>

                {/* User Avatar & Profile Link */}
                <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
                    title="View & Edit Profile"
                  >
                    <div className="relative w-8 h-8 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden ring-2 ring-transparent group-hover:ring-emerald-500 transition-all">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;
                          }}
                        />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="hidden lg:block text-xs text-left">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 block leading-tight truncate max-w-[100px] group-hover:text-[#166534] dark:group-hover:text-emerald-400 transition-colors">{user.name}</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-medium">{user.role.replace('_', ' ')}</span>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors ml-0.5 cursor-pointer"
                    title={t('nav.logout')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              type="button"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400 fill-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-2 py-1 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link
            to="/equipment"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t('nav.browse')}
          </Link>
          <Link
            to="/farmer/smart-match"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleProtectedNavClick(e, '/farmer/smart-match');
            }}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t('nav.smartMatch')}
          </Link>
          <Link
            to="/farmer/mandi"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleProtectedNavClick(e, '/farmer/mandi');
            }}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t('nav.mandi')}
          </Link>

          {!user ? (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                {t('nav.signIn')}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-semibold rounded-lg bg-[#166534] dark:bg-emerald-600 text-white"
              >
                {t('nav.register')}
              </Link>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 transition-colors border border-slate-200/80 dark:border-slate-700/80"
              >
                <div className="w-10 h-10 rounded-full bg-[#166534] dark:bg-emerald-700 text-white flex items-center justify-center font-bold text-sm overflow-hidden ring-2 ring-emerald-500/20 shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;
                      }}
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span>View & Edit Profile</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
              <Link
                to={user.role === 'FARMER' ? '/farmer/dashboard' : '/owner/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {t('nav.dashboard')}
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
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
