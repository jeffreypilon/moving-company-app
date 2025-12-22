const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    const usersCollection = db.collection('users');
    
    // Define users with their new passwords
    const userUpdates = [
      // Admin users
      { email: 'john.anderson@movingco.com', password: 'Admin1234', userType: 'admin' },
      { email: 'sarah.mitchell@movingco.com', password: 'Admin5678', userType: 'admin' },
      { email: 'michael.roberts@movingco.com', password: 'Admin9012', userType: 'admin' },
      
      // Customer users
      { email: 'emily.johnson@email.com', password: 'Pass1234', userType: 'customer' },
      { email: 'david.williams@email.com', password: 'Pass5678', userType: 'customer' },
      { email: 'jennifer.brown@email.com', password: 'Pass9012', userType: 'customer' },
      { email: 'robert.davis@email.com', password: 'Pass3456', userType: 'customer' },
      { email: 'lisa.miller@email.com', password: 'Pass7890', userType: 'customer' },
      { email: 'james.wilson@email.com', password: 'Pass2345', userType: 'customer' },
      { email: 'maria.garcia@email.com', password: 'Pass6789', userType: 'customer' },
      { email: 'chris.martinez@email.com', password: 'Pass0123', userType: 'customer' },
      { email: 'amanda.taylor@email.com', password: 'Pass4567', userType: 'customer' },
      { email: 'daniel.anderson@email.com', password: 'Pass8901', userType: 'customer' },
      { email: 'jessica.thomas@email.com', password: 'Pass1357', userType: 'customer' },
      { email: 'matthew.jackson@email.com', password: 'Pass2468', userType: 'customer' }
    ];

    console.log(`Updating passwords for ${userUpdates.length} users...\n`);

    for (const userUpdate of userUpdates) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userUpdate.password, salt);
      
      await usersCollection.updateOne(
        { email: userUpdate.email },
        { 
          $set: { 
            password: hashedPassword,
            userType: userUpdate.userType
          } 
        }
      );
      
      console.log(`✓ ${userUpdate.email} → Password: ${userUpdate.password} (Type: ${userUpdate.userType})`);
    }

    console.log('\n✅ Password reset completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('\n👔 ADMIN USERS:');
    console.log('   Email: john.anderson@movingco.com | Password: Admin1234');
    console.log('   Email: sarah.mitchell@movingco.com | Password: Admin5678');
    console.log('   Email: michael.roberts@movingco.com | Password: Admin9012');
    console.log('\n👤 CUSTOMER USERS:');
    console.log('   Email: emily.johnson@email.com | Password: Pass1234');
    console.log('   Email: david.williams@email.com | Password: Pass5678');
    console.log('   Email: jennifer.brown@email.com | Password: Pass9012');
    
  } catch (error) {
    console.error('❌ Reset error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
});
