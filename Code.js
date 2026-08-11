const SPREADSHEET_ID = "1lWyIE1mucqpRFKWgyF-bb8NTid2c4OwLx2VWQVaLcOk";

function doGet(e) {
  const page = e && e.parameter && e.parameter.page
    ? e.parameter.page
    : "index";

  if (page === "admin") {
    return HtmlService.createHtmlOutputFromFile("admin")
      .setTitle("ATT Admin Dashboard")
      .setFaviconUrl("https://chedcar.com/wp-content/uploads/2020/09/Commission_on_Higher_Education_CHEd.svg_-768x768.png");
      
  }

  if (page === "form") {
    return HtmlService.createHtmlOutputFromFile("form")
      .setTitle("ATT Form")
      .setFaviconUrl("https://chedcar.com/wp-content/uploads/2020/09/Commission_on_Higher_Education_CHEd.svg_-768x768.png");
  }

  if (page === "printAbroad") {
    return HtmlService.createHtmlOutputFromFile("PrintATTAbroad")
      .setTitle("Print ATT Abroad")
      .setFaviconUrl("https://chedcar.com/wp-content/uploads/2020/09/Commission_on_Higher_Education_CHEd.svg_-768x768.png");
  }

  if (page === "printLocal") {
    return HtmlService.createHtmlOutputFromFile("PrintATTLocal")
      .setTitle("Print ATT Local")
      .setFaviconUrl("https://chedcar.com/wp-content/uploads/2020/09/Commission_on_Higher_Education_CHEd.svg_-768x768.png");
  }

  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("ATT Generator System")
    .setFaviconUrl("https://chedcar.com/wp-content/uploads/2020/09/Commission_on_Higher_Education_CHEd.svg_-768x768.png");
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getPersonnelList() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName("Personnel");
  const values = sh.getDataRange().getValues();

  const headers = values.shift();

  return values.map(row => ({
    id: row[0],
    name: row[1],
    position: row[2],
    office: row[3],
    region: row[4],
    email: row[5]
  }));
}

function getChairmanList() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName("Chairman");
  if (!sh) return [];

  const values = sh.getDataRange().getValues();
  if (!values || values.length === 0) return [];

  const headers = values.shift();

  return values.map(row => {
    const name = row[0] || "";
    const position = row[1] || "";
    return {
      name: name,
      position: position,
      display: position ? `${name} - ${position}` : name
    };
  });
}

function saveATTRecord(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName("ATT_Records");

  const refNo = generateATTReference(data.attType);

  const personnelNames = (data.personnel || []).map(p => p.name).join(", ");
  const personnelPositions = (data.personnel || []).map(p => p.position).join(", ");

  // include the generated reference in the stored JSON payload
  const payload = Object.assign({}, data, { referenceNo: refNo });

  sh.appendRow([
    new Date(),
    refNo,
    data.attType || "",
    (data.personnel || []).map(p => p.name).join(", "),
    (data.personnel || []).map(p => p.position).join(", "),
    data.destination || "",
    data.periodOfTravel || "",
    data.purpose || "",
    data.travelClassification || "",
    data.requestedBy || "",
    data.requestedByPosition || "",
    data.fundsAvailable || "",
    data.sourceOfFunds || "",
    data.approvedBy || "",
    data.approvedByPosition || "",
    data.datePrepared || "",
    data.officeStation || "",
    data.airfare || "",
    data.perDiem || "",
    data.preTravel || "",
    data.totalAmount || "",
    data.paymentMode || "",
    Session.getActiveUser().getEmail(),
    JSON.stringify(payload)
  ]);

  return {
    success: true,
    referenceNo: refNo
  };
}

