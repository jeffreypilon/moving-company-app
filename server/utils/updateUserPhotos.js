/**
 * Utility script to update user photoFilename field
 * This script matches users to photo files in client/src/assets/images/
 * based on firstName and lastName (e.g., "John Anderson.jpg")
 * 
 * Run this script from the server directory:
 * node utils/updateUserPhotos.js
 */

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const User = require('../models/User');

// Path to images directory
const IMAGES_DIR = path.join(__dirname, '../../client/src/assets/images');

/**
 * Get list of .jpg files in images directory
 */
function getImageFiles() {
  try {
    if (!fs.existsSync(IMAGES_DIR)) {
      console.log(`Images directory does not exist: ${IMAGES_DIR}`);
      return [];
    }
    
    const files = fs.readdirSync(IMAGES_DIR);
    const jpgFiles = files.filter(file => file.toLowerCase().endsWith('.jpg'));
    console.log(`Found ${jpgFiles.length} .jpg files in images directory`);
    return jpgFiles;
  } catch (error) {
    console.error('Error reading images directory:', error.message);
    return [];
  }
}

/**
 * Generate expected photo filename from user's first and last name
 * Checks both "FirstName LastName.jpg" and "FirstName_LastName.jpg" formats
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @returns {string} Expected filename (e.g., "John Anderson.jpg" or "John_Anderson.jpg")
 */
function getExpectedPhotoFilename(firstName, lastName) {
  if (!firstName || !lastName) return null;
  return [
    `${firstName.trim()} ${lastName.trim()}.jpg`,      // Space format
    `${firstName.trim()}_${lastName.trim()}.jpg`       // Underscore format
  ];
}

/**
 * Update users with matching photo files
 */
async function updateUserPhotos() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moving-company');
    console.log('Connected to MongoDB successfully\n');

    // Get all image files
    const imageFiles = getImageFiles();
    
    if (imageFiles.length === 0) {
      console.log('No .jpg files found in images directory. Exiting...');
      await mongoose.connection.close();
      return;
    }

    console.log('Image files found:');
    imageFiles.forEach(file => console.log(`  - ${file}`));
    console.log('');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users in database\n`);

    let updatedCount = 0;
    let notFoundCount = 0;

    // Update each user if matching photo exists
    for (const user of users) {
      const expectedFilenames = getExpectedPhotoFilename(user.firstName, user.lastName);
      
      if (!expectedFilenames) {
        console.log(`Skipping user ${user.email} - missing firstName or lastName`);
        continue;
      }

      // Check if any photo file exists (try both formats)
      let matchedFilename = null;
      for (const filename of expectedFilenames) {
        if (imageFiles.includes(filename)) {
          matchedFilename = filename;
          break;
        }
      }

      if (matchedFilename) {
        // Update user with photo filename
        user.photoFilename = matchedFilename;
        await user.save();
        console.log(`✓ Updated ${user.fullName || user.email} with photo: ${matchedFilename}`);
        updatedCount++;
      } else {
        // Ensure photoFilename is null if no photo
        if (user.photoFilename !== null) {
          user.photoFilename = null;
          await user.save();
          console.log(`  Cleared photo for ${user.fullName || user.email} (no matching file)`);
        } else {
          console.log(`  No photo for ${user.fullName || user.email} (expected: ${expectedFilenames[0]} or ${expectedFilenames[1]})`);
        }
        notFoundCount++;
      }
    }

    console.log('\n--- Summary ---');
    console.log(`Total users processed: ${users.length}`);
    console.log(`Users with photos: ${updatedCount}`);
    console.log(`Users without photos: ${notFoundCount}`);
    console.log('Update complete!\n');

  } catch (error) {
    console.error('Error updating user photos:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the update
updateUserPhotos();
