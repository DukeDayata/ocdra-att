import ATTRecord from '../models/ATTRecord.js';

/**
 * Generates a unique reference number for ATT records.
 * Format:
 *   Abroad: ATT-INT-YYYY-#####
 *   Local:  ATT-LOC-YYYY-#####
 */
export const generateUniqueReferenceNo = async (attType = 'Local', attempts = 0) => {
  if (attempts > 10) {
    throw new Error('Failed to generate a unique ATT reference number after maximum retries.');
  }

  const year = new Date().getFullYear();
  const prefix = attType === 'Abroad' ? 'ATT-INT' : 'ATT-LOC';
  const searchPattern = new RegExp(`^${prefix}-${year}-(\\d{5})$`);

  // Find the record with the highest 5-digit sequence for this year and type
  const latestRecord = await ATTRecord.findOne({
    referenceNo: { $regex: searchPattern }
  })
    .sort({ referenceNo: -1 })
    .collation({ locale: 'en', numericOrdering: true })
    .exec();

  let nextSeq = 1;
  if (latestRecord && latestRecord.referenceNo) {
    const match = latestRecord.referenceNo.match(searchPattern);
    if (match && match[1]) {
      nextSeq = parseInt(match[1], 10) + 1;
    }
  }

  // Add random offset if retrying due to race condition
  if (attempts > 0) {
    nextSeq += Math.floor(Math.random() * 50) + 1;
  }

  const paddedSeq = String(nextSeq).padStart(5, '0');
  const candidateRef = `${prefix}-${year}-${paddedSeq}`;

  // Check if reference already exists
  const existing = await ATTRecord.findOne({ referenceNo: candidateRef }).select('_id').lean();
  if (existing) {
    return generateUniqueReferenceNo(attType, attempts + 1);
  }

  return candidateRef;
};
