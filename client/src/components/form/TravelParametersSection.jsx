import React from 'react';
import { MapPin, Globe, Compass, Calendar, Building, FileText, CheckCircle2 } from 'lucide-react';
import { formatPeriodOfTravel } from '../../utils/formatters';

export const TravelParametersSection = ({ register, errors, watch, setValue }) => {
  const startDate = watch('travelStartDate');
  const endDate = watch('travelEndDate');
  const currentAttType = watch('attType') || 'Local';

  // Sync periodOfTravel when start/end dates change
  React.useEffect(() => {
    if (startDate || endDate) {
      const generatedPeriod = formatPeriodOfTravel(startDate, endDate);
      if (generatedPeriod) {
        setValue('periodOfTravel', generatedPeriod);
      }
    }
  }, [startDate, endDate, setValue]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
        <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 shadow-2xs">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Travel Parameters</h2>
          <p className="text-xs text-slate-500 font-medium">Provide destination, schedule, scope, and logistical justification.</p>
        </div>
      </div>

      {/* Visual ATT Type Segmented Selector */}
      <div>
        <label className="block font-extrabold text-2xs uppercase tracking-wider text-slate-500 mb-2">
          Travel Scope & Classification <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue('attType', 'Local')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
              currentAttType === 'Local'
                ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/20 shadow-sm'
                : 'bg-slate-50/60 border-slate-200/90 hover:bg-white text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${currentAttType === 'Local' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className={`block text-xs font-black ${currentAttType === 'Local' ? 'text-teal-900' : 'text-slate-800'}`}>
                  Local Travel
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Within the Republic of the Philippines</span>
              </div>
            </div>
            {currentAttType === 'Local' && <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />}
          </button>

          <button
            type="button"
            onClick={() => setValue('attType', 'Abroad')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
              currentAttType === 'Abroad'
                ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                : 'bg-slate-50/60 border-slate-200/90 hover:bg-white text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${currentAttType === 'Abroad' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className={`block text-xs font-black ${currentAttType === 'Abroad' ? 'text-indigo-900' : 'text-slate-800'}`}>
                  Travel Abroad
                </span>
                <span className="text-[11px] text-slate-500 font-medium">International official delegations</span>
              </div>
            </div>
            {currentAttType === 'Abroad' && <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />}
          </button>
        </div>
        <input type="hidden" {...register('attType')} />
        {errors.attType && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.attType.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block font-extrabold text-2xs uppercase tracking-wider text-slate-500 mb-1.5">
            Destination <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register('destination')}
              placeholder="e.g., Baguio City / Tokyo, Japan"
              className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs"
            />
          </div>
          {errors.destination && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.destination.message}</p>}
        </div>

        <div>
          <label className="block font-extrabold text-2xs uppercase tracking-wider text-slate-500 mb-1.5">
            Travel Classification <span className="text-rose-500">*</span>
          </label>
          <select
            {...register('travelClassification')}
            className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs cursor-pointer"
          >
            <option value="Official Business">Official Business</option>
            <option value="Official Time Only">Official Time Only</option>
            <option value="Personal Time">Personal Time</option>
          </select>
          {errors.travelClassification && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.travelClassification.message}</p>}
        </div>

        <div>
          <label className="block font-extrabold text-2xs uppercase tracking-wider text-slate-500 mb-1.5">
            Travel Start Date
          </label>
          <input
            type="date"
            {...register('travelStartDate')}
            className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs"
          />
        </div>

        <div>
          <label className="block font-extrabold text-2xs uppercase tracking-wider text-slate-500 mb-1.5">
            Travel End Date
          </label>
          <input
            type="date"
            {...register('travelEndDate')}
            className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-extrabold text-2xs uppercase tracking-wider text-slate-500 mb-1.5">
            Period of Travel <span className="text-rose-500">*</span>
          </label>
          <input
            {...register('periodOfTravel')}
            placeholder="e.g., May 28, 2026 to May 30, 2026"
            className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs"
          />
          {errors.periodOfTravel && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.periodOfTravel.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block font-extrabold text-2xs uppercase tracking-wider text-slate-500 mb-1.5">
            Office Station / Mandated Division
          </label>
          <input
            {...register('officeStation')}
            className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-extrabold text-2xs uppercase tracking-wider text-slate-500 mb-1.5">
            Purpose of Travel <span className="text-rose-500">*</span>
          </label>
          <textarea
            {...register('purpose')}
            rows="3"
            placeholder="State explicit administrative duties, project bases, or official mandate for travel..."
            className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs"
          ></textarea>
          {errors.purpose && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.purpose.message}</p>}
        </div>

        <div>
          <label className="block font-extrabold text-2xs uppercase tracking-wider text-slate-500 mb-1.5">
            Date Prepared
          </label>
          <input
            type="date"
            {...register('datePrepared')}
            className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};
