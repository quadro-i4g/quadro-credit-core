/* eslint-disable max-classes-per-file */
class AppError extends Error {
  constructor(message, statusCode = 500, details = undefined) {
    super(message);
    this.name = 'QuadroError';
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    this.date = new Date();

    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad request', statusCode = 400) {
    super(message, statusCode);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Bad request', statusCode = 400, details = {}) {
    super(message, statusCode, details);
  }
}

class InternalServerError extends AppError {
  constructor(message = 'Something wrong happened', statusCode = 500) {
    super(message, statusCode);
  }
}

class BadGatewayError extends AppError {
  constructor(message = 'The server encountered a temporary error & could not complete your request', statusCode = 502) {
    super(message, statusCode);
  }
}

class UnAuthorizedError extends AppError {
  constructor(message = 'Not authorized', statusCode = 401) {
    super(message, statusCode);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden', statusCode = 403) {
    super(message, statusCode);
  }
}

class ExpectationFailedError extends AppError {
  constructor(message = 'Expected inputs were not supplied', statusCode = 417) {
    super(message, statusCode);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Requested resource not found', statusCode = 404) {
    super(message, statusCode);
  }
}

class InvalidError extends AppError {
  constructor(message = 'Invalid input', statusCode = 422) {
    super(message, statusCode);
  }
}

class DuplicateError extends AppError {
  constructor(message = 'Duplicate value entered', statusCode = 406) {
    super(message, statusCode);
  }
}

module.exports = {
  BadRequestError,
  ValidationError,
  InternalServerError,
  BadGatewayError,
  UnAuthorizedError,
  ForbiddenError,
  ExpectationFailedError,
  NotFoundError,
  InvalidError,
  DuplicateError
}