const User = require("../models/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const { sendVerificationEmail } = require("../services/email.service");

// ── Token helper ─────────────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const userPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
});

// ── Register ─────────────────────────────────────────────────────────────────
exports.register = catchAsync(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res
      .status(409)
      .json({ message: "An account with this email already exists." });
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    password,
    verificationToken,
  });

  // Send verification email — non-blocking; don't fail registration if SMTP is misconfigured
  sendVerificationEmail(user.email, user.name, verificationToken).catch((err) =>
    console.error("Verification email failed:", err.message),
  );

  const token = signToken(user._id);

  res.status(201).json({ token, user: userPayload(user) });
});

// ── Login ─────────────────────────────────────────────────────────────────────
exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  // Use the same generic message for both "no user" and "wrong password"
  // to avoid user-enumeration attacks
  if (!user || !(await user.comparePasswords(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = signToken(user._id);

  res.status(200).json({ token, user: userPayload(user) });
});

// ── Verify email ──────────────────────────────────────────────────────────────
exports.verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Verification token is required." });
  }

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Invalid or expired verification link." });
  }

  user.isEmailVerified = true;
  user.verificationToken = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ message: "Email verified successfully." });
});

// ── Get current user ──────────────────────────────────────────────────────────
exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({ user: userPayload(req.user) });
});
