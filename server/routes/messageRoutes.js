const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, replyMessage, updateMessageStatus } = require('../controllers/messageController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { sendMessageRules } = require('../middleware/validators');

router.post('/', protect, authorize('customer'), sendMessageRules, validate, sendMessage);
router.get('/', protect, authorize('customer', 'provider', 'admin'), getMessages);
router.put('/:id/reply', protect, authorize('provider'), replyMessage);
router.patch('/:id/status', protect, authorize('provider'), updateMessageStatus);

module.exports = router;
