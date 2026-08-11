import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) {
    return <span className="text-xs text-slate-400 italic">None Set</span>;
  }

  let styleClass = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'Signed':
      styleClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'Submitted':
      styleClass = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'For Signature':
      styleClass = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'Return':
    case 'Disapproved':
      styleClass = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'Generated':
    case 'Draft':
      styleClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      break;
    case 'Cancelled':
    case 'Archived':
      styleClass = 'bg-slate-100 text-slate-500 border-slate-300';
      break;
    default:
      styleClass = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styleClass}`}>
      {status}
    </span>
  );
};
