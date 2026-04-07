const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Please add some text'],
    },
    service: {
      type: mongoose.Schema.ObjectId,
      ref: 'Service',
      required: true,
    },
    provider: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
