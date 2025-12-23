const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('../models/User');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moving-company')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Password assignments for each user
const userPasswords = {
  // Admin users
  'john.anderson@starmovers.com': 'eUdiuwPyGB',
  'sarah.mitchell@starmovers.com': 'z7wYYcBMfE',
  'michael.roberts@starmovers.com': 'GR5XNUAu5p',
  
  // Customer users
  'emily.johnson@email.com': 'fjdkQwP8Xm',
  'david.williams@email.com': 'nR3pTsLwK7',
  'jennifer.brown@email.com': 'YvHg9mNcU2',
  'robert.davis@email.com': 'bZx5KjPqW4',
  'lisa.miller@email.com': 'aEr7VmNtH8',
  'james.wilson@email.com': 'cMp4XqDfL9',
  'maria.garcia@email.com': 'gJw6YhRkN3',
  'matthew.jackson@email.com': 'dKt8BnZvM5',
  'amanda.taylor@email.com': 'hLq2WpFsJ6',
  'christopher.martinez@email.com': 'eTy9GmXcR7',
  'chris.martinez@email.com': 'eTy9GmXcR7',
  'jessica.thomas@email.com': 'fNx3HkVbP8',
  'daniel.anderson@email.com': 'jQr4KpYdT9',
  'bobby@hotmail.com': 'kWs5LmZfN2',
  'testuser456@test.com': 'mCv6PnXgH3'
};

async function fixAllPasswords() {
  try {
    console.log('\n=== Fixing All User Passwords ===\n');
    
    let successCount = 0;
    let failCount = 0;
    
    for (const [email, password] of Object.entries(userPasswords)) {
      try {
        const user = await User.findOne({ email });
        
        if (user) {
          // Set plain text password - pre-save hook will hash it
          user.password = password;
          await user.save();
          
          // Verify the password works
          const verify = await User.findOne({ email }).select('+password');
          const isMatch = await bcrypt.compare(password, verify.password);
          
          if (isMatch) {
            console.log(`✓ ${user.firstName} ${user.lastName} (${email})`);
            console.log(`  Password: ${password}\n`);
            successCount++;
          } else {
            console.log(`✗ FAILED: ${email} - Verification failed\n`);
            failCount++;
          }
        } else {
          console.log(`⚠ User not found: ${email}\n`);
          failCount++;
        }
      } catch (err) {
        console.log(`✗ ERROR updating ${email}:`, err.message, '\n');
        failCount++;
      }
    }
    
    console.log('\n=== Summary ===');
    console.log(`Successfully updated: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Total: ${successCount + failCount}`);
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error fixing passwords:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Run the function
fixAllPasswords();
