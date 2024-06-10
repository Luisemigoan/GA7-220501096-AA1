// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Obtener todos los productos
router.get('/', productController.getAllProducts);

// Crear un nuevo producto
router.post('/', productController.createProduct);

// Actualizar un producto existente
router.put('/:id', productController.updateProduct);

// Eliminar un producto existente
router.delete('/:id', productController.deleteProduct);

module.exports = router;

