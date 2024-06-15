const AppError = require("../util/AppError");

function handleValidationErrorDB(err) {
  const appError = new AppError(err.message, 422); // unprocessbile entity
  appError.status = "fail";
  return appError;
}
function handleDuplicateKeyError(err) {
  const appError = new AppError("email already registered", 409); // duplicate email field
  appError.status = "fail";
  return appError;
}

function sendError(err, res) {
  console.log(err);
  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message });
  } else {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
function errorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.name === "ValidationError") err = handleValidationErrorDB(err);
  if (err.code * 1 === 11000) err = handleDuplicateKeyError(err);

  return sendError(err, res);
}

module.exports = errorHandler;
