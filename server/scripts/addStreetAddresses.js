const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    const usersCollection = db.collection('users');
    
    // Define street addresses for each user
    const addressUpdates = [
      // Admin users
      { email: 'john.anderson@movingco.com', streetAddress: '123 Main Street' },
      { email: 'sarah.mitchell@movingco.com', streetAddress: '456 Oak Avenue' },
      { email: 'michael.roberts@movingco.com', streetAddress: '789 Elm Boulevard' },
      
      // Customer users
      { email: 'emily.johnson@email.com', streetAddress: '101 Maple Drive' },
      { email: 'david.williams@email.com', streetAddress: '202 Pine Street' },
      { email: 'jennifer.brown@email.com', streetAddress: '303 Cedar Lane' },
      { email: 'robert.davis@email.com', streetAddress: '404 Birch Road' },
      { email: 'lisa.miller@email.com', streetAddress: '505 Willow Court' },
      { email: 'james.wilson@email.com', streetAddress: '606 Spruce Avenue' },
      { email: 'maria.garcia@email.com', streetAddress: '707 Ash Street' },
      { email: 'chris.martinez@email.com', streetAddress: '808 Cherry Drive' },
      { email: 'amanda.taylor@email.com', streetAddress: '909 Walnut Place' },
      { email: 'daniel.anderson@email.com', streetAddress: '1010 Hickory Lane' },
      { email: 'jessica.thomas@email.com', streetAddress: '1111 Poplar Road' },
      { email: 'matthew.jackson@email.com', streetAddress: '1212 Sycamore Court' }
    ];

    console.log(`Adding street addresses for ${addressUpdates.length} users...\n`);

    for (const update of addressUpdates) {
      const result = await usersCollection.updateOne(
        { email: update.email },
        { $set: { streetAddress: update.streetAddress } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✓ ${update.email} → ${update.streetAddress}`);
      } else {
        console.log(`⚠ ${update.email} → Not found or already updated`);
      }
    }

    console.log('\n✅ Street address update completed successfully!');
    
    // Verify the update
    const sampleUser = await usersCollection.findOne({ email: 'john.anderson@movingco.com' });
    console.log('\n📋 Sample user record:');
    console.log(`   Name: ${sampleUser.firstName} ${sampleUser.lastName}`);
    console.log(`   Email: ${sampleUser.email}`);
    console.log(`   Street: ${sampleUser.streetAddress}`);
    console.log(`   City: ${sampleUser.city}`);
    console.log(`   State: ${sampleUser.state}`);
    console.log(`   Zip: ${sampleUser.zipCode}`);
    
  } catch (error) {
    console.error('❌ Update error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
});
