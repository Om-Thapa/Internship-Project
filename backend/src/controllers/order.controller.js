const Order = require("../models/Order");
const Product = require("../models/Product");
const catchAsync = require("../utils/catchAsync");

// ── Business rules (keep in sync with frontend constants) ──────────────────
const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 50;
const DISCOUNT_THRESHOLD = 299;
const DISCOUNT_AMOUNT = 50;

// ── Create order ────────────────────────────────────────────────────────────
exports.createOrder = catchAsync(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Cart is empty." });
  }

  // Validate payment method
  const validMethods = ["online", "cod"];
  if (!paymentMethod || !validMethods.includes(paymentMethod)) {
    return res.status(400).json({
      message: `Invalid payment method. Must be one of: ${validMethods.join(", ")}`,
    });
  }

  // Validate shipping address fields
  const required = [
    "fullName",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "pincode",
  ];
  for (const field of required) {
    if (!shippingAddress?.[field]) {
      return res
        .status(400)
        .json({ message: `Shipping address missing: ${field}` });
    }
  }

  let computedSubtotal = 0;
  const processedItems = [];

  for (const item of items) {
    // Validate each cart item against the real DB product
    const dbProduct = await Product.findOne({ id: item.id });

    if (!dbProduct) {
      return res.status(404).json({
        message: `Product not found: ${item.name || item.id}`,
      });
    }

    if (dbProduct.stock < item.quantity) {
      return res.status(400).json({
        message: `Insufficient stock for "${dbProduct.name}". Available: ${dbProduct.stock}`,
      });
    }

    // Always use server-side price — never trust client price
    computedSubtotal += dbProduct.price * item.quantity;

    processedItems.push({
      productId: dbProduct._id,
      quantity: item.quantity,
      price: dbProduct.price, // authoritative price from DB
    });
  }

  // Pricing rules
  const shippingCost =
    computedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const discount = computedSubtotal >= DISCOUNT_THRESHOLD ? DISCOUNT_AMOUNT : 0;
  const grandTotal = computedSubtotal + shippingCost - discount;

  // COD orders skip Razorpay entirely — stock is deducted immediately since
  // there's no payment gateway to deduct it after verification.
  // Online orders keep stock untouched until payment.controller verifies payment.
  if (paymentMethod === "cod") {
    const stockUpdates = processedItems.map((item) => ({
      updateOne: {
        filter: { _id: item.productId, stock: { $gte: item.quantity } },
        update: { $inc: { stock: -item.quantity } },
      },
    }));
    const bulkResult = await Product.bulkWrite(stockUpdates);

    if (bulkResult.modifiedCount < processedItems.length) {
      return res.status(409).json({
        message:
          "One or more items went out of stock while placing your order. Please review your cart.",
      });
    }
  }

  const order = await Order.create({
    userId: req.user._id,
    items: processedItems,
    subtotal: computedSubtotal,
    shipping: shippingCost,
    discount,
    total: grandTotal,
    shippingAddress,
    paymentMethod,
    // COD orders stay "pending" until delivery — admin marks "paid" on collection.
    // Online orders stay "pending" until Razorpay signature verification succeeds.
    paymentStatus: "pending",
    orderStatus: "processing",
  });

  res.status(201).json(order);
});

// ── Get my orders (paginated) ────────────────────────────────────────────────
exports.getMyOrders = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 50); // cap at 50
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ userId: req.user._id })
      .populate("items.productId", "name image price slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ userId: req.user._id }),
  ]);

  res.status(200).json({
    orders,
    total,
    page,
    pages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  });
});

// ── Get single order ──────────────────────────────────────────────────────────
exports.getOrderById = catchAsync(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    userId: req.user._id, // user can only fetch their own orders
  })
    .populate("items.productId", "name image price slug")
    .lean();

  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  res.status(200).json(order);
});
