import React from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, Sparkles } from 'lucide-react';

export const Footer = () => {
  const location = useLocation();

  if (location.pathname.includes('/print/')) {
    return null;
  }

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs no-print border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-white/20 shadow-sm shrink-0">
            <img src="/assets/ched_logo.png" alt="CHED Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" />
            <div className="w-px h-5 sm:h-6 bg-slate-200 shrink-0"></div>
            <img src="/assets/ocdra-logo.png" alt="OCDRA Logo" className="h-6 sm:h-7 w-auto object-contain shrink-0" />
          </div>
          <div>
            <div className="font-bold text-slate-200">Commission on Higher Education</div>
            <div className="text-[11px] text-slate-400">Office of Commissioner Apag &bull; OCDRA &bull; ATT Generator Platform</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            System Live & Operating
          </span>
          <span>v2.0 &bull; 2026</span>
        </div>
      </div>
    </footer>
  );
};

