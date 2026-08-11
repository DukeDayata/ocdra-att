import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, LayoutDashboard, Database, Shield, Navigation, ArrowRight, CheckCircle2, Globe, MapPin, Sparkles, Clock } from 'lucide-react';
import { attApi } from '../services/api';

export const MainPortal = () => {
  const [stats, setStats] = useState({ total: 0, local: 0, abroad: 0, signed: 0 });

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

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col justify-center">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-chedNavy via-chedBlue to-blue-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-chedNavy/10 mb-8 border border-white/10">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-chedGold/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden md:block">
          <Shield className="w-48 h-48 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-chedGold text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-chedGold" />
            Office of Commissioner Apag &bull; CHED Central
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Authority to Travel (ATT) Management Platform
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 mt-3 leading-relaxed">
            Official government system for generating, tracking, and approving local and international institutional travel authorizations.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/15">
              <span className="text-blue-200 block text-2xs uppercase tracking-wider font-semibold">Total ATTs</span>
              <span className="text-xl font-black text-white mt-0.5 block">{stats.total || 0}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/15">
              <span className="text-teal-200 block text-2xs uppercase tracking-wider font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-300" /> Local
              </span>
              <span className="text-xl font-black text-white mt-0.5 block">{stats.local || 0}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/15">
              <span className="text-indigo-200 block text-2xs uppercase tracking-wider font-semibold flex items-center gap-1">
                <Globe className="w-3 h-3 text-indigo-300" /> Abroad
              </span>
              <span className="text-xl font-black text-white mt-0.5 block">{stats.abroad || 0}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/15">
              <span className="text-emerald-200 block text-2xs uppercase tracking-wider font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-300" /> Signed
              </span>
              <span className="text-xl font-black text-white mt-0.5 block">{stats.signed || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create ATT Card */}
        <Link
          to="/att/new"
          className="group relative bg-white p-7 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:border-chedBlue/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:h-2 transition-all"></div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
                <FilePlus className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-2xs font-extrabold rounded-full border border-emerald-200 uppercase tracking-wider">
                New Request
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-chedBlue transition-colors">
              Create Travel Request (ATT)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Generate standardized Local or International Authority to Travel documents with complete personnel manifests and expense allocations.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
            <span>Start New Form</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Admin Dashboard Card */}
        <Link
          to="/admin"
          className="group relative bg-white p-7 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:border-chedBlue/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-chedNavy to-chedBlue group-hover:h-2 transition-all"></div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-blue-50 text-chedBlue rounded-2xl flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                <LayoutDashboard className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 bg-blue-50 text-chedBlue text-2xs font-extrabold rounded-full border border-blue-200 uppercase tracking-wider">
                Records Portal
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-chedBlue transition-colors">
              Admin Dashboard & Records
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Search, filter, update approval statuses, view audit history, print documents, and manage historical travel records.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-chedBlue group-hover:text-blue-800">
            <span>View All Records</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Auxiliary Utilities Grid */}
      <div className="mt-8 bg-slate-100/70 p-5 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="p-2 bg-white rounded-xl text-indigo-600 shadow-sm border border-slate-200">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">Master Personnel & Signatories</span>
            <span className="text-slate-500 text-2xs">Manage personnel database and designated authority approvers</span>
          </div>
        </div>

        <Link
          to="/admin/master-data"
          className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold rounded-xl shadow-sm transition flex items-center gap-2 whitespace-nowrap"
        >
          <span>Open Registry</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>
    </div>
  );
};

