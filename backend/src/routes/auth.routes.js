const express = require("express");
const {
  register,
  login,
  verifyEmail,
  getMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verifyEmail);
router.get("/me", protect, getMe);

module.exports = router;
