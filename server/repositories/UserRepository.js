const User = require('../models/User');

/**
 * UserRepository - Data access layer for User model
 * Handles all database operations for users
 */
class UserRepository {
  /**
   * Find all users with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Users array with pagination info
   */
  async findAll(options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', filters = {} } = options;
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
    
    const [users, total] = await Promise.all([
      User.find(filters)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filters)
    ]);
    
    return { users, total, page, limit };
  }

  /**
   * Find user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} User object or null
   */
  async findById(userId) {
    return await User.findById(userId).select('-password').lean();
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @param {boolean} includePassword - Whether to include password field
   * @returns {Promise<Object|null>} User object or null
   */
  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email: email.toLowerCase() });
    
    if (includePassword) {
      query.select('+password');
    } else {
      query.select('-password');
    }
    
    return await query.lean();
  }

  /**
   * Find user by email (returns Mongoose document, not plain object)
   * @param {string} email - User email
   * @param {boolean} includePassword - Whether to include password field
   * @returns {Promise<Object|null>} User document or null
   */
  async findByEmailWithDocument(email, includePassword = false) {
    const query = User.findOne({ email: email.toLowerCase() });
    
    if (includePassword) {
      query.select('+password');
    }
    
    return await query;
  }

  /**
   * Find users by user type
   * @param {string} userType - User type ('admin' or 'customer')
   * @returns {Promise<Array>} Array of users
   */
  async findByUserType(userType) {
    return await User.find({ userType, isActive: true })
      .select('firstName lastName email phone photoFilename')
      .sort({ firstName: 1, lastName: 1 })
      .lean();
  }

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async create(userData) {
    const user = new User(userData);
    await user.save();
    return user.toJSON();
  }

  /**
   * Update user by ID
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated user or null
   */
  async update(userId, updateData) {
    return await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password').lean();
  }

  /**
   * Delete user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Deleted user or null
   */
  async delete(userId) {
    return await User.findByIdAndDelete(userId).select('-password');
  }

  /**
   * Check if user exists by email
   * @param {string} email - User email
   * @returns {Promise<boolean>} True if user exists
   */
  async existsByEmail(email) {
    return !!(await User.exists({ email: email.toLowerCase() }));
  }

  /**
   * Check if user exists by first name and last name combination
   * @param {string} firstName - User first name
   * @param {string} lastName - User last name
   * @returns {Promise<boolean>} True if user exists with this name combination
   */
  async existsByName(firstName, lastName) {
    return !!(await User.exists({ 
      firstName: firstName.trim(),
      lastName: lastName.trim()
    }));
  }

  /**
   * Count users by filter
   * @param {Object} filter - Query filter
   * @returns {Promise<number>} Count of users
   */
  async count(filter = {}) {
    return await User.countDocuments(filter);
  }

  /**
   * Update user's last login timestamp
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Updated user or null
   */
  async updateLastLogin(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { lastLoginAt: new Date() },
      { new: true }
    ).select('-password').lean();
  }
}

module.exports = new UserRepository();
