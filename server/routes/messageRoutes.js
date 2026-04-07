const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { sendMessageRules } = require('../middleware/validators');

router.post('/', protect, authorize('customer'), sendMessageRules, validate, sendMessage);
router.get('/', protect, authorize('customer', 'provider', 'admin'), getMessages);

module.exports = router;
