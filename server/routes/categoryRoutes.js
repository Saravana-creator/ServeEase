const express = require('express');
const router = express.Router();
const { getCategories, createCategory, approveCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createCategoryRules, categoryIdParamRules } = require('../middleware/validators');

// GET — public (approved only) or admin (all)
router.get('/', (req, res, next) => {
  // optional auth — attach user if token present, don't block if absent
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) return protect(req, res, next);
  next();
}, getCategories);

// Backward compatibility for AdminDashboard frontend expecting /all
router.get('/all', protect, authorize('admin'), getCategories);

// POST — admin (auto-approved) or provider (suggested, pending)
router.post('/', protect, authorize('admin', 'provider'), createCategoryRules, validate, createCategory);

// PUT /:id/approve — admin only
router.put('/:id/approve', protect, authorize('admin'), categoryIdParamRules, validate, approveCategory);

// DELETE /:id — admin only
router.delete('/:id', protect, authorize('admin'), categoryIdParamRules, validate, deleteCategory);

module.exports = router;
