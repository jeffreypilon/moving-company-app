const QuoteRepository = require('../repositories/QuoteRepository');

class QuoteService {
  /**
   * Get all quotes with pagination and filtering
   */
  async getAllQuotes(options) {
    const filters = {};
    
    if (options.status) {
      filters.status = options.status;
    }
    
    if (options.userId) {
      filters.userId = options.userId;
    }
    
    const result = await QuoteRepository.findAll({ ...options, filters });
    
    return {
      quotes: result.quotes,
      pagination: {
        currentPage: result.page,
        totalPages: Math.ceil(result.total / result.limit),
        totalItems: result.total,
        itemsPerPage: result.limit
      }
    };
  }

  /**
   * Get quote by ID
   */
  async getQuoteById(quoteId) {
    const quote = await QuoteRepository.findById(quoteId);
    
    if (!quote) {
      throw new Error('Quote not found');
    }
    
    return quote;
  }

  /**
   * Get quotes by user ID
   */
  async getQuotesByUserId(userId, options) {
    const result = await QuoteRepository.findByUserId(userId, options);
    
    return {
      quotes: result.quotes,
      pagination: {
        currentPage: result.page,
        totalPages: Math.ceil(result.total / result.limit),
        totalItems: result.total,
        itemsPerPage: result.limit
      }
    };
  }

  /**
   * Create new quote
   */
  async createQuote(quoteData) {
    // Validate move date is in the future
    const moveDate = new Date(quoteData.moveDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (moveDate < today) {
      throw new Error('Move date must be in the future');
    }
    
    return await QuoteRepository.create(quoteData);
  }

  /**
   * Update quote
   */
  async updateQuote(quoteId, updateData) {
    const quote = await QuoteRepository.findById(quoteId);
    
    if (!quote) {
      throw new Error('Quote not found');
    }
    
    // If updating move date, validate it's in the future
    if (updateData.moveDate) {
      const moveDate = new Date(updateData.moveDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (moveDate < today) {
        throw new Error('Move date must be in the future');
      }
    }
    
    return await QuoteRepository.update(quoteId, updateData);
  }

  /**
   * Delete quote
   */
  async deleteQuote(quoteId) {
    const quote = await QuoteRepository.delete(quoteId);
    
    if (!quote) {
      throw new Error('Quote not found');
    }
    
    return quote;
  }

  /**
   * Get quotes statistics
   */
  async getQuoteStats() {
    return await QuoteRepository.getStats();
  }
}

module.exports = new QuoteService();
