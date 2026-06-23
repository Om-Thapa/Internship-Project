const crypto = require("crypto");
const razorpayInstance = require("../config/razorpay");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Product = require("../models/Product");
const catchAsync = require("../utils/catchAsync");

// ── Create Razorpay order ─────────────────────────────────────────────────────
exports.createRazorpayOrder = catchAsync(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required." });
  }

  const order = await Order.findOne({ _id: orderId, userId: req.user._id });

  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  if (order.paymentStatus === "paid") {
    return res
      .status(400)
      .json({ message: "This order has already been paid." });
  }

  if (order.paymentMethod === "cod") {
    return res.status(400).json({
      message:
        "This order was placed as Cash on Delivery and does not require online payment.",
    });
  }

  const amountInPaise = Math.round(order.total * 100);

  if (amountInPaise < 100) {
    return res
      .status(400)
      .json({ message: "Order amount too low for payment processing." });
  }

  const razorpayOrder = await razorpayInstance.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: order._id.toString().slice(-20), // Razorpay receipt max 40 chars
    notes: {
      orderId: order._id.toString(),
      customerEmail: req.user.email,
    },
  });

  // Upsert payment record — safe to call again if user retries
  await Payment.findOneAndUpdate(
    { orderId: order._id },
    {
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.total,
      status: "created",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  res.status(201).json(razorpayOrder);
});

// ── Verify signature & fulfil order ──────────────────────────────────────────
exports.verifySignature = catchAsync(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res
      .status(400)
      .json({ message: "Missing payment verification parameters." });
  }

  // HMAC-SHA256 signature check
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res
      .status(400)
      .json({ message: "Payment signature verification failed." });
  }

  // Find the payment record
  const paymentRecord = await Payment.findOne({
    razorpayOrderId: razorpay_order_id,
  });

  if (!paymentRecord) {
    return res.status(404).json({ message: "Payment record not found." });
  }

  if (paymentRecord.status === "captured") {
    // Idempotent — already processed (webhook may have beaten us)
    const order = await Order.findById(paymentRecord.orderId);
    return res.status(200).json({ status: "success", orderId: order._id });
  }

  // Update payment record
  paymentRecord.razorpayPaymentId = razorpay_payment_id;
  paymentRecord.status = "captured";
  await paymentRecord.save();

  // Mark order as paid
  const linkedOrder = await Order.findById(paymentRecord.orderId);
  if (!linkedOrder) {
    return res.status(404).json({ message: "Linked order not found." });
  }

  linkedOrder.paymentStatus = "paid";
  await linkedOrder.save();

  // Deduct stock — use bulkWrite for atomicity
  const stockUpdates = linkedOrder.items.map((item) => ({
    updateOne: {
      filter: { _id: item.productId, stock: { $gte: item.quantity } },
      update: { $inc: { stock: -item.quantity } },
    },
  }));

  const bulkResult = await Product.bulkWrite(stockUpdates);

  if (bulkResult.modifiedCount < linkedOrder.items.length) {
    // Log mismatch but don't fail — order is paid, handle manually if needed
    console.warn(
      `Stock deduction mismatch for order ${linkedOrder._id}:`,
      `expected ${linkedOrder.items.length}, modified ${bulkResult.modifiedCount}`,
    );
  }

  res.status(200).json({ status: "success", orderId: linkedOrder._id });
});
