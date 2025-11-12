const Message = require('../models/Message.model');
const { sendEmail } = require('../utils/email.util');
const emailTemplates = require('../utils/emailTemplates.util');

// Submit contact message
exports.submitMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);

    // Send confirmation email to sender with beautiful template (non-blocking)
    sendEmail({
      to: message.email,
      subject: 'Message Received - House of Praise',
      html: emailTemplates.contactUsConfirmation(message.name, message.message)
    }).catch(err => console.error('Failed to send confirmation email:', err.message));

    // Notify admin with detailed template (non-blocking)
    sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Message: ${message.subject}`,
      html: emailTemplates.contactUsAdminNotification(
        message.name,
        message.email,
        message.phone,
        message.subject,
        message.message
      )
    }).catch(err => console.error('Failed to send admin notification:', err.message));

    res.status(201).json({
      status: 'success',
      message: 'Message sent successfully',
      data: { message }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get all messages (Admin)
exports.getAllMessages = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const messages = await Message.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Message.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        messages,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get single message
exports.getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ status: 'error', message: 'Message not found' });
    }

    // Mark as read
    if (message.status === 'unread') {
      message.status = 'read';
      await message.save();
    }

    res.status(200).json({ status: 'success', data: { message } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Reply to message
exports.replyMessage = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ status: 'error', message: 'Message not found' });
    }

    message.reply = {
      message: replyMessage,
      repliedBy: req.admin._id,
      repliedAt: new Date()
    };
    message.status = 'replied';
    await message.save();

    // Send reply email
    await sendEmail({
      to: message.email,
      subject: `Re: ${message.subject}`,
      html: `
        <h2>Response to Your Message</h2>
        <p>Dear ${message.name},</p>
        <p>${replyMessage}</p>
        <p>God bless you!</p>
        <p><strong>House of Praise</strong></p>
        <hr>
        <p><small><strong>Your Original Message:</strong><br>${message.message}</small></p>
      `
    });

    res.status(200).json({
      status: 'success',
      message: 'Reply sent successfully',
      data: { message }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update message status
exports.updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({ status: 'error', message: 'Message not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Status updated successfully',
      data: { message }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ status: 'error', message: 'Message not found' });
    }

    res.status(200).json({ status: 'success', message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
