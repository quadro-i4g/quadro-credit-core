/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
const { InternalServerError, NotFoundError, BadRequestError } = require('../utils/appError');

const sendErrorInDev = (errorObject, res) => {
  // eslint-disable-next-line no-console
  console.log('✖ | Error:'.red.bold, errorObject);
  res.status(errorObject.statusCode).json({
    status: errorObject.status,
    message: errorObject.message,
    error: errorObject,
    stack: errorObject.stack
  })
}

const sendErrorInProduction = (errorObject, res) => {
  // Mongoose bad ObjectId
  if (errorObject.name === 'CastError') {
    errorObject = new NotFoundError(`Resource not found :(`);
  }

  // Mongoose duplicate key error
  if (errorObject.name === 'MongoServerError' && errorObject.code === 11000) {
    errorObject = new BadRequestError();
  }

  if (errorObject?.error) {
    if (errorObject?.error.code === 'ENOTFOUND' || errorObject ?.error.code === 'ECONNRESET') {
      errorObject = new InternalServerError('An error occured while connecting to a required external service');
    }
  }


  res.status(errorObject.statusCode || 500).json({
    status: errorObject.status || 'failure',
    message: errorObject.message || 'Internal server error',
    details: errorObject.details || undefined
  })
}

module.exports = (errorObject, req, res, next) => {
  errorObject.statusCode = errorObject.statusCode || 500;
  errorObject.status = errorObject.status || 'error';

  (process.env.NODE_ENV !== 'production') && sendErrorInDev(errorObject, res);
  (process.env.NODE_ENV === 'production') && sendErrorInProduction(errorObject, res);
}