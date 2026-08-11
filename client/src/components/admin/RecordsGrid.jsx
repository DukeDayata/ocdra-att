import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Printer, Archive, Calendar, MapPin, Users } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/formatters';

export const RecordsGrid = ({
  records = [],
  onUpdateStatus,
  onArchiveRecord
}) => {
  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {records.map((r) => {
        const personnelStr = (r.personnel || []).map((p) => p.name || p).join(', ');
        const isAbroad = r.attType === 'Abroad';
        const printPath = `/att/${r.referenceNo}/print/${isAbroad ? 'abroad' : 'local'}`;

        return (
          <div
            key={r._id || r.referenceNo}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
          >
            {/* Top Accent Strip & Header */}
            <div>
              <div className={`h-1.5 w-full ${isAbroad ? 'bg-indigo-500' : 'bg-teal-500'}`}></div>

              <div className="p-5 pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-black text-chedBlue bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                    {r.referenceNo}
                  </span>
                  <StatusBadge status={r.status} />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-2xs font-extrabold uppercase border ${
                      isAbroad
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-teal-50 text-teal-700 border-teal-200'
                    }`}
                  >
                    {r.attType}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(r.datePrepared)}
                  </span>
                </div>

                {/* Destination */}
                <h3 className="font-bold text-slate-900 text-sm flex items-start gap-1.5 line-clamp-1 mt-1" title={r.destination}>
                  <MapPin className="w-4 h-4 text-chedBlue shrink-0 mt-0.5" />
                  <span>{r.destination}</span>
                </h3>

                {/* Personnel */}
                <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                  <div className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    Personnel ({r.personnel?.length || 0})
                  </div>
                  <p className="text-slate-700 font-medium truncate" title={personnelStr}>
                    {personnelStr || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Link
                  to={`/att/${r.referenceNo}`}
                  title="View Details"
                  className="p-1.5 bg-white border border-slate-200 text-slate-700 hover:text-chedBlue hover:border-chedBlue rounded-xl shadow-2xs transition"
                >
                  <Eye className="w-4 h-4" />
                </Link>

                <a
                  href={printPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Print Document"
                  className="p-1.5 bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-500 rounded-xl shadow-2xs transition"
                >
                  <Printer className="w-4 h-4" />
                </a>

                <button
                  onClick={() => onArchiveRecord(r)}
                  title={r.archived ? 'Unarchive' : 'Archive'}
                  className={`p-1.5 bg-white border rounded-xl shadow-2xs transition ${
                    r.archived
                      ? 'border-amber-300 text-amber-600 hover:bg-amber-50'
                      : 'border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300'
                  }`}
                >
                  <Archive className="w-4 h-4" />
                </button>
              </div>

              {/* Status Quick Select */}
              <select
                value={r.status || ''}
                onChange={(e) => onUpdateStatus(r, e.target.value)}
                className="text-2xs font-semibold bg-white border border-slate-300 text-slate-800 rounded-lg p-1 cursor-pointer outline-none focus:ring-1 focus:ring-chedBlue shadow-2xs"
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
            </div>
          </div>
        );
      })}
    </div>
  );
};
