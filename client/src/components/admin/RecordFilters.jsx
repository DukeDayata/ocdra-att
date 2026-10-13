import React from 'react';
import { Search, Filter, Calendar, LayoutGrid, List, RotateCcw, SlidersHorizontal } from 'lucide-react';

export const RecordFilters = ({
  filters,
  onFilterChange,
  pageSize,
  onPageSizeChange,
  viewMode = 'table',
  onViewModeChange
}) => {
  const hasActiveFilters =
    filters.search ||
    filters.attType !== 'All' ||
    filters.status !== 'All' ||
    filters.startDate ||
    filters.endDate;

  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-200/90 mb-6 space-y-4">
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full lg:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Search by reference, personnel, destination, purpose..."
            className="w-full min-h-11 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition shadow-2xs font-medium"
          />
        </div>

        {/* Controls & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          {/* View Mode Switcher */}
          {onViewModeChange && (
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 mr-1 shadow-inner">
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'table' ? 'bg-white text-blue-700 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'grid' ? 'bg-white text-blue-700 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
            </div>
          )}

          {/* Type Filter */}
          <select
            value={filters.attType}
            onChange={(e) => onFilterChange('attType', e.target.value)}
            className="min-h-10 bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-2xl px-3.5 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer shadow-2xs"
          >
            <option value="All">All Types</option>
            <option value="Local">Local Travel</option>
            <option value="Abroad">Travel Abroad</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="min-h-10 bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-2xl px-3.5 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer shadow-2xs"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Generated">Generated</option>
            <option value="Submitted">Submitted</option>
            <option value="For Signature">For Signature</option>
            <option value="Signed">Signed</option>
            <option value="Return">Return</option>
            <option value="Disapproved">Disapproved</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Sort By */}
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="min-h-10 bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-2xl px-3.5 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer shadow-2xs"
          >
            <option value="createdAt">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="referenceNo">Reference No</option>
            <option value="datePrepared">Date Prepared</option>
          </select>

          {/* Rows Per Page */}
          <div className="flex items-center gap-1.5 ml-1">
            <span className="text-2xs text-slate-400 font-extrabold uppercase tracking-wider">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="min-h-10 bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-2xl px-2.5 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer shadow-2xs font-extrabold"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Date Range Inputs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-bold text-slate-600 text-2xs uppercase tracking-wider">Date From:</span>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onFilterChange('startDate', e.target.value)}
              className="border-0 bg-transparent text-xs text-slate-800 font-medium focus:outline-none focus:ring-0 p-0"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-bold text-slate-600 text-2xs uppercase tracking-wider">Date To:</span>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onFilterChange('endDate', e.target.value)}
              className="border-0 bg-transparent text-xs text-slate-800 font-medium focus:outline-none focus:ring-0 p-0"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              onFilterChange('search', '');
              onFilterChange('attType', 'All');
              onFilterChange('status', 'All');
              onFilterChange('startDate', '');
              onFilterChange('endDate', '');
              onFilterChange('sortBy', 'createdAt');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95 text-xs font-bold rounded-xl transition border border-rose-200/80 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        )}
      </div>
    </div>
  );
};
