import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FilePlus, 
  LayoutDashboard, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  MapPin, 
  Search, 
  ShieldCheck, 
  Layers, 
  ChevronRight,
  TrendingUp,
  FileCheck,
  Lock,
  Plane,
  Receipt,
  FileSignature,
  Printer,
  SlidersHorizontal,
  Shield,
  FileText
} from 'lucide-react';
import { attApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const MainPortal = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ total: 0, local: 0, abroad: 0, signed: 0 });
  const [quickSearchRef, setQuickSearchRef] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await attApi.getStats();
        if (res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load stats on portal:', err);
      }
    };
    loadStats();
  }, []);

  const handleQuickLookup = (e) => {
    e.preventDefault();
    if (quickSearchRef.trim()) {
      navigate(`/att/${quickSearchRef.trim()}`);
    }
  };

  return (
    <div className="min-h-[85vh] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center space-y-8">
      {/* Top Welcome Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#06172A] via-[#0A2647] to-[#0E3A75] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl shadow-[#06172A]/25 border border-white/15">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Watermark Emblems in Background */}
        <div className="absolute top-6 right-6 sm:top-10 sm:right-10 opacity-10 pointer-events-none hidden lg:flex items-center gap-6">
          <img src="/assets/ched_logo.png" alt="CHED Seal Watermark" className="w-44 h-44 object-contain filter drop-shadow-2xl" />
          <img src="/assets/ocdra-logo.png" alt="OCDRA Seal Watermark" className="w-44 h-44 object-contain filter drop-shadow-2xl" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Header pill & Logos */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/95 rounded-2xl p-2 shadow-2xl shadow-black/40 border-2 border-amber-400/80 shrink-0 flex items-center justify-center backdrop-blur-md transition-transform duration-300 hover:scale-105">
                <img src="/assets/ched_logo.png" alt="Commission on Higher Education Logo" className="max-w-full max-h-full object-contain drop-shadow" />
              </div>
              <div className="h-10 w-px bg-white/20 hidden sm:block"></div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/95 rounded-2xl p-2 shadow-2xl shadow-black/40 border-2 border-amber-400/80 shrink-0 flex items-center justify-center backdrop-blur-md transition-transform duration-300 hover:scale-105">
                <img src="/assets/ocdra-logo.png" alt="Office of Commissioner Designate Rody P. Apag Logo" className="max-w-full max-h-full object-contain drop-shadow" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-slate-200 text-xs font-bold uppercase tracking-wider border border-white/15 shadow-inner">
                  <Shield className="w-3.5 h-3.5 text-blue-300" />
                  Office of Commissioner Apag &bull; OCDRA
                </div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-400/20 backdrop-blur-md rounded-full text-amber-200 text-xs font-black uppercase tracking-wider border border-amber-400/40 shadow-inner">
                  <Lock className="w-3 h-3 text-amber-300" />
                  For OCDRA Staff Use Only
                </div>
                {isAuthenticated && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-md rounded-full text-emerald-300 text-xs font-bold border border-emerald-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Signed in as {user?.username} ({user?.role})
                  </div>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Authority to Travel <span className="text-amber-400 font-extrabold">(ATT)</span> System
              </h1>
            </div>
          </div>

          <p className="text-sm sm:text-base text-blue-100/95 leading-relaxed font-normal max-w-3xl">
            This system is for OCDRA staff use only. Official internal management platform for generating, reviewing, tracking, and processing official travel orders (ATT) for both local and foreign delegations.
          </p>

          {/* Quick Lookup Bar */}
          <form onSubmit={handleQuickLookup} className="pt-2 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 focus-within:border-amber-400/90 focus-within:bg-white/15 transition-all shadow-lg">
              <Search className="w-5 h-5 text-blue-200 ml-3 shrink-0" />
              <input
                type="text"
                value={quickSearchRef}
                onChange={(e) => setQuickSearchRef(e.target.value)}
                placeholder="Enter Reference No. (e.g. ATT-2026-001)..."
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-blue-200/60 focus:outline-none font-medium"
              />
              <button
                type="submit"
                className="px-4 sm:px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl transition shadow-md whitespace-nowrap flex items-center gap-1.5"
              >
                <span>Track ATT</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4 text-xs">
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/15 transition-all group">
              <span className="text-blue-200 block text-2xs uppercase tracking-widest font-extrabold flex items-center justify-between">
                <span>Total ATTs</span>
                <Layers className="w-3.5 h-3.5 text-blue-300 opacity-60 group-hover:opacity-100" />
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white mt-1 block tracking-tight font-mono">{stats.total || 0}</span>
            </div>

            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/15 transition-all group">
              <span className="text-teal-200 block text-2xs uppercase tracking-widest font-extrabold flex items-center justify-between">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-teal-300" /> Local</span>
                <TrendingUp className="w-3.5 h-3.5 text-teal-300 opacity-60 group-hover:opacity-100" />
              </span>
              <span className="text-2xl sm:text-3xl font-black text-teal-300 mt-1 block tracking-tight font-mono">{stats.local || 0}</span>
            </div>

            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/15 transition-all group">
              <span className="text-indigo-200 block text-2xs uppercase tracking-widest font-extrabold flex items-center justify-between">
                <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-indigo-300" /> Abroad</span>
                <Globe className="w-3.5 h-3.5 text-indigo-300 opacity-60 group-hover:opacity-100" />
              </span>
              <span className="text-2xl sm:text-3xl font-black text-indigo-300 mt-1 block tracking-tight font-mono">{stats.abroad || 0}</span>
            </div>

            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/15 transition-all group">
              <span className="text-emerald-200 block text-2xs uppercase tracking-widest font-extrabold flex items-center justify-between">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-300" /> Signed</span>
                <FileCheck className="w-3.5 h-3.5 text-emerald-300 opacity-60 group-hover:opacity-100" />
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1 block tracking-tight font-mono">{stats.signed || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create ATT Card */}
        <Link
          to="/att/new"
          className="group relative bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 group-hover:h-2 transition-all"></div>

          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-200/80 shadow-sm group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <FilePlus className="w-7 h-7" />
              </div>
              <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-2xs font-extrabold rounded-full border border-emerald-200 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                New Application
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight">
              Create Travel Request (ATT)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2.5 leading-relaxed font-medium">
              Draft official Local or Foreign Travel Authorizations with standardized expense computation, multi-personnel manifests, and certified signatory matrices.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200/70 text-slate-700 rounded-lg text-xs font-bold transition-colors">
                <Plane className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Local & Foreign Scope
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200/70 text-slate-700 rounded-lg text-xs font-bold transition-colors">
                <Receipt className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Expense Allocation Matrix
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200/70 text-slate-700 rounded-lg text-xs font-bold transition-colors">
                <FileSignature className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                Certified Signatories
              </span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-emerald-600 group-hover:text-emerald-700">
            <span>Start New Application</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all duration-200">
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Admin Dashboard Card */}
        <Link
          to="/admin"
          className="group relative bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#06172A] via-[#0A2647] to-[#0F3F7E] group-hover:h-2 transition-all"></div>

          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center border border-blue-200/80 shadow-sm group-hover:scale-110 group-hover:bg-blue-700 group-hover:text-white transition-all duration-300">
                <LayoutDashboard className="w-7 h-7" />
              </div>
              <span className="px-3.5 py-1.5 bg-blue-50 text-blue-700 text-2xs font-extrabold rounded-full border border-blue-200 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Records Center
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 group-hover:text-blue-700 transition-colors tracking-tight">
              Admin Dashboard & Records
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2.5 leading-relaxed font-medium">
              Search, filter, update approval workflows, print official travel orders, view full audit logs, and manage historical institutional travel archives.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200/70 text-slate-700 rounded-lg text-xs font-bold transition-colors">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Advanced Filtering
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200/70 text-slate-700 rounded-lg text-xs font-bold transition-colors">
                <Printer className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                Official Document Print
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200/70 text-slate-700 rounded-lg text-xs font-bold transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Status Verification
              </span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-blue-700 group-hover:text-blue-800">
            <span>Explore All Records</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-700 group-hover:text-white flex items-center justify-center transition-all duration-200">
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* Auxiliary Registry & Status Bento */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 text-slate-700">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm border border-indigo-100 shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-sm block">Master Personnel & Signatories Registry</span>
            <span className="text-slate-500 text-xs font-medium">Manage personnel database, certified designations, and authorized approval authorities</span>
          </div>
        </div>

        <Link
          to="/admin/master-data"
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <span>Open Registry</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </Link>
      </div>

      {/* Internal Security & Policy Notice Footnote */}
      <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-slate-500 text-xs flex items-center gap-3">
        <Shield className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="leading-relaxed">
          <strong className="text-slate-700 font-bold">Official Government System Notice:</strong> Access to this portal is restricted exclusively to authorized staff of the Office of Commissioner Rody P. Apag (OCDRA). All document issuances conform to CHED regulatory guidelines and official Commission En Banc travel policies.
        </span>
      </div>
    </div>
  );
};
