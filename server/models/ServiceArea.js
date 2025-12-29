const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceAreaSchema = new Schema(
  {
    // State code (e.g., 'CA', 'TX', 'NY')
    stateCode: {
      type: String,
      required: [true, 'State code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 2,
      maxlength: 2
    },
    
    // Full state name
    stateName: {
      type: String,
      required: [true, 'State name is required'],
      trim: true
    },
    
    // Active status - whether the company services this state
    isActive: {
      type: Boolean,
      default: false
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

// Index on stateCode for faster lookups
serviceAreaSchema.index({ stateCode: 1 });

module.exports = mongoose.model('ServiceArea', serviceAreaSchema);
