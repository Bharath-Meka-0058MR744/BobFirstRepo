const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/productInventoryController');

// Update product inventory (increase or decrease stock)
router.put('/products/:id/inventory', inventoryController.updateInventory);

// Get low stock products
router.get('/low-stock', inventoryController.getLowStockProducts);

// Check if product is in stock
router.get('/products/:id/stock', inventoryController.checkProductStock);

module.exports = router;

// Made with Bob