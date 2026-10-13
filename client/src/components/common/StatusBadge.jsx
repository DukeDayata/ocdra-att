import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) {
    return <span className="text-xs text-slate-400 italic">None Set</span>;
  }

  let styleConfig = {
    bg: 'bg-slate-100/90 text-slate-700 border-slate-200/80',
    dot: 'bg-slate-400',
    pulse: false,
  };

  switch (status) {
    case 'Signed':
      styleConfig = {
        bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
        dot: 'bg-emerald-500',
        pulse: false,
      };
      break;
    case 'Submitted':
      styleConfig = {
        bg: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
        dot: 'bg-amber-500',
        pulse: true,
      };
      break;
    case 'For Signature':
      styleConfig = {
        bg: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
        dot: 'bg-blue-600',
        pulse: true,
      };
      break;
    case 'Return':
    case 'Disapproved':
      styleConfig = {
        bg: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
        dot: 'bg-rose-500',
        pulse: false,
      };
      break;
    case 'Generated':
    case 'Draft':
      styleConfig = {
        bg: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/30',
        dot: 'bg-indigo-500',
        pulse: false,
      };
      break;
    case 'Cancelled':
    case 'Archived':
      styleConfig = {
        bg: 'bg-slate-500/10 text-slate-600 border-slate-400/30',
        dot: 'bg-slate-400',
        pulse: false,
      };
      break;
    default:
      styleConfig = {
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        pulse: false,
      };
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-xs transition-all shadow-2xs ${styleConfig.bg}`}
    >
      <span className="relative flex h-2 w-2">
        {styleConfig.pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${styleConfig.dot}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${styleConfig.dot}`}></span>
      </span>
      {status}
    </span>
  );
};
