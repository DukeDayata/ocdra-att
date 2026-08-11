import React from 'react';
import { Files, Globe, MapPin, CheckCircle, Send, RotateCcw } from 'lucide-react';

export const AdminStatsCards = ({ stats = {} }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-2xs font-extrabold uppercase tracking-wider">Total ATTs</span>
          <div className="p-2 bg-blue-50 text-chedBlue rounded-xl border border-blue-100 group-hover:scale-110 transition-transform">
            <Files className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-slate-900">{stats.total || 0}</h3>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-2xs font-extrabold uppercase tracking-wider">Local</span>
          <div className="p-2 bg-teal-50 text-teal-600 rounded-xl border border-teal-100 group-hover:scale-110 transition-transform">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-teal-600">{stats.local || 0}</h3>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-2xs font-extrabold uppercase tracking-wider">Abroad</span>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 group-hover:scale-110 transition-transform">
            <Globe className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-indigo-600">{stats.abroad || 0}</h3>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-2xs font-extrabold uppercase tracking-wider">Signed</span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 group-hover:scale-110 transition-transform">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-emerald-600">{stats.signed || 0}</h3>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-2xs font-extrabold uppercase tracking-wider">Submitted</span>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 group-hover:scale-110 transition-transform">
            <Send className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-amber-600">{stats.submitted || 0}</h3>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-2xs font-extrabold uppercase tracking-wider">Returned</span>
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 group-hover:scale-110 transition-transform">
            <RotateCcw className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-rose-600">{stats.returned || 0}</h3>
      </div>
    </div>
  );
};

