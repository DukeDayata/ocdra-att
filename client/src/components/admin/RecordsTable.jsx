import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Printer, Archive, Edit3 } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Signed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
      case 'Submitted':
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
      case 'For Signature':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'Return':
      case 'Disapproved':
        return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100';
      case 'Generated':
      case 'Draft':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100';
      case 'Cancelled':
      case 'Archived':
        return 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse table-auto">
        <thead>
          <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
            <th className="px-5 py-3.5">Reference</th>
            <th className="px-5 py-3.5">Type</th>
            <th className="px-5 py-3.5">Personnel Manifest</th>
            <th className="px-5 py-3.5">Destination</th>
            <th className="px-5 py-3.5">Period</th>
            <th className="px-5 py-3.5">Date Prepared</th>
            <th className="px-5 py-3.5">Approved By</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
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
                <td className="px-5 py-3.5 font-mono text-xs font-black text-slate-900 whitespace-nowrap">
                  <Link
                    to={`/att/${r.referenceNo}`}
                    className="text-chedBlue hover:underline flex items-center gap-1 group-hover:text-blue-700"
                  >
                    {r.referenceNo}
                  </Link>
                </td>

                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-extrabold border ${
                      isAbroad
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-teal-50 text-teal-700 border-teal-200'
                    }`}
                  >
                    {r.attType}
                  </span>
                </td>

                <td className="px-5 py-3.5 max-w-xs" title={personnelStr}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black flex items-center justify-center shrink-0 border border-slate-300">
                      {getInitials(firstPerson)}
                    </div>
                    <span className="truncate text-slate-800 font-semibold">{firstPerson}</span>
                    {extraCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold border border-slate-200 shrink-0">
                        +{extraCount} more
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-5 py-3.5 max-w-xs truncate font-semibold text-slate-800" title={r.destination}>
                  {r.destination}
                </td>

                <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{r.periodOfTravel}</td>

                <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{formatDate(r.datePrepared)}</td>

                <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">{r.approvedBy?.name || 'N/A'}</td>

                <td className="px-5 py-3.5 whitespace-nowrap">
                  <div className="relative inline-block">
                    <select
                      value={r.status || 'Draft'}
                      onChange={(e) => onUpdateStatus(r, e.target.value)}
                      className={`text-2xs font-bold px-2.5 py-1 rounded-full border cursor-pointer appearance-none pr-5.5 focus:outline-none focus:ring-1 focus:ring-chedBlue shadow-2xs transition-colors ${getStatusBadgeClass(r.status)}`}
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
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-current opacity-60 text-[8px]">
                      ▼
                    </span>
                  </div>
                </td>

                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  <div className="inline-flex items-center justify-end gap-1.5">
                    <Link
                      to={`/att/${r.referenceNo}`}
                      title="View Details"
                      className="p-1.5 text-slate-600 hover:text-chedBlue hover:bg-slate-100 rounded-lg border border-slate-200/80 transition shadow-2xs"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <Link
                      to={`/att/${r.referenceNo}/edit`}
                      title="Edit ATT Record"
                      className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg border border-slate-200/80 hover:border-amber-200 transition shadow-2xs"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>

                    <a
                      href={printPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Print Document"
                      className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-slate-200/80 hover:border-emerald-200 transition shadow-2xs"
                    >
                      <Printer className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => onArchiveRecord(r)}
                      title={r.archived ? 'Unarchive' : 'Archive'}
                      className={`p-1.5 rounded-lg border transition shadow-2xs ${
                        r.archived
                          ? 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 border-slate-200/80 hover:border-rose-200'
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

