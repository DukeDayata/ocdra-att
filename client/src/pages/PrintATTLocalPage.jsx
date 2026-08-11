import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { attApi } from '../services/api';
import { formatDate } from '../utils/formatters';

export const PrintATTLocalPage = () => {
  const { referenceNo } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true);
        const res = await attApi.getByRef(referenceNo);
        setData(res.data);
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

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-sans text-sm">
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

  const isPersonal = data.travelClassification === 'Personal Time';
  const isBusiness = data.travelClassification === 'Official Business';
  const isOfficialTime = data.travelClassification === 'Official Time Only';

  const isCashAdvance = data.paymentMode === 'Cash Advance';
  const isReimbursement = data.paymentMode === 'Reimbursement';

  return (
    <div className="bg-white min-h-screen font-sans text-[#111] text-[12px] p-2 sm:p-4">
      {/* Floating Print Toolbar */}
      <div className="no-print sticky top-4 z-50 max-w-2xl mx-auto mb-6 bg-slate-900/90 backdrop-blur-md text-white p-3.5 px-6 rounded-2xl shadow-xl border border-slate-700/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-chedGold/20 flex items-center justify-center text-chedGold font-extrabold text-xs">
            A4
          </div>
          <div>
            <div className="font-extrabold text-xs text-white">Local ATT Document Print Preview</div>
            <div className="text-[11px] text-slate-300">Set paper orientation to Portrait &bull; Margins: 0.30 in</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.history.back()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-600 transition"
          >
            Back
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            Print ATT Local
          </button>
        </div>
      </div>


      <style>{`
        @page {
          size: A4 portrait;
          margin: 0.30in;
        }
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; background: white; }
          .page { transform: none !important; width: 100% !important; margin: 0 !important; }
        }
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
                Name of Official/Employee:<br /><br /><br />
                <div className="bold" style={{ fontSize: '11px' }} dangerouslySetInnerHTML={{ __html: personnelNamesHtml }}></div>
              </td>
              <td>
                Position:<br /><br /><br />
                <div className="bold" style={{ fontSize: '11px' }} dangerouslySetInnerHTML={{ __html: personnelPositionsHtml }}></div>
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
                <div className="checkbox-line">
                  <span className="checkbox">{isPersonal ? '✓' : ''}</span>Personal Time
                </div>
                <div className="checkbox-line">
                  <span className="checkbox">{isBusiness ? '✓' : ''}</span>Official Business
                </div>
                <div className="checkbox-line">
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
              <td className="red center" style={{ width: '20%' }}>
                AIRFARE EXPENSES with<br />Travel Insurance
              </td>
              <td className="center" style={{ width: '17%' }}>Meals</td>
              <td className="center" style={{ width: '22%' }}>Travel Allowance</td>
              <td className="center" style={{ width: '10%' }}>Total Amount</td>
            </tr>

            <tr className="expenses-row">
              <td>{data.expenses?.airfareRaw || data.expenses?.airfare || ''}</td>
              <td>{data.expenses?.perDiemRaw || data.expenses?.perDiem || ''}</td>
              <td>{data.expenses?.preTravelRaw || data.expenses?.preTravel || ''}</td>
              <td className="expense-dash">{data.expenses?.totalAmountRaw || data.expenses?.totalAmount || ''}</td>
              <td>
                <div style={{ paddingTop: '18px', textAlign: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                  <div className="checkbox-line">
                    <span className="checkbox">{isCashAdvance ? '✓' : ''}</span>Cash Advance
                  </div>
                  <div className="checkbox-line">
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
                <div className="center" style={{ marginTop: '48px' }}>
                  <div className="bold">{data.fundsAvailable || 'N/A'}</div>
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
                Source of Funds: <span className="bold">{data.sourceOfFunds}</span>
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
