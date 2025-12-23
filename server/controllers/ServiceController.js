const ServiceService = require('../services/ServiceService');

class ServiceController {
  /**
   * @route   GET /api/services
   * @desc    Get all services
   * @access  Public
   */
  async getAllServices(req, res) {
    try {
      const { page, limit, sortBy, order } = req.query;
      const options = { page, limit, sortBy, order };
      
      const result = await ServiceService.getAllServices(options);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Services retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Get services error:', error);
      
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: error.message || 'An error occurred while retrieving services',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * @route   GET /api/services/:id
   * @desc    Get service by ID
   * @access  Public
   */
  async getServiceById(req, res) {
    try {
      const service = await ServiceService.getServiceById(req.params.id);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Service retrieved successfully',
        data: { service }
      });
    } catch (error) {
      console.error('Get service error:', error);
      
      const statusCode = error.message === 'Service not found' ? 404 : 500;
      
      return res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || 'An error occurred while retrieving service',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * @route   POST /api/services
   * @desc    Create new service
   * @access  Private (Admin only)
   */
  async createService(req, res) {
    try {
      const service = await ServiceService.createService(req.body);

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Service created successfully',
        data: { service }
      });
    } catch (error) {
      console.error('Create service error:', error);
      
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: error.message || 'An error occurred while creating service',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * @route   PUT /api/services/:id
   * @desc    Update service
   * @access  Private (Admin only)
   */
  async updateService(req, res) {
    try {
      const service = await ServiceService.updateService(req.params.id, req.body);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Service updated successfully',
        data: { service }
      });
    } catch (error) {
      console.error('Update service error:', error);
      
      const statusCode = error.message === 'Service not found' ? 404 : 400;
      
      return res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || 'An error occurred while updating service',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * @route   DELETE /api/services/:id
   * @desc    Delete service (soft delete)
   * @access  Private (Admin only)
   */
  async deleteService(req, res) {
    try {
      const service = await ServiceService.deleteService(req.params.id);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Service deleted successfully',
        data: { service }
      });
    } catch (error) {
      console.error('Delete service error:', error);
      
      const statusCode = error.message === 'Service not found' ? 404 : 500;
      
      return res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || 'An error occurred while deleting service',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new ServiceController();
