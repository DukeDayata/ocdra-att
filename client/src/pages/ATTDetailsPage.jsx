import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Printer, ArrowLeft, Clock, UserCheck, DollarSign, Calendar, MapPin, CheckCircle, FileText, Send, PenTool, CheckCircle2 } from 'lucide-react';
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
      <div className="max-w-5xl mx-auto p-6">
        <LoadingSkeleton count={8} />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-xl">
        <h3 className="text-lg font-black text-red-600">ATT Record Not Found</h3>
        <p className="text-xs text-slate-500">{error || `No record found for reference ${referenceNo}`}</p>
        <button
          onClick={() => navigate('/admin')}
          className="px-5 py-2.5 bg-chedBlue text-white font-bold text-xs rounded-xl shadow-md"
        >
          Return to Admin Dashboard
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
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/90">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-black text-chedBlue bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
              {record.referenceNo}
            </span>
            <StatusBadge status={record.status} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {record.attType} Travel Authorization
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-chedBlue shrink-0" />
            <span>Destination: <strong className="text-slate-800">{record.destination}</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>

          <a
            href={printRoute}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-600/20 transition"
          >
            <Printer className="w-4 h-4" />
            Print ATT
          </a>
        </div>
      </div>

      {/* Workflow Progress Tracker Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/90">
        <h3 className="text-2xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">Workflow Status Tracker</h3>
        <div className="flex items-center justify-between relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 inset-x-0 h-1 bg-slate-100 -translate-y-1/2 z-0"></div>

          {statusSteps.map((step, idx) => {
            const isCompleted = currentStatusIndex >= 0 && idx <= currentStatusIndex;
            const isCurrent = record.status === step.key;
            const Icon = step.icon;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center group">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs transition-all duration-200 ${
                    isCurrent
                      ? 'bg-chedBlue text-white shadow-lg ring-4 ring-blue-100 font-bold scale-110'
                      : isCompleted
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[11px] font-bold mt-2 hidden sm:block ${
                    isCurrent ? 'text-chedBlue font-extrabold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
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
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200/90 space-y-5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2 pb-3 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-chedBlue" />
              Travel Details & Schedule
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1">Destination</span>
                <span className="font-extrabold text-slate-900 text-sm">{record.destination}</span>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1">Period of Travel</span>
                <span className="font-extrabold text-slate-900 text-sm">{record.periodOfTravel}</span>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1">Classification</span>
                <span className="font-bold text-slate-800">{record.travelClassification}</span>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1">Date Prepared</span>
                <span className="font-bold text-slate-800">{formatDate(record.datePrepared)}</span>
              </div>

              <div className="sm:col-span-2 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1">Office / Station</span>
                <span className="font-bold text-slate-800">{record.officeStation}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1.5">Purpose of Travel</span>
                <p className="font-medium text-slate-800 text-xs leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {record.purpose}
                </p>
              </div>
            </div>
          </div>

          {/* Personnel Manifest Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200/90 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2 pb-3 border-b border-slate-100">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              Personnel Manifest ({record.personnel?.length || 0})
            </h3>

            <div className="space-y-2.5">
              {record.personnel?.map((p, i) => (
                <div key={i} className="flex justify-between items-center p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 hover:border-slate-200 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs shrink-0">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{p.name}</div>
                      <div className="text-2xs text-slate-500 font-medium">{p.position}</div>
                    </div>
                  </div>
                  <span className="text-2xs font-semibold text-slate-400 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {p.office || record.officeStation}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Expense Allocation Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200/90 space-y-5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2 pb-3 border-b border-slate-100">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Expense Allocations & Funding
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1">Airfare</span>
                <span className="font-black text-slate-800 text-sm">₱ {formatCurrency(record.expenses?.airfare)}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1">Per Diem</span>
                <span className="font-black text-slate-800 text-sm">₱ {formatCurrency(record.expenses?.perDiem)}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-2xs uppercase tracking-wider font-extrabold mb-1">Pre-travel</span>
                <span className="font-black text-slate-800 text-sm">₱ {formatCurrency(record.expenses?.preTravel)}</span>
              </div>

              <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-100">
                <span className="text-emerald-700 block text-2xs uppercase tracking-wider font-extrabold mb-1">Total Amount</span>
                <span className="font-black text-emerald-800 text-sm">₱ {formatCurrency(record.expenses?.totalAmount)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 font-medium">Source of Funds: </span>
                <span className="font-bold text-slate-800">{record.sourceOfFunds}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Payment Mode: </span>
                <span className="font-bold text-slate-800">{record.paymentMode || 'None'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info (1 col) */}
        <div className="space-y-6">
          {/* Signatories Box */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/90 space-y-4 text-xs">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-100">
              Authorized Signatories
            </h3>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block mb-1 uppercase tracking-wider text-[10px] font-extrabold">Requested By</span>
              <div className="font-extrabold text-slate-900 text-sm">{record.requestedBy?.name || 'N/A'}</div>
              <div className="text-slate-500 text-2xs font-medium">{record.requestedBy?.position}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block mb-1 uppercase tracking-wider text-[10px] font-extrabold">Funds Available</span>
              <div className="font-bold text-slate-800">{record.fundsAvailable}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block mb-1 uppercase tracking-wider text-[10px] font-extrabold">Approved By</span>
              <div className="font-extrabold text-slate-900 text-sm">{record.approvedBy?.name || 'N/A'}</div>
              <div className="text-slate-500 text-2xs font-medium">{record.approvedBy?.position}</div>
            </div>
          </div>

          {/* Status History Timeline */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/90 space-y-4 text-xs">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Clock className="w-4 h-4 text-amber-600" />
              Audit Trail History
            </h3>

            <div className="space-y-4 relative pl-4 border-l-2 border-slate-200">
              {record.statusHistory?.map((h, i) => (
                <div key={i} className="relative">
                  <div className="w-3 h-3 rounded-full bg-chedBlue border-2 border-white absolute -left-[23px] top-0.5 shadow-xs"></div>
                  <div className="font-extrabold text-slate-900">{h.status}</div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {formatDate(h.changedAt)} &bull; {h.changedBy}
                  </div>
                  {h.remarks && <div className="text-2xs text-slate-500 mt-1 bg-slate-50 p-2 rounded-xl border border-slate-100">{h.remarks}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

