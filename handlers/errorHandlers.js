const Sequelize = require("sequelize");
const { logger } = require("./logger");

exports.errorWrapper = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || "";
  const errorDetails = {
    error: err.message,
    stack: err.stack,
  };

  logger.error(err);
  res.status(err.status || 500).json(errorDetails);
};

exports.productionErrors = (err, req, res, next) => {
  logger.error(err);

  res.status(err.status || 500).json({
    error: err.message,
  });
};

exports.notFound = (req, res, next) => {
  const err = new Error("server.notFound");
  err.status = 404;
  next(err);
};

exports.sequelizeErrorHandler = (err, req, res, next) => {
  if (err instanceof Sequelize.ValidationError) {
    const errorCodes = err.errors.map((error) => error.message);
    res.status(400).json({
      errors: errorCodes,
    });
    return;
  } else {
    next(err);
  }
};

class CustomError extends Error {
  constructor(error, name, status) {
    super(error);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.name = name;
    this.status = status;
  }
}

exports.CustomError = CustomError;
