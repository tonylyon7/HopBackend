const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.post('/', messageController.submitMessage);

// Protected routes (Admin only)
router.get('/', protect, messageController.getAllMessages);
router.get('/:id', protect, messageController.getMessage);
router.post('/:id/reply', protect, messageController.replyMessage);
router.put('/:id/status', protect, messageController.updateMessageStatus);
router.delete('/:id', protect, messageController.deleteMessage);

module.exports = router;
