const express = require('express');
const router = express.Router();
const {
  createService, getServices, getServiceById,
  updateService, deleteService, getMyServices,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createServiceRules, updateServiceRules,
  serviceQueryRules, userIdParamRules,
} = require('../middleware/validators');
const { param } = require('express-validator');

const serviceIdParam = [param('id').isMongoId().withMessage('Invalid service ID')];

router.get('/', serviceQueryRules, validate, getServices);
router.get('/mine', protect, authorize('provider'), getMyServices);
router.get('/new', getServices); // Allow fetching new services via query params or separate logic if needed, but for now reuse getServices
router.get('/:id', serviceIdParam, validate, getServiceById);
router.post('/', protect, authorize('provider'), createServiceRules, validate, createService);
router.put('/:id', protect, authorize('provider', 'admin'), serviceIdParam, updateServiceRules, validate, updateService);
router.delete('/:id', protect, authorize('provider', 'admin'), serviceIdParam, validate, deleteService);

module.exports = router;
