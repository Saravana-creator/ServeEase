const Category = require('../models/Category');

// GET /api/categories — approved only (public), all for admin
const getCategories = async (req, res) => {
  const filter = req.user?.role === 'admin' ? {} : { approved: true };
  const categories = await Category.find(filter)
    .populate('suggestedBy', 'name email')
    .sort({ name: 1 });
  res.json({ success: true, count: categories.length, data: categories });
};

// POST /api/categories — admin creates (auto-approved), provider suggests (pending)
const createCategory = async (req, res) => {
  const { name } = req.body;

  const existing = await Category.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
  if (existing) return res.status(409).json({ message: 'Category already exists' });

  const isAdmin = req.user.role === 'admin';
  const category = await Category.create({
    name,
    approved: isAdmin,
    suggestedBy: isAdmin ? null : req.user._id,
  });
  res.status(201).json({ success: true, data: category });
};

// PUT /api/categories/:id/approve — admin approves a pending suggestion
const approveCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  if (category.approved) return res.status(400).json({ message: 'Category already approved' });

  category.approved = true;
  await category.save();
  res.json({ success: true, data: category });
};

// DELETE /api/categories/:id — admin only
const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Category deleted' });
};

module.exports = { getCategories, createCategory, approveCategory, deleteCategory };
