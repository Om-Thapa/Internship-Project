const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  razorpayOrderId: { type: String, required: true, unique: true },
  razorpayPaymentId: { type: String },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["created", "captured", "failed"],
    default: "created",
  },
  // Store checkout data temporarily until order is created after payment success
  checkoutData: {
    userId: mongoose.Schema.Types.ObjectId,
    items: [
      {
        id: Number,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    shippingAddress: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    paymentMethod: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
