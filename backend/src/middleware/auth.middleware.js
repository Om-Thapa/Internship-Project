const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

/**
 * protect — verifies JWT and attaches req.user.
 * Throws operational errors that the global error handler formats cleanly.
 */
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "You must be signed in to access this resource.",
    });
  }

  // Throws JsonWebTokenError / TokenExpiredError — caught by global handler
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id).select(
    "-password -verificationToken",
  );

  if (!currentUser) {
    return res.status(401).json({
      message: "The account belonging to this token no longer exists.",
    });
  }

  req.user = currentUser;
  next();
});

/**
 * restrictTo — role-based access guard.
 * Must be used after protect.
 */
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. This action requires: ${roles.join(", ")} role.`,
      });
    }
    next();
  };
