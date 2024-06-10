const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  }],
  total: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Sale', saleSchema);

