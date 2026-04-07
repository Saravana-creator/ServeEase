const express = require('express');
const {
  createFeedback,
  getProviderFeedbacks,
  getServiceFeedbacks,
  getMyFeedbacks,
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/:serviceId', protect, authorize('customer'), createFeedback);
router.get('/provider', protect, authorize('provider'), getProviderFeedbacks);
router.get('/my-reviews', protect, authorize('customer'), getMyFeedbacks);
router.get('/service/:serviceId', getServiceFeedbacks);

module.exports = router;
