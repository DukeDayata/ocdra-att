import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusCircle, LayoutDashboard, Database, Menu, X, ShieldCheck, Home, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide header in print preview pages
  if (location.pathname.includes('/print/')) {
    return null;
  }

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path) => {
    const active = isActive(path);
    return `px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${
      active
        ? 'bg-blue-50 text-blue-700 font-extrabold border border-blue-200/80 shadow-2xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl text-slate-800 shadow-sm border-b border-slate-200/80 no-print transition-all">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4 flex-nowrap">
          {/* Logo & Office Brand */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 select-none">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50/90 rounded-2xl px-2 sm:px-2.5 py-1.5 border border-slate-200/90 shadow-2xs group-hover:border-blue-400 group-hover:shadow-sm transition-all duration-300 shrink-0">
              <img src="/assets/ched_logo.png" alt="CHED Logo" className="w-7 h-7 sm:w-9 sm:h-9 object-contain shrink-0" />
              <div className="w-px h-6 sm:h-7 bg-slate-200 shrink-0"></div>
              <img src="/assets/ocdra-logo.png" alt="OCDRA Logo" className="h-6 sm:h-8 w-auto object-contain shrink-0" />
            </div>
            <div className="shrink-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-[10px] sm:text-2xs uppercase tracking-widest text-slate-500 font-extrabold whitespace-nowrap leading-tight">
                  Commission on Higher Education
                </span>
                <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200/80 whitespace-nowrap shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Official Portal
                </span>
              </div>
              <h1 className="text-xs sm:text-base md:text-lg font-black tracking-tight text-slate-900 leading-tight whitespace-nowrap">
                ATT Generator System &bull; OCDRA
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0 flex-nowrap">
            <Link to="/" className={navLinkClass('/')}>
              <Home className={`w-4 h-4 shrink-0 ${isActive('/') ? 'text-blue-700' : 'text-slate-500'}`} />
              <span className="whitespace-nowrap">Portal Home</span>
            </Link>

            <Link
              to="/att/new"
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl text-xs sm:text-sm whitespace-nowrap shrink-0 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${
                isActive('/att/new')
                  ? 'bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-200/90 shadow-2xs'
                  : 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/60 font-bold'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="whitespace-nowrap">Create ATT</span>
            </Link>

            <Link to="/admin" className={navLinkClass('/admin')}>
              <LayoutDashboard className={`w-4 h-4 shrink-0 ${isActive('/admin') ? 'text-blue-700' : 'text-slate-500'}`} />
              <span className="whitespace-nowrap">Dashboard</span>
            </Link>

            <Link to="/admin/master-data" className={navLinkClass('/admin/master-data')}>
              <Database className={`w-4 h-4 shrink-0 ${isActive('/admin/master-data') ? 'text-blue-700' : 'text-slate-500'}`} />
              <span className="whitespace-nowrap">Master Data</span>
            </Link>

            {/* Auth State Pill */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-1 shrink-0">
                <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-2xl border border-slate-200/90 text-xs shadow-2xs shrink-0">
                  <div className="w-6 h-6 rounded-full bg-blue-700 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <span className="font-extrabold text-slate-800 text-xs truncate max-w-[100px] whitespace-nowrap">
                    {user?.username}
                  </span>
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-md text-[9px] font-black uppercase whitespace-nowrap shrink-0">
                    {user?.role || 'Admin'}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="px-3 py-1.5 sm:py-2 rounded-2xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs whitespace-nowrap shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs sm:text-sm font-black rounded-2xl shadow-sm transition flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <LogIn className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="whitespace-nowrap">Sign In</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 px-4 pt-2 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-200 shadow-lg">
          {isAuthenticated && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 mb-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-700 text-white font-black text-xs flex items-center justify-center">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <span className="font-extrabold text-slate-800 block text-xs">{user?.name || user?.username}</span>
                  <span className="text-2xs text-slate-400 font-bold uppercase">{user?.role}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs border border-rose-200 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          )}

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-2xl text-sm font-semibold transition ${
              isActive('/') ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Home className="w-5 h-5 text-blue-600" />
            Portal Home
          </Link>

          <Link
            to="/att/new"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-2xl text-sm font-semibold transition ${
              isActive('/att/new') ? 'bg-emerald-50 text-emerald-700 font-black' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            Create ATT Request
          </Link>

          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-2xl text-sm font-semibold transition ${
              isActive('/admin') ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
            Admin Dashboard
          </Link>

          <Link
            to="/admin/master-data"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-2xl text-sm font-semibold transition ${
              isActive('/admin/master-data') ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Database className="w-5 h-5 text-indigo-600" />
            Master Data Registry
          </Link>

          {!isAuthenticated && (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-sm"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              Sign In to System
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
