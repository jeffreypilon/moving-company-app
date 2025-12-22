const AuthService = require('../services/AuthService');

class AuthController {
  /**
   * @route   POST /api/auth/login
   * @desc    Login user and return JWT token
   * @access  Public
   */
  async login(req, res) {
    try {
      const result = await AuthService.login(req.body);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error cases
      const statusCode = error.message.includes('Invalid') || 
                        error.message.includes('inactive') ? 401 : 500;
      
      return res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || 'An error occurred during login',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * @route   GET /api/auth/me
   * @desc    Get current logged in user
   * @access  Private
   */
  async getCurrentUser(req, res) {
    try {
      const user = await AuthService.getCurrentUser(req.user.id);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'User retrieved successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Get current user error:', error);
      
      const statusCode = error.message === 'User not found' ? 404 : 500;
      
      return res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || 'An error occurred while retrieving user',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * @route   POST /api/auth/logout
   * @desc    Logout user (client-side token removal)
   * @access  Private
   */
  async logout(req, res) {
    try {
      await AuthService.logout();
      
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'An error occurred during logout'
      });
    }
  }

  /**
   * @route   POST /api/auth/register
   * @desc    Register new user
   * @access  Public
   */
  async register(req, res) {
    try {
      const result = await AuthService.register(req.body);

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      const statusCode = error.message.includes('already') ? 409 : 400;
      
      return res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || 'An error occurred during registration',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new AuthController();
