const Service = require('../models/Service');

const createService = async (req, res) => {
  const { title, description, category, price, location } = req.body;
  if (!title || !description || !category || !price || !location)
    return res.status(400).json({ message: 'All fields are required' });

  const service = await Service.create({
    title, description, category,
    price: Number(price), location,
    provider: req.user._id,
  });
  await service.populate('provider', 'name email');
  res.status(201).json(service);
};

const getServices = async (req, res) => {
  const { category, location, minPrice, maxPrice } = req.query;
  const filter = {};
  if (category) filter.category = { $regex: category, $options: 'i' };
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  const services = await Service.find(filter)
    .populate('provider', 'name email')
    .sort({ createdAt: -1 });
  res.json(services);
};

const getServiceById = async (req, res) => {
  const service = await Service.findById(req.params.id).populate('provider', 'name email');
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.json(service);
};

const updateService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found' });
  if (String(service.provider) !== String(req.user._id) && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden' });

  const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('provider', 'name email');
  res.json(updated);
};

const deleteService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found' });
  if (String(service.provider) !== String(req.user._id) && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden' });

  await service.deleteOne();
  res.json({ message: 'Service deleted' });
};

const getMyServices = async (req, res) => {
  const services = await Service.find({ provider: req.user._id })
    .populate('provider', 'name email')
    .sort({ createdAt: -1 });
  res.json(services);
};

module.exports = { createService, getServices, getServiceById, updateService, deleteService, getMyServices };
