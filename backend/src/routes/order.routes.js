const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require("../controllers/order.controller");
const { protect } = require("../middleware/auth.middleware");
const router = express.Router();

router.route("/").post(protect, createOrder).get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);

module.exports = router;
