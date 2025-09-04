const express = require('express');
const router = express.Router();
const productLogisticsController = require('../controllers/productLogisticsController');

// Get all products with logistics info
router.get('/', productLogisticsController.getAllProductsWithLogistics);

// Get products by warehouse
router.get('/warehouse/:warehouse', productLogisticsController.getProductsByWarehouse);

// Get products that require special handling
router.get('/special-handling', productLogisticsController.getSpecialHandlingProducts);

// Get logistics info for a specific product
router.get('/product/:productId', productLogisticsController.getLogisticsInfo);

// Create logistics info for a product
router.post('/product/:productId', productLogisticsController.createLogisticsInfo);

// Update logistics info for a product
router.put('/product/:productId', productLogisticsController.updateLogisticsInfo);

// Delete logistics info for a product
router.delete('/product/:productId', productLogisticsController.deleteLogisticsInfo);

module.exports = router;

// Made with Bob
