const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');
const Service = require('../models/Service');

// @desc    Create feedback for a service
// @route   POST /api/feedbacks/:serviceId
// @access  Private (Customer only)
exports.createFeedback = async (req, res) => {
  try {
    const { text } = req.body;
    const serviceId = req.params.serviceId;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Please provide feedback text' });
    }

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ success: false, message: 'Invalid service ID' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const feedback = await Feedback.create({
      text,
      service: serviceId,
      provider: service.provider,
      customer: req.user._id // Using _id correctly
    });

    res.status(201).json({
      success: true,
      data: feedback
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get feedbacks for logged in provider
// @route   GET /api/feedbacks/provider
// @access  Private (Provider only)
exports.getProviderFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ provider: req.user._id }) // Use _id
      .populate({ path: 'customer', select: 'name email' })
      .populate({ path: 'service', select: 'title' })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get feedbacks for a specific service
// @route   GET /api/feedbacks/service/:serviceId
// @access  Public
exports.getServiceFeedbacks = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.serviceId)) {
      return res.status(200).json({ success: true, count: 0, data: [] }); // Return empty for invalid IDs instead of 500
    }

    const feedbacks = await Feedback.find({ service: req.params.serviceId })
      .populate({ path: 'customer', select: 'name' })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
