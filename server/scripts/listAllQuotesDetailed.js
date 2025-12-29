/**
 * Script to list all quotes from the database with detailed information
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Quote = require('../models/Quote');
const User = require('../models/User');
const Service = require('../models/Service');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
    console.log('Database:', mongoose.connection.name);
    console.log('');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Main function to list all quotes
const listAllQuotes = async () => {
  try {
    await connectDB();

    // Fetch all quotes with populated user and service data
    const quotes = await Quote.find({})
      .populate('userId', 'firstName lastName email phone userType')
      .populate('serviceId', 'title description')
      .sort({ createdAt: -1 })
      .lean();

    console.log('='.repeat(100));
    console.log(`TOTAL QUOTES FOUND: ${quotes.length}`);
    console.log('='.repeat(100));
    console.log('');

    if (quotes.length === 0) {
      console.log('No quotes found in the database.');
    } else {
      quotes.forEach((quote, index) => {
        console.log(`QUOTE #${index + 1}`);
        console.log('-'.repeat(100));
        console.log(`Quote ID:           ${quote._id}`);
        console.log(`Short ID:           #${quote._id.toString().slice(-6)}`);
        console.log('');
        
        // User Information
        if (quote.userId) {
          console.log('CUSTOMER INFORMATION:');
          console.log(`  Name:             ${quote.userId.firstName} ${quote.userId.lastName}`);
          console.log(`  Email:            ${quote.userId.email}`);
          console.log(`  Phone:            ${quote.userId.phone || 'N/A'}`);
          console.log(`  User Type:        ${quote.userId.userType}`);
        } else {
          console.log('CUSTOMER INFORMATION: User not found or deleted');
        }
        console.log('');

        // Service Information
        if (quote.serviceId) {
          console.log('SERVICE REQUESTED:');
          console.log(`  Title:            ${quote.serviceId.title}`);
          console.log(`  Description:      ${quote.serviceId.description}`);
        } else {
          console.log('SERVICE REQUESTED:  Service not found or deleted');
        }
        console.log('');

        // Moving From Address
        console.log('MOVING FROM:');
        console.log(`  Street:           ${quote.fromStreetAddress}`);
        console.log(`  City:             ${quote.fromCity}`);
        console.log(`  State:            ${quote.fromState}`);
        console.log(`  Zip Code:         ${quote.fromZipCode}`);
        console.log(`  Full Address:     ${quote.fromStreetAddress}, ${quote.fromCity}, ${quote.fromState} ${quote.fromZipCode}`);
        console.log('');

        // Moving To Address
        console.log('MOVING TO:');
        console.log(`  Street:           ${quote.toStreetAddress}`);
        console.log(`  City:             ${quote.toCity}`);
        console.log(`  State:            ${quote.toState}`);
        console.log(`  Zip Code:         ${quote.toZipCode}`);
        console.log(`  Full Address:     ${quote.toStreetAddress}, ${quote.toCity}, ${quote.toState} ${quote.toZipCode}`);
        console.log('');

        // Move Details
        console.log('MOVE DETAILS:');
        console.log(`  Move Date:        ${new Date(quote.moveDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}`);
        console.log(`  Status:           ${quote.status.toUpperCase()}`);
        console.log(`  Estimated Price:  ${quote.estimatedPrice ? `$${quote.estimatedPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'Not yet estimated'}`);
        console.log('');

        // Admin Notes
        if (quote.notes) {
          console.log('ADMIN NOTES:');
          console.log(`  ${quote.notes}`);
          console.log('');
        }

        // Timestamps
        console.log('TIMESTAMPS:');
        console.log(`  Submitted On:     ${new Date(quote.createdAt).toLocaleString('en-US')}`);
        console.log(`  Last Updated:     ${new Date(quote.updatedAt).toLocaleString('en-US')}`);
        console.log('');

        console.log('='.repeat(100));
        console.log('');
      });

      // Summary Statistics
      console.log('');
      console.log('SUMMARY STATISTICS');
      console.log('='.repeat(100));
      
      const statusCounts = quotes.reduce((acc, quote) => {
        acc[quote.status] = (acc[quote.status] || 0) + 1;
        return acc;
      }, {});

      console.log('Quotes by Status:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`  ${status.charAt(0).toUpperCase() + status.slice(1)}: ${count}`);
      });
      console.log('');

      const totalEstimated = quotes.reduce((sum, quote) => {
        return sum + (quote.estimatedPrice || 0);
      }, 0);

      const quotesWithPrice = quotes.filter(q => q.estimatedPrice).length;
      
      console.log('Price Information:');
      console.log(`  Quotes with Estimated Price: ${quotesWithPrice} of ${quotes.length}`);
      console.log(`  Total Estimated Revenue:     $${totalEstimated.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
      if (quotesWithPrice > 0) {
        console.log(`  Average Estimated Price:     $${(totalEstimated / quotesWithPrice).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
      }
      console.log('');

      // Most common routes
      const routes = quotes.reduce((acc, quote) => {
        const route = `${quote.fromCity}, ${quote.fromState} → ${quote.toCity}, ${quote.toState}`;
        acc[route] = (acc[route] || 0) + 1;
        return acc;
      }, {});

      console.log('Most Common Routes:');
      Object.entries(routes)
        .sort((a, b) => b[1] - a[1])
        .forEach(([route, count]) => {
          console.log(`  ${route}: ${count} quote${count > 1 ? 's' : ''}`);
        });
      console.log('');

      console.log('='.repeat(100));
    }

  } catch (error) {
    console.error('Error fetching quotes:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
listAllQuotes();
