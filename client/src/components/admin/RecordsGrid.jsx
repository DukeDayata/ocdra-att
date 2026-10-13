import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Printer, Archive, Calendar, MapPin, Users, ChevronDown } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/formatters';

export const RecordsGrid = ({
  records = [],
  onUpdateStatus,
  onArchiveRecord
}) => {
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Signed':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
      case 'Submitted':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
      case 'For Signature':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/30';
      case 'Return':
      case 'Disapproved':
        return 'bg-rose-500/10 text-rose-700 border-rose-500/30';
      case 'Generated':
      case 'Draft':
        return 'bg-indigo-500/10 text-indigo-700 border-indigo-500/30';
      case 'Cancelled':
      case 'Archived':
        return 'bg-slate-500/10 text-slate-600 border-slate-400/30';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {records.map((r) => {
        const personnelStr = (r.personnel || []).map((p) => p.name || p).join(', ');
        const isAbroad = r.attType === 'Abroad';
        const printPath = `/att/${r.referenceNo}/print/${isAbroad ? 'abroad' : 'local'}`;

        return (
          <div
            key={r._id || r.referenceNo}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
          >
            {/* Top Accent Strip & Header */}
            <div>
              <div className={`h-1.5 w-full ${isAbroad ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gradient-to-r from-teal-500 to-emerald-600'}`}></div>

              <div className="p-6 pb-3">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Link
                    to={`/att/${r.referenceNo}`}
                    className="font-mono text-xs font-black text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1 rounded-xl border border-blue-200/80 transition-all shadow-2xs"
                  >
                    {r.referenceNo}
                  </Link>
                  <StatusBadge status={r.status} />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase tracking-wider border ${
                      isAbroad
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-teal-50 text-teal-700 border-teal-200'
                    }`}
                  >
                    {r.attType}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 font-medium text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(r.datePrepared)}
                  </span>
                </div>

                {/* Destination */}
                <h3 className="font-extrabold text-slate-900 text-sm flex items-start gap-1.5 line-clamp-1 mt-1 group-hover:text-blue-700 transition-colors" title={r.destination}>
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{r.destination}</span>
                </h3>

                {/* Personnel */}
                <div className="mt-4 bg-slate-50/90 p-3 rounded-2xl border border-slate-100 text-xs">
                  <div className="text-2xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                    <Users className="w-3 h-3 text-slate-400" />
                    Personnel Manifest ({r.personnel?.length || 0})
                  </div>
                  <p className="text-slate-800 font-semibold truncate" title={personnelStr}>
                    {personnelStr || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="bg-slate-50/90 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <Link
                  to={`/att/${r.referenceNo}`}
                  title="View Details"
                  className="p-2 bg-white border border-slate-200/90 text-slate-600 hover:text-blue-700 hover:border-blue-300 rounded-xl shadow-2xs transition active:scale-95"
                >
                  <Eye className="w-4 h-4" />
                </Link>

                <Link
                  to={`/att/${r.referenceNo}/edit`}
                  title="Edit ATT Record"
                  className="p-2 bg-white border border-slate-200/90 text-slate-600 hover:text-amber-600 hover:border-amber-300 rounded-xl shadow-2xs transition active:scale-95"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>

                <a
                  href={printPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Print Document"
                  className="p-2 bg-white border border-slate-200/90 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 rounded-xl shadow-2xs transition active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                </a>

                <button
                  onClick={() => onArchiveRecord(r)}
                  title={r.archived ? 'Unarchive' : 'Archive'}
                  className={`p-2 bg-white border rounded-xl shadow-2xs transition active:scale-95 ${
                    r.archived
                      ? 'border-amber-300 text-amber-600 hover:bg-amber-50'
                      : 'border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300'
                  }`}
                >
                  <Archive className="w-4 h-4" />
                </button>
              </div>

              {/* Status Quick Select */}
              <div className="relative inline-block">
                <select
                  value={r.status || 'Draft'}
                  onChange={(e) => onUpdateStatus(r, e.target.value)}
                  className={`text-2xs font-extrabold px-3 py-1 rounded-full border cursor-pointer appearance-none pr-6 focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-2xs transition-all ${getStatusBadgeStyle(r.status)}`}
                  title="Click to update status"
                >
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
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-current opacity-70" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
