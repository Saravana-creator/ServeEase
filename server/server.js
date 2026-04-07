require('dotenv').config();
const bcrypt = require('bcryptjs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false, // Disable CSP in dev for external images/CDNs
}));

// ── CORS — explicit whitelist ─────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin && process.env.NODE_ENV !== 'production') return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parser & Logging ─────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

// ── Rate limiting ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many requests from this IP, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increased to accommodate dashboard polling and multiple concurrent requests
  message: { message: 'Too many requests from this IP, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/services', apiLimiter, require('./routes/serviceRoutes'));
app.use('/api/messages', apiLimiter, require('./routes/messageRoutes'));
app.use('/api/feedbacks', apiLimiter, require('./routes/feedbackRoutes'));
app.use('/api/users', apiLimiter, require('./routes/userRoutes'));
app.use('/api/categories', apiLimiter, require('./routes/categoryRoutes'));
app.use('/api/bookings', apiLimiter, require('./routes/bookingRoutes'));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  if (err.message?.startsWith('CORS:'))
    return res.status(403).json({ message: err.message });
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

// Connect DB and then seed data and start server
connectDB().then(async () => {
    // Auto-create default admin user if it doesn't exist
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@serveease.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin_secret_123';
    
    const adminExists = await User.findOne({ email: ADMIN_EMAIL });
    if (!adminExists) {
      const hashedAdminPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await User.create({
        name: 'Super Admin',
        email: ADMIN_EMAIL,
        password: hashedAdminPassword,
        role: 'admin' // Create directly as admin
      });
      console.log(`Default admin created with email: ${ADMIN_EMAIL}`);
    }

    // Auto-create default approved categories
    const defaultCategories = ['Plumbing', 'Electrician', 'Cleaning', 'Carpentry', 'Painting', 'Appliance Repair'];
    
    for (const catName of defaultCategories) {
      const exists = await Category.findOne({ name: catName });
      if (!exists) {
        await Category.create({ name: catName, approved: true });
        console.log(`Default category created: ${catName}`);
      }
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`));
});
