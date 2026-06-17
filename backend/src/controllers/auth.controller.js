const User = require("../models/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const { sendVerificationEmail } = require("../services/email.service");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = catchAsync(async (req, res) => {
  const { name, email, phone, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res
      .status(400)
      .json({ message: "User profile already exist." });

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    name,
    email,
    phone,
    password,
    verificationToken,
  });

  try {
    await sendVerificationEmail(user.email, user.name, verificationToken);
  } catch (err) {
    console.error("SMTP Configuration Mismatch: ", err.message);
  }

  const token = signToken(user._id);
  res
    .status(201)
    .json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Provide credentials." });

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePasswords(password, user.password))) {
    return res
      .status(401)
      .json({ message: "Invalid email or password." });
  }

  const token = signToken(user._id);
  res
    .status(200)
    .json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
});

exports.verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({ verificationToken: token });

  if (!user)
    return res
      .status(400)
      .json({ message: "Invalid or expired payload parameters." });

  user.isEmailVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(200).json({ message: "Access loop authorized. Email verified." });
});

exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({ user: req.user });
});
