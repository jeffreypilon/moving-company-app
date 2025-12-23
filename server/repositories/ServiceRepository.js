const Service = require('../models/Service');

/**
 * ServiceRepository - Data access layer for Service
 * Handles all database operations for services
 */
class ServiceRepository {
  /**
   * Find all services with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Services and pagination info
   */
  async findAll(options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', filters = {} } = options;
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
    
    const [services, total] = await Promise.all([
      Service.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Service.countDocuments(filters)
    ]);
    
    return { services, total, page, limit };
  }

  /**
   * Find service by ID
   * @param {string} serviceId - Service ID
   * @returns {Promise<Object|null>} Service or null
   */
  async findById(serviceId) {
    return await Service.findById(serviceId).lean();
  }

  /**
   * Create new service
   * @param {Object} serviceData - Service data
   * @returns {Promise<Object>} Created service
   */
  async create(serviceData) {
    const service = new Service(serviceData);
    await service.save();
    return service.toJSON();
  }

  /**
   * Update service by ID
   * @param {string} serviceId - Service ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object|null>} Updated service or null
   */
  async update(serviceId, updateData) {
    return await Service.findByIdAndUpdate(
      serviceId,
      updateData,
      { new: true, runValidators: true }
    ).lean();
  }

  /**
   * Delete service by ID
   * @param {string} serviceId - Service ID
   * @returns {Promise<Object|null>} Deleted service or null
   */
  async delete(serviceId) {
    return await Service.findByIdAndDelete(serviceId);
  }

  /**
   * Count services by filter
   * @param {Object} filter - Query filter
   * @returns {Promise<number>} Count of services
   */
  async count(filter = {}) {
    return await Service.countDocuments(filter);
  }
}

module.exports = new ServiceRepository();
