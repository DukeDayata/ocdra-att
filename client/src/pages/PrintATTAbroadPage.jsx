import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { attApi } from '../services/api';
import { formatDate, toBullets } from '../utils/formatters';

export const PrintATTAbroadPage = () => {
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

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-sans text-sm">
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

  const personnelNamesHtml = (data.personnel || []).map((p) => p.name).join('<br>');
  const personnelPositionsHtml = (data.personnel || []).map((p) => p.position).join('<br>');

  const isBusiness = data.travelClassification === 'Official Business';
  const isOfficialTime = data.travelClassification === 'Official Time Only';
  const isPersonal = data.travelClassification === 'Personal Travel' || data.travelClassification === 'Personal Time';

  const isCashAdvance = data.paymentMode === 'Cash Advance';
  const isReimbursement = data.paymentMode === 'Reimbursement';

  const purposeBulletsHtml = toBullets(data.purpose || '').replace(/\n/g, '<br>');

  return (
    <div className="bg-white min-h-screen font-serif text-[#111] text-[12px] p-2 sm:p-4">
      {/* Floating Print Toolbar */}
      <div className="no-print sticky top-4 z-50 max-w-2xl mx-auto mb-6 bg-slate-900/90 backdrop-blur-md text-white p-3.5 px-6 rounded-2xl shadow-xl border border-slate-700/80 flex items-center justify-between gap-4 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-extrabold text-xs">
            INT
          </div>
          <div>
            <div className="font-extrabold text-xs text-white">Abroad ATT Document Print Preview</div>
            <div className="text-[11px] text-slate-300">Set paper orientation to Portrait &bull; Margins: 0.18 in</div>
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
            Print ATT Abroad
          </button>
        </div>
      </div>


      <style>{`
        @page {
          size: A4 portrait;
          margin: 0.18in;
        }
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; background: white; }
          .page { transform: none !important; width: 100% !important; margin: 0 !important; }
        }
        .page {
          width: 760px;
          margin: 0 auto;
          transform: scale(0.96);
          transform-origin: top center;
        }
        .header {
          text-align: center;
          margin-bottom: 8px;
        }
        .header img {
          width: 100%;
          max-width: 760px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .no-field {
          text-align: right;
          font-size: 11px;
          margin-right: 20px;
          margin-bottom: 28px;
        }
        .title {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 6px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        td, th {
          border: 1px solid #111;
          padding: 3px;
          vertical-align: top;
        }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .small { font-size: 10px; }
        .checkbox {
          display: inline-block;
          width: 13px;
          height: 13px;
          border: 2px solid #111;
          margin-right: 22px;
          text-align: center;
          line-height: 12px;
          font-size: 12px;
          font-weight: bold;
        }
        .checkbox-line {
          margin: 10px 0;
          padding-left: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          justify-content: flex-start;
        }
        .purpose-box { height: 160px; }
        .expense-row { height: 25px; }

        .signature-box {
          height: 95px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          text-align: center;
          padding-bottom: 6px;
        }
        .sig-container { display: flex; align-items: stretch; }
        .sig-left { width: 10px; }
        .sig-right { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; }
        .sig-name { font-weight: 700; text-transform: uppercase; font-size: 13px; }
        .sig-pos { font-size: 10px; color: #111; text-transform: uppercase; letter-spacing: 0.6px; }
        .footer {
          text-align: center;
          font-size: 10px;
          margin-top: 22px;
        }
      `}</style>

      <div className="page">
        <div className="header">
          <img src="/assets/ched_header_abroad.png" alt="CHED Header - Republic of the Philippines Office of the President Commission on Higher Education Bagong Pilipinas" />
        </div>

        <div className="no-field">
          <b>No. ____________</b><br />
          <span className="small">(NO. TO BE FILLED-UP BY HRDD, AFMS)</span>
        </div>

        <div className="title">AUTHORITY TO TRAVEL ABROAD</div>

        <table>
          <colgroup>
            <col style={{ width: '45%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '33%' }} />
          </colgroup>

          <tbody>
            <tr>
              <td colSpan="2" style={{ height: '62px' }}>
                Name of Official / Employee:<br /><br />
                <div className="bold center" dangerouslySetInnerHTML={{ __html: personnelNamesHtml }}></div>
              </td>
              <td>
                Position:<br /><br />
                <div dangerouslySetInnerHTML={{ __html: personnelPositionsHtml }}></div>
              </td>
            </tr>

            <tr>
              <td style={{ height: '58px' }}>
                Office/Station:<br /><br />
                <div>{data.officeStation}</div>
              </td>
              <td>
                Destination:<br /><br />
                <div>{data.destination}</div>
              </td>
              <td>
                Period of Travel:<br /><br />
                <div>{data.periodOfTravel}</div>
              </td>
            </tr>

            <tr>
              <td colSpan="2" className="purpose-box">
                Purpose of Travel:<br /><br />
                <div className="bold" dangerouslySetInnerHTML={{ __html: purposeBulletsHtml }}></div>
              </td>

              <td>
                Please Check:<br /><br />
                <div className="checkbox-line">
                  <span className="checkbox">{isBusiness ? '✓' : ''}</span>Official Business
                </div>
                <div className="checkbox-line">
                  <span className="checkbox">{isOfficialTime ? '✓' : ''}</span>Official Time Only
                </div>
                <div className="checkbox-line">
                  <span className="checkbox">{isPersonal ? '✓' : ''}</span>Personal Travel
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table>
          <colgroup>
            <col style={{ width: '17%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>

          <tbody>
            <tr>
              <td colSpan="4" className="center bold" style={{ height: '20px' }}>ESTIMATED EXPENSES</td>
              <td rowSpan="2">
                Please Check One if Travel is on<br />
                Official Business:
              </td>
            </tr>

            <tr>
              <td className="center bold">Airfare</td>
              <td className="center bold">Per Diem</td>
              <td className="center bold">Pre-travel<br />Expenses</td>
              <td className="center bold">Total<br />Amount</td>
            </tr>

            <tr>
              <td colSpan="4" className="center">No government funds involved</td>
              <td rowSpan="6">
                <br />
                <div className="checkbox-line">
                  <span className="checkbox">{isCashAdvance ? '✓' : ''}</span>Cash Advance
                </div>

                <div className="checkbox-line">
                  <span className="checkbox">{isReimbursement ? '✓' : ''}</span>Reimbursement
                </div>
              </td>
            </tr>

            <tr className="expense-row">
              <td>{data.expenses?.airfareRaw || data.expenses?.airfare || ''}</td>
              <td>{data.expenses?.perDiemRaw || data.expenses?.perDiem || ''}</td>
              <td>{data.expenses?.preTravelRaw || data.expenses?.preTravel || ''}</td>
              <td>{data.expenses?.totalAmountRaw || data.expenses?.totalAmount || ''}</td>
            </tr>

            <tr className="expense-row">
              <td></td><td></td><td></td><td></td>
            </tr>

            <tr className="expense-row">
              <td></td><td></td><td></td><td></td>
            </tr>

            <tr className="expense-row">
              <td></td><td></td><td></td><td></td>
            </tr>

            <tr>
              <td colSpan="4" className="center bold">T O T A L</td>
            </tr>
          </tbody>
        </table>

        <table>
          <colgroup>
            <col style={{ width: '45%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '33%' }} />
          </colgroup>

          <tbody>
            <tr>
              <td>
                PREPARED BY:
                <div className="sig-container">
                  <div className="sig-left"></div>
                  <div className="sig-right">
                    <div className="signature-box">
                      <div className="sig-name">{data.requestedBy?.name || 'DUKE VINCENT PAUL DAYATA'}</div>
                      <div className="sig-pos">{data.requestedBy?.position || 'Project Technical Staff II'}</div>
                    </div>
                  </div>
                </div>
              </td>

              <td>
                FUNDS AVAILABLE:
                <div className="sig-container">
                  <div className="sig-left"></div>
                  <div className="sig-right">
                    <div className="signature-box">
                      <div className="sig-name">{data.fundsAvailable || 'N/A'}</div>
                      <div style={{ textAlign: 'left', width: '100%', paddingLeft: '8px', boxSizing: 'border-box' }}>
                        <b>Source of Funds:</b><br />
                        <span>{data.sourceOfFunds || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>

              <td>
                APPROVED BY:
                <div className="sig-container">
                  <div className="sig-left"></div>
                  <div className="sig-right">
                    <div className="signature-box">
                      <div className="sig-name">{data.approvedBy?.name || 'SHIRLEY C. AGRUPIS, Ph.D'}</div>
                      <div className="sig-pos">{data.approvedBy?.position || 'Chairperson'}</div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td colSpan="3">
                Date: <span>{formatDate(data.datePrepared)}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="footer">
          Higher Education Development Center Building, C.P. Garcia Ave., Diliman, Quezon City, Philippines 1104www.ched.gov.ph<br />
          info@ched.gov.ph &nbsp;&nbsp;&nbsp;&nbsp; 02 8441 1260
        </div>
      </div>
    </div>
  );
};
