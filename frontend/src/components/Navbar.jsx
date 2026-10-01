import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserAvatar } from './UserAvatar';
import { useTranslation } from '../context/LanguageContext';
import {
  Compass,
  BookOpen,
  Award,
  Flame,
  User,
  LogOut,
  Users,
  Briefcase,
  MapPin,
  Menu,
  X,
  ShieldCheck,
  Languages
} from 'lucide-react';

export const Navbar = ({ user, onOpenAuth, onLogout }) => {
  const location = useLocation();
  const { t, lang, setLang } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t('nav.explore'), path: '/' },
    { label: t('nav.learning'), path: '/courses' },
    { label: t('nav.passport'), path: '/skill-passport' },
    { label: t('nav.peers'), path: '/peers' },
  ];

  if (user?.role === 'super_admin') {
    navItems.push({ label: t('nav.admin'), path: '/admin', icon: ShieldCheck });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-300 bg-slate-900/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-5">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-900 via-blue-700 to-red-600 flex items-center justify-center shadow-lg shadow-blue-900/40 text-white font-extrabold text-lg tracking-wider border border-blue-400/30">
              H
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white group-hover:text-blue-300 transition-colors">
                  The Hub
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? 'text-white bg-blue-800/80 font-bold shadow-sm border border-blue-600/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.icon && <item.icon className="w-3.5 h-3.5" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700 mr-2">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all ${
                lang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('rw')}
              className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all ${
                lang === 'rw' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              RW
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
                  <UserAvatar user={user} size="sm" className="ring-2 ring-blue-500" />
                </Link>
                <button
                  onClick={onLogout}
                  className="hidden sm:block p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth()}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('nav.signin')}</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col p-4 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-blue-900 text-white border border-blue-700'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
