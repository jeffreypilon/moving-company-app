const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Service = require('../models/Service');
const Quote = require('../models/Quote');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moving-company')
  .then(async () => {
    console.log('MongoDB connected');
    
    const quotes = await Quote.find({})
      .populate('userId', 'firstName lastName email')
      .populate('serviceId', 'title')
      .lean();
    
    console.log('\n=== All Quotes in Database ===\n');
    console.log('Total Quotes:', quotes.length);
    console.log('\n');
    
    if (quotes.length === 0) {
      console.log('No quotes found in database.');
    } else {
      quotes.forEach((quote, index) => {
        console.log(`Quote #${index + 1}:`);
        console.log('  ID:', quote._id);
        console.log('  User:', quote.userId 
          ? `${quote.userId.firstName} ${quote.userId.lastName} (${quote.userId.email})` 
          : 'N/A');
        console.log('  Service:', quote.serviceId ? quote.serviceId.title : 'N/A');
        console.log('  From:', `${quote.fromStreetAddress}, ${quote.fromCity}, ${quote.fromState} ${quote.fromZipCode}`);
        console.log('  To:', `${quote.toStreetAddress}, ${quote.toCity}, ${quote.toState} ${quote.toZipCode}`);
        console.log('  Move Date:', new Date(quote.moveDate).toLocaleDateString());
        console.log('  Status:', quote.status);
        console.log('  Estimated Price:', quote.estimatedPrice || 'Not set');
        console.log('  Created:', new Date(quote.createdAt).toLocaleString());
        console.log('  Updated:', new Date(quote.updatedAt).toLocaleString());
        console.log('');
      });
    }
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
