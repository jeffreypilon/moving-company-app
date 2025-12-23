const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/users/admins
 * @desc    Get all admin users (public)
 * @access  Public
 */
router.get('/admins', UserController.getAdminUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private/Admin
 */
router.get('/:id', authenticate, authorize('admin'), UserController.getUserById);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get('/', authenticate, authorize('admin'), UserController.getAllUsers);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private/Admin
 */
router.put('/:id', authenticate, authorize('admin'), UserController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
router.delete('/:id', authenticate, authorize('admin'), UserController.deleteUser);

module.exports = router;
