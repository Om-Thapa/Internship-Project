const Order = require("../models/Order");
const Product = require("../models/Product");
const catchAsync = require("../utils/catchAsync");

// ── Business rules (keep in sync with frontend constants) ──────────────────
const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 50;
const DISCOUNT_THRESHOLD = 299;
const DISCOUNT_AMOUNT = 50;

// ── Validate checkout data (used by payment controller before order creation) ──
exports.validateCheckoutData = catchAsync(
  async (userId, items, shippingAddress, paymentMethod) => {
    if (!items || items.length === 0) {
      throw new Error("Cart is empty.");
    }

    // Only online payment is supported
    if (paymentMethod !== "online") {
      throw new Error("Only online payment via Razorpay is supported.");
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
        throw new Error(`Shipping address missing: ${field}`);
      }
    }

    let computedSubtotal = 0;
    const processedItems = [];

    for (const item of items) {
      // Validate each cart item against the real DB product
      const dbProduct = await Product.findOne({ id: item.id });

      if (!dbProduct) {
        throw new Error(`Product not found: ${item.name || item.id}`);
      }

      if (dbProduct.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for "${dbProduct.name}". Available: ${dbProduct.stock}`,
        );
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
    const discount =
      computedSubtotal >= DISCOUNT_THRESHOLD ? DISCOUNT_AMOUNT : 0;
    const grandTotal = computedSubtotal + shippingCost - discount;

    return {
      processedItems,
      subtotal: computedSubtotal,
      shippingCost,
      discount,
      grandTotal,
    };
  },
);

// ── Create order (ONLY called after successful payment verification) ────────
exports.createOrderAfterPayment = catchAsync(
  async (userId, items, shippingAddress, paymentMethod) => {
    // Validate checkout data again (security)
    const validation = await exports.validateCheckoutData(
      userId,
      items,
      shippingAddress,
      paymentMethod,
    );

    const order = await Order.create({
      userId,
      items: validation.processedItems,
      subtotal: validation.subtotal,
      shipping: validation.shippingCost,
      discount: validation.discount,
      total: validation.grandTotal,
      shippingAddress,
      paymentMethod: "online",
      paymentStatus: "pending",
      orderStatus: "processing",
    });

    return order;
  },
);

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
