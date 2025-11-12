const Event = require('../models/Event.model');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, upcoming, sortBy = 'startDate' } = req.query;

    const query = { isPublished: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (upcoming === 'true') {
      query.startDate = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'firstName lastName');

    const count = await Event.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        events,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'firstName lastName');

    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }

    res.status(200).json({ status: 'success', data: { event } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Create event
exports.createEvent = async (req, res) => {
  try {
    const eventData = { ...req.body, createdBy: req.admin._id };
    
    // Add image URL if file was uploaded (Cloudinary URL)
    if (req.file) {
      eventData.imageUrl = req.file.path; // Cloudinary URL
    }
    
    const event = await Event.create(eventData);

    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      data: { event }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Add image URL if file was uploaded (Cloudinary URL)
    if (req.file) {
      updateData.imageUrl = req.file.path; // Cloudinary URL
    }
    
    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Event updated successfully',
      data: { event }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }

    res.status(200).json({ status: 'success', message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
