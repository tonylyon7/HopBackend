const express = require('express');
const router = express.Router();
const sermonController = require('../controllers/sermon.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

// Public routes
router.get('/', sermonController.getAllSermons);
router.get('/:id', sermonController.getSermon);
router.post('/:id/download', sermonController.incrementDownload);

// Protected routes (Admin only)
router.post('/', protect, upload.single('thumbnail'), sermonController.createSermon);
router.put('/:id', protect, upload.single('thumbnail'), sermonController.updateSermon);
router.delete('/:id', protect, sermonController.deleteSermon);

module.exports = router;
