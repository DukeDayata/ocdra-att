import Approver from '../models/Approver.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getApprovers = async (req, res, next) => {
  try {
    const { active } = req.query;
    const filter = {};
    if (active !== undefined) {
      filter.active = active === 'true';
    }

    const approvers = await Approver.find(filter).sort({ name: 1 }).lean();
    return successResponse(res, 200, 'Approvers list retrieved successfully', approvers);
  } catch (error) {
    next(error);
  }
};

export const createApprover = async (req, res, next) => {
  try {
    const { name, position } = req.body;
    if (!name || !position) {
      return errorResponse(res, 400, 'Name and position are required fields.');
    }

    const newApprover = await Approver.create({ name, position });
    return successResponse(res, 201, 'Approver created successfully', newApprover);
  } catch (error) {
    next(error);
  }
};

export const getApproverById = async (req, res, next) => {
  try {
    const approver = await Approver.findById(req.params.id);
    if (!approver) {
      return errorResponse(res, 404, 'Approver not found');
    }
    return successResponse(res, 200, 'Approver details retrieved', approver);
  } catch (error) {
    next(error);
  }
};

export const updateApprover = async (req, res, next) => {
  try {
    const approver = await Approver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!approver) {
      return errorResponse(res, 404, 'Approver not found');
    }
    return successResponse(res, 200, 'Approver updated successfully', approver);
  } catch (error) {
    next(error);
  }
};

export const toggleApproverStatus = async (req, res, next) => {
  try {
    const approver = await Approver.findById(req.params.id);
    if (!approver) {
      return errorResponse(res, 404, 'Approver not found');
    }
    approver.active = !approver.active;
    await approver.save();
    return successResponse(res, 200, `Approver ${approver.active ? 'activated' : 'deactivated'} successfully`, approver);
  } catch (error) {
    next(error);
  }
};
