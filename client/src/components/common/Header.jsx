import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, PlusCircle, LayoutDashboard, Database, Menu, X, ShieldCheck, Home } from 'lucide-react';

export const Header = () => {
  const location = useLocation();
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

  const navLinkClass = (path) =>
    `px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
      isActive(path)
        ? 'bg-white/15 text-white shadow-sm border border-white/20 backdrop-blur-md'
        : 'text-slate-300 hover:text-white hover:bg-white/10'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-chedNavy via-[#0f315a] to-[#123B72] text-white shadow-lg shadow-chedNavy/20 no-print border-b border-white/10">
      {/* Top Gold Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-chedGold to-amber-500 shadow-sm"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Office Brand */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center p-2 shadow-inner border border-white/20 group-hover:scale-105 group-hover:border-chedGold/50 transition-all duration-200">
              <FileText className="w-6 h-6 text-chedGold drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-2xs uppercase tracking-widest text-chedGold font-extrabold">
                  Commission on Higher Education
                </span>
                <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[9px] font-bold rounded-full border border-emerald-400/30">
                  <ShieldCheck className="w-2.5 h-2.5" /> Official Portal
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-tight flex items-center gap-2">
                ATT Generator System
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <Link to="/" className={navLinkClass('/')}>
              <Home className="w-4 h-4 text-chedGold" />
              <span>Portal Home</span>
            </Link>

            <Link to="/att/new" className={navLinkClass('/att/new')}>
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Create ATT</span>
            </Link>

            <Link to="/admin" className={navLinkClass('/admin')}>
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>Dashboard</span>
            </Link>

            <Link to="/admin/master-data" className={navLinkClass('/admin/master-data')}>
              <Database className="w-4 h-4 text-indigo-400" />
              <span>Master Data</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-chedNavy/95 backdrop-blur-xl border-b border-white/10 px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium ${isActive('/') ? 'bg-white/15 text-white font-bold' : 'text-slate-200'}`}
          >
            <Home className="w-5 h-5 text-chedGold" />
            Portal Home
          </Link>

          <Link
            to="/att/new"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium ${isActive('/att/new') ? 'bg-white/15 text-white font-bold' : 'text-slate-200'}`}
          >
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            Create ATT Request
          </Link>

          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium ${isActive('/admin') ? 'bg-white/15 text-white font-bold' : 'text-slate-200'}`}
          >
            <LayoutDashboard className="w-5 h-5 text-blue-400" />
            Admin Dashboard
          </Link>

          <Link
            to="/admin/master-data"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium ${isActive('/admin/master-data') ? 'bg-white/15 text-white font-bold' : 'text-slate-200'}`}
          >
            <Database className="w-5 h-5 text-indigo-400" />
            Master Data Registry
          </Link>
        </div>
      )}
    </header>
  );
};

