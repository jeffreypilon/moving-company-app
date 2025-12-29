const ServiceAreaRepository = require('../repositories/ServiceAreaRepository');

class ServiceAreaService {
  /**
   * Get all service areas
   */
  async getAllServiceAreas() {
    return await ServiceAreaRepository.findAll();
  }

  /**
   * Get service area by state code
   */
  async getServiceAreaByStateCode(stateCode) {
    const serviceArea = await ServiceAreaRepository.findByStateCode(stateCode);
    if (!serviceArea) {
      throw new Error('Service area not found');
    }
    return serviceArea;
  }

  /**
   * Get all active service areas
   */
  async getActiveServiceAreas() {
    return await ServiceAreaRepository.findActive();
  }

  /**
   * Create service area
   */
  async createServiceArea(serviceAreaData) {
    // Check if service area already exists
    const existing = await ServiceAreaRepository.findByStateCode(serviceAreaData.stateCode);
    if (existing) {
      throw new Error('Service area for this state already exists');
    }
    
    return await ServiceAreaRepository.create(serviceAreaData);
  }

  /**
   * Update service area
   */
  async updateServiceArea(stateCode, updateData) {
    const serviceArea = await ServiceAreaRepository.updateByStateCode(stateCode, updateData);
    if (!serviceArea) {
      throw new Error('Service area not found');
    }
    return serviceArea;
  }

  /**
   * Toggle active status
   */
  async toggleServiceAreaStatus(stateCode) {
    return await ServiceAreaRepository.toggleActive(stateCode);
  }

  /**
   * Delete service area
   */
  async deleteServiceArea(stateCode) {
    const serviceArea = await ServiceAreaRepository.delete(stateCode);
    if (!serviceArea) {
      throw new Error('Service area not found');
    }
    return serviceArea;
  }

  /**
   * Initialize all continental US states
   */
  async initializeStates() {
    const continentalStates = [
      { stateCode: 'AL', stateName: 'Alabama', isActive: false },
      { stateCode: 'AZ', stateName: 'Arizona', isActive: false },
      { stateCode: 'AR', stateName: 'Arkansas', isActive: false },
      { stateCode: 'CA', stateName: 'California', isActive: false },
      { stateCode: 'CO', stateName: 'Colorado', isActive: false },
      { stateCode: 'CT', stateName: 'Connecticut', isActive: false },
      { stateCode: 'DE', stateName: 'Delaware', isActive: false },
      { stateCode: 'FL', stateName: 'Florida', isActive: false },
      { stateCode: 'GA', stateName: 'Georgia', isActive: false },
      { stateCode: 'ID', stateName: 'Idaho', isActive: false },
      { stateCode: 'IL', stateName: 'Illinois', isActive: false },
      { stateCode: 'IN', stateName: 'Indiana', isActive: false },
      { stateCode: 'IA', stateName: 'Iowa', isActive: false },
      { stateCode: 'KS', stateName: 'Kansas', isActive: false },
      { stateCode: 'KY', stateName: 'Kentucky', isActive: false },
      { stateCode: 'LA', stateName: 'Louisiana', isActive: false },
      { stateCode: 'ME', stateName: 'Maine', isActive: false },
      { stateCode: 'MD', stateName: 'Maryland', isActive: false },
      { stateCode: 'MA', stateName: 'Massachusetts', isActive: false },
      { stateCode: 'MI', stateName: 'Michigan', isActive: false },
      { stateCode: 'MN', stateName: 'Minnesota', isActive: false },
      { stateCode: 'MS', stateName: 'Mississippi', isActive: false },
      { stateCode: 'MO', stateName: 'Missouri', isActive: false },
      { stateCode: 'MT', stateName: 'Montana', isActive: false },
      { stateCode: 'NE', stateName: 'Nebraska', isActive: false },
      { stateCode: 'NV', stateName: 'Nevada', isActive: false },
      { stateCode: 'NH', stateName: 'New Hampshire', isActive: false },
      { stateCode: 'NJ', stateName: 'New Jersey', isActive: false },
      { stateCode: 'NM', stateName: 'New Mexico', isActive: false },
      { stateCode: 'NY', stateName: 'New York', isActive: false },
      { stateCode: 'NC', stateName: 'North Carolina', isActive: false },
      { stateCode: 'ND', stateName: 'North Dakota', isActive: false },
      { stateCode: 'OH', stateName: 'Ohio', isActive: false },
      { stateCode: 'OK', stateName: 'Oklahoma', isActive: false },
      { stateCode: 'OR', stateName: 'Oregon', isActive: false },
      { stateCode: 'PA', stateName: 'Pennsylvania', isActive: false },
      { stateCode: 'RI', stateName: 'Rhode Island', isActive: false },
      { stateCode: 'SC', stateName: 'South Carolina', isActive: false },
      { stateCode: 'SD', stateName: 'South Dakota', isActive: false },
      { stateCode: 'TN', stateName: 'Tennessee', isActive: false },
      { stateCode: 'TX', stateName: 'Texas', isActive: false },
      { stateCode: 'UT', stateName: 'Utah', isActive: false },
      { stateCode: 'VT', stateName: 'Vermont', isActive: false },
      { stateCode: 'VA', stateName: 'Virginia', isActive: false },
      { stateCode: 'WA', stateName: 'Washington', isActive: false },
      { stateCode: 'WV', stateName: 'West Virginia', isActive: false },
      { stateCode: 'WI', stateName: 'Wisconsin', isActive: false },
      { stateCode: 'WY', stateName: 'Wyoming', isActive: false }
    ];

    // Check if states are already initialized
    const existingStates = await ServiceAreaRepository.findAll();
    if (existingStates.length > 0) {
      throw new Error('States already initialized');
    }

    return await ServiceAreaRepository.createMany(continentalStates);
  }
}

module.exports = new ServiceAreaService();
