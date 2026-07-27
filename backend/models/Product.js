const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [120, 'Product name must be under 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description must be under 2000 characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    categories: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one category must be selected',
      },
    },
  },
  { timestamps: true }
);

// Case-insensitive uniqueness safeguard + fast search on name
productSchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
// Speeds up category-based filtering (products belonging to any of N categories)
productSchema.index({ categories: 1 });

module.exports = mongoose.model('Product', productSchema);
