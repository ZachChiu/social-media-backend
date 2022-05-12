const errorHandle = (httpStatus, errMessage, next) => {
  const error = new Error(errMessage);
  error.status = httpStatus;
  error.isOperational = true;

  next(error);
};

module.exports = errorHandle;
