// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production mode
    if (err.isOperational) {
      // Operational, trusted error: send message to client
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Programming or other unknown error: don't leak error details
      console.error("ERROR 💥", err);
      res.status(500).json({
        status: "error",
        message: "Something went wrong!",
      });
    }
  }
};

// Not found handler middleware
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(error);
};

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
}; 