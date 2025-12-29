const express = require('express');
const router = express.Router();
const ServiceAreaController = require('../controllers/ServiceAreaController');
const { authenticate, authorize } = require('../middleware/auth');

// Initialize states (admin only) - MUST be before /:stateCode routes
router.post('/initialize', authenticate, authorize('admin'), ServiceAreaController.initializeStates);

// Get active service areas (public)
router.get('/active', ServiceAreaController.getActiveServiceAreas);

// Get all service areas (admin only)
router.get('/', authenticate, authorize('admin'), ServiceAreaController.getAllServiceAreas);

// Get service area by state code (admin only)
router.get('/:stateCode', authenticate, authorize('admin'), ServiceAreaController.getServiceAreaByStateCode);

// Create service area (admin only)
router.post('/', authenticate, authorize('admin'), ServiceAreaController.createServiceArea);

// Update service area (admin only)
router.put('/:stateCode', authenticate, authorize('admin'), ServiceAreaController.updateServiceArea);

// Toggle service area status (admin only)
router.patch('/:stateCode/toggle', authenticate, authorize('admin'), ServiceAreaController.toggleServiceAreaStatus);

// Delete service area (admin only)
router.delete('/:stateCode', authenticate, authorize('admin'), ServiceAreaController.deleteServiceArea);

module.exports = router;
