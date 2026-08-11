import React, { useEffect, useState, useCallback } from 'react';
import { LayoutDashboard, RefreshCw, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AdminStatsCards } from '../components/admin/AdminStatsCards';
import { RecordFilters } from '../components/admin/RecordFilters';
import { RecordsTable } from '../components/admin/RecordsTable';
import { RecordsGrid } from '../components/admin/RecordsGrid';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { attApi } from '../services/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, local: 0, abroad: 0, signed: 0, submitted: 0, returned: 0 });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0, limit: 10 });

  const [filters, setFilters] = useState({
    search: '',
    attType: 'All',
    status: 'All',
    startDate: '',
    endDate: '',
    sortBy: 'createdAt'
  });

  // Modal State for Confirmations
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    action: null,
    danger: false
  });

  const fetchStats = useCallback(async () => {
    try {
      const res = await attApi.getStats();
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Stats Error:', err);
    }
  }, []);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        search: filters.search,
        attType: filters.attType,
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
        sortBy: filters.sortBy === 'oldest' ? 'createdAt' : filters.sortBy,
        sortOrder: filters.sortBy === 'oldest' ? 'asc' : 'desc'
      };

      const res = await attApi.getAll(params);
      setRecords(res.data || []);
      if (res.pagination) {
        setPagination((prev) => ({
          ...prev,
          totalPages: res.pagination.totalPages,
          totalRecords: res.pagination.totalRecords
        }));
      }
    } catch (err) {
      console.error('Fetch Records Error:', err);
      setErrorMsg(err.message || 'Failed to fetch ATT records from server.');
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, filters]);

  useEffect(() => {
    fetchStats();
    fetchRecords();
  }, [fetchStats, fetchRecords]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination((prev) => ({ ...prev, limit: newSize, currentPage: 1 }));
  };

  const handleUpdateStatus = (record, newStatus) => {
    setConfirmModal({
      isOpen: true,
      title: 'Update Record Status',
      message: `Are you sure you want to change the status of ${record.referenceNo} to "${newStatus}"?`,
      danger: newStatus === 'Return' || newStatus === 'Disapproved' || newStatus === 'Cancelled',
      action: async () => {
        try {
          await attApi.updateStatus(record._id, newStatus, `Status updated via Admin Dashboard`);
          toast.success(`Status updated to ${newStatus}`);
          fetchRecords();
          fetchStats();
        } catch (err) {
          toast.error(err.message || 'Failed to update status.');
        }
      }
    });
  };

  const handleArchiveRecord = (record) => {
    const isArchiving = !record.archived;
    setConfirmModal({
      isOpen: true,
      title: isArchiving ? 'Archive ATT Record' : 'Unarchive ATT Record',
      message: `Are you sure you want to ${isArchiving ? 'archive' : 'unarchive'} record ${record.referenceNo}?`,
      danger: isArchiving,
      action: async () => {
        try {
          await attApi.archive(record._id);
          toast.success(`Record ${isArchiving ? 'archived' : 'unarchived'} successfully`);
          fetchRecords();
          fetchStats();
        } catch (err) {
          toast.error(err.message || 'Failed to update record archival state.');
        }
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-chedBlue rounded-xl border border-blue-100">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            ATT Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage, search, filter, and verify all Authority to Travel (ATT) records.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/att/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-extrabold text-xs shadow-md shadow-emerald-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            New ATT Request
          </Link>

          <button
            onClick={() => {
              fetchStats();
              fetchRecords();
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-chedBlue hover:bg-chedNavy active:scale-[0.98] rounded-xl shadow-md shadow-chedBlue/20 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </header>

      {/* Metric Cards */}
      <AdminStatsCards stats={stats} />

      {/* Filters and Controls */}
      <RecordFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        pageSize={pagination.limit}
        onPageSizeChange={handlePageSizeChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Records Table / Grid Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative min-h-[300px]">
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : errorMsg ? (
          <EmptyState
            title="Error Loading Records"
            message={errorMsg}
            onRetry={() => {
              fetchStats();
              fetchRecords();
            }}
          />
        ) : records.length === 0 ? (
          <EmptyState
            title="No Records Found"
            message="No ATT records match your current filter and search criteria."
          />
        ) : (
          <>
            {viewMode === 'table' ? (
              <RecordsTable
                records={records}
                onUpdateStatus={handleUpdateStatus}
                onArchiveRecord={handleArchiveRecord}
              />
            ) : (
              <RecordsGrid
                records={records}
                onUpdateStatus={handleUpdateStatus}
                onArchiveRecord={handleArchiveRecord}
              />
            )}

            {/* Pagination Controls */}
            <div className="border-t border-slate-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
              <p className="text-xs text-slate-500 font-medium">
                Showing {records.length > 0 ? (pagination.currentPage - 1) * pagination.limit + 1 : 0}–
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords)} of {pagination.totalRecords} records
              </p>

              <div className="flex items-center gap-1">
                <button
                  disabled={pagination.currentPage <= 1}
                  onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>

                <span className="px-3 text-xs font-bold text-slate-700">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  disabled={pagination.currentPage >= pagination.totalPages}
                  onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.action || (() => {})}
        title={confirmModal.title}
        message={confirmModal.message}
        danger={confirmModal.danger}
      />
    </div>
  );
};

