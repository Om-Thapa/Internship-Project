const express = require("express");
const {
  createRazorpayOrder,
  verifySignature,
} = require("../controllers/payment.controller");
const {
  protect,
  requireEmailVerified,
} = require("../middleware/auth.middleware");
const router = express.Router();

router.post(
  "/create-order",
  protect,
  requireEmailVerified,
  createRazorpayOrder,
);
router.post("/verify", protect, requireEmailVerified, verifySignature);

module.exports = router;
