import React from 'react';
import { MapPin, Globe, Compass, Calendar, Building, FileText, CheckCircle2 } from 'lucide-react';
import { formatPeriodOfTravel } from '../../utils/formatters';

export const TravelParametersSection = ({ register, errors, watch, setValue }) => {
  const startDate = watch('travelStartDate');
  const endDate = watch('travelEndDate');
  const currentAttType = watch('attType') || 'Local';
  const currentClassification = watch('travelClassification') || 'Official Business';

  // Sync periodOfTravel when start/end dates change
  React.useEffect(() => {
    if (startDate || endDate) {
      const generatedPeriod = formatPeriodOfTravel(startDate, endDate);
      if (generatedPeriod) {
        setValue('periodOfTravel', generatedPeriod);
      }
    }
  }, [startDate, endDate, setValue]);

  // Harmonize travelClassification when switching between Local and Abroad
  const handleScopeChange = (type) => {
    setValue('attType', type, { shouldValidate: true, shouldDirty: true });
    if (type === 'Abroad' && currentClassification === 'Personal Time') {
      setValue('travelClassification', 'Personal Travel', { shouldValidate: true, shouldDirty: true });
    } else if (type === 'Local' && currentClassification === 'Personal Travel') {
      setValue('travelClassification', 'Personal Time', { shouldValidate: true, shouldDirty: true });
    }
  };

  const abroadClassifications = [
    {
      value: 'Official Business',
      label: 'Official Business',
      description: 'Official CHED mission, international conference, or bilateral meeting.',
      tag: 'Official Mission'
    },
    {
      value: 'Official Time Only',
      label: 'Official Time Only',
      description: 'Authorized travel on official government time; no monetary expense claim from CHED.',
      tag: 'Official Time'
    },
    {
      value: 'Personal Travel',
      label: 'Personal Travel',
      description: 'Personal, vacation, or private travel abroad requiring CHED travel authority clearance.',
      tag: 'Personal Leave'
    }
  ];

  const localClassifications = [
    {
      value: 'Official Business',
      label: 'Official Business',
      description: 'Official travel within the Philippines with travel expense allocation.',
      tag: 'Official Mission'
    },
    {
      value: 'Official Time Only',
      label: 'Official Time Only',
      description: 'Authorized travel within the Philippines on official time only; no per diem claim.',
      tag: 'Official Time'
    },
    {
      value: 'Personal Time',
      label: 'Personal Time',
      description: 'Personal travel or non-official transit within the Republic of the Philippines.',
      tag: 'Personal Time'
    }
  ];

  const classificationOptions = currentAttType === 'Abroad' ? abroadClassifications : localClassifications;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
        <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 shadow-2xs">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Travel Scope & Classification</h2>
          <p className="text-xs text-slate-500 font-medium">Select travel jurisdiction, official classification, destination, and schedule.</p>
        </div>
      </div>

      {/* Visual Travel Scope (ATT Type) Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block font-extrabold text-2xs uppercase tracking-wider text-slate-500">
            Travel Scope (ATT Type) <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {currentAttType === 'Abroad' ? 'International Jurisdiction' : 'Domestic Jurisdiction'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleScopeChange('Local')}
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
                <div className="flex items-center gap-2">
                  <span className={`block text-xs font-black ${currentAttType === 'Local' ? 'text-teal-900' : 'text-slate-800'}`}>
                    Local Travel
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal-100/70 text-teal-800 border border-teal-200/50">
                    Domestic
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Within the Republic of the Philippines</span>
              </div>
            </div>
            {currentAttType === 'Local' && <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />}
          </button>

          <button
            type="button"
            onClick={() => handleScopeChange('Abroad')}
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
                <div className="flex items-center gap-2">
                  <span className={`block text-xs font-black ${currentAttType === 'Abroad' ? 'text-indigo-900' : 'text-slate-800'}`}>
                    Travel Abroad
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100/70 text-indigo-800 border border-indigo-200/50">
                    International
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">International official delegations or personal travel</span>
              </div>
            </div>
            {currentAttType === 'Abroad' && <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />}
          </button>
        </div>
        <input type="hidden" {...register('attType')} />
        {errors.attType && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.attType.message}</p>}
      </div>

      {/* Visual Travel Classification Segmented Selector */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <label className="block font-extrabold text-2xs uppercase tracking-wider text-slate-500">
            Travel Classification <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] font-bold text-slate-500">
            {currentAttType === 'Abroad' ? 'Official Authority to Travel Abroad Options' : 'Local Authority to Travel Options'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {classificationOptions.map((opt) => {
            const isSelected = currentClassification === opt.value;
            const isAbroad = currentAttType === 'Abroad';
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('travelClassification', opt.value, { shouldValidate: true, shouldDirty: true })}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? isAbroad
                      ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/20 shadow-sm'
                    : 'bg-slate-50/60 border-slate-200/90 hover:bg-white text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-xs font-black ${
                      isSelected
                        ? isAbroad ? 'text-indigo-900' : 'text-teal-900'
                        : 'text-slate-800'
                    }`}>
                      {opt.label}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${
                        isAbroad ? 'text-indigo-600' : 'text-teal-600'
                      }`} />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-2">
                    {opt.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/60">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isSelected
                      ? isAbroad
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-teal-100 text-teal-800'
                      : 'bg-slate-200/70 text-slate-600'
                  }`}>
                    {opt.tag}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Hidden or standard select for accessibility & form registration */}
        <select
          {...register('travelClassification')}
          className="sr-only"
        >
          {classificationOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.travelClassification && (
          <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.travelClassification.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        <div className="md:col-span-2">
          <label className="block font-extrabold text-2xs uppercase tracking-wider text-slate-500 mb-1.5">
            Destination <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register('destination')}
              placeholder={
                currentAttType === 'Abroad'
                  ? 'e.g., San Diego, California, USA / Tokyo, Japan / Geneva, Switzerland'
                  : 'e.g., Baguio City / Cebu City / Davao City'
              }
              className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            {currentAttType === 'Abroad'
              ? 'Specify international host city and country.'
              : 'Specify local city/municipality and province.'}
          </p>
          {errors.destination && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.destination.message}</p>}
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
