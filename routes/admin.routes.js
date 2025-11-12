const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Sermon = require('../models/Sermon.model');
const Event = require('../models/Event.model');
const Message = require('../models/Message.model');
const Subscriber = require('../models/Subscriber.model');
const MinistryRequest = require('../models/MinistryRequest.model');
const MinistryMember = require('../models/MinistryMember.model');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const totalSermons = await Sermon.countDocuments({ isPublished: true });
    const totalEvents = await Event.countDocuments({ isPublished: true });
    const upcomingEvents = await Event.countDocuments({ 
      isPublished: true, 
      startDate: { $gte: new Date() } 
    });
    const unreadMessages = await Message.countDocuments({ status: 'unread' });
    const totalSubscribers = await Subscriber.countDocuments({ status: 'Active' });
    const pendingMinistryRequests = await MinistryRequest.countDocuments({ status: 'pending' });
    const totalMinistryMembers = await MinistryMember.countDocuments({ status: 'active' });

    // Recent sermons
    const recentSermons = await Sermon.find({ isPublished: true })
      .sort('-createdAt')
      .limit(5)
      .select('title preacher date views');

    // Recent events
    const recentEvents = await Event.find({ isPublished: true })
      .sort('-createdAt')
      .limit(5)
      .select('title startDate location category');

    res.status(200).json({
      status: 'success',
      data: {
        statistics: {
          totalSermons,
          totalEvents,
          upcomingEvents,
          unreadMessages,
          totalSubscribers,
          pendingMinistryRequests,
          totalMinistryMembers
        },
        recentSermons,
        recentEvents
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
