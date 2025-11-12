const Sermon = require('../models/Sermon.model');

// @desc    Get all sermons
// @route   GET /api/sermons
// @access  Public
exports.getAllSermons = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      preacher,
      isFeatured,
      sortBy = '-date' 
    } = req.query;

    // Build query
    const query = { isPublished: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (preacher) {
      query.preacher = new RegExp(preacher, 'i');
    }

    if (isFeatured) {
      query.isFeatured = isFeatured === 'true';
    }

    // Execute query with pagination
    const sermons = await Sermon.find(query)
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'firstName lastName');

    const count = await Sermon.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        sermons,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single sermon
// @route   GET /api/sermons/:id
// @access  Public
exports.getSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id)
      .populate('createdBy', 'firstName lastName');

    if (!sermon) {
      return res.status(404).json({
        status: 'error',
        message: 'Sermon not found'
      });
    }

    // Increment views
    sermon.views += 1;
    await sermon.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      data: { sermon }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Create sermon
// @route   POST /api/sermons
// @access  Private
exports.createSermon = async (req, res) => {
  try {
    // Check if admin is authenticated
    if (!req.admin || !req.admin._id) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const sermonData = {
      ...req.body,
      createdBy: req.admin._id
    };

    // Add thumbnail URL if file was uploaded (Cloudinary URL)
    if (req.file) {
      sermonData.thumbnailUrl = req.file.path; // Cloudinary URL
    }

    const sermon = await Sermon.create(sermonData);

    res.status(201).json({
      status: 'success',
      message: 'Sermon created successfully',
      data: { sermon }
    });
  } catch (error) {
    console.error('Create sermon error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update sermon
// @route   PUT /api/sermons/:id
// @access  Private
exports.updateSermon = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Add thumbnail URL if file was uploaded (Cloudinary URL)
    if (req.file) {
      updateData.thumbnailUrl = req.file.path; // Cloudinary URL
    }

    const sermon = await Sermon.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!sermon) {
      return res.status(404).json({
        status: 'error',
        message: 'Sermon not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Sermon updated successfully',
      data: { sermon }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete sermon
// @route   DELETE /api/sermons/:id
// @access  Private
exports.deleteSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findByIdAndDelete(req.params.id);

    if (!sermon) {
      return res.status(404).json({
        status: 'error',
        message: 'Sermon not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Sermon deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Increment sermon downloads
// @route   POST /api/sermons/:id/download
// @access  Public
exports.incrementDownload = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);

    if (!sermon) {
      return res.status(404).json({
        status: 'error',
        message: 'Sermon not found'
      });
    }

    sermon.downloads += 1;
    await sermon.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Download count updated'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
