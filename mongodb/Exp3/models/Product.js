const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Apparel', 'Footwear', 'Electronics', 'Accessories']
  },
  variants: [variantSchema]
}, { 
  timestamps: true
});

// Indexes
productSchema.index({ category: 1 });
productSchema.index({ 'variants.color': 1 });

module.exports = mongoose.model('Product', productSchema);
