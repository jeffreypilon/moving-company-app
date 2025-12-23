const ServiceRepository = require('../repositories/ServiceRepository');

/**
 * ServiceService - Business logic layer for Services
 * Contains all service-related business logic
 */
class ServiceService {
  /**
   * Get all services with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Services and pagination info
   */
  async getAllServices(options = {}) {
    const filters = { isActive: true };
    
    const result = await ServiceRepository.findAll({ ...options, filters });
    
    return {
      services: result.services,
      pagination: {
        currentPage: result.page,
        totalPages: Math.ceil(result.total / result.limit),
        totalItems: result.total,
        itemsPerPage: result.limit
      }
    };
  }

  /**
   * Get service by ID
   * @param {string} serviceId - Service ID
   * @returns {Promise<Object>} Service data
   */
  async getServiceById(serviceId) {
    const service = await ServiceRepository.findById(serviceId);
    
    if (!service) {
      throw new Error('Service not found');
    }
    
    return service;
  }

  /**
   * Create new service
   * @param {Object} serviceData - Service data
   * @returns {Promise<Object>} Created service
   */
  async createService(serviceData) {
    // Set default isActive to true if not provided
    const serviceDataWithDefaults = {
      ...serviceData,
      isActive: serviceData.isActive !== undefined ? serviceData.isActive : true
    };
    
    const service = await ServiceRepository.create(serviceDataWithDefaults);
    
    return service;
  }

  /**
   * Update service
   * @param {string} serviceId - Service ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated service
   */
  async updateService(serviceId, updateData) {
    const service = await ServiceRepository.update(serviceId, updateData);
    
    if (!service) {
      throw new Error('Service not found');
    }
    
    return service;
  }

  /**
   * Delete service (soft delete by setting isActive to false)
   * @param {string} serviceId - Service ID
   * @returns {Promise<Object>} Updated service
   */
  async deleteService(serviceId) {
    const service = await ServiceRepository.update(serviceId, { isActive: false });
    
    if (!service) {
      throw new Error('Service not found');
    }
    
    return service;
  }

  /**
   * Hard delete service (permanently remove from database)
   * @param {string} serviceId - Service ID
   * @returns {Promise<Object>} Deleted service
   */
  async hardDeleteService(serviceId) {
    const service = await ServiceRepository.delete(serviceId);
    
    if (!service) {
      throw new Error('Service not found');
    }
    
    return service;
  }

  /**
   * Get service statistics
   * @returns {Promise<Object>} Service stats
   */
  async getServiceStats() {
    const [total, active, inactive] = await Promise.all([
      ServiceRepository.count(),
      ServiceRepository.count({ isActive: true }),
      ServiceRepository.count({ isActive: false })
    ]);
    
    return { total, active, inactive };
  }
}

module.exports = new ServiceService();
