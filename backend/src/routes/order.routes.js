const express = require("express");
const {
  getMyOrders,
  getOrderById,
} = require("../controllers/order.controller");
const { protect } = require("../middleware/auth.middleware");
const router = express.Router();

// NOTE: Orders are no longer created directly via this route.
// Orders are created internally by payment.controller.js's verifySignature
// handler, only after a Razorpay payment has been successfully verified.
// This guarantees no order ever exists in the DB without a completed payment.
router.route("/").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);

module.exports = router;
