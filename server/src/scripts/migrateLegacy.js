import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { parse } from 'csv-parse/sync';
import { connectDB } from '../config/db.js';
import ATTRecord from '../models/ATTRecord.js';
import Personnel from '../models/Personnel.js';
import Approver from '../models/Approver.js';

dotenv.config();

/**
 * Migration Script to import legacy Google Sheets data (CSV or JSON format).
 * Usage:
 *   node src/scripts/migrateLegacy.js --file=path/to/ATT_Records.csv
 *   or
 *   node src/scripts/migrateLegacy.js --file=path/to/ATT_Records.json
 */
const migrate = async () => {
  const args = process.argv.slice(2);
  const fileArg = args.find(a => a.startsWith('--file='));

  if (!fileArg) {
    console.log(`
========================================================================
ATT LEGACY MIGRATION TOOL
========================================================================
How to export data from Google Sheets:
1. Open your legacy Google Sheet (ATT Records / Personnel / Chairman).
2. Go to File -> Download -> Comma Separated Values (.csv) or export as JSON.
3. Save the exported file into server/data/ (e.g., server/data/ATT_Records.csv).
4. Run:
   npm run migrate -- --file=data/ATT_Records.csv
========================================================================
    `);
    process.exit(0);
  }

  const filePath = path.resolve(fileArg.split('=')[1]);
  if (!fs.existsSync(filePath)) {
    console.error(`[Migration Error] File not found: ${filePath}`);
    process.exit(1);
  }

  await connectDB();

  console.log(`[Migration] Reading file: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');

  let rawRecords = [];

  if (filePath.endsWith('.json')) {
    try {
      rawRecords = JSON.parse(content);
    } catch (err) {
      console.error('[Migration Error] Failed to parse JSON file:', err.message);
      process.exit(1);
    }
  } else {
    // Parse CSV
    try {
      rawRecords = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });
    } catch (err) {
      console.error('[Migration Error] Failed to parse CSV file:', err.message);
      process.exit(1);
    }
  }

  console.log(`[Migration] Processing ${rawRecords.length} records...`);

  let imported = 0;
  let skipped = 0;
  let duplicate = 0;
  let failed = 0;

  for (const row of rawRecords) {
    try {
      let payload = {};

      // 1. Check if JSON Backup field exists
      const jsonBackupStr = row['JSON Backup'] || row['jsonBackup'] || row['json_backup'];
      if (jsonBackupStr) {
        try {
          payload = JSON.parse(jsonBackupStr);
        } catch (e) {
          payload = {};
        }
      }

      // 2. Extract key fields from columns or JSON payload
      const referenceNo =
        payload.referenceNo ||
        row['Reference No.'] ||
        row['Reference No'] ||
        row['referenceNo'] ||
        row['refNo'];

      if (!referenceNo) {
        console.warn('[Migration Warning] Row missing reference number. Skipping:', row);
        skipped++;
        continue;
      }

      // Check if reference already exists in database
      const existing = await ATTRecord.findOne({ referenceNo });
      if (existing) {
        console.log(`[Migration] Duplicate reference found (${referenceNo}). Skipping.`);
        duplicate++;
        continue;
      }

      const attType = payload.attType || row['ATT Type'] || row['attType'] || 'Local';
      const destination = payload.destination || row['Destination'] || row['destination'] || 'N/A';
      const periodOfTravel = payload.periodOfTravel || row['Period of Travel'] || row['periodOfTravel'] || 'N/A';
      const purpose = payload.purpose || row['Purpose'] || row['purpose'] || 'N/A';
      const travelClassification =
        payload.travelClassification || row['Travel Classification'] || row['travelClassification'] || 'Official Business';
      const status = payload.status || row['Status'] || row['status'] || 'Generated';
      const officeStation =
        payload.officeStation || row['Office / Station'] || row['officeStation'] || 'Commission on Higher Education - Central Office';
      const requestedByStr = payload.requestedBy || row['Requested By'] || row['requestedBy'] || '';
      const requestedByPos = payload.requestedByPosition || row['Requested By Position'] || row['requestedByPosition'] || '';
      const approvedByStr = payload.approvedBy || row['Approved By'] || row['approvedBy'] || '';
      const approvedByPos = payload.approvedByPosition || row['Approved By Position'] || row['approvedByPosition'] || '';

      // Extract personnel list
      let personnel = [];
      if (Array.isArray(payload.personnel) && payload.personnel.length > 0) {
        personnel = payload.personnel;
      } else {
        const names = String(row['Personnel'] || row['personnel'] || '').split(',');
        const positions = String(row['Position'] || row['position'] || '').split(',');
        personnel = names
          .map((n, idx) => ({
            name: n.trim(),
            position: positions[idx] ? positions[idx].trim() : ''
          }))
          .filter(p => p.name);
      }

      if (personnel.length === 0) {
        personnel = [{ name: 'Unknown Personnel', position: 'Staff' }];
      }

      // Extract expenses
      const airfareNum = parseFloat(payload.airfare || row['Airfare'] || 0) || 0;
      const perDiemNum = parseFloat(payload.perDiem || row['Per Diem'] || 0) || 0;
      const preTravelNum = parseFloat(payload.preTravel || row['Pre Travel'] || 0) || 0;
      const totalNum = parseFloat(payload.totalAmount || row['Total Amount'] || (airfareNum + perDiemNum + preTravelNum)) || 0;

      await ATTRecord.create({
        referenceNo,
        attType: attType.includes('Abroad') ? 'Abroad' : 'Local',
        personnel,
        destination,
        periodOfTravel,
        officeStation,
        purpose,
        travelClassification: ['Official Business', 'Official Time Only', 'Personal Time'].includes(travelClassification)
          ? travelClassification
          : 'Official Business',
        datePrepared: payload.datePrepared ? new Date(payload.datePrepared) : new Date(),
        requestedBy: {
          name: typeof requestedByStr === 'string' ? requestedByStr : requestedByStr.name || '',
          position: typeof requestedByStr === 'string' ? requestedByPos : requestedByStr.position || ''
        },
        approvedBy: {
          name: typeof approvedByStr === 'string' ? approvedByStr : approvedByStr.name || '',
          position: typeof approvedByStr === 'string' ? approvedByPos : approvedByStr.position || ''
        },
        fundsAvailable: payload.fundsAvailable || row['Funds Available'] || 'N/A',
        sourceOfFunds: payload.sourceOfFunds || row['Source of Funds'] || 'Personal',
        expenses: {
          airfare: airfareNum,
          perDiem: perDiemNum,
          preTravel: preTravelNum,
          totalAmount: totalNum,
          airfareRaw: String(airfareNum),
          perDiemRaw: String(perDiemNum),
          preTravelRaw: String(preTravelNum),
          totalAmountRaw: String(totalNum)
        },
        paymentMode: payload.paymentMode || row['Payment Mode'] || '',
        status: status || 'Generated',
        statusHistory: [
          {
            status: status || 'Generated',
            remarks: 'Imported from legacy Google Sheets backup',
            changedBy: 'MigrationScript',
            changedAt: new Date()
          }
        ],
        submittedBy: row['Submitted By'] || 'legacy-import',
        archived: false
      });

      imported++;
    } catch (err) {
      console.error(`[Migration Error] Failed to import record:`, err.message);
      failed++;
    }
  }

  console.log(`
========================================================================
MIGRATION SUMMARY REPORT
========================================================================
Imported:   ${imported}
Duplicates: ${duplicate}
Skipped:    ${skipped}
Failed:     ${failed}
Total:      ${rawRecords.length}
========================================================================
  `);

  process.exit(0);
};

migrate();
