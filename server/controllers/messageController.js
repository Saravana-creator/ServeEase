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

  res.status(201).json(message);
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

  res.json(messages);
};

module.exports = { sendMessage, getMessages };
