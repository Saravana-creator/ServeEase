const User = require('../models/User');

// GET /api/users — all users
const getUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};

// PUT /api/users/:id/role — change role
const updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['customer', 'provider', 'admin'].includes(role))
    return res.status(400).json({ message: 'Invalid role' });

  if (String(req.params.id) === String(req.user._id))
    return res.status(400).json({ message: 'Cannot change your own role' });

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('-password');

  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  if (String(req.params.id) === String(req.user._id))
    return res.status(400).json({ message: 'Cannot delete yourself' });

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
};

module.exports = { getUsers, updateUserRole, deleteUser };
