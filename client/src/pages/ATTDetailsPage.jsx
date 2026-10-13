import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Printer, 
  ArrowLeft, 
  Clock, 
  UserCheck, 
  DollarSign, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  FileText, 
  Send, 
  PenTool, 
  CheckCircle2, 
  Edit3,
  ShieldCheck,
  Building,
  Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';
import { attApi } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatDate, formatCurrency } from '../utils/formatters';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const ATTDetailsPage = () => {
  const { referenceNo } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true);
        const res = await attApi.getByRef(referenceNo);
        setRecord(res.data);
      } catch (err) {
        console.error('Fetch Details Error:', err);
        setError(err.message || 'Record not found.');
      } finally {
        setLoading(false);
      }
    };

    if (referenceNo) {
      fetchRecord();
    }
  }, [referenceNo]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 sm:p-8">
        <LoadingSkeleton count={8} />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-black text-slate-900 tracking-tight">ATT Record Not Found</h3>
        <p className="text-xs text-slate-500 font-medium">{error || `No record found for reference ${referenceNo}`}</p>
        <button
          onClick={() => navigate('/admin')}
          className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-2xl shadow-md transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isAbroad = record.attType === 'Abroad';
  const printRoute = `/att/${record.referenceNo}/print/${isAbroad ? 'abroad' : 'local'}`;

  // Workflow steps
  const statusSteps = [
    { label: 'Draft', key: 'Draft', icon: FileText },
    { label: 'Generated', key: 'Generated', icon: CheckCircle },
    { label: 'Submitted', key: 'Submitted', icon: Send },
    { label: 'For Signature', key: 'For Signature', icon: PenTool },
    { label: 'Signed', key: 'Signed', icon: CheckCircle2 }
  ];

  const currentStatusIndex = statusSteps.findIndex(s => s.key === record.status);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/90 relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200/80 shadow-2xs">
              {record.referenceNo}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-2xs font-black uppercase tracking-wider border ${
                isAbroad
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-teal-50 text-teal-700 border-teal-200'
              }`}
            >
              {record.attType} Travel
            </span>
            <StatusBadge status={record.status} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Authority to Travel Order Details
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Destination: <strong className="text-slate-900">{record.destination}</strong></span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <Link
            to={`/att/${record.referenceNo}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 text-xs font-black rounded-2xl shadow-md shadow-amber-500/20 transition"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit ATT</span>
          </Link>

          <a
            href={printRoute}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white text-xs font-black rounded-2xl shadow-md shadow-emerald-600/25 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official ATT</span>
          </a>
        </div>
      </div>

      {/* Workflow Progress Tracker Bar */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200/90">
        <h3 className="text-2xs font-extrabold uppercase tracking-widest text-slate-400 mb-5">Workflow Lifecycle & Tracking</h3>
        <div className="flex items-center justify-between relative px-2 sm:px-6">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-4 right-4 sm:left-10 sm:right-10 h-1 bg-slate-100 -translate-y-1/2 z-0"></div>

          {statusSteps.map((step, idx) => {
            const isCompleted = currentStatusIndex >= 0 && idx <= currentStatusIndex;
            const isCurrent = record.status === step.key;
            const Icon = step.icon;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center group">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs transition-all duration-300 ${
                    isCurrent
                      ? 'bg-blue-700 text-white shadow-lg shadow-blue-700/30 ring-4 ring-blue-100 font-bold scale-110'
                      : isCompleted
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-white text-slate-400 border-2 border-slate-200 shadow-2xs'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[11px] font-bold mt-2.5 hidden sm:block ${
                    isCurrent ? 'text-blue-700 font-black' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Travel Details Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/90 space-y-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 pb-3.5 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-blue-600" />
              Travel Details & Schedule
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1">Destination</span>
                <span className="font-black text-slate-900 text-sm">{record.destination}</span>
              </div>

              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1">Period of Travel</span>
                <span className="font-black text-slate-900 text-sm">{record.periodOfTravel}</span>
              </div>

              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1">Classification</span>
                <span className="font-bold text-slate-800">{record.travelClassification}</span>
              </div>

              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1">Date Prepared</span>
                <span className="font-bold text-slate-800">{formatDate(record.datePrepared)}</span>
              </div>

              <div className="sm:col-span-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1">Office / Station</span>
                <span className="font-bold text-slate-800">{record.officeStation}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1.5">Purpose of Travel</span>
                <p className="font-medium text-slate-800 text-xs leading-relaxed whitespace-pre-wrap bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                  {record.purpose}
                </p>
              </div>
            </div>
          </div>

          {/* Personnel Manifest Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/90 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 pb-3.5 border-b border-slate-100">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              Personnel Manifest ({record.personnel?.length || 0})
            </h3>

            <div className="space-y-2.5">
              {record.personnel?.map((p, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-slate-50/80 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-white transition-all shadow-2xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-700 font-black flex items-center justify-center text-xs shrink-0 border border-indigo-200/80 shadow-2xs">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">{p.name}</div>
                      <div className="text-2xs text-slate-500 font-semibold">{p.position}</div>
                    </div>
                  </div>
                  <span className="text-2xs font-bold text-slate-500 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                    {p.office || record.officeStation}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Expense Allocation Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/90 space-y-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 pb-3.5 border-b border-slate-100">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Expense Allocations & Funding Breakdown
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1">
                  {record.travelType === 'Local'
                    ? record.expenseType === 'Transportation'
                      ? 'Transportation'
                      : 'Airfare'
                    : 'Airfare'}
                </span>
                <span className="font-black text-slate-900 text-sm">₱ {formatCurrency(record.expenses?.airfare)}</span>
              </div>

              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1">
                  {record.travelType === 'Local' ? 'Meals' : 'Per Diem'}
                </span>
                <span className="font-black text-slate-900 text-sm">₱ {formatCurrency(record.expenses?.perDiem)}</span>
              </div>

              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1">
                  {record.travelType === 'Local' ? 'Incidental Fee' : 'Pre-travel'}
                </span>
                <span className="font-black text-slate-900 text-sm">₱ {formatCurrency(record.expenses?.preTravel)}</span>
              </div>

              <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200/80">
                <span className="text-emerald-700 block text-2xs uppercase tracking-wider font-black mb-1">Total Amount</span>
                <span className="font-black text-emerald-900 text-sm">₱ {formatCurrency(record.expenses?.totalAmount)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-100">
              <div>
                <span className="text-slate-400 font-semibold">Source of Funds: </span>
                <span className="font-extrabold text-slate-900">{record.sourceOfFunds}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">Payment Mode: </span>
                <span className="font-extrabold text-slate-900">{record.paymentMode || 'None'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info (1 col) */}
        <div className="space-y-6">
          {/* Signatories Box */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200/90 space-y-4 text-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 pb-3.5 border-b border-slate-100">
              Authorized Signatories
            </h3>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block mb-1 uppercase tracking-wider text-2xs font-extrabold">Requested By</span>
              <div className="font-black text-slate-900 text-sm">{record.requestedBy?.name || 'N/A'}</div>
              <div className="text-slate-500 text-2xs font-bold mt-0.5">{record.requestedBy?.position}</div>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block mb-1 uppercase tracking-wider text-2xs font-extrabold">Funds Available</span>
              <div className="font-black text-slate-900 text-sm">{record.fundsAvailable}</div>
              {record.fundsAvailablePosition && (
                <div className="text-slate-500 text-2xs font-bold mt-0.5">{record.fundsAvailablePosition}</div>
              )}
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block mb-1 uppercase tracking-wider text-2xs font-extrabold">Approved By</span>
              <div className="font-black text-slate-900 text-sm">{record.approvedBy?.name || 'N/A'}</div>
              <div className="text-slate-500 text-2xs font-bold mt-0.5">{record.approvedBy?.position}</div>
            </div>
          </div>

          {/* Status History Timeline */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200/90 space-y-4 text-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 pb-3.5 border-b border-slate-100">
              <Clock className="w-4 h-4 text-amber-600" />
              Audit Trail & Status Log
            </h3>

            <div className="space-y-4 relative pl-4 border-l-2 border-slate-200">
              {record.statusHistory?.map((h, i) => (
                <div key={i} className="relative">
                  <div className="w-3 h-3 rounded-full bg-blue-700 border-2 border-white absolute -left-[23px] top-0.5 shadow-sm"></div>
                  <div className="font-black text-slate-900">{h.status}</div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {formatDate(h.changedAt)} &bull; {h.changedBy}
                  </div>
                  {h.remarks && <div className="text-2xs text-slate-600 mt-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">{h.remarks}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
