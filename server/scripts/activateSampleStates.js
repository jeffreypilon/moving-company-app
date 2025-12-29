/**
 * Script to activate sample states for testing Quick Quote validation
 */

require('dotenv').config();
const mongoose = require('mongoose');
const ServiceArea = require('../models/ServiceArea');

async function activateSampleStates() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // States to activate (California, Texas, New York, Florida, Illinois)
    const statesToActivate = ['CA', 'TX', 'NY', 'FL', 'IL'];

    // Activate the states
    const result = await ServiceArea.updateMany(
      { stateCode: { $in: statesToActivate } },
      { $set: { isActive: true } }
    );

    console.log(`\n✓ Activated ${result.modifiedCount} states for testing`);
    console.log(`States activated: ${statesToActivate.join(', ')}`);

    // Show current active states
    const activeStates = await ServiceArea.find({ isActive: true }).sort('stateCode');
    console.log(`\nTotal active states: ${activeStates.length}`);
    console.log('Active states:', activeStates.map(s => s.stateCode).join(', '));

    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the script
activateSampleStates();
