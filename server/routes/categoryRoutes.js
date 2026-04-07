const express = require('express');
const { 
  getCategories, 
  getAdminCategories,
  createCategory,
  approveCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCategories);
router.get('/all', protect, authorize('admin'), getAdminCategories);
router.post('/', protect, authorize('provider', 'admin'), createCategory);
router.put('/:id/approve', protect, authorize('admin'), approveCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;
