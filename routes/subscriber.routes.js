const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriber.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.post('/subscribe', subscriberController.subscribe);
router.post('/unsubscribe', subscriberController.unsubscribe);

// Protected routes (Admin only)
router.get('/', protect, subscriberController.getAllSubscribers);
router.delete('/:id', protect, subscriberController.deleteSubscriber);
router.post('/newsletter', protect, subscriberController.sendNewsletter);
router.get('/newsletter/history', protect, subscriberController.getNewsletterHistory);

module.exports = router;
