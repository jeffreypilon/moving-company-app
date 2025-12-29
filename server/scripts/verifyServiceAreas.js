/**
 * Script to verify service areas in the database
 */

require('dotenv').config();
const mongoose = require('mongoose');
const ServiceArea = require('../models/ServiceArea');

async function verifyServiceAreas() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Get all service areas
    const areas = await ServiceArea.find().sort('stateName');
    
    console.log('=== SERVICE AREAS VERIFICATION ===\n');
    console.log(`Total states: ${areas.length}`);
    console.log(`Active states: ${areas.filter(a => a.isActive).length}`);
    console.log(`Inactive states: ${areas.filter(a => !a.isActive).length}`);
    
    console.log('\n=== ALL STATES ===');
    areas.forEach(state => {
      console.log(`${state.stateCode} - ${state.stateName.padEnd(20)} [${state.isActive ? '✓ Active' : '○ Inactive'}]`);
    });
    
    // Close connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the script
verifyServiceAreas();
