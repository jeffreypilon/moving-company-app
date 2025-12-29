import apiClient from './apiClient';

class ServiceAreaService {
  /**
   * Get all service areas (admin only)
   */
  async getAllServiceAreas() {
    return await apiClient.get('/service-areas');
  }

  /**
   * Get service area by state code (admin only)
   */
  async getServiceAreaByStateCode(stateCode) {
    return await apiClient.get(`/service-areas/${stateCode}`);
  }

  /**
   * Get active service areas (public)
   */
  async getActiveServiceAreas() {
    return await apiClient.get('/service-areas/active');
  }

  /**
   * Create service area (admin only)
   */
  async createServiceArea(serviceAreaData) {
    return await apiClient.post('/service-areas', serviceAreaData);
  }

  /**
   * Update service area (admin only)
   */
  async updateServiceArea(stateCode, updateData) {
    return await apiClient.put(`/service-areas/${stateCode}`, updateData);
  }

  /**
   * Toggle service area status (admin only)
   */
  async toggleServiceAreaStatus(stateCode) {
    return await apiClient.patch(`/service-areas/${stateCode}/toggle`);
  }

  /**
   * Delete service area (admin only)
   */
  async deleteServiceArea(stateCode) {
    return await apiClient.delete(`/service-areas/${stateCode}`);
  }

  /**
   * Initialize all continental US states (admin only)
   */
  async initializeStates() {
    return await apiClient.post('/service-areas/initialize');
  }
}

export default new ServiceAreaService();
