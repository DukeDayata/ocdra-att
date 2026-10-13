import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { attApi } from '../services/api';
import { formatDate, formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';
import {
  Printer,
  ArrowLeft,
  DollarSign,
  Ban,
  Save,
  SlidersHorizontal,
  Calculator,
  RotateCcw,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export const PrintATTLocalPage = () => {
  const { referenceNo } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Expense Mode: 'expenses' (Expense Allocation) | 'no_ched_fund' (No CHED Fund Incurred)
  const [expenseMode, setExpenseMode] = useState('no_ched_fund');

  // Breakdown Choice: 'airfare' (Airfare, Meals, Incidental Fee) | 'transportation' (Transportation, Meals, Incidental Fee)
  const [expenseHeaderType, setExpenseHeaderType] = useState('airfare');

  // Editable Expense Allocations & Funding
  const [airfare, setAirfare] = useState('');
  const [meals, setMeals] = useState('');
  const [travelAllowance, setTravelAllowance] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [sourceOfFunds, setSourceOfFunds] = useState('');
  const [travelClassification, setTravelClassification] = useState('');
  const [fundsAvailable, setFundsAvailable] = useState('Diana C. Aguilar');
  const [fundsAvailablePosition, setFundsAvailablePosition] = useState('Chief Administrative Officer');

  // UI state
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true);
        const res = await attApi.getByRef(referenceNo);
        const record = res.data;
        setData(record);

        // Detect if record already has recorded expenses
        const hasExpenses = Boolean(
          record.expenses?.airfare ||
          record.expenses?.perDiem ||
          record.expenses?.preTravel ||
          (record.expenses?.totalAmount && Number(record.expenses?.totalAmount) > 0) ||
          record.expenses?.airfareRaw ||
          record.expenses?.perDiemRaw ||
          record.expenses?.preTravelRaw ||
          record.expenses?.totalAmountRaw
        );

        setExpenseMode(hasExpenses ? 'expenses' : 'no_ched_fund');
        setExpenseHeaderType(record.expenses?.expenseType === 'Transportation' ? 'transportation' : 'airfare');
        setAirfare(record.expenses?.airfareRaw || (record.expenses?.airfare ? String(record.expenses?.airfare) : ''));
        setMeals(record.expenses?.perDiemRaw || (record.expenses?.perDiem ? String(record.expenses?.perDiem) : ''));
        setTravelAllowance(record.expenses?.preTravelRaw || (record.expenses?.preTravel ? String(record.expenses?.preTravel) : ''));
        setTotalAmount(record.expenses?.totalAmountRaw || (record.expenses?.totalAmount ? String(record.expenses?.totalAmount) : ''));
        setPaymentMode(record.paymentMode || '');
        setSourceOfFunds(record.sourceOfFunds === 'CHED GAA' ? '' : (record.sourceOfFunds || ''));
        setTravelClassification(record.travelClassification || 'Official Business');
        const initFunds = record.fundsAvailable || (hasExpenses ? 'Diana C. Aguilar' : 'N/A');
        setFundsAvailable(initFunds);
        setFundsAvailablePosition(
          record.fundsAvailablePosition ||
          (initFunds.toLowerCase().includes('aguilar') ? 'Chief Administrative Officer' : '')
        );
      } catch (err) {
        console.error('Fetch Local Print Record Error:', err);
        setError(err.message || `Unable to load ATT record for reference ${referenceNo}`);
      } finally {
        setLoading(false);
      }
    };

    if (referenceNo) {
      fetchRecord();
    }
  }, [referenceNo]);

  // Helper to calculate total sum of numbers
  const calcSum = (a, m, t) => {
    const aNum = parseFloat(String(a).replace(/[^0-9.-]+/g, '')) || 0;
    const mNum = parseFloat(String(m).replace(/[^0-9.-]+/g, '')) || 0;
    const tNum = parseFloat(String(t).replace(/[^0-9.-]+/g, '')) || 0;
    return aNum + mNum + tNum;
  };

  const handleAirfareChange = (val) => {
    setAirfare(val);
    const sum = calcSum(val, meals, travelAllowance);
    if (sum > 0) {
      setTotalAmount(formatCurrency(sum));
    }
  };

  const handleMealsChange = (val) => {
    setMeals(val);
    const sum = calcSum(airfare, val, travelAllowance);
    if (sum > 0) {
      setTotalAmount(formatCurrency(sum));
    }
  };

  const handleTravelAllowanceChange = (val) => {
    setTravelAllowance(val);
    const sum = calcSum(airfare, meals, val);
    if (sum > 0) {
      setTotalAmount(formatCurrency(sum));
    }
  };

  const handleAutoSum = () => {
    const sum = calcSum(airfare, meals, travelAllowance);
    setTotalAmount(formatCurrency(sum));
    toast.success(`Calculated Total: ₱ ${formatCurrency(sum)}`);
  };

  const handleResetExpenses = () => {
    if (data?.expenses) {
      setAirfare(data.expenses.airfareRaw || (data.expenses.airfare ? String(data.expenses.airfare) : ''));
      setMeals(data.expenses.perDiemRaw || (data.expenses.perDiem ? String(data.expenses.perDiem) : ''));
      setTravelAllowance(data.expenses.preTravelRaw || (data.expenses.preTravel ? String(data.expenses.preTravel) : ''));
      setTotalAmount(data.expenses.totalAmountRaw || (data.expenses.totalAmount ? String(data.expenses.totalAmount) : ''));
      setPaymentMode(data.paymentMode || '');
      setSourceOfFunds(data.sourceOfFunds === 'CHED GAA' ? '' : (data.sourceOfFunds || ''));
      const resetFunds = data.fundsAvailable || 'Diana C. Aguilar';
      setFundsAvailable(resetFunds);
      setFundsAvailablePosition(
        data.fundsAvailablePosition ||
        (resetFunds.toLowerCase().includes('aguilar') ? 'Chief Administrative Officer' : '')
      );
    } else {
      setAirfare('');
      setMeals('');
      setTravelAllowance('');
      setTotalAmount('');
      setPaymentMode('');
      setSourceOfFunds('');
      setFundsAvailable('Diana C. Aguilar');
      setFundsAvailablePosition('Chief Administrative Officer');
    }
    toast.success('Reset to recorded database values');
  };

  const handleSelectExpensesMode = () => {
    setExpenseMode('expenses');
    toast.success('Switched to Expense Allocation mode');
  };

  const handleSelectNoChedFundMode = () => {
    setExpenseMode('no_ched_fund');
    toast.success("Switched to 'NO CHED FUND INCURRED' mode");
  };

  // Persist current settings to database
  const handleSaveToRecord = async () => {
    try {
      setIsSaving(true);
      const targetId = data._id || referenceNo;

      let expensesPayload = {};
      if (expenseMode === 'no_ched_fund') {
        expensesPayload = {
          airfare: 0,
          perDiem: 0,
          preTravel: 0,
          totalAmount: 0,
          airfareRaw: '',
          perDiemRaw: '',
          preTravelRaw: '',
          totalAmountRaw: ''
        };
      } else {
        const aNum = parseFloat(String(airfare).replace(/[^0-9.-]+/g, '')) || 0;
        const mNum = parseFloat(String(meals).replace(/[^0-9.-]+/g, '')) || 0;
        const tNum = parseFloat(String(travelAllowance).replace(/[^0-9.-]+/g, '')) || 0;
        const totNum = parseFloat(String(totalAmount).replace(/[^0-9.-]+/g, '')) || (aNum + mNum + tNum);

        expensesPayload = {
          airfare: aNum,
          perDiem: mNum,
          preTravel: tNum,
          totalAmount: totNum,
          airfareRaw: String(airfare || ''),
          perDiemRaw: String(meals || ''),
          preTravelRaw: String(travelAllowance || ''),
          totalAmountRaw: String(totalAmount || ''),
          expenseType: expenseHeaderType === 'transportation' ? 'Transportation' : 'Airfare'
        };
      }

      const updatePayload = {
        expenses: expensesPayload,
        paymentMode: paymentMode,
        sourceOfFunds: (sourceOfFunds === 'CHED GAA' ? '' : sourceOfFunds) || (data.sourceOfFunds === 'CHED GAA' ? '' : data.sourceOfFunds) || '',
        travelClassification: travelClassification || data.travelClassification,
        fundsAvailable: fundsAvailable || (expenseMode === 'expenses' ? 'Diana C. Aguilar' : 'N/A'),
        fundsAvailablePosition: fundsAvailablePosition || (fundsAvailable.toLowerCase().includes('aguilar') ? 'Chief Administrative Officer' : '')
      };

      const res = await attApi.update(targetId, updatePayload);
      if (res.data) {
        setData(res.data);
      }
      toast.success('ATT record expenses successfully saved to database!');
    } catch (err) {
      console.error('Error saving expenses to ATT:', err);
      toast.error(err.message || 'Failed to save changes to database');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-sans text-sm flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-chedBlue" />
        Loading printable Local ATT document...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-red-600 font-sans text-sm">
        {error || `Record not found for reference ${referenceNo}`}
      </div>
    );
  }

  const personnelNamesHtml = (data.personnel || []).map((p) => p.name).join('<br>');
  const personnelPositionsHtml = (data.personnel || []).map((p) => p.position).join('<br>');

  const isPersonal = travelClassification === 'Personal Time';
  const isBusiness = travelClassification === 'Official Business';
  const isOfficialTime = travelClassification === 'Official Time Only';

  const isCashAdvance = paymentMode === 'Cash Advance';
  const isReimbursement = paymentMode === 'Reimbursement';

  return (
    <div className="bg-white min-h-screen font-sans text-[#111] text-[12px] p-2 sm:p-4">
      {/* Floating Print Toolbar */}
      <div className="no-print sticky top-3 z-50 max-w-4xl mx-auto mb-6 bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:p-4 px-4 sm:px-6 rounded-2xl shadow-2xl border border-slate-700/80 flex flex-col gap-3">
        {/* Main Toolbar Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-chedGold/20 flex items-center justify-center text-chedGold font-extrabold text-xs shadow-inner">
              LOCAL
            </div>
            <div>
              <div className="font-extrabold text-xs sm:text-sm text-white flex items-center gap-2">
                <span>Print ATT Local</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {referenceNo}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                A4 Portrait &bull; Margins: 0.30 in
              </div>
            </div>
          </div>

          {/* Option Selector: Expense Allocation vs No CHED Fund Incurred */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 shadow-inner">
            <button
              type="button"
              onClick={handleSelectExpensesMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                expenseMode === 'expenses'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Expense Allocation
            </button>
            <button
              type="button"
              onClick={handleSelectNoChedFundMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                expenseMode === 'no_ched_fund'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-1 ring-rose-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Ban className="w-3.5 h-3.5" />
              No CHED Fund Incurred
            </button>
          </div>

          {/* Choice Selector: Airfare vs Transportation */}
          {expenseMode === 'expenses' && (
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 shadow-inner">
              <button
                type="button"
                onClick={() => setExpenseHeaderType('airfare')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  expenseHeaderType === 'airfare'
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Choice 1: Airfare Expenses with Travel Insurance, Meals, Incidental Fee"
              >
                ✈️ Airfare
              </button>
              <button
                type="button"
                onClick={() => setExpenseHeaderType('transportation')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  expenseHeaderType === 'transportation'
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Choice 2: Transportation, Meals, Incidental Fee"
              >
                🚗 Transportation
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {expenseMode === 'expenses' && (
              <button
                type="button"
                onClick={() => setShowEditDrawer(!showEditDrawer)}
                className={`px-3 py-2 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 ${
                  showEditDrawer
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title="Toggle quick expense editing form"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {showEditDrawer ? 'Hide Inputs' : 'Put Expenses'}
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveToRecord}
              disabled={isSaving}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
              title="Save current mode & expenses permanently to the database"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              ) : (
                <Save className="w-3.5 h-3.5 text-amber-400" />
              )}
              Save
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 shadow-emerald-500/20"
            >
              <Printer className="w-4 h-4" />
              Print ATT Local
            </button>
          </div>
        </div>

        {/* Collapsible Quick Expense Allocation Form Drawer */}
        {showEditDrawer && expenseMode === 'expenses' && (
          <div className="pt-3 border-t border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-800/40 p-3.5 rounded-xl text-xs">
            <div className="sm:col-span-4 flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-700/60 mb-1">
              <span className="text-[11px] font-bold text-slate-300">
                Expense Breakdown Choices:
              </span>
              <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setExpenseHeaderType('airfare')}
                  className={`px-3 py-1 text-xs rounded-md font-bold transition ${
                    expenseHeaderType === 'airfare'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Choice 1: Airfare &bull; Meals &bull; Incidental Fee
                </button>
                <button
                  type="button"
                  onClick={() => setExpenseHeaderType('transportation')}
                  className={`px-3 py-1 text-xs rounded-md font-bold transition ${
                    expenseHeaderType === 'transportation'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Choice 2: Transportation &bull; Meals &bull; Incidental Fee
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                {expenseHeaderType === 'airfare'
                  ? 'Airfare (w/ Insurance)'
                  : 'Transportation'}
              </label>
              <input
                type="text"
                value={airfare}
                onChange={(e) => handleAirfareChange(e.target.value)}
                placeholder={expenseHeaderType === 'airfare' ? 'e.g. 8,500.00' : 'e.g. 3,500.00'}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Meals
              </label>
              <input
                type="text"
                value={meals}
                onChange={(e) => handleMealsChange(e.target.value)}
                placeholder="e.g. 2,400.00"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Incidental Fee
              </label>
              <input
                type="text"
                value={travelAllowance}
                onChange={(e) => handleTravelAllowanceChange(e.target.value)}
                placeholder="e.g. 1,000.00"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-300">Total Amount</label>
                <button
                  type="button"
                  onClick={handleAutoSum}
                  className="text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                  title="Sum numeric fields automatically"
                >
                  <Calculator className="w-2.5 h-2.5" /> Sum
                </button>
              </div>
              <input
                type="text"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs font-bold text-emerald-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Source of Funds
              </label>
              <input
                type="text"
                value={sourceOfFunds === 'CHED GAA' ? '' : sourceOfFunds}
                onChange={(e) => setSourceOfFunds(e.target.value)}
                placeholder="e.g. Personal, Sponsor, etc."
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-300">Payment Mode:</span>
              <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setPaymentMode('')}
                  className={`px-2.5 py-1 text-[11px] rounded font-semibold transition ${
                    !paymentMode ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  None
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('Cash Advance')}
                  className={`px-2.5 py-1 text-[11px] rounded font-semibold transition ${
                    paymentMode === 'Cash Advance' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Cash Advance
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('Reimbursement')}
                  className={`px-2.5 py-1 text-[11px] rounded font-semibold transition ${
                    paymentMode === 'Reimbursement' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Reimbursement
                </button>
              </div>
            </div>

            <div className="sm:col-span-4 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-300">
                  Funds Available Signatory:
                </span>
                <div className="inline-flex gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      setFundsAvailable('Diana C. Aguilar');
                      setFundsAvailablePosition('Chief Administrative Officer');
                    }}
                    className="text-blue-400 hover:underline font-bold"
                  >
                    Diana C. Aguilar
                  </button>
                  <span className="text-slate-500">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFundsAvailable('N/A');
                      setFundsAvailablePosition('');
                    }}
                    className="text-slate-400 hover:underline font-bold"
                  >
                    N/A
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={fundsAvailable}
                  onChange={(e) => setFundsAvailable(e.target.value)}
                  placeholder="Diana C. Aguilar"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                />
                <input
                  type="text"
                  value={fundsAvailablePosition}
                  onChange={(e) => setFundsAvailablePosition(e.target.value)}
                  placeholder="Chief Administrative Officer"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="sm:col-span-4 flex items-center gap-2 justify-end pt-2 border-t border-slate-700/60">
              <button
                type="button"
                onClick={handleResetExpenses}
                className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold rounded-lg transition flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
              <button
                type="button"
                onClick={handleSaveToRecord}
                disabled={isSaving}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
              >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                Save to Database
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @page {
          size: A4 portrait;
          margin: 0.30in;
        }
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { margin: 0; background: white; }
          .page { transform: none !important; width: 100% !important; margin: 0 !important; }
        }
        .print-only { display: none; }
        .page {
          width: 640px;
          margin: 0 auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        td {
          border: 1px solid #111;
          vertical-align: top;
          padding: 3px;
        }
        .no-border td {
          border: none;
        }
        .center { text-align: center; }
        .bold { font-weight: 700; }
        .italic { font-style: italic; }
        .red { color: #e11d2e; font-weight: 700; }

        .main-title {
          text-align: center;
          font-size: 13px;
          font-weight: 800;
          margin: 16px 0 16px;
        }
        .agency-title {
          font-size: 16px;
          font-weight: 800;
          line-height: 1.1;
        }
        .agency-sub {
          font-size: 8px;
          line-height: 1.4;
        }
        .top-box { height: 34px; }
        .name-row { height: 70px; }
        .office-row { height: 56px; }
        .purpose-row { height: 105px; }
        .expenses-row { height: 140px; }
        .signature-row { height: 90px; }
        .date-row { height: 58px; }

        .checkbox {
          display: inline-block;
          width: 10px;
          height: 10px;
          border: 1.5px solid #111;
          margin-right: 8px;
          text-align: center;
          line-height: 9px;
          font-size: 10px;
          font-weight: 800;
        }
        .checkbox-line {
          margin: 10px 0 12px 8px;
          font-size: 10px;
          white-space: nowrap;
        }
        .small { font-size: 10px; }
        .bottom-label {
          text-align: center;
          color: #e11d2e;
          font-weight: 800;
          margin-bottom: 5px;
          font-size: 10px;
        }
        .bottom-box {
          height: 50px;
          border: 1px solid #111;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          flex-direction: column;
        }
        .ticket-box {
          height: 88px;
          border: 1px solid #111;
        }
        .received-box {
          height: 55px;
          border: 1px solid #111;
        }
        .mt-22 { margin-top: 22px; }
        .expense-dash {
          text-align: right;
          line-height: 2.2;
          padding-right: 10px;
        }
      `}</style>

      <div className="page">
        {/* HEADER */}
        <table className="no-border">
          <tbody>
            <tr>
              <td style={{ width: '21%', textAlign: 'right' }}>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS09VcKGv13xWhInQgtKJHMc_OusxGrtluNMw&s"
                  alt="CHED Logo"
                  style={{ width: '60%', maxWidth: '380px' }}
                />
              </td>
              <td style={{ width: '79%', textAlign: 'left', paddingLeft: '12px', paddingTop: '12px' }}>
                <div className="agency-title">COMMISSION ON HIGHER EDUCATION</div>
                <div className="agency-sub">Higher Education Development Center (HEDC) Building,</div>
                <div className="agency-sub">C.P. Garcia Ave., Diliman, Quezon City</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* BOOKING ROW */}
        <table style={{ marginTop: '14px' }}>
          <tbody>
            <tr>
              <td className="red center" style={{ width: '20%', border: 'none', paddingTop: '7px' }}>
                BOOKING REFERENCE<br />NO./TOTAL AIRFARE
              </td>
              <td className="top-box" style={{ width: '30%' }}></td>
              <td className="red center" style={{ width: '18%', border: 'none', paddingTop: '7px' }}>
                BASE FARE X NO.<br />OF PASSENGERS
              </td>
              <td className="top-box" style={{ width: '32%' }}></td>
            </tr>
          </tbody>
        </table>

        <div className="main-title">AUTHORITY TO TRAVEL</div>

        {/* MAIN DETAILS */}
        <table>
          <colgroup>
            <col style={{ width: '35%' }} />
            <col style={{ width: '32%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '32%' }} />
          </colgroup>

          <tbody>
            <tr className="name-row">
              <td colSpan="3">
                Name of Official/Employee:
                <div
                  className="bold"
                  style={{ fontSize: '11px', marginTop: '4px' }}
                  dangerouslySetInnerHTML={{ __html: personnelNamesHtml }}
                ></div>
              </td>
              <td>
                Position:
                <div
                  className="bold"
                  style={{ fontSize: '11px', marginTop: '4px' }}
                  dangerouslySetInnerHTML={{ __html: personnelPositionsHtml }}
                ></div>
              </td>
            </tr>

            <tr className="office-row">
              <td>
                Office/Station<br /><br />
                <div className="center bold italic small">{data.officeStation}</div>
              </td>
              <td>
                Destination:<br /><br />
                <div className="center bold">{data.destination}</div>
              </td>
              <td colSpan="2">
                Period of Travel:<br /><br />
                <div className="center bold small">{data.periodOfTravel}</div>
              </td>
            </tr>

            <tr className="purpose-row">
              <td colSpan="3">
                Purpose of Travel:<br /><br /><br />
                <div className="bold" style={{ paddingLeft: '12px' }}>{data.purpose}</div>
              </td>
              <td>
                <br />
                <div
                  className="checkbox-line cursor-pointer select-none"
                  onClick={() => setTravelClassification('Personal Time')}
                  title="Click to toggle Personal Time"
                >
                  <span className="checkbox">{isPersonal ? '✓' : ''}</span>Personal Time
                </div>
                <div
                  className="checkbox-line cursor-pointer select-none"
                  onClick={() => setTravelClassification('Official Business')}
                  title="Click to toggle Official Business"
                >
                  <span className="checkbox">{isBusiness ? '✓' : ''}</span>Official Business
                </div>
                <div
                  className="checkbox-line cursor-pointer select-none"
                  onClick={() => setTravelClassification('Official Time Only')}
                  title="Click to toggle Official Time Only"
                >
                  <span className="checkbox">{isOfficialTime ? '✓' : ''}</span>Official Time Only
                </div>
              </td>
            </tr>

            <tr>
              <td colSpan="4" className="bold" style={{ height: '20px' }}>
                *authorized to reimburse actual expenses
              </td>
            </tr>
          </tbody>
        </table>

        {/* ESTIMATED EXPENSES */}
        <table>
          <tbody>
            <tr>
              <td colSpan="4" className="center bold" style={{ height: '19px' }}>ESTIMATED EXPENSES</td>
              <td rowSpan="2" style={{ width: '31%' }}>Please check:</td>
            </tr>

            <tr>
              <td
                className="red center"
                style={{ width: '20%', position: 'relative' }}
              >
                {/* Screen view clickable selector */}
                <div
                  className="no-print cursor-pointer select-none group"
                  onClick={() => setExpenseHeaderType((prev) => (prev === 'airfare' ? 'transportation' : 'airfare'))}
                  title="Click to toggle between Choice 1 (Airfare) and Choice 2 (Transportation)"
                >
                  {expenseHeaderType === 'airfare' ? (
                    <>
                      AIRFARE EXPENSES with<br />Travel Insurance
                    </>
                  ) : (
                    <>Transportation</>
                  )}
                  <span className="block text-[8px] text-blue-600 font-bold uppercase tracking-wider mt-0.5 group-hover:underline">
                    ⇄ Switch choice
                  </span>
                </div>

                {/* Print view exact output */}
                <div className="print-only">
                  {expenseHeaderType === 'airfare' ? (
                    <>
                      AIRFARE EXPENSES with<br />Travel Insurance
                    </>
                  ) : (
                    <>Transportation</>
                  )}
                </div>
              </td>
              <td className="center" style={{ width: '17%' }}>Meals</td>
              <td className="center" style={{ width: '22%' }}>Incidental Fee</td>
              <td className="center" style={{ width: '10%' }}>Total Amount</td>
            </tr>

            <tr className="expenses-row">
              {expenseMode === 'expenses' ? (
                <>
                  <td style={{ padding: 0 }}>
                    <div className="w-full h-full min-h-[130px] relative">
                      <div className="print-only whitespace-pre-wrap text-[11px] p-1.5 font-semibold">
                        {airfare}
                      </div>
                      <textarea
                        value={airfare}
                        onChange={(e) => handleAirfareChange(e.target.value)}
                        placeholder={expenseHeaderType === 'airfare' ? 'Airfare amount...' : 'Transportation amount...'}
                        title={expenseHeaderType === 'airfare' ? 'Click to put/edit Airfare' : 'Click to put/edit Transportation'}
                        className="no-print w-full h-[130px] p-1.5 text-[11px] font-semibold bg-transparent hover:bg-slate-50/80 focus:bg-blue-50/50 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded focus:outline-none resize-none transition"
                      />
                    </div>
                  </td>

                  <td style={{ padding: 0 }}>
                    <div className="w-full h-full min-h-[130px] relative">
                      <div className="print-only whitespace-pre-wrap text-[11px] p-1.5 font-semibold">
                        {meals}
                      </div>
                      <textarea
                        value={meals}
                        onChange={(e) => handleMealsChange(e.target.value)}
                        placeholder="Meals amount..."
                        title="Click to put/edit Meals"
                        className="no-print w-full h-[130px] p-1.5 text-[11px] font-semibold bg-transparent hover:bg-slate-50/80 focus:bg-blue-50/50 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded focus:outline-none resize-none transition"
                      />
                    </div>
                  </td>

                  <td style={{ padding: 0 }}>
                    <div className="w-full h-full min-h-[130px] relative">
                      <div className="print-only whitespace-pre-wrap text-[11px] p-1.5 font-semibold">
                        {travelAllowance}
                      </div>
                      <textarea
                        value={travelAllowance}
                        onChange={(e) => handleTravelAllowanceChange(e.target.value)}
                        placeholder="Incidental Fee amount..."
                        title="Click to put/edit Incidental Fee"
                        className="no-print w-full h-[130px] p-1.5 text-[11px] font-semibold bg-transparent hover:bg-slate-50/80 focus:bg-blue-50/50 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded focus:outline-none resize-none transition"
                      />
                    </div>
                  </td>

                  <td className="expense-dash" style={{ padding: 0 }}>
                    <div className="w-full h-full min-h-[130px] relative text-right">
                      <div className="print-only whitespace-pre-wrap text-[11px] p-1.5 pr-2 font-bold text-right">
                        {totalAmount}
                      </div>
                      <textarea
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        placeholder="0.00"
                        title="Click to put/edit Total Amount"
                        className="no-print w-full h-[130px] p-1.5 text-[11px] font-bold text-right bg-transparent hover:bg-slate-50/80 focus:bg-blue-50/50 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded focus:outline-none resize-none transition"
                      />
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td colSpan="3" style={{ padding: 0, verticalAlign: 'middle', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '130px' }}>
                      <div style={{
                        border: '2px solid #000',
                        padding: '8px 24px',
                        backgroundColor: '#fff',
                        fontWeight: '700',
                        fontSize: '13px',
                        letterSpacing: '0.5px',
                        textAlign: 'center',
                        lineHeight: '1.2'
                      }}>
                        NO CHED FUND INCURRED
                      </div>
                    </div>
                  </td>
                  <td className="expense-dash"></td>
                </>
              )}

              <td>
                <div style={{ paddingTop: '18px', textAlign: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                  <div
                    className="checkbox-line cursor-pointer select-none"
                    onClick={() => setPaymentMode(prev => prev === 'Cash Advance' ? '' : 'Cash Advance')}
                    title="Click to toggle Cash Advance"
                  >
                    <span className="checkbox">{isCashAdvance ? '✓' : ''}</span>Cash Advance
                  </div>
                  <div
                    className="checkbox-line cursor-pointer select-none"
                    onClick={() => setPaymentMode(prev => prev === 'Reimbursement' ? '' : 'Reimbursement')}
                    title="Click to toggle Reimbursement"
                  >
                    <span className="checkbox">{isReimbursement ? '✓' : ''}</span>Reimbursement
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* SIGNATORIES */}
        <table>
          <tbody>
            <tr className="signature-row">
              <td style={{ width: '35%' }}>
                REQUESTED BY:
                <div className="center" style={{ marginTop: '42px' }}>
                  <div className="bold">{data.requestedBy?.name || ''}</div>
                  <div className="italic small">{data.requestedBy?.position || ''}</div>
                </div>
              </td>

              <td style={{ width: '30%' }}>
                FUNDS AVAILABLE
                <div
                  className="center cursor-pointer select-none group"
                  style={{
                    marginTop: (fundsAvailablePosition || (fundsAvailable && fundsAvailable !== 'N/A')) ? '42px' : '48px'
                  }}
                  onClick={() => {
                    if (fundsAvailable === 'N/A') {
                      setFundsAvailable('Diana C. Aguilar');
                      setFundsAvailablePosition('Chief Administrative Officer');
                    } else {
                      setFundsAvailable('N/A');
                      setFundsAvailablePosition('');
                    }
                  }}
                  title="Click to toggle between Diana C. Aguilar and N/A"
                >
                  <div className="bold">
                    {fundsAvailable
                      ? (fundsAvailable.toLowerCase() === 'diana c. aguilar' ? 'DIANA C. AGUILAR' : fundsAvailable)
                      : (expenseMode === 'expenses' ? 'DIANA C. AGUILAR' : 'N/A')}
                  </div>
                  {(fundsAvailablePosition || (fundsAvailable && fundsAvailable !== 'N/A' && fundsAvailable.toLowerCase().includes('aguilar'))) && (
                    <div className="italic small">
                      {fundsAvailablePosition || 'Chief Administrative Officer'}
                    </div>
                  )}
                  <span className="no-print block text-[8px] text-blue-500 font-normal uppercase tracking-wider mt-0.5 group-hover:underline">
                    ⇄ Toggle
                  </span>
                </div>
              </td>

              <td style={{ width: '35%' }}>
                APPROVED BY:
                <div className="center" style={{ marginTop: '42px' }}>
                  <div className="bold">{data.approvedBy?.name || 'SHIRLEY C. AGRUPIS, Ph.D'}</div>
                  <div className="italic small">{data.approvedBy?.position || 'Chairperson'}</div>
                </div>
              </td>
            </tr>

            <tr className="date-row">
              <td>
                Date:<br /><br />
                <div className="center italic">{formatDate(data.datePrepared)}</div>
              </td>
              <td>
                Source of Funds:{' '}
                <span className="bold">
                  {(sourceOfFunds === 'CHED GAA' ? '' : sourceOfFunds) ||
                   (data.sourceOfFunds === 'CHED GAA' ? '' : data.sourceOfFunds) ||
                   ''}
                </span>
              </td>
              <td>
                Date:
              </td>
            </tr>
          </tbody>
        </table>

        {/* BOTTOM BOXES */}
        <table className="no-border mt-22">
          <tbody>
            <tr>
              <td style={{ width: '36%' }}>
                <div className="bottom-label">ASSIGNED TRAVEL ARRANGER:</div>
                <div className="bottom-box">
                  <b>DUKE VINCENT PAUL DAYATA</b>
                  <span className="italic small">Project Technical Staff II</span>
                </div>
              </td>

              <td style={{ width: '18%' }}></td>

              <td style={{ width: '46%' }}>
                <div className="bottom-label">APPROVED FOR ISSUANCE OF AIRLINE TICKET:</div>
                <div className="ticket-box"></div>
              </td>
            </tr>
          </tbody>
        </table>

        <table className="no-border" style={{ marginTop: '5px' }}>
          <tbody>
            <tr>
              <td style={{ width: '36%' }}>
                <div className="bottom-label">AIRLINE TICKET RECEIVED BY:</div>
                <div className="received-box"></div>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
