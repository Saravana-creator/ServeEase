const Message = require('../models/Message');
const Service = require('../models/Service');

// POST /api/messages — customer sends inquiry
const sendMessage = async (req, res) => {
  const { serviceId, content } = req.body;
  if (!serviceId || !content?.trim())
    return res.status(400).json({ message: 'serviceId and content are required' });

  const service = await Service.findById(serviceId);
  if (!service) return res.status(404).json({ message: 'Service not found' });

  if (String(service.provider) === String(req.user._id))
    return res.status(400).json({ message: 'Cannot message yourself' });

  // Prevent duplicate inquiries for the same service
  const existingMessage = await Message.findOne({
    sender: req.user._id,
    service: serviceId,
    status: { $in: ['pending', 'accepted'] }
  });

  if (existingMessage) {
    return res.status(400).json({ 
      success: false, 
      message: 'You already have an active inquiry for this service.' 
    });
  }

  const message = await Message.create({
    sender: req.user._id,
    receiver: service.provider,
    service: serviceId,
    content: content.trim(),
  });

  await message.populate([
    { path: 'sender', select: 'name email' },
    { path: 'receiver', select: 'name email' },
    { path: 'service', select: 'title' },
  ]);

  res.status(201).json({ success: true, data: message });
};

// GET /api/messages — provider views messages sent to them
const getMessages = async (req, res) => {
  let query = {};

  if (req.user.role === 'provider') {
    query.receiver = req.user._id;
  } else if (req.user.role === 'customer') {
    query.sender = req.user._id;
  }
  // admin sees all (no filter)

  const messages = await Message.find(query)
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .populate('service', 'title')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: messages.length, data: messages });
};

// PUT /api/messages/:id/reply — provider replies
const replyMessage = async (req, res) => {
  const { replyContent, status } = req.body;
  const message = await Message.findById(req.params.id);
  if (!message) return res.status(404).json({ message: 'Message not found' });

  if (String(message.receiver) !== String(req.user._id))
    return res.status(403).json({ message: 'Only receiver can reply' });

  message.replyContent = replyContent || message.replyContent;
  if (status) message.status = status;
  await message.save();
  await message.populate([
    { path: 'sender', select: 'name email' },
    { path: 'receiver', select: 'name email' },
    { path: 'service', select: 'title' },
  ]);

  res.json({ success: true, data: message });
};

// PATCH /api/messages/:id/status — accept/reject job
const updateMessageStatus = async (req, res) => {
  const { status } = req.body;
  const message = await Message.findById(req.params.id);
  if (!message) return res.status(404).json({ message: 'Message not found' });

  if (String(message.receiver) !== String(req.user._id))
    return res.status(403).json({ message: 'Only receiver can update status' });

  message.status = status;
  await message.save();
  res.json({ success: true, data: message });
};

module.exports = { sendMessage, getMessages, replyMessage, updateMessageStatus };
