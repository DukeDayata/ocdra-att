import React from 'react';
import { MapPin } from 'lucide-react';
import { formatPeriodOfTravel } from '../../utils/formatters';

export const TravelParametersSection = ({ register, errors, watch, setValue }) => {
  const startDate = watch('travelStartDate');
  const endDate = watch('travelEndDate');

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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="p-2.5 bg-blue-50 text-chedBlue rounded-xl">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Travel Parameters</h2>
          <p className="text-xs text-slate-500">Provide core destination, schedule, and logistical information.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block font-semibold text-xs uppercase tracking-wider text-slate-600">
            ATT Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register('attType')}
            className="w-full border border-slate-300 rounded-xl p-3 mt-1.5 text-sm bg-white focus:ring-2 focus:ring-chedBlue focus:border-chedBlue focus:outline-none transition shadow-sm"
          >
            <option value="Local">Local Travel</option>
            <option value="Abroad">Travel Abroad</option>
          </select>
          {errors.attType && <p className="text-red-500 text-xs mt-1">{errors.attType.message}</p>}
        </div>

        <div>
          <label className="block font-semibold text-xs uppercase tracking-wider text-slate-600">
            Destination <span className="text-red-500">*</span>
          </label>
          <input
            {...register('destination')}
            placeholder="e.g., Bataan / Japan"
            className="w-full border border-slate-300 rounded-xl p-3 mt-1.5 text-sm focus:ring-2 focus:ring-chedBlue focus:border-chedBlue focus:outline-none transition shadow-sm"
          />
          {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>}
        </div>

        <div>
          <label className="block font-semibold text-xs uppercase tracking-wider text-slate-600">Travel Start Date</label>
          <input
            type="date"
            {...register('travelStartDate')}
            className="w-full border border-slate-300 rounded-xl p-3 mt-1.5 text-sm focus:ring-2 focus:ring-chedBlue focus:border-chedBlue focus:outline-none transition shadow-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-xs uppercase tracking-wider text-slate-600">Travel End Date</label>
          <input
            type="date"
            {...register('travelEndDate')}
            className="w-full border border-slate-300 rounded-xl p-3 mt-1.5 text-sm focus:ring-2 focus:ring-chedBlue focus:border-chedBlue focus:outline-none transition shadow-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-semibold text-xs uppercase tracking-wider text-slate-600">
            Period of Travel <span className="text-red-500">*</span>
          </label>
          <input
            {...register('periodOfTravel')}
            placeholder="e.g., May 28, 2026 to May 30, 2026"
            className="w-full border border-slate-300 rounded-xl p-3 mt-1.5 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-chedBlue focus:outline-none transition shadow-sm"
          />
          {errors.periodOfTravel && <p className="text-red-500 text-xs mt-1">{errors.periodOfTravel.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block font-semibold text-xs uppercase tracking-wider text-slate-600">Office / Station</label>
          <input
            {...register('officeStation')}
            className="w-full border border-slate-300 rounded-xl p-3 mt-1.5 text-sm bg-slate-50 text-slate-700 focus:ring-2 focus:ring-chedBlue focus:outline-none transition shadow-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-semibold text-xs uppercase tracking-wider text-slate-600">
            Purpose of Travel <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('purpose')}
            rows="3"
            placeholder="State explicit details or legal dynamic bases for travel..."
            className="w-full border border-slate-300 rounded-xl p-3 mt-1.5 text-sm focus:ring-2 focus:ring-chedBlue focus:border-chedBlue focus:outline-none transition shadow-sm"
          ></textarea>
          {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose.message}</p>}
        </div>

        <div>
          <label className="block font-semibold text-xs uppercase tracking-wider text-slate-600">
            Travel Classification <span className="text-red-500">*</span>
          </label>
          <select
            {...register('travelClassification')}
            className="w-full border border-slate-300 rounded-xl p-3 mt-1.5 text-sm bg-white focus:ring-2 focus:ring-chedBlue focus:border-chedBlue focus:outline-none transition shadow-sm"
          >
            <option value="Official Business">Official Business</option>
            <option value="Official Time Only">Official Time Only</option>
            <option value="Personal Time">Personal Time</option>
          </select>
          {errors.travelClassification && <p className="text-red-500 text-xs mt-1">{errors.travelClassification.message}</p>}
        </div>

        <div>
          <label className="block font-semibold text-xs uppercase tracking-wider text-slate-600">Date Prepared</label>
          <input
            type="date"
            {...register('datePrepared')}
            className="w-full border border-slate-300 rounded-xl p-3 mt-1.5 text-sm focus:ring-2 focus:ring-chedBlue focus:border-chedBlue focus:outline-none transition shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};
