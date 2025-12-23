const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/ServiceController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/services
 * @desc    Get all services
 * @access  Public
 */
router.get('/', ServiceController.getAllServices);

/**
 * @route   GET /api/services/:id
 * @desc    Get service by ID
 * @access  Public
 */
router.get('/:id', ServiceController.getServiceById);

/**
 * @route   POST /api/services
 * @desc    Create new service
 * @access  Private (Admin only)
 */
router.post('/', authenticate, authorize('admin'), ServiceController.createService);

/**
 * @route   PUT /api/services/:id
 * @desc    Update service
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, authorize('admin'), ServiceController.updateService);

/**
 * @route   DELETE /api/services/:id
 * @desc    Delete service
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, authorize('admin'), ServiceController.deleteService);

module.exports = router;
