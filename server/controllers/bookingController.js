const Booking = require('../models/Booking');
const Service = require('../models/Service');

// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, amount, paymentMethod } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    // Prevent duplicate active bookings for same service
    const existingBooking = await Booking.findOne({
      customer: req.user._id,
      service: serviceId,
      status: { $in: ['confirmed', 'completed'] }
    });

    if (existingBooking) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already booked this service.' 
      });
    }

    const booking = await Booking.create({
      customer: req.user._id,
      service: serviceId,
      provider: service.provider,
      amount,
      paymentMethod
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/bookings/my-bookings (Customer)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('service', 'title category price location description')
      .populate('provider', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/bookings/provider-inquiries (Provider)
exports.getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id })
      .populate('service', 'title')
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/bookings/:id/complete (Customer)
exports.completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    if (String(booking.customer) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only customer can complete' });
    }

    booking.status = 'completed';
    await booking.save();
    
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
