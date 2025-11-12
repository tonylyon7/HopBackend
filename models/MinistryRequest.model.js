const mongoose = require('mongoose');

const ministryRequestSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  ministry: {
    type: String,
    required: [true, 'Ministry selection is required'],
    enum: [
      'worship-team',
      'media-ministry',
      'creative-arts',
      'children-ministry',
      'youth-ministry',
      'adult-ministry',
      'community-outreach',
      'missions',
      'pastoral-care',
      'discipleship',
      'small-groups',
      'ushering',
      'prayer-team'
    ]
  },
  ministryLabel: {
    type: String,
    required: true
  },
  availability: [{
    type: String,
    enum: [
      'Sunday Morning Service',
      'Wednesday Evening Service',
      'Friday Night Vigil',
      'Weekday Events',
      'Special Programs'
    ]
  }],
  whyJoin: {
    type: String,
    required: [true, 'Please tell us why you want to join'],
    trim: true
  },
  previousMinistry: {
    type: String,
    trim: true
  },
  skills: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  reviewedDate: {
    type: Date
  },
  declineReason: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for search
ministryRequestSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });
ministryRequestSchema.index({ status: 1, ministry: 1 });

module.exports = mongoose.model('MinistryRequest', ministryRequestSchema);
