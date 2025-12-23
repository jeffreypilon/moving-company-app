import apiClient from './apiClient';

class QuoteService {
  /**
   * Create a new quote
   */
  async createQuote(quoteData) {
    return await apiClient.post('/quotes', quoteData);
  }

  /**
   * Get all quotes (admin only)
   */
  async getAllQuotes(params = {}) {
    return await apiClient.get('/quotes', { params });
  }

  /**
   * Get quote by ID
   */
  async getQuoteById(quoteId) {
    return await apiClient.get(`/quotes/${quoteId}`);
  }

  /**
   * Get current user's quotes
   */
  async getMyQuotes(params = {}) {
    return await apiClient.get('/quotes/user/my-quotes', { params });
  }

  /**
   * Update quote (admin only)
   */
  async updateQuote(quoteId, updateData) {
    return await apiClient.put(`/quotes/${quoteId}`, updateData);
  }

  /**
   * Delete quote (admin only)
   */
  async deleteQuote(quoteId) {
    return await apiClient.delete(`/quotes/${quoteId}`);
  }

  /**
   * Get quote statistics (admin only)
   */
  async getQuoteStats() {
    return await apiClient.get('/quotes/stats');
  }
}

export default new QuoteService();
