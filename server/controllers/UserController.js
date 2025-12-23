const UserService = require('../services/UserService');

class UserController {
  /**
   * @desc    Get all admin users
   * @route   GET /api/users/admins
   * @access  Public
   */
  getAdminUsers = async (req, res) => {
    try {
      const admins = await UserService.getAdminUsers();
      
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Admin users retrieved successfully',
        data: { users: admins }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: error.message || 'Error retrieving admin users'
      });
    }
  };

  /**
   * @desc    Get all users
   * @route   GET /api/users
   * @access  Private/Admin
   */
  getAllUsers = async (req, res) => {
    try {
      const result = await UserService.getAllUsers(req.query);
      
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Users retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: error.message || 'Error retrieving users'
      });
    }
  };

  /**
   * @desc    Get user by ID
   * @route   GET /api/users/:id
   * @access  Private/Admin
   */
  getUserById = async (req, res) => {
    try {
      const user = await UserService.getUserById(req.params.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'User retrieved successfully',
        data: { user }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: error.message || 'Error retrieving user'
      });
    }
  };

  /**
   * @desc    Update user
   * @route   PUT /api/users/:id
   * @access  Private/Admin
   */
  updateUser = async (req, res) => {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'User updated successfully',
        data: { user }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: error.message || 'Error updating user'
      });
    }
  };

  /**
   * @desc    Delete user
   * @route   DELETE /api/users/:id
   * @access  Private/Admin
   */
  deleteUser = async (req, res) => {
    try {
      const user = await UserService.deleteUser(req.params.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'User deleted successfully',
        data: { user }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: error.message || 'Error deleting user'
      });
    }
  };
}

module.exports = new UserController();
