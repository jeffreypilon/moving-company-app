const UserRepository = require('../repositories/UserRepository');
const { generateToken } = require('../utils/jwt');

/**
 * AuthService - Business logic layer for Authentication
 * Contains all authentication-related business logic
 */
class AuthService {
  /**
   * Authenticate user and generate JWT token
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @param {string} credentials.userType - User type (admin/customer)
   * @returns {Promise<Object>} Token and user data
   */
  async login(credentials) {
    const { email, password, userType } = credentials;

    // Validate input
    if (!email || !password || !userType) {
      throw new Error('Please provide email, password, and user type');
    }

    // Find user by email (with password field included)
    const user = await UserRepository.findByEmailWithDocument(email, true);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is inactive. Please contact support.');
    }

    // Verify user type matches
    if (user.userType !== userType.toLowerCase()) {
      throw new Error('Invalid user type selected');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
      userType: user.userType
    });

    // Update last login timestamp (optional - fire and forget)
    UserRepository.updateLastLogin(user._id).catch(err => 
      console.error('Failed to update last login:', err)
    );

    // Return token and user data (excluding password)
    return {
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
    };
  }

  /**
   * Get current user by ID
   * @param {string} userId - User ID from JWT token
   * @returns {Promise<Object>} User data
   */
  async getCurrentUser(userId) {
    const user = await UserRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
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
    };
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Token and user data
   */
  async register(userData) {
    // Check if user already exists
    const exists = await UserRepository.existsByEmail(userData.email);
    if (exists) {
      throw new Error('Email already registered');
    }

    // Create user
    const user = await UserRepository.create(userData);

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      userType: user.userType
    });

    return {
      token,
      user
    };
  }

  /**
   * Logout user (placeholder for future token blacklist implementation)
   * @returns {Promise<Object>} Success message
   */
  async logout() {
    // In the future, you could implement token blacklisting here
    // For now, logout is handled client-side by removing the token
    return { message: 'Logout successful' };
  }
}

module.exports = new AuthService();
