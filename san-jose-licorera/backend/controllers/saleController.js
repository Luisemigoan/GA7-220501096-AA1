const Sale = require('../models/saleModel');

// Obtener todas las ventas
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('products.productId');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear una venta
// Modificar el controlador de ventas para procesar la cantidad de productos seleccionada
exports.createSale = async (req, res) => {
  const { tableNumber, salesItems, total } = req.body;

  if (!tableNumber || !salesItems || !total) {
    return res.status(400).json({ message: 'Por favor, proporcione todos los campos requeridos' });
  }

  const newSale = new Sale({ tableNumber, salesItems, total });

  try {
    await newSale.save();
    res.status(201).json(newSale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generar un informe de ventas diario
exports.generateDailySalesReport = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const dailySales = await Sale.find({ createdAt: { $gte: startOfDay, $lt: endOfDay } });
    res.json(dailySales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generar un informe de ventas semanal
exports.generateWeeklySalesReport = async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1); // Obtener el lunes de esta semana
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (7 - today.getDay())); // Obtener el domingo de esta semana
    const weeklySales = await Sale.find({ createdAt: { $gte: startOfWeek, $lte: endOfWeek } });
    res.json(weeklySales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generar un informe de ventas mensual
exports.generateMonthlySalesReport = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Obtener el primer día de este mes
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Obtener el último día de este mes
    const monthlySales = await Sale.find({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } });
    res.json(monthlySales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generar un informe de ventas por producto
exports.generateProductSalesReport = async (req, res) => {
  const productId = req.params.productId;

  try {
    const productSales = await Sale.find({ 'products.productId': productId });
    res.json(productSales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Otros métodos adicionales según las necesidades de tu aplicación

