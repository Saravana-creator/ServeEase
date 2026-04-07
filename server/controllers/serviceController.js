const Service = require('../models/Service');
const Feedback = require('../models/Feedback');

const createService = async (req, res) => {
  const { title, description, category, price, location } = req.body;
  if (!title || !description || !category || !price || !location)
    return res.status(400).json({ message: 'All fields are required' });

  const service = await Service.create({
    title, description, category,
    price: Number(price), location,
    provider: req.user._id,
  });
  await service.populate([
    { path: 'provider', select: 'name email' },
    { path: 'category', select: 'name' }
  ]);
  res.status(201).json({ success: true, data: service });
};

const getServices = async (req, res) => {
  const { category, location, minPrice, maxPrice, search } = req.query;
  const filter = {};

  if (category) {
    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      filter.category = category;
    } else {
      const Category = require('../models/Category');
      const cat = await Category.findOne({ name: { $regex: category, $options: 'i' } });
      if (cat) filter.category = cat._id;
    }
  }

  if (location) filter.location = { $regex: location, $options: 'i' };
  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let services = await Service.find(filter)
    .populate('provider', 'name email')
    .populate('category', 'name')
    .sort({ createdAt: -1 });

  // Add rating stats to each service
  services = await Promise.all(services.map(async (s) => {
    const ratings = await Feedback.aggregate([
      { $match: { service: s._id } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    return {
      ...s._doc,
      avgRating: (ratings.length > 0 && ratings[0].avgRating !== null) 
        ? ratings[0].avgRating.toFixed(1) 
        : 'No reviews yet',
      reviewCount: ratings.length > 0 ? ratings[0].count : 0
    };
  }));

  res.json({ success: true, count: services.length, data: services });
};

const getServiceById = async (req, res) => {
  const service = await Service.findById(req.params.id)
    .populate('provider', 'name email')
    .populate('category', 'name');
    
  if (!service) return res.status(404).json({ message: 'Service not found' });

  const ratings = await Feedback.aggregate([
    { $match: { service: service._id } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);

  const data = {
    ...service._doc,
    avgRating: (ratings.length > 0 && ratings[0].avgRating !== null) 
      ? ratings[0].avgRating.toFixed(1) 
      : 'No reviews yet',
    reviewCount: ratings.length > 0 ? ratings[0].count : 0
  };

  res.json({ success: true, data });
};

const updateService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found' });
  if (String(service.provider) !== String(req.user._id) && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden' });

  const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('provider', 'name email')
    .populate('category', 'name');
  res.json({ success: true, data: updated });
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
    .populate('category', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: services.length, data: services });
};

module.exports = { createService, getServices, getServiceById, updateService, deleteService, getMyServices };
