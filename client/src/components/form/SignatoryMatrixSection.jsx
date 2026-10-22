import React, { useEffect } from 'react';
import { PenTool, UserCheck, ShieldCheck, DollarSign } from 'lucide-react';

export const SignatoryMatrixSection = ({
  register,
  watch,
  setValue,
  personnelList = [],
  approverList = []
}) => {
  const requestedBySelect = watch('requestedBySelectIndex');
  const approvedBySelect = watch('approvedBySelectIndex');

  // Sync requestedBy name & position when select changes
  useEffect(() => {
    if (requestedBySelect !== undefined && requestedBySelect !== '') {
      const selectedPerson = personnelList[requestedBySelect];
      if (selectedPerson) {
        setValue('requestedBy.name', selectedPerson.name);
        setValue('requestedBy.position', selectedPerson.position);
        setValue('requestedBy.personnelId', selectedPerson._id || '');
      }
    }
  }, [requestedBySelect, personnelList, setValue]);

  // Sync approvedBy name & position when select changes
  useEffect(() => {
    if (approvedBySelect !== undefined && approvedBySelect !== '') {
      const selectedApprover = approverList[approvedBySelect];
      if (selectedApprover) {
        setValue('approvedBy.name', selectedApprover.name);
        setValue('approvedBy.position', selectedApprover.position);
        setValue('approvedBy.approverId', selectedApprover._id || '');
      }
    } else if (approverList.length > 0 && !watch('approvedBy.name')) {
      // Default to first approver if available (Shirley C. Agrupis)
      setValue('approvedBy.name', approverList[0].name);
      setValue('approvedBy.position', approverList[0].position);
      setValue('approvedBy.approverId', approverList[0]._id || '');
    }
  }, [approvedBySelect, approverList, setValue, watch]);

  // Sync approvedBy.approverId when approver list is loaded and name is present but id is missing
  useEffect(() => {
    if (approverList.length > 0) {
      const currentName = watch('approvedBy.name');
      const currentId = watch('approvedBy.approverId');
      if (currentName && !currentId) {
        const found = approverList.find(
          (a) => a.name.toLowerCase().trim() === currentName.toLowerCase().trim()
        );
        if (found) {
          setValue('approvedBy.approverId', found._id);
        }
      }
    }
  }, [approverList, watch, setValue]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
        <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 shadow-2xs">
          <PenTool className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Signatory & Approval Matrix</h2>
          <p className="text-xs text-slate-500 font-medium">Designate endorsing, certifying, and approving authority officers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requested By */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-3 relative group hover:border-blue-300 transition-all">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <label className="font-extrabold text-2xs uppercase tracking-wider text-slate-700">1. Requested By</label>
          </div>

          <select
            {...register('requestedBySelectIndex')}
            className="w-full bg-white border border-slate-200/90 rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition cursor-pointer shadow-2xs"
          >
            <option value="">Select Staff / Recommender...</option>
            {personnelList.map((p, index) => (
              <option key={p._id || index} value={index}>
                {p.name} — {p.position}
              </option>
            ))}
          </select>

          <input
            {...register('requestedBy.name')}
            className="w-full bg-slate-100/90 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold cursor-not-allowed shadow-inner"
            placeholder="Official Full Name"
            readOnly
          />

          <input
            {...register('requestedBy.position')}
            className="w-full bg-slate-100/90 border border-slate-200 rounded-xl p-2 text-2xs text-slate-600 uppercase font-semibold tracking-wide cursor-not-allowed shadow-inner"
            placeholder="Designation / Position"
            readOnly
          />
        </div>

        {/* Funds Status */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-3 relative group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <label className="font-extrabold text-2xs uppercase tracking-wider text-slate-700">2. Funds Status</label>
            </div>
            <div className="inline-flex rounded-lg bg-white p-0.5 border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setValue('fundsAvailable', 'Diana C. Aguilar');
                  setValue('fundsAvailablePosition', 'Chief Administrative Officer');
                }}
                className="px-2 py-0.5 text-[10px] font-extrabold text-blue-700 hover:bg-blue-50 rounded transition"
                title="Set to Diana C. Aguilar"
              >
                Diana C. Aguilar
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue('fundsAvailable', 'N/A');
                  setValue('fundsAvailablePosition', '');
                }}
                className="px-2 py-0.5 text-[10px] font-extrabold text-slate-500 hover:bg-slate-100 rounded transition"
                title="Set to N/A"
              >
                N/A
              </button>
            </div>
          </div>

          <input
            {...register('fundsAvailable')}
            className="w-full bg-white border border-slate-200/90 rounded-xl p-2.5 text-xs text-slate-900 font-black focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs"
            placeholder="e.g. Diana C. Aguilar"
          />

          <input
            {...register('fundsAvailablePosition')}
            className="w-full bg-white border border-slate-200/90 rounded-xl p-2 text-2xs text-slate-600 uppercase font-bold tracking-wide focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs"
            placeholder="e.g. Chief Administrative Officer"
          />
        </div>

        {/* Approved By */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-3 relative group hover:border-purple-300 transition-all">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <label className="font-extrabold text-2xs uppercase tracking-wider text-slate-700">3. Approved By</label>
          </div>

          <select
            {...register('approvedBySelectIndex')}
            className="w-full bg-white border border-slate-200/90 rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition cursor-pointer shadow-2xs"
          >
            <option value="">Select Certified Approver...</option>
            {approverList.map((a, index) => (
              <option key={a._id || index} value={index}>
                {a.name} — {a.position}
              </option>
            ))}
          </select>

          <input
            {...register('approvedBy.name')}
            className="w-full bg-white border border-slate-200/90 rounded-xl p-2.5 text-xs text-slate-900 font-black focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs"
            placeholder="SHIRLEY C. AGRUPIS, Ph.D"
          />

          <select
            {...register('approvedBy.position')}
            className="w-full bg-white border border-slate-200/90 rounded-xl p-2 text-2xs text-slate-700 uppercase font-bold tracking-wide focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs cursor-pointer"
          >
            <option value="Chairperson">Chairperson</option>
            <option value="OIC - Chairperson">OIC - Chairperson</option>
            <option value="Commissioner">Commissioner</option>
          </select>
        </div>
      </div>
    </div>
  );
};
