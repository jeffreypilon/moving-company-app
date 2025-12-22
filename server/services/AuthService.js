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
   * @returns {Promise<Object>} User data (no token - user must login)
   */
  async register(userData) {
    // Check if email already exists
    const emailExists = await UserRepository.existsByEmail(userData.email);
    if (emailExists) {
      throw new Error('Email address is already registered');
    }

    // Check if first name and last name combination already exists
    const nameExists = await UserRepository.existsByName(
      userData.firstName,
      userData.lastName
    );
    if (nameExists) {
      throw new Error('A user with this first name and last name combination already exists');
    }

    // Set default userType to 'customer' if not provided
    const userDataWithDefaults = {
      ...userData,
      userType: userData.userType || 'customer',
      isActive: true
    };

    // Create user (password will be hashed by the User model pre-save hook)
    const user = await UserRepository.create(userDataWithDefaults);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        userType: user.userType,
        phone: user.phone,
        streetAddress: user.streetAddress,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode
      }
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
