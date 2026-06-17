const crypto = require("crypto");
const razorpayInstance = require("../config/razorpay");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Product = require("../models/Product");
const catchAsync = require("../utils/catchAsync");

exports.createRazorpayOrder = catchAsync(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order)
    return res.status(404).json({ message: "Order structure missing." });

  const options = {
    amount: Math.round(order.total * 100), // convert to paisa
    currency: "INR",
    receipt: order._id.toString(),
  };

  const razorpayOrder = await razorpayInstance.orders.create(options);

  await Payment.create({
    orderId: order._id,
    razorpayOrderId: razorpayOrder.id,
    amount: order.total,
  });

  res.status(201).json(razorpayOrder);
});

exports.verifySignature = catchAsync(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const expectedSignature = shasum.digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res
      .status(400)
      .json({ message: "Signature forgery fallback triggered." });
  }

  const paymentRecord = await Payment.findOne({
    razorpayOrderId: razorpay_order_id,
  });
  if (!paymentRecord)
    return res
      .status(404)
      .json({ message: "Transaction tracking ledger unindexed." });

  paymentRecord.razorpayPaymentId = razorpay_payment_id;
  paymentRecord.status = "captured";
  await paymentRecord.save();

  const linkedOrder = await Order.findById(paymentRecord.orderId);
  linkedOrder.paymentStatus = "paid";
  await linkedOrder.save();

  // Deduct inventory dynamically
  for (const element of linkedOrder.items) {
    await Product.findByIdAndUpdate(element.productId, {
      $inc: { stock: -element.quantity },
    });
  }

  res.status(200).json({ status: "success", orderId: linkedOrder._id });
});
