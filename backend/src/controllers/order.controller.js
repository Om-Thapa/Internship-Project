const Order = require("../models/Order");
const Product = require("../models/Product");
const catchAsync = require("../utils/catchAsync");

exports.createOrder = catchAsync(async (req, res) => {
  const { items, shippingAddress } = req.body;
  if (!items || items.length === 0)
    return res
      .status(400)
      .json({ message: "Detials are empty." });

  let computedSubtotal = 0;
  const processedItems = [];

  for (const item of items) {
    const dbProduct = await Product.findOne({ id: item.id });
    if (!dbProduct)
      return res
        .status(404)
        .json({ message: `Product mismatch: ${item.name} for key: ${item.id}` });
    if (dbProduct.stock < item.quantity)
      return res
        .status(400)
        .json({
          message: `Insufficient inventory configuration for structural node: ${dbProduct.name}`,
        });

    computedSubtotal += dbProduct.price * item.quantity;
    processedItems.push({
      productId: dbProduct._id,
      quantity: item.quantity,
      price: dbProduct.price,
    });
  }

  const shippingCost = computedSubtotal > 500 ? 0 : 50;
  const grandTotal = computedSubtotal + shippingCost;

  const order = await Order.create({
    userId: req.user._id,
    items: processedItems,
    subtotal: computedSubtotal,
    shipping: shippingCost,
    total: grandTotal,
    shippingAddress,
  });

  res.status(201).json(order);
});

exports.getMyOrders = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ userId: req.user._id })
    .populate("items.productId")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments({ userId: req.user._id });

  res
    .status(200)
    .json({ orders, total, page, pages: Math.ceil(total / limit) });
});

exports.getOrderById = catchAsync(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    userId: req.user._id,
  }).populate("items.productId");
  if (!order)
    return res
      .status(404)
      .json({ message: "Order reference unverified or missing." });
  res.status(200).json(order);
});
