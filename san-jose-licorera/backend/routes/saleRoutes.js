// backend/routes/saleRoutes.js
const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

router.get('/', saleController.getAllSales);
router.post('/', saleController.createSale);
// Additional routes for generating reports, etc.

module.exports = router;