const express = require("express");
const {
  createRazorpayOrder,
  verifySignature,
} = require("../controllers/payment.controller");
const { protect } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify", protect, verifySignature);

module.exports = router;
