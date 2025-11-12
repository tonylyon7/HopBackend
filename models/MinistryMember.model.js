const mongoose = require('mongoose');

const ministryMemberSchema = new mongoose.Schema({
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
    required: [true, 'Ministry is required'],
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
    type: String
  }],
  skills: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active'
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  notes: {
    type: String,
    trim: true
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MinistryRequest'
  }
}, {
  timestamps: true
});

// Index for search
ministryMemberSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });
ministryMemberSchema.index({ ministry: 1, status: 1 });

module.exports = mongoose.model('MinistryMember', ministryMemberSchema);
