const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getProviderBookings, completeBooking } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/provider', protect, authorize('provider', 'admin'), getProviderBookings);
router.patch('/:id/complete', protect, authorize('customer'), completeBooking);

module.exports = router;
