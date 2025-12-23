const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    // Required fields
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false // Don't return password by default
    },
    
    // Optional fields
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    streetAddress: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    
    // Photo filename (stored in client/src/assets/images/)
    photoFilename: {
      type: String,
      trim: true,
      default: null,
      match: [/^[a-zA-Z0-9_\-\s.]+\.jpg$/i, 'Photo filename must be a .jpg file']
    },
    
    // User type
    userType: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer',
      lowercase: true
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);

// Indexes for performance
// Note: email index is created by unique:true in schema, so we don't duplicate it here
userSchema.index({ userType: 1, isActive: 1 });

// Virtual property for full name
userSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`.trim();
  }
  return this.firstName || this.lastName || '';
});

// Pre-save middleware to hash password
userSchema.pre('save', async function() {
  // Only hash password if it's modified or new
  if (!this.isModified('password')) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

module.exports = mongoose.model('User', userSchema);
