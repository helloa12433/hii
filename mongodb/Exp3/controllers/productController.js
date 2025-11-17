const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching products', 
      error: error.message 
    });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ 
      category: category 
    });
    
    if (products.length === 0) {
      return res.status(404).json({ 
        message: `No products found in category: ${category}` 
      });
    }
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching products by category', 
      error: error.message 
    });
  }
};

// Get products by color (nested variant field)
exports.getProductsByColor = async (req, res) => {
  try {
    const { color } = req.params;
    const products = await Product.find({ 
      'variants.color': color 
    });
    
    if (products.length === 0) {
      return res.status(404).json({ 
        message: `No products found with color: ${color}` 
      });
    }
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching products by color', 
      error: error.message 
    });
  }
};

// Project specific variant details
exports.getProductVariants = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .select('name variants');
    
    if (!product) {
      return res.status(404).json({ 
        message: 'Product not found' 
      });
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching product variants', 
      error: error.message 
    });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error creating product', 
      error: error.message 
    });
  }
};

// Update product variant stock
exports.updateVariantStock = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const { stock } = req.body;
    
    const product = await Product.findOneAndUpdate(
      { 
        _id: productId, 
        'variants._id': variantId 
      },
      { 
        $set: { 'variants.$.stock': stock } 
      },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ 
        message: 'Product or variant not found' 
      });
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating variant stock', 
      error: error.message 
    });
  }
};
