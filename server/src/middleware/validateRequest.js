import { errorResponse } from '../utils/apiResponse.js';

export const validateRequest = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error.errors) {
      const formattedErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return errorResponse(res, 400, 'Validation Error', formattedErrors);
    }
    return errorResponse(res, 400, error.message || 'Invalid Request Data');
  }
};
