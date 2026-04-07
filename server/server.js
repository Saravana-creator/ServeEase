const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes Placeholder
app.get('/', (req, res) => {
  res.send('ServeEase API is running...');
});

// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const User = require('./models/User');

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');
    
    // Auto-create default admin user if it doesn't exist
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@serveease.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin_secret_123';
    
    const adminExists = await User.findOne({ email: ADMIN_EMAIL });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin' // Create directly as admin
      });
      console.log(`Default admin created with email: ${ADMIN_EMAIL}`);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
