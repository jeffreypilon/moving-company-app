const express = require('express');
const router = express.Router();
const QuoteController = require('../controllers/QuoteController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes (none for quotes)

// Protected routes - require authentication
router.post('/', authenticate, QuoteController.createQuote);
router.get('/user/my-quotes', authenticate, QuoteController.getMyQuotes);

// Admin routes
router.get('/stats', authenticate, authorize('admin'), QuoteController.getQuoteStats);
router.get('/', authenticate, authorize('admin'), QuoteController.getAllQuotes);
router.get('/:id', authenticate, QuoteController.getQuoteById);
router.put('/:id', authenticate, authorize('admin'), QuoteController.updateQuote);
router.delete('/:id', authenticate, authorize('admin'), QuoteController.deleteQuote);

module.exports = router;
