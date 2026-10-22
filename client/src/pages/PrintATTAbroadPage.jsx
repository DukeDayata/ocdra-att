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
  Loader2
} from 'lucide-react';

export const PrintATTAbroadPage = () => {
  const { referenceNo } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mode: 'no_ched_fund' (No CHED Fund Incurred) | 'expenses' (Expense Allocation)
  const [expenseMode, setExpenseMode] = useState('no_ched_fund');

  // Form State / Overrides
  const [personnelList, setPersonnelList] = useState([]);
  const [officeStation, setOfficeStation] = useState('');
  const [destination, setDestination] = useState('');
  const [periodOfTravel, setPeriodOfTravel] = useState('');
  const [purpose, setPurpose] = useState('');
  const [travelClassification, setTravelClassification] = useState('Official Business');
  const [paymentMode, setPaymentMode] = useState('');
  const [sourceOfFunds, setSourceOfFunds] = useState('');
  const [chargeNote, setChargeNote] = useState('');

  // Expense amounts
  const [airfare, setAirfare] = useState('');
  const [meals, setMeals] = useState('');
  const [travelAllowance, setTravelAllowance] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  // Signatories
  const [preparedByName, setPreparedByName] = useState('');
  const [preparedByPosition, setPreparedByPosition] = useState('');
  const [fundsAvailable, setFundsAvailable] = useState('N/A');
  const [fundsAvailablePosition, setFundsAvailablePosition] = useState('');
  const [approvedByName, setApprovedByName] = useState('DR. J. PROSPERO DE VERA III');
  const [approvedByPosition, setApprovedByPosition] = useState('Chairperson');
  const [datePrepared, setDatePrepared] = useState('');

  // UI State
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true);
        const res = await attApi.getByRef(referenceNo);
        const record = res.data;
        setData(record);

        // Detect if record has genuine non-zero recorded expenses
        const airfareNum = parseFloat(String(record.expenses?.airfare || record.expenses?.airfareRaw || 0).replace(/[^0-9.-]+/g, '')) || 0;
        const mealsNum = parseFloat(String(record.expenses?.perDiem || record.expenses?.perDiemRaw || 0).replace(/[^0-9.-]+/g, '')) || 0;
        const preTravelNum = parseFloat(String(record.expenses?.preTravel || record.expenses?.preTravelRaw || 0).replace(/[^0-9.-]+/g, '')) || 0;
        const totalNum = parseFloat(String(record.expenses?.totalAmount || record.expenses?.totalAmountRaw || 0).replace(/[^0-9.-]+/g, '')) || 0;

        const hasActualExpenses = (airfareNum > 0 || mealsNum > 0 || preTravelNum > 0 || totalNum > 0);
        // Default to no_ched_fund if no actual positive expenses
        setExpenseMode(hasActualExpenses ? 'expenses' : 'no_ched_fund');

        // Populate fields
        setPersonnelList(record.personnel || []);
        setOfficeStation(record.officeStation || 'OCC-OCDRA');
        setDestination(record.destination || '');
        setPeriodOfTravel(record.periodOfTravel || '');
        setPurpose(record.purpose || '');
        setTravelClassification(record.travelClassification || 'Official Business');
        setPaymentMode(record.paymentMode || '');
        
        const srcFunds = record.sourceOfFunds || '';
        setSourceOfFunds(srcFunds);
        setChargeNote('');

        if (hasActualExpenses) {
          setAirfare(record.expenses?.airfareRaw || (airfareNum > 0 ? formatCurrency(airfareNum) : ''));
          setMeals(record.expenses?.perDiemRaw || (mealsNum > 0 ? formatCurrency(mealsNum) : ''));
          setTravelAllowance(record.expenses?.preTravelRaw || (preTravelNum > 0 ? formatCurrency(preTravelNum) : ''));
          setTotalAmount(record.expenses?.totalAmountRaw || (totalNum > 0 ? formatCurrency(totalNum) : ''));
        } else {
          setAirfare('');
          setMeals('');
          setTravelAllowance('');
          setTotalAmount('');
        }

        // Signatories
        setPreparedByName(record.preparedBy || record.requestedBy?.name || 'DESIDERIO R. APAG III');
        setPreparedByPosition(record.requestedByPosition || record.requestedBy?.position || 'Administrative Assistant VI');

        setFundsAvailable(record.fundsAvailable || 'N/A');
        setFundsAvailablePosition(record.fundsAvailablePosition || '');

        setApprovedByName(record.approvedBy?.name || record.approvedBy || 'DR. J. PROSPERO DE VERA III');
        setApprovedByPosition(record.approvedBy?.position || record.approvedByPosition || 'Chairperson');

        setDatePrepared(record.datePrepared || new Date().toISOString().split('T')[0]);
      } catch (err) {
        console.error('Fetch Abroad Print Record Error:', err);
        setError(err.message || `Unable to load ATT record for reference ${referenceNo}`);
      } finally {
        setLoading(false);
      }
    };

    if (referenceNo) {
      fetchRecord();
    }
  }, [referenceNo]);

  // Total sum calculator
  const calcSum = (a, m, t) => {
    const aNum = parseFloat(String(a).replace(/[^0-9.-]+/g, '')) || 0;
    const mNum = parseFloat(String(m).replace(/[^0-9.-]+/g, '')) || 0;
    const tNum = parseFloat(String(t).replace(/[^0-9.-]+/g, '')) || 0;
    return aNum + mNum + tNum;
  };

  const handleAirfareChange = (val) => {
    setAirfare(val);
    const sum = calcSum(val, meals, travelAllowance);
    if (sum > 0) setTotalAmount(formatCurrency(sum));
  };

  const handleMealsChange = (val) => {
    setMeals(val);
    const sum = calcSum(airfare, val, travelAllowance);
    if (sum > 0) setTotalAmount(formatCurrency(sum));
  };

  const handleTravelAllowanceChange = (val) => {
    setTravelAllowance(val);
    const sum = calcSum(airfare, meals, val);
    if (sum > 0) setTotalAmount(formatCurrency(sum));
  };

  const handleAutoSum = () => {
    const sum = calcSum(airfare, meals, travelAllowance);
    setTotalAmount(formatCurrency(sum));
    toast.success(`Calculated Total: ₱ ${formatCurrency(sum)}`);
  };

  const handleReset = () => {
    if (!data) return;
    setPersonnelList(data.personnel || []);
    setOfficeStation(data.officeStation || 'OCC-OCDRA');
    setDestination(data.destination || '');
    setPeriodOfTravel(data.periodOfTravel || '');
    setPurpose(data.purpose || '');
    setTravelClassification(data.travelClassification || 'Official Business');
    setPaymentMode(data.paymentMode || '');
    setSourceOfFunds(data.sourceOfFunds || '');
    setChargeNote('');

    setPreparedByName(data.preparedBy || data.requestedBy?.name || 'DESIDERIO R. APAG III');
    setPreparedByPosition(data.requestedByPosition || data.requestedBy?.position || 'Administrative Assistant VI');
    setFundsAvailable(data.fundsAvailable || 'N/A');
    setFundsAvailablePosition(data.fundsAvailablePosition || '');
    setApprovedByName(data.approvedBy?.name || data.approvedBy || 'DR. J. PROSPERO DE VERA III');
    setApprovedByPosition(data.approvedBy?.position || data.approvedByPosition || 'Chairperson');
    setDatePrepared(data.datePrepared || new Date().toISOString().split('T')[0]);

    toast.success('Reset to recorded database values');
  };

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
          totalAmountRaw: String(totalAmount || '')
        };
      }

      const updatePayload = {
        expenses: expensesPayload,
        officeStation,
        destination,
        periodOfTravel,
        purpose,
        paymentMode,
        sourceOfFunds,
        travelClassification,
        fundsAvailable,
        fundsAvailablePosition,
        preparedBy: preparedByName,
        requestedByPosition: preparedByPosition,
        approvedBy: {
          name: approvedByName,
          position: approvedByPosition
        },
        datePrepared
      };

      const res = await attApi.update(targetId, updatePayload);
      if (res.data) {
        setData(res.data);
      }
      toast.success('ATT record successfully saved to database!');
    } catch (err) {
      console.error('Error saving ATT Abroad:', err);
      toast.error(err.message || 'Failed to save changes to database');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-sans text-sm flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        Loading printable Abroad ATT document...
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

  const isBusiness = travelClassification === 'Official Business';
  const isOfficialTime = travelClassification === 'Official Time Only';
  const isPersonal = travelClassification === 'Personal Travel' || travelClassification === 'Personal Time';

  const isCashAdvance = paymentMode === 'Cash Advance';
  const isReimbursement = paymentMode === 'Reimbursement';

  // Format date in ALL CAPS e.g. "MAY 19, 2025"
  const formattedDate = datePrepared ? formatDate(datePrepared).toUpperCase() : '';

  return (
    <div className="bg-slate-200/80 min-h-screen text-[#000] p-2 sm:p-5 print:p-0 print:bg-white print:min-h-0">
      {/* Floating Print & Control Toolbar */}
      <div className="no-print sticky top-3 z-50 max-w-4xl mx-auto mb-5 bg-slate-900/95 backdrop-blur-md text-white p-3 px-5 rounded-2xl shadow-xl border border-slate-700/80 font-sans">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-extrabold text-xs">
              ABROAD
            </div>
            <div>
              <div className="font-extrabold text-xs text-white">Authority to Travel Abroad (ATT)</div>
              <div className="text-[11px] text-slate-300">Exact Template Layout &bull; Full-Height A4</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Mode Toggle */}
            <div className="inline-flex rounded-xl bg-slate-800 p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setExpenseMode('no_ched_fund');
                  toast.success("Switched to 'NO CHED FUND INCURRED' mode");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  expenseMode === 'no_ched_fund'
                    ? 'bg-rose-600 text-white shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                <span>No CHED Fund</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpenseMode('expenses');
                  toast.success('Switched to Expense Allocation mode');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  expenseMode === 'expenses'
                    ? 'bg-blue-600 text-white shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Put Expenses</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowEditDrawer(!showEditDrawer)}
              className={`px-3 py-2 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 ${
                showEditDrawer
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {showEditDrawer ? 'Close Editor' : 'Customize Form'}
            </button>

            <button
              type="button"
              onClick={handleSaveToRecord}
              disabled={isSaving}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
              title="Save changes to database"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" /> : <Save className="w-3.5 h-3.5 text-amber-400" />}
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
              Print ATT Abroad
            </button>
          </div>
        </div>

        {/* Collapsible Customization Drawer */}
        {showEditDrawer && (
          <div className="mt-3 pt-3 border-t border-slate-700/80 space-y-3 bg-slate-800/60 p-4 rounded-xl text-xs max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <span className="font-bold text-slate-200 text-xs uppercase tracking-wide">
                Live Document Editor &bull; Edit Before Printing
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Values
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Classification */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Travel Classification</label>
                <select
                  value={travelClassification}
                  onChange={(e) => setTravelClassification(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Official Business">Official Business</option>
                  <option value="Official Time Only">Official Time Only</option>
                  <option value="Personal Travel">Personal Travel</option>
                </select>
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Official Business Check</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">None Checked</option>
                  <option value="Cash Advance">Cash Advance</option>
                  <option value="Reimbursement">Reimbursement</option>
                </select>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. USA-MANILA-USA"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Period of Travel */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Period of Travel</label>
                <input
                  type="text"
                  value={periodOfTravel}
                  onChange={(e) => setPeriodOfTravel(e.target.value)}
                  placeholder="e.g. MAY 25 – JUNE 4, 2025"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Office / Station */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Office/Station</label>
                <input
                  type="text"
                  value={officeStation}
                  onChange={(e) => setOfficeStation(e.target.value)}
                  placeholder="e.g. OCC-OCDRA"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Date Prepared */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Date Prepared</label>
                <input
                  type="date"
                  value={datePrepared ? datePrepared.split('T')[0] : ''}
                  onChange={(e) => setDatePrepared(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Source of Funds */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Source of Funds</label>
                <input
                  type="text"
                  value={sourceOfFunds}
                  onChange={(e) => setSourceOfFunds(e.target.value)}
                  placeholder="Optional, e.g. Personal"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Charging Note (for No CHED Fund mode) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Custom Charging Note</label>
                <input
                  type="text"
                  value={chargeNote}
                  onChange={(e) => setChargeNote(e.target.value)}
                  placeholder="Optional, e.g. charged against..."
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Purpose of Travel</label>
              <textarea
                rows="2"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Enter travel purpose..."
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Expense Inputs if in expenses mode */}
            {expenseMode === 'expenses' && (
              <div className="pt-2 border-t border-slate-700/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-300 text-xs">Expense Allocations:</span>
                  <button
                    type="button"
                    onClick={handleAutoSum}
                    className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-lg transition"
                  >
                    <Calculator className="w-3 h-3" />
                    Auto Sum
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Airfare</label>
                    <input
                      type="text"
                      value={airfare}
                      onChange={(e) => handleAirfareChange(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Per Diem</label>
                    <input
                      type="text"
                      value={meals}
                      onChange={(e) => handleMealsChange(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Pre-travel Expenses</label>
                    <input
                      type="text"
                      value={travelAllowance}
                      onChange={(e) => handleTravelAllowanceChange(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-400 mb-1">Total Amount</label>
                    <input
                      type="text"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Signatories Row */}
            <div className="pt-2 border-t border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Prepared By Name</label>
                <input
                  type="text"
                  value={preparedByName}
                  onChange={(e) => setPreparedByName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none mb-1.5"
                />
                <input
                  type="text"
                  value={preparedByPosition}
                  onChange={(e) => setPreparedByPosition(e.target.value)}
                  placeholder="Position"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-300">Funds Available Signatory</label>
                  <div className="inline-flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setFundsAvailable('Diana C. Aguilar');
                        setFundsAvailablePosition('Chief Administrative Officer');
                      }}
                      className="px-1.5 py-0.5 text-[9px] font-bold text-blue-400 hover:text-blue-300 bg-slate-700 hover:bg-slate-600 rounded transition"
                    >
                      Diana
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFundsAvailable('N/A');
                        setFundsAvailablePosition('');
                      }}
                      className="px-1.5 py-0.5 text-[9px] font-bold text-amber-400 hover:text-amber-300 bg-slate-700 hover:bg-slate-600 rounded transition"
                    >
                      N/A
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={fundsAvailable}
                  onChange={(e) => setFundsAvailable(e.target.value)}
                  placeholder="e.g. N/A or Name"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none mb-1.5"
                />
                <input
                  type="text"
                  value={fundsAvailablePosition}
                  onChange={(e) => setFundsAvailablePosition(e.target.value)}
                  placeholder="Position (optional)"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Approved By Name</label>
                <input
                  type="text"
                  value={approvedByName}
                  onChange={(e) => setApprovedByName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none mb-1.5"
                />
                <input
                  type="text"
                  value={approvedByPosition}
                  onChange={(e) => setApprovedByPosition(e.target.value)}
                  placeholder="Position"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Document CSS for Exact Print Template Match */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 0.32in 0.45in 0.28in 0.45in;
        }

        @media print {
          .no-print { display: none !important; }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .page {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            transform: none !important;
          }
        }

        .page {
          width: 780px;
          min-height: 275mm;
          position: relative;
          margin: 0 auto;
          background: #ffffff;
          padding: 20px 34px 65px 34px;
          box-sizing: border-box;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.12);
          font-family: 'Times New Roman', Times, serif;
          color: #000;
        }

        @media print {
          .no-print { display: none !important; }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .page {
            width: 100% !important;
            max-width: 100% !important;
            height: 100vh !important;
            min-height: 100vh !important;
            max-height: 100vh !important;
            position: relative !important;
            margin: 0 !important;
            padding: 0 0 55px 0 !important;
            box-shadow: none !important;
            border: none !important;
            transform: none !important;
            box-sizing: border-box !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
          .doc-footer {
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
          }
        }

        .header {
          text-align: center;
          margin-bottom: 8px;
        }

        .header img {
          width: 100%;
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
        }

        .doc-title {
          text-align: center;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 20px;
          font-weight: 900;
          letter-spacing: 0.5px;
          margin: 10px 0 10px 0;
          color: #000;
          text-transform: uppercase;
        }

        /* Main Table with Exact Proportions */
        .att-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          border: 2px solid #000;
          font-family: 'Times New Roman', Times, serif;
          color: #000;
        }

        .att-table > tbody > tr > td {
          border: 1px solid #000;
          vertical-align: top;
          padding: 4px 6px;
          box-sizing: border-box;
        }

        .label-text {
          font-size: 11.5px;
          line-height: 1.2;
          color: #000;
          font-family: 'Times New Roman', Times, serif;
        }

        .chk-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 17px;
          height: 17px;
          border: 1.5px solid #000;
          margin-right: 10px;
          box-sizing: border-box;
          flex-shrink: 0;
          background: #ffffff;
        }

        /* Estimated Expenses Subtable */
        .expenses-subtable {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          border: none;
          height: 100%;
          font-family: 'Times New Roman', Times, serif;
        }

        .expenses-subtable th,
        .expenses-subtable td {
          border: none;
          border-right: 1px solid #000;
          border-bottom: 1px solid #000;
          padding: 2px 4px;
          vertical-align: middle;
          box-sizing: border-box;
        }

        .expenses-subtable th:last-child,
        .expenses-subtable td:last-child {
          border-right: none;
        }

        .expenses-subtable tr:last-child td {
          border-bottom: none;
        }

        .no-field-bottom {
          margin-top: 14px;
          margin-bottom: 0px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding-right: 8px;
        }

        /* Fixed Footer anchored at bottom of the page */
        .doc-footer {
          position: absolute;
          bottom: 14px;
          left: 34px;
          right: 34px;
          text-align: center;
          font-family: Arial, Helvetica, sans-serif;
          color: #000;
        }

        .footer-line {
          border-top: 1px solid #000;
          width: 100%;
          margin-bottom: 6px;
        }

        .footer-text {
          font-size: 10px;
          line-height: 1.4;
          letter-spacing: 0.1px;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 28px;
          margin-top: 2px;
        }
      `}</style>

      {/* Main Document Body */}
      <div className="page">
        {/* Header Image */}
        <div className="header">
          <img
            src="/assets/ched_header_abroad.png?v=3"
            alt="Republic of the Philippines - Commission on Higher Education - Bagong Pilipinas"
          />
        </div>

        {/* Title */}
        <div className="doc-title">AUTHORITY TO TRAVEL ABROAD</div>

        {/* Main Unified Table */}
        <table className="att-table">
          <colgroup>
            <col style={{ width: '38%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '40%' }} />
          </colgroup>

          <tbody>
            {/* ROW 1: Name of Official / Employee & Position */}
            <tr>
              <td colSpan="2" style={{ height: '78px', position: 'relative', padding: '5px 8px' }}>
                <div className="label-text">Name of Official / Employee:</div>
                <div
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    marginTop: '14px',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase'
                  }}
                >
                  {(personnelList.length > 0 ? personnelList : [{ name: 'DESIDERIO R. APAG III, D.ENG, PCPE' }])
                    .map((p, idx) => (
                      <div key={idx}>{p.name}</div>
                    ))}
                </div>
              </td>
              <td style={{ height: '78px', position: 'relative', padding: '5px 10px' }}>
                <div className="label-text">Position:</div>
                <div
                  style={{
                    fontSize: '13px',
                    marginTop: '14px',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase'
                  }}
                >
                  {(personnelList.length > 0 ? personnelList : [{ position: 'COMMISSIONER' }])
                    .map((p, idx) => (
                      <div key={idx}>{p.position}</div>
                    ))}
                </div>
              </td>
            </tr>

            {/* ROW 2: Office/Station, Destination, Period of Travel */}
            <tr>
              <td style={{ height: '66px', padding: '5px 8px' }}>
                <div className="label-text">Office/Station:</div>
                <div
                  style={{
                    fontSize: '12px',
                    marginTop: '10px',
                    letterSpacing: '0.2px',
                    textTransform: 'uppercase',
                    lineHeight: '1.25'
                  }}
                >
                  {officeStation || 'OCC-OCDRA'}
                </div>
              </td>
              <td style={{ height: '66px', padding: '5px 8px' }}>
                <div className="label-text">Destination:</div>
                <div
                  style={{
                    fontSize: '12px',
                    marginTop: '10px',
                    letterSpacing: '0.2px',
                    textTransform: 'uppercase',
                    lineHeight: '1.25'
                  }}
                >
                  {destination || 'USA-MANILA-USA'}
                </div>
              </td>
              <td style={{ height: '66px', padding: '5px 10px' }}>
                <div className="label-text">Period of Travel:</div>
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    marginTop: '10px',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase'
                  }}
                >
                  {periodOfTravel || 'MAY 25 – JUNE 4, 2025'}
                </div>
              </td>
            </tr>

            {/* ROW 3: Purpose of Travel & Please Check */}
            <tr>
              <td colSpan="2" style={{ height: '200px', padding: '6px 8px' }}>
                <div className="label-text">Purpose of Travel:</div>
                <div
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 'bold',
                    marginTop: '18px',
                    paddingRight: '8px',
                    lineHeight: '1.5',
                    textTransform: 'uppercase'
                  }}
                >
                  {purpose || 'TO ATTEND THE NAFSA 2025 ANNUAL CONFERENCE & EXPO IN SAN DIEGO, CALIFORNIA, USA.'}
                </div>
              </td>

              <td style={{ height: '200px', padding: '6px 12px' }}>
                <div className="label-text">Please Check:</div>
                <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="chk-box">
                      {isBusiness && (
                        <svg className="w-3.5 h-3.5 stroke-[3.5] text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span style={{ fontSize: '13px' }}>Official Business</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="chk-box">
                      {isOfficialTime && (
                        <svg className="w-3.5 h-3.5 stroke-[3.5] text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span style={{ fontSize: '13px' }}>Official Time Only</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="chk-box">
                      {isPersonal && (
                        <svg className="w-3.5 h-3.5 stroke-[3.5] text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span style={{ fontSize: '13px' }}>Personal Travel</span>
                  </div>
                </div>
              </td>
            </tr>

            {/* ROW 4: ESTIMATED EXPENSES & Please Check One if Travel is on Official Business */}
            <tr>
              <td colSpan="2" style={{ padding: 0, height: '230px' }}>
                <table className="expenses-subtable">
                  <thead>
                    <tr style={{ height: '30px' }}>
                      <th
                        colSpan="4"
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: '12.5px',
                          padding: '3px 2px',
                          letterSpacing: '0.3px',
                          textTransform: 'uppercase'
                        }}
                      >
                        ESTIMATED EXPENSES
                      </th>
                    </tr>
                    <tr style={{ height: '34px' }}>
                      <th style={{ width: '25%', textAlign: 'center', fontWeight: 'bold', fontSize: '11.5px', padding: '3px 2px' }}>
                        Airfare
                      </th>
                      <th style={{ width: '25%', textAlign: 'center', fontWeight: 'bold', fontSize: '11.5px', padding: '3px 2px' }}>
                        Per Diem
                      </th>
                      <th style={{ width: '25%', textAlign: 'center', fontWeight: 'bold', fontSize: '11.5px', padding: '2px 2px', lineHeight: '1.15' }}>
                        Pre-travel<br />Expenses
                      </th>
                      <th style={{ width: '25%', textAlign: 'center', fontWeight: 'bold', fontSize: '11.5px', padding: '2px 2px', lineHeight: '1.15' }}>
                        Total<br />Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {expenseMode === 'expenses' ? (
                      <>
                        <tr style={{ height: '52px', textAlign: 'center', fontSize: '12px' }}>
                          <td>{airfare || ''}</td>
                          <td>{meals || ''}</td>
                          <td>{travelAllowance || ''}</td>
                          <td>{totalAmount || ''}</td>
                        </tr>
                        <tr style={{ height: '36px' }}>
                          <td></td><td></td><td></td><td></td>
                        </tr>
                        <tr style={{ height: '36px' }}>
                          <td></td><td></td><td></td><td></td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr style={{ height: '56px', textAlign: 'center', fontSize: '12.5px', textTransform: 'uppercase' }}>
                          <td colSpan="4" style={{ padding: '4px 6px', lineHeight: '1.4' }}>
                            <div style={{ fontWeight: 'bold' }}>NO CHED FUND INCURRED</div>
                            {chargeNote && (
                              <div style={{ fontWeight: 'bold', marginTop: '2px' }}>{chargeNote}</div>
                            )}
                          </td>
                        </tr>
                        <tr style={{ height: '34px' }}>
                          <td></td><td></td><td></td><td></td>
                        </tr>
                        <tr style={{ height: '34px' }}>
                          <td></td><td></td><td></td><td></td>
                        </tr>
                      </>
                    )}

                    {/* TOTAL ROW */}
                    <tr style={{ height: '38px' }}>
                      <td></td>
                      <td></td>
                      <td
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          letterSpacing: '3px'
                        }}
                      >
                        T O T A L
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                        {expenseMode === 'expenses' ? totalAmount : ''}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>

              <td style={{ height: '230px', padding: '6px 12px' }}>
                <div style={{ fontSize: '12.5px', lineHeight: '1.25' }}>
                  Please Check One if Travel is on<br />
                  &nbsp;&nbsp;Official Business:
                </div>
                <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="chk-box">
                      {isCashAdvance && (
                        <svg className="w-3.5 h-3.5 stroke-[3.5] text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span style={{ fontSize: '13px' }}>Cash Advance</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="chk-box">
                      {isReimbursement && (
                        <svg className="w-3.5 h-3.5 stroke-[3.5] text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span style={{ fontSize: '13px' }}>Reimbursement</span>
                  </div>
                </div>
              </td>
            </tr>

            {/* ROW 5: PREPARED BY, FUNDS AVAILABLE, APPROVED BY */}
            <tr>
              {/* PREPARED BY */}
              <td style={{ height: '140px', padding: '6px 8px', position: 'relative' }}>
                <div style={{ fontSize: '11px' }}>PREPARED BY:</div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '6px',
                    right: '6px',
                    textAlign: 'center'
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2px'
                    }}
                  >
                    {preparedByName || 'CZHARLYZ NICOLE D. MANALANG'}
                  </div>
                  <div style={{ fontSize: '11px', marginTop: '1px' }}>
                    {preparedByPosition || 'Administrative Assistant VI'}
                  </div>
                </div>
              </td>

              {/* FUNDS AVAILABLE */}
              <td style={{ height: '140px', padding: '6px 8px', position: 'relative' }}>
                <div style={{ fontSize: '10.5px', lineHeight: '1.15' }}>
                  FUNDS<br />AVAILABLE:
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '6px',
                    right: '6px'
                  }}
                >
                  <div
                    onClick={() => {
                      if (!fundsAvailable || fundsAvailable.trim().toUpperCase() === 'N/A') {
                        setFundsAvailable('Diana C. Aguilar');
                        setFundsAvailablePosition('Chief Administrative Officer');
                      } else {
                        setFundsAvailable('N/A');
                        setFundsAvailablePosition('');
                      }
                    }}
                    className="cursor-pointer select-none group"
                    title="Click to toggle between Diana C. Aguilar and N/A"
                    style={{ textAlign: 'center', marginBottom: '6px' }}
                  >
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: (fundsAvailable && fundsAvailable.trim().toUpperCase() === 'N/A') ? '13px' : '11.5px',
                        textTransform: 'uppercase',
                        letterSpacing: (fundsAvailable && fundsAvailable.trim().toUpperCase() === 'N/A') ? '1px' : 'normal'
                      }}
                    >
                      {fundsAvailable || 'N/A'}
                    </div>
                    {fundsAvailablePosition && fundsAvailable && fundsAvailable.trim().toUpperCase() !== 'N/A' && (
                      <div style={{ fontSize: '10px' }}>{fundsAvailablePosition}</div>
                    )}
                  </div>

                  <div style={{ textAlign: 'left', paddingLeft: '4px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold' }}>Source of Funds:</div>
                    {sourceOfFunds && (
                      <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '1px' }}>
                        {sourceOfFunds}
                      </div>
                    )}
                  </div>
                </div>
              </td>

              {/* APPROVED BY */}
              <td style={{ height: '140px', padding: '6px 8px', position: 'relative' }}>
                <div style={{ fontSize: '11px' }}>APPROVED BY:</div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '6px',
                    right: '6px',
                    textAlign: 'center'
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2px'
                    }}
                  >
                    {approvedByName || 'DR. J. PROSPERO DE VERA III'}
                  </div>
                  <div style={{ fontSize: '11px', marginTop: '1px' }}>
                    {approvedByPosition || 'Chairperson'}
                  </div>
                </div>
              </td>
            </tr>

            {/* ROW 6: Date & Blank cell */}
            <tr>
              <td colSpan="2" style={{ height: '32px', padding: '4px 8px', verticalAlign: 'middle' }}>
                <span style={{ fontSize: '12px' }}>Date: </span>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2px' }}>
                  {formattedDate || 'MAY 19, 2025'}
                </span>
              </td>
              <td style={{ height: '32px', padding: '4px 8px' }}></td>
            </tr>
          </tbody>
        </table>

        {/* Bottom Right Document Number Box */}
        <div className="no-field-bottom">
          <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: '12px', fontFamily: "'Times New Roman', Times, serif" }}>
            <span>No.</span>
            <span style={{ display: 'inline-block', width: '220px', borderBottom: '1.5px solid #000', marginLeft: '6px', marginBottom: '2px' }}></span>
          </div>
          <div
            style={{
              width: '245px',
              textAlign: 'center',
              fontSize: '9px',
              fontStyle: 'italic',
              fontFamily: "'Times New Roman', Times, serif",
              marginTop: '4px'
            }}
          >
            (NO. TO BE FILLED-UP BY HRDD, AFMS)
          </div>
        </div>

        {/* Official Fixed Footer */}
        <div className="doc-footer">
          <div className="footer-line"></div>
          <div className="footer-text">
            <div>Higher Education Development Center Building, C.P. Garcia Ave., Diliman, Quezon City, Philippines 1104</div>
            <div className="footer-links">
              <span>www.ched.gov.ph</span>
              <span>info@ched.gov.ph</span>
              <span>02 8441 1260</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
