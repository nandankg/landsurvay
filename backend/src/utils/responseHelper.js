/**
 * Standard API Response Helpers
 */

// Success response
const success = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Error response
const error = (res, message = 'Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Paginated response
const paginated = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit)
    }
  });
};

// Not found response
const notFound = (res, message = 'Resource not found') => {
  return error(res, message, 404);
};

// Unauthorized response
const unauthorized = (res, message = 'Unauthorized') => {
  return error(res, message, 401);
};

// Validation error response
const validationError = (res, errors) => {
  return error(res, 'Validation failed', 400, errors);
};

module.exports = {
  success,
  error,
  paginated,
  notFound,
  unauthorized,
  validationError
};
