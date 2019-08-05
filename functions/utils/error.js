const APIErrorName = 'APIError';

const buildError = (err, status, message) => {
  let error = err;
  if (!error) {
    error = new Error('Unknown error');
  }
  error.name = APIErrorName;
  if (status) {
    error.status = status;
  }
  if (message) {
    error.message = message;
  }
  return error;
};

const catchError = (next, message, errorCheck) => (err) => {
  let error = err;
  if (error && error.name === 'CastError') {
    error = buildError(error, 403, 'Invalid id');
  }
  if (error && error.code === 11000) {
    error.message = message || error.message;
  }
  if (errorCheck) {
    error = errorCheck(error);
  }
  next(error);
};

module.exports = {
  buildError,
  catchError,
};
