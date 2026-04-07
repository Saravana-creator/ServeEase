const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a service title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a service description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a service price'],
    },
    location: {
      type: String,
      required: [true, 'Please add a service location'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Please assign a valid category'],
    },
    provider: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add text indexes for searching title and location
serviceSchema.index({ title: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model('Service', serviceSchema);
