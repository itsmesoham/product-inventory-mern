const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { name, description, quantity, categories } = req.body;

    // Confirm every category id actually exists before saving
    const foundCategories = await Category.find({ _id: { $in: categories } });
    if (foundCategories.length !== new Set(categories).size) {
      return res.status(400).json({ success: false, message: 'One or more categories do not exist' });
    }

    // Case-insensitive duplicate check for a friendlier error than the raw index error
    const existing = await Product.findOne({ name }).collation({ locale: 'en', strength: 2 });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A product with this name already exists' });
    }

    const product = await Product.create({ name, description, quantity, categories });
    const populated = await product.populate('categories', 'name');

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// GET /api/products?page=&limit=&search=&categories=id1,id2
const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.search) {
      filter.name = { $regex: req.query.search.trim(), $options: 'i' };
    }

    if (req.query.categories) {
      const ids = req.query.categories
        .split(',')
        .map((id) => id.trim())
        .filter((id) => mongoose.Types.ObjectId.isValid(id));
      if (ids.length > 0) {
        // Product matches if it belongs to ANY of the selected categories
        filter.categories = { $in: ids };
      }
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('categories', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted', data: { _id: product._id } });
  } catch (err) {
    next(err);
  }
};

module.exports = { createProduct, getProducts, deleteProduct };
