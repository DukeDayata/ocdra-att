import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Printer, Archive, Edit3, ChevronDown, MapPin, Calendar, UserCheck } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const RecordsTable = ({
  records = [],
  onUpdateStatus,
  onArchiveRecord
}) => {
  const getInitials = (name) => {
    if (!name) return 'CH';
    return name
      .split(' ')
      .filter((n) => n.length > 0)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

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
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse table-auto">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200/90 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
            <th className="px-5 py-4">Reference</th>
            <th className="px-5 py-4">Type</th>
            <th className="px-5 py-4">Personnel Manifest</th>
            <th className="px-5 py-4">Destination</th>
            <th className="px-5 py-4">Period</th>
            <th className="px-5 py-4">Date Prepared</th>
            <th className="px-5 py-4">Approved By</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
          {records.map((r) => {
            const personnelList = r.personnel || [];
            const firstPerson = personnelList[0]?.name || personnelList[0] || 'N/A';
            const extraCount = personnelList.length > 1 ? personnelList.length - 1 : 0;
            const personnelStr = personnelList.map((p) => p.name || p).join(', ');
            const isAbroad = r.attType === 'Abroad';
            const printPath = `/att/${r.referenceNo}/print/${isAbroad ? 'abroad' : 'local'}`;

            return (
              <tr key={r._id || r.referenceNo} className="hover:bg-blue-50/40 transition-colors group">
                <td className="px-5 py-4 whitespace-nowrap">
                  <Link
                    to={`/att/${r.referenceNo}`}
                    className="font-mono text-xs font-black text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1 rounded-lg border border-blue-200/80 transition-all inline-block shadow-2xs"
                  >
                    {r.referenceNo}
                  </Link>
                </td>

                <td className="px-5 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-2xs font-extrabold border uppercase tracking-wider ${
                      isAbroad
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-teal-50 text-teal-700 border-teal-200'
                    }`}
                  >
                    {r.attType}
                  </span>
                </td>

                <td className="px-5 py-4 max-w-xs" title={personnelStr}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-slate-800 text-[10px] font-black flex items-center justify-center shrink-0 border border-slate-300 shadow-2xs">
                      {getInitials(firstPerson)}
                    </div>
                    <span className="truncate text-slate-900 font-bold">{firstPerson}</span>
                    {extraCount > 0 && (
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-extrabold border border-slate-200 shrink-0">
                        +{extraCount} more
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-5 py-4 max-w-xs truncate font-semibold text-slate-800" title={r.destination}>
                  <span className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{r.destination}</span>
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-500 whitespace-nowrap font-medium">{r.periodOfTravel}</td>

                <td className="px-5 py-4 text-slate-500 whitespace-nowrap font-medium">{formatDate(r.datePrepared)}</td>

                <td className="px-5 py-4 text-slate-700 whitespace-nowrap font-semibold">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>{r.approvedBy?.name || 'N/A'}</span>
                  </span>
                </td>

                <td className="px-5 py-4 whitespace-nowrap">
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
                </td>

                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center justify-end gap-1.5">
                    <Link
                      to={`/att/${r.referenceNo}`}
                      title="View Details"
                      className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 active:scale-95 rounded-xl border border-slate-200/90 transition shadow-2xs"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <Link
                      to={`/att/${r.referenceNo}/edit`}
                      title="Edit ATT Record"
                      className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 active:scale-95 rounded-xl border border-slate-200/90 hover:border-amber-200 transition shadow-2xs"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>

                    <a
                      href={printPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Print Document"
                      className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 active:scale-95 rounded-xl border border-slate-200/90 hover:border-emerald-200 transition shadow-2xs"
                    >
                      <Printer className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => onArchiveRecord(r)}
                      title={r.archived ? 'Unarchive' : 'Archive'}
                      className={`p-1.5 rounded-xl border transition shadow-2xs active:scale-95 ${
                        r.archived
                          ? 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 border-slate-200/90 hover:border-rose-200'
                      }`}
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
