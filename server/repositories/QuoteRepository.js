const Quote = require('../models/Quote');

class QuoteRepository {
  /**
   * Find all quotes with pagination and filtering
   */
  async findAll(options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', filters = {} } = options;
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
    
    const [quotes, total] = await Promise.all([
      Quote.find(filters)
        .populate('userId', 'firstName lastName email')
        .populate('serviceId', 'title')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Quote.countDocuments(filters)
    ]);
    
    return { quotes, total, page, limit };
  }

  /**
   * Find quote by ID
   */
  async findById(quoteId) {
    return await Quote.findById(quoteId)
      .populate('userId', 'firstName lastName email phone')
      .populate('serviceId', 'title description')
      .lean();
  }

  /**
   * Find quotes by user ID
   */
  async findByUserId(userId, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
    
    const [quotes, total] = await Promise.all([
      Quote.find({ userId })
        .populate('serviceId', 'title')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Quote.countDocuments({ userId })
    ]);
    
    return { quotes, total, page, limit };
  }

  /**
   * Create new quote
   */
  async create(quoteData) {
    const quote = new Quote(quoteData);
    await quote.save();
    return await this.findById(quote._id);
  }

  /**
   * Update quote by ID
   */
  async update(quoteId, updateData) {
    return await Quote.findByIdAndUpdate(
      quoteId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('userId', 'firstName lastName email')
      .populate('serviceId', 'title')
      .lean();
  }

  /**
   * Delete quote by ID
   */
  async delete(quoteId) {
    return await Quote.findByIdAndDelete(quoteId);
  }

  /**
   * Count quotes by status
   */
  async countByStatus(status) {
    return await Quote.countDocuments({ status });
  }

  /**
   * Get quotes statistics
   */
  async getStats() {
    const stats = await Quote.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    return stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});
  }
}

module.exports = new QuoteRepository();
