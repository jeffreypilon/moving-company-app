const mongoose = require('mongoose');
const { Schema } = mongoose;

const quoteSchema = new Schema(
  {
    // User who requested the quote
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    
    // Service selected
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service is required']
    },
    
    // Moving From Address
    fromStreetAddress: {
      type: String,
      required: [true, 'From street address is required'],
      trim: true
    },
    fromCity: {
      type: String,
      required: [true, 'From city is required'],
      trim: true
    },
    fromState: {
      type: String,
      required: [true, 'From state is required'],
      trim: true
    },
    fromZipCode: {
      type: String,
      required: [true, 'From zip code is required'],
      trim: true,
      match: [/^\d{5}(-\d{4})?$/, 'Please provide a valid zip code']
    },
    
    // Moving To Address
    toStreetAddress: {
      type: String,
      required: [true, 'To street address is required'],
      trim: true
    },
    toCity: {
      type: String,
      required: [true, 'To city is required'],
      trim: true
    },
    toState: {
      type: String,
      required: [true, 'To state is required'],
      trim: true
    },
    toZipCode: {
      type: String,
      required: [true, 'To zip code is required'],
      trim: true,
      match: [/^\d{5}(-\d{4})?$/, 'Please provide a valid zip code']
    },
    
    // Move Date
    moveDate: {
      type: Date,
      required: [true, 'Move date is required']
    },
    
    // Quote Status
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'approved', 'rejected'],
      default: 'pending'
    },
    
    // Estimated Price (to be filled by admin)
    estimatedPrice: {
      type: Number,
      default: null
    },
    
    // Notes (admin can add notes)
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes for performance
quoteSchema.index({ userId: 1, createdAt: -1 });
quoteSchema.index({ status: 1, createdAt: -1 });
quoteSchema.index({ serviceId: 1 });

module.exports = mongoose.model('Quote', quoteSchema);
