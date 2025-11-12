const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  status: {
    type: String,
    enum: ['Active', 'Unsubscribed'],
    default: 'Active'
  },
  source: {
    type: String,
    enum: ['Website', 'Manual', 'Import'],
    default: 'Website'
  },
  unsubscribedAt: {
    type: Date
  },
  unsubscribeReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for email lookup
subscriberSchema.index({ email: 1 });
subscriberSchema.index({ status: 1 });

module.exports = mongoose.model('Subscriber', subscriberSchema);
