const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true, trim: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

serviceSchema.index({ title: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model('Service', serviceSchema);
