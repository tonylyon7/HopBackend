const MinistryRequest = require('../models/MinistryRequest.model');
const MinistryMember = require('../models/MinistryMember.model');
const { sendEmail } = require('../utils/email.util');
const emailTemplates = require('../utils/emailTemplates.util');

// Submit ministry join request
exports.submitRequest = async (req, res) => {
  try {
    const request = await MinistryRequest.create(req.body);

    // Send confirmation email to applicant with beautiful template (non-blocking)
    sendEmail({
      to: request.email,
      subject: 'Ministry Application Received - House of Praise',
      html: emailTemplates.ministryApplicationConfirmation(
        request.firstName,
        request.lastName,
        request.ministryLabel
      )
    }).catch(err => console.error('Failed to send ministry confirmation email:', err.message));

    res.status(201).json({
      status: 'success',
      message: 'Ministry request submitted successfully',
      data: { request }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get all ministry requests (Admin)
exports.getAllRequests = async (req, res) => {
  try {
    const { status, ministry, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (ministry) query.ministry = ministry;

    const requests = await MinistryRequest.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('reviewedBy', 'firstName lastName');

    const count = await MinistryRequest.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        requests,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Approve ministry request
exports.approveRequest = async (req, res) => {
  try {
    const request = await MinistryRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ status: 'error', message: 'Request not found' });
    }

    // Update request status
    request.status = 'approved';
    request.reviewedBy = req.admin._id;
    request.reviewedDate = new Date();
    await request.save();

    // Create ministry member
    const member = await MinistryMember.create({
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      phone: request.phone,
      address: request.address,
      city: request.city,
      state: request.state,
      ministry: request.ministry,
      ministryLabel: request.ministryLabel,
      availability: request.availability,
      skills: request.skills,
      approvedBy: req.admin._id,
      requestId: request._id
    });

    // Send approval email with beautiful template (non-blocking)
    sendEmail({
      to: request.email,
      subject: 'Ministry Application Approved! - House of Praise',
      html: emailTemplates.ministryApplicationApproval(
        request.firstName,
        request.lastName,
        request.ministryLabel
      )
    }).catch(err => console.error('Failed to send ministry approval email:', err.message));

    res.status(200).json({
      status: 'success',
      message: 'Request approved successfully',
      data: { request, member }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Decline ministry request
exports.declineRequest = async (req, res) => {
  try {
    const { declineReason } = req.body;
    const request = await MinistryRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ status: 'error', message: 'Request not found' });
    }

    request.status = 'declined';
    request.reviewedBy = req.admin._id;
    request.reviewedDate = new Date();
    request.declineReason = declineReason;
    await request.save();

    // Send decline email with professional template (non-blocking)
    sendEmail({
      to: request.email,
      subject: 'Ministry Application Update - House of Praise',
      html: emailTemplates.ministryApplicationDecline(
        request.firstName,
        request.lastName,
        request.ministryLabel,
        declineReason
      )
    }).catch(err => console.error('Failed to send ministry decline email:', err.message));

    res.status(200).json({
      status: 'success',
      message: 'Request declined',
      data: { request }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get all ministry members
exports.getAllMembers = async (req, res) => {
  try {
    const { ministry, status, page = 1, limit = 50 } = req.query;

    const query = {};
    if (ministry) query.ministry = ministry;
    if (status) query.status = status;

    const members = await MinistryMember.find(query)
      .sort('firstName')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await MinistryMember.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        members,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Remove ministry member
exports.removeMember = async (req, res) => {
  try {
    const member = await MinistryMember.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({ status: 'error', message: 'Member not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Member removed successfully'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get ministry statistics
exports.getStatistics = async (req, res) => {
  try {
    const totalRequests = await MinistryRequest.countDocuments();
    const pendingRequests = await MinistryRequest.countDocuments({ status: 'pending' });
    const approvedRequests = await MinistryRequest.countDocuments({ status: 'approved' });
    const totalMembers = await MinistryMember.countDocuments({ status: 'active' });

    // Members by ministry
    const membersByMinistry = await MinistryMember.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$ministry', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalRequests,
        pendingRequests,
        approvedRequests,
        totalMembers,
        membersByMinistry
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
