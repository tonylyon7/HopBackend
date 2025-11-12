const mongoose = require('mongoose');

const sermonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Sermon title is required'],
    trim: true
  },
  preacher: {
    type: String,
    required: [true, 'Preacher name is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Sermon date is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  scripture: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['Faith', 'Love', 'Healing', 'Purpose', 'Prayer', 'Worship', 'Family', 'Finance', 'Prophecy', 'Sunday Service', 'Wednesday Service', 'Friday Vigil', 'Special Event', 'Conference', 'Other'],
    default: 'Other'
  },
  sermonType: {
    type: String,
    enum: ['Regular', 'Series', 'Special Event', 'Guest Speaker'],
    default: 'Regular'
  },
  videoUrl: {
    type: String,
    trim: true
  },
  youtubeUrl: {
    type: String,
    trim: true
  },
  audioUrl: {
    type: String,
    trim: true
  },
  thumbnailUrl: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

// Index for search
sermonSchema.index({ title: 'text', preacher: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Sermon', sermonSchema);
