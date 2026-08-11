import React from 'react';
import { FolderOpen, RefreshCw } from 'lucide-react';

export const EmptyState = ({ title = 'No records found', message = 'There are no items matching your request.', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 my-4">
      <div className="p-4 bg-slate-100 text-slate-400 rounded-full mb-3">
        <FolderOpen className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl shadow-sm transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      )}
    </div>
  );
};
