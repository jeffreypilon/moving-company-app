const UserRepository = require('../repositories/UserRepository');

/**
 * UserService - Business logic layer for User operations
 * Contains all business logic related to users
 */
class UserService {
  /**
   * Get all users with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Users with pagination metadata
   */
  async getAllUsers(options) {
    const filters = { isActive: true };
    
    // Add additional filters if provided
    if (options.userType) {
      filters.userType = options.userType;
    }
    
    const result = await UserRepository.findAll({ ...options, filters });
    
    return {
      users: result.users,
      pagination: {
        currentPage: result.page,
        totalPages: Math.ceil(result.total / result.limit),
        totalItems: result.total,
        itemsPerPage: result.limit
      }
    };
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User object
   */
  async getUserById(userId) {
    const user = await UserRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User object
   */
  async getUserByEmail(email) {
    const user = await UserRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    // Check if user already exists
    const exists = await UserRepository.existsByEmail(userData.email);
    if (exists) {
      throw new Error('Email already exists');
    }
    
    // Additional business logic can be added here
    // For example: validate phone format, check if city is in service area, etc.
    
    return await UserRepository.create(userData);
  }

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(userId, updateData) {
    // Don't allow updating sensitive fields through this method
    delete updateData.password;
    delete updateData.userType;
    
    const user = await UserRepository.update(userId, updateData);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  /**
   * Delete user (soft delete by setting isActive to false)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated user
   */
  async deleteUser(userId) {
    const user = await UserRepository.update(userId, { isActive: false });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  /**
   * Hard delete user (permanently remove from database)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Deleted user
   */
  async hardDeleteUser(userId) {
    const user = await UserRepository.delete(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  /**
   * Get user statistics
   * @returns {Promise<Object>} User statistics
   */
  async getUserStats() {
    const [totalUsers, activeUsers, adminCount, customerCount] = await Promise.all([
      UserRepository.count(),
      UserRepository.count({ isActive: true }),
      UserRepository.count({ userType: 'admin', isActive: true }),
      UserRepository.count({ userType: 'customer', isActive: true })
    ]);
    
    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      adminCount,
      customerCount
    };
  }
}

module.exports = new UserService();
