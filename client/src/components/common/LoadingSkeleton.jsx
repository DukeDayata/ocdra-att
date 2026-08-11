import React from 'react';

export const LoadingSkeleton = ({ count = 5 }) => {
  return (
    <div className="animate-pulse space-y-4 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between space-x-4">
          <div className="h-4 bg-slate-200 rounded w-1/6"></div>
          <div className="h-4 bg-slate-200 rounded w-1/12"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/6"></div>
          <div className="h-4 bg-slate-200 rounded w-1/6"></div>
          <div className="h-8 bg-slate-200 rounded w-24"></div>
        </div>
      ))}
    </div>
  );
};