function getATTRecord(refNo) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName("ATT_Records");
  if (!sh) return null;

  const values = sh.getDataRange().getValues();
  if (!values || values.length < 2) return null;

  // build header map from first row (normalize by removing non-alphanum and lowercasing)
  const headerRow = values[0];
  const hdrMap = {};
  headerRow.forEach((h, idx) => {
    const key = (h || "").toString().replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    if (key) hdrMap[key] = idx;
  });

  // helper to get column by possible names
  function getColIndex(names, fallbackIndex) {
    for (const n of names) {
      const k = n.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      if (k in hdrMap) return hdrMap[k];
    }
    return fallbackIndex;
  }

  const refCol = getColIndex(["referenceno", "ref", "reference"], 1);

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if ((row[refCol] || "") == refNo) {
      const last = row[row.length - 1];
      try {
        const parsed = JSON.parse(last);
        return parsed;
      } catch (e) {
        // construct object using header mapping
        const obj = {};
        obj.referenceNo = row[refCol] || "";
        obj.attType = row[getColIndex(["atttype", "type", "atttype"], 2)] || "";
        const personnelStr = row[getColIndex(["personnel", "personnel_names", "personnelnames"], 3)] || "";
        obj.personnel = (personnelStr + "").toString().split(/,\s*/).filter(s=>s).map(n => ({ name: n.trim(), position: "" }));
        obj.destination = row[getColIndex(["destination", "dest", "place"], 4)] || "";
        obj.periodOfTravel = row[getColIndex(["periodoftravel","period","periodoftravel"],5)] || "";
        obj.purpose = row[getColIndex(["purpose","purposeoftravel"],6)] || "";
        obj.travelClassification = row[getColIndex(["classification","travelclassification"],7)] || "";
        obj.requestedBy = row[getColIndex(["requestedby","requested_by"],8)] || "";
        obj.fundsAvailable = row[getColIndex(["fundsavailable","funds_available"],9)] || "";
        obj.approvedBy = row[getColIndex(["approvedby","approved_by"],10)] || "";
        obj.datePrepared = row[getColIndex(["dateprepared","date_prepared"],11)] || "";
        obj.sourceOfFunds = row[getColIndex(["sourceoffunds","source_of_funds"],12)] || "";
        obj.airfare = row[getColIndex(["airfare"],13)] || "";
        obj.perDiem = row[getColIndex(["perdiem","per_diem"],14)] || "";
        obj.preTravel = row[getColIndex(["pretravelexpenses","pre_travel_expenses","pretravelexpenses"],15)] || "";
        obj.totalAmount = row[getColIndex(["totalamount","total_amount"],16)] || "";
        obj.paymentMode = row[getColIndex(["paymentmode","payment_mode"],17)] || "";

        return obj;
      }
    }
  }

  return null;
}

function getAllATTRecords() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName("ATT_Records");
  if (!sh) return [];

  const values = sh.getDataRange().getDisplayValues();
  if (!values || values.length < 2) return [];

  const headers = values[0];

  function col(name) {
    const target = name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    return headers.findIndex(h =>
      String(h).replace(/[^a-zA-Z0-9]/g, "").toLowerCase() === target
    );
  }

  const idx = {
    timestamp: col("Timestamp"),
    ref: col("Reference No."),
    attType: col("ATT Type"),
    personnel: col("Personnel"),
    position: col("Position"),
    destination: col("Destination"),
    period: col("Period of Travel"),
    purpose: col("Purpose"),
    classification: col("Travel Classification"),
    requestedBy: col("Requested By"),
    requestedByPosition: col("Requested By Position"),
    fundsAvailable: col("Funds Available"),
    sourceOfFunds: col("Source of Funds"),
    approvedBy: col("Approved By"),
    approvedByPosition: col("Approved By Position"),
    datePrepared: col("Date Prepared"),
    officeStation: col("Office / Station"),
    airfare: col("Airfare"),
    perDiem: col("Per Diem"),
    preTravel: col("Pre Travel"),
    totalAmount: col("Total Amount"),
    paymentMode: col("Payment Mode"),
    submittedBy: col("Submitted By"),
    jsonBackup: col("JSON Backup"),
    status: col("Status")
  };

  const records = values.slice(1)
    .filter(row => row[idx.ref])
    .map(row => {
      let obj = {};

      if (idx.jsonBackup !== -1 && row[idx.jsonBackup]) {
        try {
          obj = JSON.parse(row[idx.jsonBackup]);
        } catch (e) {
          obj = {};
        }
      }

      obj.referenceNo = obj.referenceNo || row[idx.ref] || "";
      obj.attType = obj.attType || row[idx.attType] || "";
      obj.personnel = obj.personnel || String(row[idx.personnel] || "")
        .split(",")
        .filter(Boolean)
        .map((name, i) => ({
          name: name.trim(),
          position: String(row[idx.position] || "").split(",")[i]?.trim() || ""
        }));

      obj.destination = obj.destination || row[idx.destination] || "";
      obj.periodOfTravel = obj.periodOfTravel || row[idx.period] || "";
      obj.purpose = obj.purpose || row[idx.purpose] || "";
      obj.travelClassification = obj.travelClassification || row[idx.classification] || "";
      obj.requestedBy = obj.requestedBy || row[idx.requestedBy] || "";
      obj.requestedByPosition = obj.requestedByPosition || row[idx.requestedByPosition] || "";
      obj.fundsAvailable = obj.fundsAvailable || row[idx.fundsAvailable] || "";
      obj.sourceOfFunds = obj.sourceOfFunds || row[idx.sourceOfFunds] || "";
      obj.approvedBy = obj.approvedBy || row[idx.approvedBy] || "";
      obj.approvedByPosition = obj.approvedByPosition || row[idx.approvedByPosition] || "";
      obj.datePrepared = obj.datePrepared || row[idx.datePrepared] || "";
      obj.officeStation = obj.officeStation || row[idx.officeStation] || "";
      obj.airfare = obj.airfare || row[idx.airfare] || "";
      obj.perDiem = obj.perDiem || row[idx.perDiem] || "";
      obj.preTravel = obj.preTravel || row[idx.preTravel] || "";
      obj.totalAmount = obj.totalAmount || row[idx.totalAmount] || "";
      obj.paymentMode = obj.paymentMode || row[idx.paymentMode] || "";
      obj.submittedBy = obj.submittedBy || row[idx.submittedBy] || "";
      obj.status = obj.status || (idx.status !== -1 ? row[idx.status] : "");

      return obj;
    });

  return records.reverse();
}

