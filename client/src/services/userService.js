import apiClient from './apiClient';

class UserService {
  /**
   * Get all admin users
   * @returns {Promise<Object>} Admin users list
   */
  async getAdminUsers() {
    try {
      const response = await apiClient.get('/users/admins');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all users (admin only)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Users list
   */
  async getAllUsers(params = {}) {
    try {
      const response = await apiClient.get('/users', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(userId, userData) {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Delete confirmation
   */
  async deleteUser(userId) {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
