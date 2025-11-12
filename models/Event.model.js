const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['Service', 'Conference', 'Seminar', 'Outreach', 'Youth Event', 'Children Event', 'Prayer Meeting', 'Other'],
    default: 'Service'
  },
  imageUrl: {
    type: String,
    trim: true
  },
  registrationRequired: {
    type: Boolean,
    default: false
  },
  registrationLink: {
    type: String,
    trim: true
  },
  maxAttendees: {
    type: Number
  },
  currentAttendees: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  organizer: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

// Index for search and date queries
eventSchema.index({ title: 'text', description: 'text', location: 'text' });
eventSchema.index({ startDate: 1 });

module.exports = mongoose.model('Event', eventSchema);
