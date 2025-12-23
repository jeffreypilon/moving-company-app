import apiClient from './apiClient';

class ServiceService {
  /**
   * Get all services
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Services list
   */
  async getAllServices(params = {}) {
    try {
      const response = await apiClient.get('/services', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get service by ID
   * @param {string} serviceId - Service ID
   * @returns {Promise<Object>} Service data
   */
  async getServiceById(serviceId) {
    try {
      const response = await apiClient.get(`/services/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new service
   * @param {Object} serviceData - Service data
   * @returns {Promise<Object>} Created service
   */
  async createService(serviceData) {
    try {
      const response = await apiClient.post('/services', serviceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update service
   * @param {string} serviceId - Service ID
   * @param {Object} serviceData - Updated service data
   * @returns {Promise<Object>} Updated service
   */
  async updateService(serviceId, serviceData) {
    try {
      const response = await apiClient.put(`/services/${serviceId}`, serviceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete service
   * @param {string} serviceId - Service ID
   * @returns {Promise<Object>} Deleted service
   */
  async deleteService(serviceId) {
    try {
      const response = await apiClient.delete(`/services/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const serviceService = new ServiceService();
export default serviceService;
