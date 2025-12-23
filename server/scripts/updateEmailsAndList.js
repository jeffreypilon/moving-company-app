const mongoose = require('mongoose');
const User = require('../models/User');

async function updateEmailsAndListUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/moving-company');
    console.log('Connected to MongoDB');

    // Get all users with movingco.com emails
    const usersToUpdate = await User.find({ email: { $regex: 'movingco.com$' } });
    
    console.log('\nUpdating', usersToUpdate.length, 'user email addresses...');
    
    // Update each user's email
    let modifiedCount = 0;
    for (const user of usersToUpdate) {
      user.email = user.email.replace('movingco.com', 'starmovers.com');
      await user.save();
      modifiedCount++;
    }

    console.log('Email domains updated!');
    console.log('Modified count:', modifiedCount);
    console.log('\n' + '='.repeat(60));

    // Get all users sorted by userType and firstName
    const users = await User.find({})
      .select('firstName lastName email password userType')
      .sort({ userType: 1, firstName: 1 });

    // Display admin users
    console.log('\n=== ADMIN USERS ===\n');
    const admins = users.filter(u => u.userType === 'admin');
    admins.forEach(u => {
      console.log('Full Name:', u.firstName, u.lastName);
      console.log('Email:', u.email);
      console.log('Password:', u.password);
      console.log('');
    });

    // Display customer users
    console.log('='.repeat(60));
    console.log('\n=== CUSTOMER USERS ===\n');
    const customers = users.filter(u => u.userType === 'customer');
    customers.forEach(u => {
      console.log('Full Name:', u.firstName, u.lastName);
      console.log('Email:', u.email);
      console.log('Password:', u.password);
      console.log('');
    });

    console.log('='.repeat(60));
    console.log('\nTotal Admin Users:', admins.length);
    console.log('Total Customer Users:', customers.length);
    console.log('Total Users:', users.length);

    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

updateEmailsAndListUsers();