function setATTStatus(refNo, status) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName("ATT_Records");
  if (!sh) return { success: false, message: 'Sheet not found' };

  const values = sh.getDataRange().getValues();
  if (!values || values.length < 1) return { success: false, message: 'No data' };

  const headers = values[0].map(h => (h||'').toString());
  // find or create Status column
  let statusCol = headers.findIndex(h => (h||'').toString().replace(/[^a-zA-Z0-9]/g,'').toLowerCase() === 'status');
  if (statusCol === -1) {
    // add a Status header at the end
    statusCol = headers.length;
    sh.getRange(1, statusCol+1).setValue('Status');
  }

  // find row by reference (col 2)
  const refCol = 2; // 1-based column index for refNo stored earlier
  for (let r = 2; r <= values.length; r++) {
    const rowRef = sh.getRange(r, refCol).getValue();
    if (rowRef == refNo) {
      sh.getRange(r, statusCol+1).setValue(status);
      // also update JSON payload if present in last column
      const lastCol = values[0].length;
      try {
        const raw = sh.getRange(r, lastCol).getValue();
        const parsed = JSON.parse(raw);
        parsed.status = status;
        sh.getRange(r, lastCol).setValue(JSON.stringify(parsed));
      } catch (err) {
        // ignore
      }
      return { success: true };
    }
  }

  return { success: false, message: 'Reference not found' };
}

function generateATTReference(type) {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  const prefix = type === "Abroad" ? "ATT-INT" : "ATT-LOC";
  return `${prefix}-${year}-${random}`;
}

/**
 * Debug helper: returns basic info about ATT_Records sheet
 */
function debugATTRecords() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName("ATT_Records");
  if (!sh) return { sheetExists: false };
  const range = sh.getDataRange();
  const values = range.getValues();
  return {
    sheetExists: true,
    rowCount: values.length,
    colCount: values[0] ? values[0].length : 0,
    headers: values[0] || [],
    sampleRows: values.slice(1, 6)
  };
}

/**
 * More detailed debug info including execution user and errors
 */
function debugFullInfo() {
  try {
    const info = {
      spreadsheetId: SPREADSHEET_ID,
      activeUser: Session.getActiveUser() ? Session.getActiveUser().getEmail() : '',
      sheetExists: false,
      rowCount: 0,
      colCount: 0,
      headers: [],
      sampleRows: []
    };

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sh = ss.getSheetByName("ATT_Records");
    if (!sh) {
      info.sheetExists = false;
      return info;
    }

    info.sheetExists = true;
    const values = sh.getDataRange().getValues();
    info.rowCount = values.length;
    info.colCount = values[0] ? values[0].length : 0;
    info.headers = values[0] || [];
    info.sampleRows = values.slice(1, 6);
    return info;
  } catch (err) {
    return { error: (err && err.toString()) || 'Unknown error', spreadsheetId: SPREADSHEET_ID };
  }
}