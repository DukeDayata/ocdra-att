import mongoose from 'mongoose';
import ATTRecord from '../models/ATTRecord.js';
import { generateUniqueReferenceNo } from '../utils/referenceGenerator.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const sanitizeATTData = (input = {}) => {
  const data = { ...input };

  if (data.approvedBy) {
    const app = { ...data.approvedBy };
    if (!app.approverId || !mongoose.Types.ObjectId.isValid(app.approverId)) {
      app.approverId = null;
    }
    data.approvedBy = app;
  }

  if (data.requestedBy) {
    const reqBy = { ...data.requestedBy };
    if (!reqBy.personnelId || !mongoose.Types.ObjectId.isValid(reqBy.personnelId)) {
      reqBy.personnelId = null;
    }
    data.requestedBy = reqBy;
  }

  if (Array.isArray(data.personnel)) {
    data.personnel = data.personnel.map((p) => {
      const pCopy = { ...p };
      if (!pCopy.personnelId || !mongoose.Types.ObjectId.isValid(pCopy.personnelId)) {
        pCopy.personnelId = null;
      }
      return pCopy;
    });
  }

  return data;
};

export const createATT = async (req, res, next) => {
  try {
    const data = sanitizeATTData(req.body);

    // Generate unique reference number
    const referenceNo = await generateUniqueReferenceNo(data.attType);

    // Format monetary amounts safely
    const airfareNum = parseFloat(data.expenses?.airfare) || 0;
    const perDiemNum = parseFloat(data.expenses?.perDiem) || 0;
    const preTravelNum = parseFloat(data.expenses?.preTravel) || 0;
    const totalAmountCalculated = airfareNum + perDiemNum + preTravelNum;
    const userTotalNum = parseFloat(data.expenses?.totalAmount);

    const finalTotalAmount = !isNaN(userTotalNum) && userTotalNum > 0 ? userTotalNum : totalAmountCalculated;

    const initialStatus = 'Generated';
    const statusEntry = {
      status: initialStatus,
      remarks: 'ATT record initially generated',
      changedBy: data.submittedBy || 'System',
      changedAt: new Date()
    };

    const newRecord = await ATTRecord.create({
      ...data,
      referenceNo,
      expenses: {
        airfare: airfareNum,
        perDiem: perDiemNum,
        preTravel: preTravelNum,
        totalAmount: finalTotalAmount,
        airfareRaw: data.expenses?.airfareRaw || (data.expenses?.airfare ? String(data.expenses.airfare) : ''),
        perDiemRaw: data.expenses?.perDiemRaw || (data.expenses?.perDiem ? String(data.expenses.perDiem) : ''),
        preTravelRaw: data.expenses?.preTravelRaw || (data.expenses?.preTravel ? String(data.expenses.preTravel) : ''),
        totalAmountRaw: data.expenses?.totalAmountRaw || String(finalTotalAmount)
      },
      status: initialStatus,
      statusHistory: [statusEntry],
      archived: false
    });

    return successResponse(res, 201, 'ATT record created successfully', newRecord);
  } catch (error) {
    next(error);
  }
};

