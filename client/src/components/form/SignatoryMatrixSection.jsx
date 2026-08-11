import React, { useEffect } from 'react';
import { PenTool } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
          <PenTool className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Signatory Matrix</h2>
          <p className="text-xs text-slate-500">Map internal approval stakeholders and workflow routes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requested By */}
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 space-y-2">
          <label className="block font-bold text-xs uppercase tracking-wider text-slate-600">Requested By</label>
          <select
            {...register('requestedBySelectIndex')}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white focus:ring-2 focus:ring-chedBlue focus:outline-none transition"
          >
            <option value="">Select Personnel</option>
            {personnelList.map((p, index) => (
              <option key={p._id || index} value={index}>
                {p.name} — {p.position}
              </option>
            ))}
          </select>
          <input
            {...register('requestedBy.name')}
            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-100 text-slate-700 font-semibold cursor-not-allowed"
            placeholder="Requested By Name"
            readOnly
          />
          <input
            {...register('requestedBy.position')}
            className="w-full border border-slate-200 rounded-lg p-2.5 text-2xs bg-slate-100 text-slate-500 uppercase tracking-tight cursor-not-allowed"
            placeholder="Position"
            readOnly
          />
        </div>

        {/* Funds Status */}
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 flex flex-col justify-between">
          <label className="block font-bold text-xs uppercase tracking-wider text-slate-600 mb-2">Funds Status</label>
          <div className="flex-1 flex items-center">
            <input
              {...register('fundsAvailable')}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white focus:ring-2 focus:ring-chedBlue focus:outline-none transition"
              placeholder="e.g. N/A"
            />
          </div>
        </div>

        {/* Approved By */}
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 space-y-2">
          <label className="block font-bold text-xs uppercase tracking-wider text-slate-600">Approved By</label>
          <select
            {...register('approvedBySelectIndex')}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white focus:ring-2 focus:ring-chedBlue focus:outline-none transition"
          >
            <option value="">Select Approver</option>
            {approverList.map((a, index) => (
              <option key={a._id || index} value={index}>
                {a.name} — {a.position}
              </option>
            ))}
          </select>

          <input
            {...register('approvedBy.name')}
            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-100 text-slate-700 font-semibold"
            placeholder="SHIRLEY C. AGRUPIS, Ph.D"
          />

          <select
            {...register('approvedBy.position')}
            className="w-full border border-slate-200 rounded-lg p-2.5 text-2xs bg-white text-slate-700 uppercase tracking-tight"
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
