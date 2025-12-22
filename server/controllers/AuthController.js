const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

class AuthController {
  /**
   * @route   POST /api/auth/login
   * @desc    Login user and return JWT token
   * @access  Public
   */
  async login(req, res) {
    try {
      const { email, password, userType } = req.body;

      // Validate input
      if (!email || !password || !userType) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Please provide email, password, and user type'
        });
      }

      // Find user by email and include password field
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'Invalid email or password'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: 'Account is inactive. Please contact support.'
        });
      }

      // Verify user type matches
      if (user.userType !== userType.toLowerCase()) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'Invalid user type selected'
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = generateToken({
        id: user._id,
        email: user.email,
        userType: user.userType
      });

      // Return success response with token and user data
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userType: user.userType,
            fullName: user.fullName,
            phone: user.phone,
            streetAddress: user.streetAddress,
            city: user.city,
            state: user.state,
            zipCode: user.zipCode
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'An error occurred during login',
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
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: 'User not found'
        });
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'User retrieved successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userType: user.userType,
            fullName: user.fullName,
            phone: user.phone,
            streetAddress: user.streetAddress,
            city: user.city,
            state: user.state,
            zipCode: user.zipCode
          }
        }
      });
    } catch (error) {
      console.error('Get current user error:', error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'An error occurred while retrieving user',
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
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Logout successful'
    });
  }
}

module.exports = new AuthController();
