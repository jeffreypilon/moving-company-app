const QuoteService = require('../services/QuoteService');

class QuoteController {
  /**
   * Get all quotes
   * GET /api/quotes
   */
  getAllQuotes = async (req, res) => {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || 'createdAt',
        order: req.query.order || 'desc',
        status: req.query.status,
        userId: req.query.userId
      };

      const result = await QuoteService.getAllQuotes(options);

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Quotes retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to retrieve quotes'
      });
    }
  };

  /**
   * Get quote by ID
   * GET /api/quotes/:id
   */
  getQuoteById = async (req, res) => {
    try {
      const quote = await QuoteService.getQuoteById(req.params.id);

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Quote retrieved successfully',
        data: { quote }
      });
    } catch (error) {
      const statusCode = error.message === 'Quote not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || 'Failed to retrieve quote'
      });
    }
  };

  /**
   * Get quotes by user ID (for logged-in user)
   * GET /api/quotes/user/my-quotes
   */
  getMyQuotes = async (req, res) => {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || 'createdAt',
        order: req.query.order || 'desc'
      };

      const result = await QuoteService.getQuotesByUserId(req.user.id, options);

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'User quotes retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to retrieve user quotes'
      });
    }
  };

  /**
   * Create new quote
   * POST /api/quotes
   */
  createQuote = async (req, res) => {
    try {
      const quoteData = {
        userId: req.user.id,
        serviceId: req.body.serviceId,
        fromStreetAddress: req.body.fromStreetAddress,
        fromCity: req.body.fromCity,
        fromState: req.body.fromState,
        fromZipCode: req.body.fromZipCode,
        toStreetAddress: req.body.toStreetAddress,
        toCity: req.body.toCity,
        toState: req.body.toState,
        toZipCode: req.body.toZipCode,
        moveDate: req.body.moveDate
      };

      const quote = await QuoteService.createQuote(quoteData);

      res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Quote created successfully',
        data: { quote }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        statusCode: 400,
        message: error.message || 'Failed to create quote'
      });
    }
  };

  /**
   * Update quote
   * PUT /api/quotes/:id
   */
  updateQuote = async (req, res) => {
    try {
      const updateData = { ...req.body };
      
      // Remove fields that shouldn't be updated by user
      delete updateData.userId;
      
      const quote = await QuoteService.updateQuote(req.params.id, updateData);

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Quote updated successfully',
        data: { quote }
      });
    } catch (error) {
      const statusCode = error.message === 'Quote not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || 'Failed to update quote'
      });
    }
  };

  /**
   * Delete quote
   * DELETE /api/quotes/:id
   */
  deleteQuote = async (req, res) => {
    try {
      await QuoteService.deleteQuote(req.params.id);

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Quote deleted successfully',
        data: null
      });
    } catch (error) {
      const statusCode = error.message === 'Quote not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || 'Failed to delete quote'
      });
    }
  };

  /**
   * Get quote statistics
   * GET /api/quotes/stats
   */
  getQuoteStats = async (req, res) => {
    try {
      const stats = await QuoteService.getQuoteStats();

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Quote statistics retrieved successfully',
        data: { stats }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to retrieve quote statistics'
      });
    }
  };
}

module.exports = new QuoteController();
