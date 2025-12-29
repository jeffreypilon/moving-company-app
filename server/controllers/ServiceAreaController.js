const ServiceAreaService = require('../services/ServiceAreaService');

class ServiceAreaController {
  /**
   * Get all service areas
   * GET /api/service-areas
   */
  getAllServiceAreas = async (req, res) => {
    try {
      const serviceAreas = await ServiceAreaService.getAllServiceAreas();

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Service areas retrieved successfully',
        data: { serviceAreas }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to retrieve service areas'
      });
    }
  };

  /**
   * Get service area by state code
   * GET /api/service-areas/:stateCode
   */
  getServiceAreaByStateCode = async (req, res) => {
    try {
      const serviceArea = await ServiceAreaService.getServiceAreaByStateCode(req.params.stateCode);

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Service area retrieved successfully',
        data: { serviceArea }
      });
    } catch (error) {
      const statusCode = error.message === 'Service area not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || 'Failed to retrieve service area'
      });
    }
  };

  /**
   * Get active service areas
   * GET /api/service-areas/active
   */
  getActiveServiceAreas = async (req, res) => {
    try {
      const serviceAreas = await ServiceAreaService.getActiveServiceAreas();

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Active service areas retrieved successfully',
        data: { serviceAreas }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to retrieve active service areas'
      });
    }
  };

  /**
   * Create service area
   * POST /api/service-areas
   */
  createServiceArea = async (req, res) => {
    try {
      const serviceArea = await ServiceAreaService.createServiceArea(req.body);

      res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Service area created successfully',
        data: { serviceArea }
      });
    } catch (error) {
      const statusCode = error.message.includes('already exists') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || 'Failed to create service area'
      });
    }
  };

  /**
   * Update service area
   * PUT /api/service-areas/:stateCode
   */
  updateServiceArea = async (req, res) => {
    try {
      const serviceArea = await ServiceAreaService.updateServiceArea(
        req.params.stateCode,
        req.body
      );

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Service area updated successfully',
        data: { serviceArea }
      });
    } catch (error) {
      const statusCode = error.message === 'Service area not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || 'Failed to update service area'
      });
    }
  };

  /**
   * Toggle service area status
   * PATCH /api/service-areas/:stateCode/toggle
   */
  toggleServiceAreaStatus = async (req, res) => {
    try {
      const serviceArea = await ServiceAreaService.toggleServiceAreaStatus(req.params.stateCode);

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: `Service area ${serviceArea.isActive ? 'activated' : 'deactivated'} successfully`,
        data: { serviceArea }
      });
    } catch (error) {
      const statusCode = error.message === 'Service area not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || 'Failed to toggle service area status'
      });
    }
  };

  /**
   * Delete service area
   * DELETE /api/service-areas/:stateCode
   */
  deleteServiceArea = async (req, res) => {
    try {
      await ServiceAreaService.deleteServiceArea(req.params.stateCode);

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Service area deleted successfully'
      });
    } catch (error) {
      const statusCode = error.message === 'Service area not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || 'Failed to delete service area'
      });
    }
  };

  /**
   * Initialize all continental US states
   * POST /api/service-areas/initialize
   */
  initializeStates = async (req, res) => {
    try {
      const serviceAreas = await ServiceAreaService.initializeStates();

      res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'States initialized successfully',
        data: { count: serviceAreas.length, serviceAreas }
      });
    } catch (error) {
      const statusCode = error.message.includes('already initialized') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || 'Failed to initialize states'
      });
    }
  };
}

module.exports = new ServiceAreaController();