export const getATTRecords = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      attType,
      status,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      archived = 'false'
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    // Archival status
    if (archived === 'all') {
      // no filter
    } else {
      filter.archived = archived === 'true';
    }

    // Type filter
    if (attType && attType !== 'All') {
      filter.attType = attType;
    }

    // Status filter
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const eDate = new Date(endDate);
        eDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = eDate;
      }
    }

    // Search query
    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { referenceNo: regex },
        { destination: regex },
        { purpose: regex },
        { 'personnel.name': regex },
        { 'approvedBy.name': regex },
        { 'requestedBy.name': regex }
      ];
    }

    const sortOption = {};
    sortOption[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [records, totalRecords] = await Promise.all([
      ATTRecord.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ATTRecord.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalRecords / limitNum) || 1;

    return res.status(200).json({
      success: true,
      message: 'ATT records retrieved successfully',
      data: records,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: pageNum,
        limit: limitNum
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getATTStats = async (req, res, next) => {
  try {
    const stats = await ATTRecord.aggregate([
      { $match: { archived: false } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          local: { $sum: { $cond: [{ $eq: ['$attType', 'Local'] }, 1, 0] } },
          abroad: { $sum: { $cond: [{ $eq: ['$attType', 'Abroad'] }, 1, 0] } },
          signed: { $sum: { $cond: [{ $eq: ['$status', 'Signed'] }, 1, 0] } },
          submitted: { $sum: { $cond: [{ $eq: ['$status', 'Submitted'] }, 1, 0] } },
          returned: { $sum: { $cond: [{ $eq: ['$status', 'Return'] }, 1, 0] } }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      local: 0,
      abroad: 0,
      signed: 0,
      submitted: 0,
      returned: 0
    };

    delete result._id;

    return successResponse(res, 200, 'ATT statistics retrieved', result);
  } catch (error) {
    next(error);
  }
};

export const getATTByReferenceNo = async (req, res, next) => {
  try {
    const { referenceNo } = req.params;
    const record = await ATTRecord.findOne({ referenceNo }).lean();

    if (!record) {
      return errorResponse(res, 404, `ATT record with reference ${referenceNo} not found`);
    }

    return successResponse(res, 200, 'ATT record retrieved', record);
  } catch (error) {
    next(error);
  }
};

export const getATTById = async (req, res, next) => {
  try {
    const record = await ATTRecord.findById(req.params.id).lean();
    if (!record) {
      return errorResponse(res, 404, 'ATT record not found');
    }
    return successResponse(res, 200, 'ATT record retrieved', record);
  } catch (error) {
    next(error);
  }
};

export const updateATT = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = sanitizeATTData(req.body);

    let record = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      record = await ATTRecord.findById(id);
    }
    if (!record) {
      record = await ATTRecord.findOne({ referenceNo: id });
    }

    if (!record) {
      return errorResponse(res, 404, 'ATT record not found');
    }

    // Update monetary total if expense numbers changed
    if (updateData.expenses) {
      const airfareNum = parseFloat(updateData.expenses.airfare ?? record.expenses.airfare) || 0;
      const perDiemNum = parseFloat(updateData.expenses.perDiem ?? record.expenses.perDiem) || 0;
      const preTravelNum = parseFloat(updateData.expenses.preTravel ?? record.expenses.preTravel) || 0;
      const totalNum = parseFloat(updateData.expenses.totalAmount) || (airfareNum + perDiemNum + preTravelNum);

      updateData.expenses = {
        ...record.expenses,
        ...updateData.expenses,
        airfare: airfareNum,
        perDiem: perDiemNum,
        preTravel: preTravelNum,
        totalAmount: totalNum
      };
    }

    Object.assign(record, updateData);
    await record.save();

    return successResponse(res, 200, 'ATT record updated successfully', record);
  } catch (error) {
    next(error);
  }
};

export const updateATTStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, remarks = '', changedBy = 'Admin' } = req.body;

    let record = await ATTRecord.findById(id);
    if (!record) {
      // Fallback search by reference number if ID fails
      record = await ATTRecord.findOne({ referenceNo: id });
    }

    if (!record) {
      return errorResponse(res, 404, 'ATT record not found');
    }

    record.status = status;
    record.statusHistory.push({
      status,
      remarks,
      changedBy,
      changedAt: new Date()
    });

    await record.save();

    return successResponse(res, 200, `ATT status updated to ${status}`, record);
  } catch (error) {
    next(error);
  }
};

export const archiveATT = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await ATTRecord.findById(id);

    if (!record) {
      return errorResponse(res, 404, 'ATT record not found');
    }

    record.archived = !record.archived;
    record.statusHistory.push({
      status: record.archived ? 'Archived' : record.status,
      remarks: record.archived ? 'ATT record archived' : 'ATT record unarchived',
      changedBy: 'Admin',
      changedAt: new Date()
    });

    await record.save();

    return successResponse(
      res,
      200,
      `ATT record ${record.archived ? 'archived' : 'unarchived'} successfully`,
      record
    );
  } catch (error) {
    next(error);
  }
};
