/**
 * Global Express error handler.
 *
 * Distinguishes between:
 *  - Operational errors  (expected, safe to surface to client)
 *  - Programming errors  (unexpected, generic 500 in production)
 *
 * Mongoose-specific errors are normalised into clean API messages.
 */

function handleCastError(err) {
  return Object.assign(new Error(`Invalid ${err.path}: ${err.value}`), {
    statusCode: 400,
    isOperational: true,
  });
}

function handleDuplicateKey(err) {
  const field = Object.keys(err.keyValue || {})[0] || "field";
  const value = err.keyValue?.[field];
  return Object.assign(
    new Error(`"${value}" is already in use. Please use a different ${field}.`),
    { statusCode: 409, isOperational: true },
  );
}

function handleValidationError(err) {
  const messages = Object.values(err.errors)
    .map((e) => e.message)
    .join(". ");
  return Object.assign(new Error(`Validation failed: ${messages}`), {
    statusCode: 400,
    isOperational: true,
  });
}

function handleJWTError() {
  return Object.assign(new Error("Invalid session. Please sign in again."), {
    statusCode: 401,
    isOperational: true,
  });
}

function handleJWTExpiredError() {
  return Object.assign(
    new Error("Your session has expired. Please sign in again."),
    {
      statusCode: 401,
      isOperational: true,
    },
  );
}

module.exports = (err, req, res, next) => {
  let error = { ...err, message: err.message, stack: err.stack };

  // Normalise Mongoose / JWT errors
  if (error.name === "CastError") error = handleCastError(error);
  if (error.code === 11000) error = handleDuplicateKey(error);
  if (error.name === "ValidationError") error = handleValidationError(error);
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

  error.statusCode = error.statusCode || 500;

  const isDev = process.env.NODE_ENV === "development";
  const isProd = process.env.NODE_ENV === "production";

  if (isDev) {
    // Full details in development
    return res.status(error.statusCode).json({
      status: error.statusCode >= 500 ? "error" : "fail",
      message: error.message,
      stack: error.stack,
      error,
    });
  }

  if (isProd) {
    if (error.isOperational) {
      // Safe to surface
      return res.status(error.statusCode).json({
        status: error.statusCode >= 500 ? "error" : "fail",
        message: error.message,
      });
    }

    // Programming / unknown error — don't leak details
    console.error("UNEXPECTED ERROR:", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again later.",
    });
  }

  // Fallback (test env, etc.)
  res.status(error.statusCode).json({
    status: "error",
    message: error.message,
  });
};
