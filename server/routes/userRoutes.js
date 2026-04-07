const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { updateRoleRules, userIdParamRules } = require('../middleware/validators');

router.get('/', protect, authorize('admin'), getUsers);
router.put('/:id/role', protect, authorize('admin'), updateRoleRules, validate, updateUserRole);
router.delete('/:id', protect, authorize('admin'), userIdParamRules, validate, deleteUser);

module.exports = router;
