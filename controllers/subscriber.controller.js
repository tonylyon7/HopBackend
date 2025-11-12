const Subscriber = require('../models/Subscriber.model');
const Newsletter = require('../models/Newsletter.model');
const { sendEmail } = require('../utils/email.util');
const emailTemplates = require('../utils/emailTemplates.util');

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });

    if (existing) {
      if (existing.status === 'Active') {
        return res.status(400).json({
          status: 'error',
          message: 'Email is already subscribed'
        });
      } else {
        // Reactivate subscription
        existing.status = 'Active';
        existing.unsubscribedAt = undefined;
        existing.unsubscribeReason = undefined;
        await existing.save();

        return res.status(200).json({
          status: 'success',
          message: 'Subscription reactivated successfully'
        });
      }
    }

    const subscriber = await Subscriber.create({ email });

    // Send welcome email with beautiful template
    await sendEmail({
      to: email,
      subject: 'Welcome to House of Praise Newsletter',
      html: emailTemplates.newsletterWelcome(email)
    });

    res.status(201).json({
      status: 'success',
      message: 'Subscribed successfully',
      data: { subscriber }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Unsubscribe from newsletter
exports.unsubscribe = async (req, res) => {
  try {
    const { email, reason } = req.body;

    const subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({
        status: 'error',
        message: 'Email not found in subscribers list'
      });
    }

    subscriber.status = 'Unsubscribed';
    subscriber.unsubscribedAt = new Date();
    subscriber.unsubscribeReason = reason;
    await subscriber.save();

    res.status(200).json({
      status: 'success',
      message: 'Unsubscribed successfully'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get all subscribers (Admin)
exports.getAllSubscribers = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status) query.status = status;

    const subscribers = await Subscriber.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Subscriber.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        subscribers,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Delete subscriber
exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ status: 'error', message: 'Subscriber not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Subscriber deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Send newsletter to all subscribers
exports.sendNewsletter = async (req, res) => {
  try {
    const { subject, message } = req.body;

    // Get all active subscribers
    const subscribers = await Subscriber.find({ status: 'Active' });

    if (subscribers.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No active subscribers found'
      });
    }

    // Create newsletter record
    const newsletter = await Newsletter.create({
      subject,
      message,
      sentBy: req.admin._id,
      recipientCount: subscribers.length,
      status: 'sending'
    });

    // Send emails asynchronously
    let successCount = 0;
    let failureCount = 0;

    const emailPromises = subscribers.map(async (subscriber) => {
      try {
        await sendEmail({
          to: subscriber.email,
          subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1e40af;">${subject}</h2>
              <div style="white-space: pre-wrap;">${message}</div>
              <hr style="margin: 30px 0;">
              <p style="font-size: 12px; color: #666;">
                You are receiving this email because you subscribed to House of Praise newsletter.
                <br>
                <a href="${process.env.FRONTEND_URL}/unsubscribe?email=${subscriber.email}">Unsubscribe</a>
              </p>
            </div>
          `
        });

        newsletter.recipients.push({
          email: subscriber.email,
          status: 'sent',
          sentAt: new Date()
        });
        successCount++;
      } catch (error) {
        newsletter.recipients.push({
          email: subscriber.email,
          status: 'failed',
          error: error.message
        });
        failureCount++;
      }
    });

    await Promise.all(emailPromises);

    // Update newsletter record
    newsletter.successCount = successCount;
    newsletter.failureCount = failureCount;
    newsletter.status = failureCount === 0 ? 'sent' : 'sent';
    newsletter.sentAt = new Date();
    await newsletter.save();

    res.status(200).json({
      status: 'success',
      message: 'Newsletter sent successfully',
      data: {
        totalSent: successCount,
        totalFailed: failureCount,
        newsletter
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get newsletter history
exports.getNewsletterHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const newsletters = await Newsletter.find()
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('sentBy', 'firstName lastName')
      .select('-recipients');

    const count = await Newsletter.countDocuments();

    res.status(200).json({
      status: 'success',
      data: {
        newsletters,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
