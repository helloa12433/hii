const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products
router.get('/products', productController.getAllProducts);

// Get products by category
router.get('/products/category/:category', productController.getProductsByCategory);

// Get products by color
router.get('/products/by-color/:color', productController.getProductsByColor);

// Get product variants
router.get('/products/:id/variants', productController.getProductVariants);

// Create new product
router.post('/products', productController.createProduct);

// Update variant stock
router.patch('/products/:productId/variants/:variantId/stock', 
  productController.updateVariantStock);

module.exports = router;
