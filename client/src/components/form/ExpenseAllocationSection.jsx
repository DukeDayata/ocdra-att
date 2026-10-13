import React, { useEffect, useState } from 'react';
import { DollarSign, Ban, CheckCircle2, Calculator, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ExpenseAllocationSection = ({ register, watch, setValue, attType }) => {
  const isLocal = attType === 'Local';

  const airfare = watch('expenses.airfare');
  const perDiem = watch('expenses.perDiem');
  const preTravel = watch('expenses.preTravel');
  const totalAmount = watch('expenses.totalAmount');

  // Option state for local travel: 'expenses' or 'no_ched_fund'
  const [localOption, setLocalOption] = useState(() => {
    const hasExp = Boolean(
      (airfare && Number(airfare) > 0) ||
      (perDiem && Number(perDiem) > 0) ||
      (preTravel && Number(preTravel) > 0) ||
      (totalAmount && Number(totalAmount) > 0)
    );
    return hasExp ? 'expenses' : 'expenses';
  });

  // Choice state: 'airfare' (Airfare, Meals, Incidental Fee) | 'transportation' (Transportation, Meals, Incidental Fee)
  const [localChoice, setLocalChoice] = useState(() => {
    return watch('expenses.expenseType') === 'Transportation' ? 'transportation' : 'airfare';
  });

  const handleSelectChoice = (choice) => {
    setLocalChoice(choice);
    setValue('expenses.expenseType', choice === 'transportation' ? 'Transportation' : 'Airfare');
  };

  // Automatically calculate total amount when numeric inputs change
  useEffect(() => {
    if (localOption === 'no_ched_fund' && isLocal) return;

    const airfareNum = parseFloat(airfare) || 0;
    const perDiemNum = parseFloat(perDiem) || 0;
    const preTravelNum = parseFloat(preTravel) || 0;
    const calcTotal = airfareNum + perDiemNum + preTravelNum;

    if (!isNaN(calcTotal) && calcTotal > 0) {
      setValue('expenses.totalAmount', calcTotal);
    }
  }, [airfare, perDiem, preTravel, localOption, isLocal, setValue]);

  // Set default values when ATT Type changes
  useEffect(() => {
    if (isLocal) {
      setValue('paymentMode', '');
      setValue('fundsAvailable', 'Diana C. Aguilar');
      setValue('fundsAvailablePosition', 'Chief Administrative Officer');
    } else {
      setValue('paymentMode', 'Reimbursement');
      setValue('fundsAvailable', 'Diana C. Aguilar');
      setValue('fundsAvailablePosition', 'Chief Administrative Officer');
    }
  }, [attType, isLocal, setValue]);

  const handleSelectOption = (option) => {
    setLocalOption(option);
    if (option === 'no_ched_fund') {
      setValue('expenses.airfare', 0);
      setValue('expenses.perDiem', 0);
      setValue('expenses.preTravel', 0);
      setValue('expenses.totalAmount', 0);
      setValue('expenses.airfareRaw', '');
      setValue('expenses.perDiemRaw', '');
      setValue('expenses.preTravelRaw', '');
      setValue('expenses.totalAmountRaw', '');
      setValue('paymentMode', '');
      setValue('sourceOfFunds', 'Personal');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-2xs">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Expense Allocation & Funding</h2>
            <p className="text-xs text-slate-500 font-medium">Designate funding source, payment method, and expense amounts.</p>
          </div>
        </div>

        {/* Local Travel Option Switcher */}
        {isLocal && (
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80 self-start sm:self-auto shadow-inner">
            <button
              type="button"
              onClick={() => handleSelectOption('expenses')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                localOption === 'expenses'
                  ? 'bg-white text-emerald-700 shadow-sm font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Put Expense Allocation</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectOption('no_ched_fund')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                localOption === 'no_ched_fund'
                  ? 'bg-rose-600 text-white shadow-sm font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Ban className="w-3.5 h-3.5" />
              <span>No CHED Fund Incurred</span>
            </button>
          </div>
        )}
      </div>

      {isLocal && localOption === 'no_ched_fund' ? (
        <div className="p-8 rounded-3xl bg-rose-50/70 border-2 border-rose-200/90 text-center space-y-2.5">
          <div className="inline-flex items-center justify-center p-3 bg-rose-100 text-rose-700 rounded-2xl shadow-sm mb-1">
            <Ban className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-rose-900 tracking-wide">NO CHED FUND INCURRED</h3>
          <p className="text-xs text-rose-700 max-w-md mx-auto font-medium leading-relaxed">
            This Local ATT document will be generated and printed with the official centered{' '}
            <strong className="underline">NO CHED FUND INCURRED</strong> stamp. All expense items are zeroed out.
          </p>
          <div className="pt-2 text-2xs text-slate-500 font-semibold">
            Click "Put Expense Allocation" above if you wish to allocate monetary amounts instead.
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Choice Selector for Local Travel Breakdown */}
          {isLocal && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-extrabold text-slate-700 uppercase tracking-wider text-2xs">
                Expense Breakdown Category:
              </span>
              <div className="inline-flex rounded-xl bg-white p-1 border border-slate-200 shadow-sm">
                <button
                  type="button"
                  onClick={() => handleSelectChoice('airfare')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all ${
                    localChoice === 'airfare'
                      ? 'bg-blue-600 text-white shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Choice 1: Airfare &bull; Meals &bull; Incidental Fee
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectChoice('transportation')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all ${
                    localChoice === 'transportation'
                      ? 'bg-blue-600 text-white shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Choice 2: Transportation &bull; Meals &bull; Incidental Fee
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div>
              <label className="block font-extrabold text-2xs uppercase tracking-wider text-slate-500 mb-1.5">
                Source of Funds
              </label>
              <input
                {...register('sourceOfFunds')}
                placeholder="e.g. Government / Project / Sponsor"
                className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-extrabold text-2xs uppercase tracking-wider text-slate-500 mb-1.5">
                Payment Mode
              </label>
              <select
                {...register('paymentMode')}
                className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs cursor-pointer"
              >
                <option value="">None</option>
                <option value="Cash Advance">Cash Advance</option>
                <option value="Reimbursement">Reimbursement</option>
              </select>
            </div>

            <div>
              <label className="block font-extrabold text-2xs uppercase tracking-wider text-slate-500 mb-1.5 truncate">
                {isLocal
                  ? localChoice === 'airfare'
                    ? 'AIRFARE EXPENSES with Insurance'
                    : 'Transportation'
                  : 'Airfare'}
              </label>
              <input
                type="number"
                step="any"
                {...register('expenses.airfare')}
                placeholder="0.00"
                className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-extrabold text-2xs uppercase tracking-wider text-slate-500 mb-1.5">
                Meals
              </label>
              <input
                type="number"
                step="any"
                {...register('expenses.perDiem')}
                placeholder="0.00"
                className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-extrabold text-2xs uppercase tracking-wider text-slate-500 mb-1.5">
                {isLocal ? 'Incidental Fee' : 'Pre-travel Expenses'}
              </label>
              <input
                type="number"
                step="any"
                {...register('expenses.preTravel')}
                placeholder="0.00"
                className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-extrabold text-2xs uppercase tracking-wider text-emerald-700 mb-1.5 flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                Total Amount (PHP)
              </label>
              <input
                type="number"
                step="any"
                {...register('expenses.totalAmount')}
                placeholder="0.00"
                className="w-full bg-emerald-50/60 border border-emerald-300 rounded-2xl p-3 text-sm font-black text-emerald-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition shadow-2xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
