const Product = require('../models/productModel');

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
  const { name, price, stock } = req.body;

  if (!name || !price || !stock) {
    return res.status(400).json({ message: 'Por favor, proporcione todos los campos requeridos' });
  }

  // Convertir precio a número y manejar punto de miles
  let parsedPrice;
  if (typeof price === 'string') {
    parsedPrice = parseFloat(price.replace(/\./g, '').replace(',', '.'));
  } else if (typeof price === 'number') {
    parsedPrice = price;
  } else {
    return res.status(400).json({ message: 'El precio debe ser un número o una cadena válida' });
  }

  const newProduct = new Product({ name, price: parsedPrice, stock });

  try {
    await newProduct.save();
    // Formatear precio con punto de miles
    newProduct.price = newProduct.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;

  if (!name || !price || !stock) {
    return res.status(400).json({ message: 'Por favor, proporcione todos los campos requeridos' });
  }

  let parsedPrice;
  if (typeof price === 'string') {
    parsedPrice = parseFloat(price.replace(/\./g, '').replace(',', '.'));
  } else if (typeof price === 'number') {
    parsedPrice = price;
  } else {
    return res.status(400).json({ message: 'El precio debe ser un número o una cadena válida' });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, { name, price: parsedPrice, stock }, { new: true });
    // Formatear precio con punto de miles
    updatedProduct.price = updatedProduct.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


