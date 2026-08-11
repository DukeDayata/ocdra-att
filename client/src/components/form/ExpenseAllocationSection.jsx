import React, { useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ExpenseAllocationSection = ({ register, watch, setValue, attType }) => {
  const isLocal = attType === 'Local';

  const airfare = watch('expenses.airfare');
  const perDiem = watch('expenses.perDiem');
  const preTravel = watch('expenses.preTravel');

  // Automatically calculate total amount when numeric inputs change
  useEffect(() => {
    const airfareNum = parseFloat(airfare) || 0;
    const perDiemNum = parseFloat(perDiem) || 0;
    const preTravelNum = parseFloat(preTravel) || 0;
    const calcTotal = airfareNum + perDiemNum + preTravelNum;

    if (!isNaN(calcTotal) && calcTotal > 0) {
      setValue('expenses.totalAmount', calcTotal);
    }
  }, [airfare, perDiem, preTravel, setValue]);

  // Set default values when ATT Type changes
  useEffect(() => {
    if (isLocal) {
      setValue('paymentMode', '');
      setValue('fundsAvailable', 'N/A');
    } else {
      setValue('paymentMode', 'Reimbursement');
      setValue('fundsAvailable', 'N/A');
    }
  }, [attType, isLocal, setValue]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Expense Allocation</h2>
          <p className="text-xs text-slate-500">Provide funding information and accurate monetary allocations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <div>
          <label className="block font-semibold text-xs uppercase tracking-wider text-slate-600">Source of Funds</label>
          <input
            {...register('sourceOfFunds')}
            placeholder="Government / CHED GAA / Sponsor / etc."
            className="w-full border border-slate-300 rounded-xl p-3 mt-1.5 text-sm focus:ring-2 focus:ring-chedBlue focus:outline-none transition shadow-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-xs uppercase tracking-wider text-slate-600">Payment Mode</label>
          <select
            {...register('paymentMode')}
            className="w-full border border-slate-300 rounded-xl p-3 mt-1.5 text-sm bg-white focus:ring-2 focus:ring-chedBlue focus:outline-none transition shadow-sm"
          >
            <option value="">None</option>
            <option value="Cash Advance">Cash Advance</option>
            <option value="Reimbursement">Reimbursement</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-xs uppercase tracking-wider text-slate-600">
            {isLocal ? 'Airfare Expenses with Travel Insurance' : 'Airfare'}
          </label>
          <input
            type="number"
            step="any"
            {...register('expenses.airfare')}
            placeholder="0.00"
            className="w-full border border-slate-300 rounded-xl p-3 mt-1.5 text-sm focus:ring-2 focus:ring-chedBlue focus:outline-none transition shadow-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-xs uppercase tracking-wider text-slate-600">
            {isLocal ? 'Meals' : 'Per Diem'}
          </label>
          <input
            type="number"
            step="any"
            {...register('expenses.perDiem')}
            placeholder="0.00"
            className="w-full border border-slate-300 rounded-xl p-3 mt-1.5 text-sm focus:ring-2 focus:ring-chedBlue focus:outline-none transition shadow-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-xs uppercase tracking-wider text-slate-600">
            {isLocal ? 'Travel Allowance' : 'Pre-travel Expenses'}
          </label>
          <input
            type="number"
            step="any"
            {...register('expenses.preTravel')}
            placeholder="0.00"
            className="w-full border border-slate-300 rounded-xl p-3 mt-1.5 text-sm focus:ring-2 focus:ring-chedBlue focus:outline-none transition shadow-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-xs uppercase tracking-wider text-slate-600">Total Amount</label>
          <input
            type="number"
            step="any"
            {...register('expenses.totalAmount')}
            placeholder="0.00"
            className="w-full border border-slate-300 rounded-xl p-3 mt-1.5 text-sm font-semibold focus:ring-2 focus:ring-chedBlue focus:outline-none transition shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};
