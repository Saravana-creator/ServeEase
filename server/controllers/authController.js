const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = async (user) => {
  const jti = crypto.randomUUID(); // unique per login
  await User.findByIdAndUpdate(user._id, { tokenId: jti });
  return jwt.sign(
    { id: user._id, role: user.role, jti },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const signup = async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  if (!name || !email || !password || !confirmPassword)
    return res.status(400).json({ message: 'All fields are required' });

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match' });

  if (await User.findOne({ email }))
    return res.status(409).json({ message: 'Email already in use' });

  const allowedRoles = ['customer', 'provider'];
  const assignedRole = allowedRoles.includes(role) ? role : 'customer';

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed, role: assignedRole });

  const token = await signToken(user);
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = await signToken(user);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

const getMe = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  if (!name?.trim() || !email?.trim())
    return res.status(400).json({ message: 'Name and email are required' });

  const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { name: name.trim(), email: email.trim() },
    { new: true }
  ).select('-password');
  res.json({ id: updated._id, name: updated.name, email: updated.email, role: updated.role });
};

module.exports = { signup, login, getMe, updateProfile };
