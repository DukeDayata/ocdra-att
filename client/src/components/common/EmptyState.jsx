import React from 'react';
import { FolderOpen, RefreshCw } from 'lucide-react';

export const EmptyState = ({ title = 'No records found', message = 'There are no items matching your request.', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 sm:p-16 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200/90 my-6 mx-4">
      <div className="p-4 bg-white text-blue-700 rounded-2xl shadow-sm border border-slate-200/80 mb-4">
        <FolderOpen className="w-8 h-8" />
      </div>
      <h4 className="text-base font-black text-slate-900 mb-1.5 tracking-tight">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mb-5 font-medium leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 font-extrabold text-xs rounded-2xl shadow-sm transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
          <span>Reload Records</span>
        </button>
      )}
    </div>
  );
};
