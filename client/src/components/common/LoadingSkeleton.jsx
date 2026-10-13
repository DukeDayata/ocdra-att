import React from 'react';

export const LoadingSkeleton = ({ count = 5 }) => {
  return (
    <div className="animate-pulse space-y-4 p-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between space-x-4 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
          <div className="h-4 bg-slate-200/80 rounded-xl w-1/6"></div>
          <div className="h-4 bg-slate-200/80 rounded-xl w-1/12"></div>
          <div className="h-4 bg-slate-200/80 rounded-xl w-1/4"></div>
          <div className="h-4 bg-slate-200/80 rounded-xl w-1/6"></div>
          <div className="h-4 bg-slate-200/80 rounded-xl w-1/6"></div>
          <div className="h-8 bg-slate-200/80 rounded-xl w-24"></div>
        </div>
      ))}
    </div>
  );
};
