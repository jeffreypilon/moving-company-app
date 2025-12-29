/**
 * Script to initialize all 48 continental US states in the service_areas collection
 */

require('dotenv').config();
const mongoose = require('mongoose');
const ServiceArea = require('../models/ServiceArea');

// Continental US states (48 states, excluding Alaska and Hawaii)
const continentalStates = [
  { stateCode: 'AL', stateName: 'Alabama', isActive: false },
  { stateCode: 'AZ', stateName: 'Arizona', isActive: false },
  { stateCode: 'AR', stateName: 'Arkansas', isActive: false },
  { stateCode: 'CA', stateName: 'California', isActive: false },
  { stateCode: 'CO', stateName: 'Colorado', isActive: false },
  { stateCode: 'CT', stateName: 'Connecticut', isActive: false },
  { stateCode: 'DE', stateName: 'Delaware', isActive: false },
  { stateCode: 'FL', stateName: 'Florida', isActive: false },
  { stateCode: 'GA', stateName: 'Georgia', isActive: false },
  { stateCode: 'ID', stateName: 'Idaho', isActive: false },
  { stateCode: 'IL', stateName: 'Illinois', isActive: false },
  { stateCode: 'IN', stateName: 'Indiana', isActive: false },
  { stateCode: 'IA', stateName: 'Iowa', isActive: false },
  { stateCode: 'KS', stateName: 'Kansas', isActive: false },
  { stateCode: 'KY', stateName: 'Kentucky', isActive: false },
  { stateCode: 'LA', stateName: 'Louisiana', isActive: false },
  { stateCode: 'ME', stateName: 'Maine', isActive: false },
  { stateCode: 'MD', stateName: 'Maryland', isActive: false },
  { stateCode: 'MA', stateName: 'Massachusetts', isActive: false },
  { stateCode: 'MI', stateName: 'Michigan', isActive: false },
  { stateCode: 'MN', stateName: 'Minnesota', isActive: false },
  { stateCode: 'MS', stateName: 'Mississippi', isActive: false },
  { stateCode: 'MO', stateName: 'Missouri', isActive: false },
  { stateCode: 'MT', stateName: 'Montana', isActive: false },
  { stateCode: 'NE', stateName: 'Nebraska', isActive: false },
  { stateCode: 'NV', stateName: 'Nevada', isActive: false },
  { stateCode: 'NH', stateName: 'New Hampshire', isActive: false },
  { stateCode: 'NJ', stateName: 'New Jersey', isActive: false },
  { stateCode: 'NM', stateName: 'New Mexico', isActive: false },
  { stateCode: 'NY', stateName: 'New York', isActive: false },
  { stateCode: 'NC', stateName: 'North Carolina', isActive: false },
  { stateCode: 'ND', stateName: 'North Dakota', isActive: false },
  { stateCode: 'OH', stateName: 'Ohio', isActive: false },
  { stateCode: 'OK', stateName: 'Oklahoma', isActive: false },
  { stateCode: 'OR', stateName: 'Oregon', isActive: false },
  { stateCode: 'PA', stateName: 'Pennsylvania', isActive: false },
  { stateCode: 'RI', stateName: 'Rhode Island', isActive: false },
  { stateCode: 'SC', stateName: 'South Carolina', isActive: false },
  { stateCode: 'SD', stateName: 'South Dakota', isActive: false },
  { stateCode: 'TN', stateName: 'Tennessee', isActive: false },
  { stateCode: 'TX', stateName: 'Texas', isActive: false },
  { stateCode: 'UT', stateName: 'Utah', isActive: false },
  { stateCode: 'VT', stateName: 'Vermont', isActive: false },
  { stateCode: 'VA', stateName: 'Virginia', isActive: false },
  { stateCode: 'WA', stateName: 'Washington', isActive: false },
  { stateCode: 'WV', stateName: 'West Virginia', isActive: false },
  { stateCode: 'WI', stateName: 'Wisconsin', isActive: false },
  { stateCode: 'WY', stateName: 'Wyoming', isActive: false }
];

async function initializeStates() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if states already exist
    const existingCount = await ServiceArea.countDocuments();
    
    if (existingCount > 0) {
      console.log(`Service areas already initialized. Found ${existingCount} states.`);
      console.log('Skipping initialization to prevent duplicates.');
      await mongoose.connection.close();
      return;
    }

    // Insert all states
    const result = await ServiceArea.insertMany(continentalStates);
    console.log(`✓ Successfully initialized ${result.length} continental US states`);
    console.log('All states are initially set to inactive (isActive: false)');

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error initializing states:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the script
initializeStates();
