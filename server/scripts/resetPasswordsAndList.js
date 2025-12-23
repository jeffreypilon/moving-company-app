const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate random alphanumeric password (10 characters)
function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function resetPasswordsAndList() {
  try {
    await mongoose.connect('mongodb://localhost:27017/moving-company');
    console.log('Connected to MongoDB\n');
    console.log('='.repeat(70));
    console.log('RESETTING ALL USER PASSWORDS');
    console.log('='.repeat(70));

    // Get all users
    const users = await User.find({}).sort({ userType: 1, firstName: 1 });
    
    // Store passwords for display
    const userPasswords = [];

    // Update each user with a new unique password
    for (const user of users) {
      const plainPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      
      user.password = hashedPassword;
      await user.save();
      
      userPasswords.push({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: plainPassword,
        userType: user.userType
      });
      
      console.log(`✓ Updated password for ${user.firstName} ${user.lastName}`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('PASSWORD RESET COMPLETE!');
    console.log('='.repeat(70));
    console.log(`Total users updated: ${users.length}\n`);

    // Display Admin Users
    console.log('='.repeat(70));
    console.log('=== ADMIN USERS ===');
    console.log('='.repeat(70));
    console.log('');
    
    const admins = userPasswords.filter(u => u.userType === 'admin');
    admins.forEach(user => {
      console.log(`Full Name: ${user.firstName} ${user.lastName}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log('');
    });

    // Display Customer Users
    console.log('='.repeat(70));
    console.log('=== CUSTOMER USERS ===');
    console.log('='.repeat(70));
    console.log('');
    
    const customers = userPasswords.filter(u => u.userType === 'customer');
    customers.forEach(user => {
      console.log(`Full Name: ${user.firstName} ${user.lastName}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log('');
    });

    console.log('='.repeat(70));
    console.log(`Total Admin Users: ${admins.length}`);
    console.log(`Total Customer Users: ${customers.length}`);
    console.log(`Total Users: ${userPasswords.length}`);
    console.log('='.repeat(70));

    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

resetPasswordsAndList();
