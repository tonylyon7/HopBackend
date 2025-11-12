const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);

// Protected routes (Admin only)
router.post('/', protect, upload.single('image'), eventController.createEvent);
router.put('/:id', protect, upload.single('image'), eventController.updateEvent);
router.delete('/:id', protect, eventController.deleteEvent);

module.exports = router;
