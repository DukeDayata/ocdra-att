import Personnel from '../models/Personnel.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getPersonnel = async (req, res, next) => {
  try {
    const { active, search } = req.query;
    const filter = {};

    if (active !== undefined) {
      filter.active = active === 'true';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { office: { $regex: search, $options: 'i' } }
      ];
    }

    const personnel = await Personnel.find(filter).sort({ name: 1 }).lean();
    return successResponse(res, 200, 'Personnel list retrieved successfully', personnel);
  } catch (error) {
    next(error);
  }
};

export const createPersonnel = async (req, res, next) => {
  try {
    const { employeeId, name, position, office, region, email } = req.body;

    if (!name || !position) {
      return errorResponse(res, 400, 'Name and position are required fields.');
    }

    const newPerson = await Personnel.create({
      employeeId,
      name,
      position,
      office: office || 'Commission on Higher Education - Central Office',
      region: region || '',
      email: email || ''
    });

    return successResponse(res, 201, 'Personnel created successfully', newPerson);
  } catch (error) {
    next(error);
  }
};

export const getPersonnelById = async (req, res, next) => {
  try {
    const person = await Personnel.findById(req.params.id);
    if (!person) {
      return errorResponse(res, 404, 'Personnel not found');
    }
    return successResponse(res, 200, 'Personnel details retrieved', person);
  } catch (error) {
    next(error);
  }
};

export const updatePersonnel = async (req, res, next) => {
  try {
    const person = await Personnel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!person) {
      return errorResponse(res, 404, 'Personnel not found');
    }
    return successResponse(res, 200, 'Personnel updated successfully', person);
  } catch (error) {
    next(error);
  }
};

export const togglePersonnelStatus = async (req, res, next) => {
  try {
    const person = await Personnel.findById(req.params.id);
    if (!person) {
      return errorResponse(res, 404, 'Personnel not found');
    }
    person.active = !person.active;
    await person.save();
    return successResponse(res, 200, `Personnel ${person.active ? 'activated' : 'deactivated'} successfully`, person);
  } catch (error) {
    next(error);
  }
};
