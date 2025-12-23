const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moving-company')
  .then(async () => {
    const users = await User.find({}).select('firstName lastName email userType').sort({ userType: -1, firstName: 1 });
    
    console.log('\nAll users in database:\n');
    users.forEach((u, i) => {
      console.log(`${i+1}. ${u.firstName} ${u.lastName}`);
      console.log(`   Email: ${u.email}`);
      console.log(`   Type: ${u.userType}\n`);
    });
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
