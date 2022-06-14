const AppError = require('../utils/appError');

const sendErrorDev = (err, req, res) => {
  //API error
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stacK: err.stack,
    });
  } else {
    //RENDER error
    console.error('ERROR ', err);

    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  //API error
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      //Operational, trusted error: send message to the client.
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming or other unknown error: don't leak the error details
    console.error('ERROR', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }

  if (err.isOperational) {
    //Operational, trusted error: send message to the client.
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  // Programming or other unknown error: don't leak the error details
  console.error('ERROR', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later.',
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const message = `Duplicate field value: ${value[0]}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = (err) =>
  new AppError('Invalid token, please log in again to continue', 401);

const handleExpiredJsonWebTokenError = (err) =>
  new AppError('Token expired, please log in again to continue', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //internal server error
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // Buggy cause err has hidden properties it seems
    let error = new AppError(err.message, err.statusCode);
    error.isOperational = err.isOperational;
    if (err.name === 'CastError') {
      error = handleCastErrorDB(err);
    }
    if (err.code === 11000) {
      error = handleDuplicateErrorDB(err);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(err);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJsonWebTokenError(err);
    }
    if (err.name === 'TokenExpiredError') {
      error = handleExpiredJsonWebTokenError(err);
    }
    sendErrorProd(error, req, res);
  }
};
