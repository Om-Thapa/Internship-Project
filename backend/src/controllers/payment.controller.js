const crypto = require("crypto");
const razorpayInstance = require("../config/razorpay");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Product = require("../models/Product");
const orderController = require("./order.controller");
const catchAsync = require("../utils/catchAsync");

// ── Create Razorpay order ─────────────────────────────────────────────────────
// Now accepts checkout data instead of orderId
// Creates temporary payment record, order is created after payment verification
exports.createRazorpayOrder = catchAsync(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  const userId = req.user._id;

  // Validate checkout data (this will throw if invalid)
  const validation = await orderController.validateCheckoutData(
    userId,
    items,
    shippingAddress,
    paymentMethod,
  );

  const amountInPaise = Math.round(validation.grandTotal * 100);

  if (amountInPaise < 100) {
    return res
      .status(400)
      .json({ message: "Order amount too low for payment processing." });
  }

  const razorpayOrder = await razorpayInstance.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: crypto.randomBytes(10).toString("hex"), // random receipt
    notes: {
      userId: userId.toString(),
      customerEmail: req.user.email,
      paymentMethod: paymentMethod,
    },
  });

  // Create temporary payment record (order will be created after verification)
  const payment = await Payment.create({
    razorpayOrderId: razorpayOrder.id,
    amount: validation.grandTotal,
    status: "created",
    // Store checkout data in notes for later order creation
    checkoutData: {
      userId,
      items,
      shippingAddress,
      paymentMethod,
    },
  });

  res.status(201).json({
    id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  });
});

// ── Verify signature & create order ──────────────────────────────────────────
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
    // Idempotent — already processed
    return res.status(200).json({
      status: "success",
      message: "Payment already verified and order created.",
    });
  }

  // Update payment record
  paymentRecord.razorpayPaymentId = razorpay_payment_id;
  paymentRecord.status = "captured";
  await paymentRecord.save();

  // Get checkout data from payment record
  const { userId, items, shippingAddress, paymentMethod } =
    paymentRecord.checkoutData || {};

  if (!userId || !items) {
    return res.status(400).json({
      message: "Checkout data not found. Please try placing the order again.",
    });
  }

  // Create the order now that payment is verified
  const order = await orderController.createOrderAfterPayment(
    userId,
    items,
    shippingAddress,
    paymentMethod,
  );

  // Update payment record with order ID
  paymentRecord.orderId = order._id;
  await paymentRecord.save();

  // Mark order as paid
  order.paymentStatus = "paid";
  await order.save();

  // Deduct stock — use bulkWrite for atomicity
  const stockUpdates = order.items.map((item) => ({
    updateOne: {
      filter: { _id: item.productId, stock: { $gte: item.quantity } },
      update: { $inc: { stock: -item.quantity } },
    },
  }));

  const bulkResult = await Product.bulkWrite(stockUpdates);

  if (bulkResult.modifiedCount < order.items.length) {
    // Log warning but don't fail — order is already paid
    console.warn(
      `Stock deduction mismatch for order ${order._id}:`,
      `expected ${order.items.length}, modified ${bulkResult.modifiedCount}`,
    );
  }

  res.status(200).json({
    status: "success",
    orderId: order._id,
    message: "Payment successful! Your order has been created.",
  });
});
