import { errorResponse } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]', err.stack || err.message);

  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || 'Internal Server Error';
  
  // Format errors depending on type
  let errors = [];
  if (err.errors) {
    if (Array.isArray(err.errors)) {
      errors = err.errors;
    } else if (typeof err.errors === 'object') {
      errors = Object.values(err.errors).map(e => e.message);
    }
  }

  return errorResponse(
    res,
    statusCode,
    message,
    process.env.NODE_ENV === 'development' ? (errors.length ? errors : [err.stack]) : errors
  );
};
