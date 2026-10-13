import React from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, Sparkles, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  const location = useLocation();

  if (location.pathname.includes('/print/')) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-r from-[#06172A] via-[#081F3B] to-[#0A2548] text-slate-400 text-xs no-print border-t border-white/10 mt-20 shadow-2xl">
      {/* Accent top gold line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2 bg-white/95 px-2.5 py-1.5 rounded-2xl border border-white/30 shadow-md shadow-black/20 shrink-0">
            <img src="/assets/ched_logo.png" alt="CHED Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" />
            <div className="w-px h-5 sm:h-6 bg-slate-200 shrink-0"></div>
            <img src="/assets/ocdra-logo.png" alt="OCDRA Logo" className="h-6 sm:h-7 w-auto object-contain shrink-0" />
          </div>
          <div>
            <div className="font-extrabold text-white text-sm tracking-tight">Commission on Higher Education</div>
            <div className="text-[11px] text-slate-300 font-medium">Office of Commissioner Apag &bull; OCDRA &bull; ATT Generator Platform</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300 text-xs">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-200 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-semibold text-[11px]">System Operating &bull; Active</span>
          </span>
          <span className="text-slate-400 text-[11px] font-mono">OCDRA ATT v2.5 &bull; 2026</span>
        </div>
      </div>
    </footer>
  );
};
