const Product = require("../models/Product");
const catchAsync = require("../utils/catchAsync");

exports.getProducts = catchAsync(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
});

exports.getProductBySlug = catchAsync(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product)
    return res
      .status(404)
      .json({ message: "Product configuration not located." });
  res.status(200).json(product);
});

exports.createProduct = catchAsync(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

exports.updateProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product)
    return res.status(404).json({ message: "Configuration object absent." });
  res.status(200).json(product);
});

exports.deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product)
    return res.status(404).json({ message: "Configuration target unindexed." });
  res.status(204).json(null);
});
