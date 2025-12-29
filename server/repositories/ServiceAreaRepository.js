const ServiceArea = require('../models/ServiceArea');

class ServiceAreaRepository {
  /**
   * Find all service areas
   */
  async findAll() {
    return await ServiceArea.find({}).sort({ stateName: 1 }).lean();
  }

  /**
   * Find service area by state code
   */
  async findByStateCode(stateCode) {
    return await ServiceArea.findOne({ stateCode: stateCode.toUpperCase() }).lean();
  }

  /**
   * Find all active service areas
   */
  async findActive() {
    return await ServiceArea.find({ isActive: true }).sort({ stateName: 1 }).lean();
  }

  /**
   * Create service area
   */
  async create(serviceAreaData) {
    const serviceArea = new ServiceArea(serviceAreaData);
    await serviceArea.save();
    return serviceArea.toJSON();
  }

  /**
   * Update service area by state code
   */
  async updateByStateCode(stateCode, updateData) {
    return await ServiceArea.findOneAndUpdate(
      { stateCode: stateCode.toUpperCase() },
      updateData,
      { new: true, runValidators: true }
    ).lean();
  }

  /**
   * Toggle active status
   */
  async toggleActive(stateCode) {
    const serviceArea = await ServiceArea.findOne({ stateCode: stateCode.toUpperCase() });
    if (!serviceArea) {
      throw new Error('Service area not found');
    }
    serviceArea.isActive = !serviceArea.isActive;
    await serviceArea.save();
    return serviceArea.toJSON();
  }

  /**
   * Delete service area
   */
  async delete(stateCode) {
    return await ServiceArea.findOneAndDelete({ stateCode: stateCode.toUpperCase() });
  }

  /**
   * Create multiple service areas (bulk insert)
   */
  async createMany(serviceAreasData) {
    return await ServiceArea.insertMany(serviceAreasData);
  }
}

module.exports = new ServiceAreaRepository();
