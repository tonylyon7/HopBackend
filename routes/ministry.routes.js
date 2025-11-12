const express = require('express');
const router = express.Router();
const ministryController = require('../controllers/ministry.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.post('/requests', ministryController.submitRequest);

// Protected routes (Admin only)
router.get('/requests', protect, ministryController.getAllRequests);
router.put('/requests/:id/approve', protect, ministryController.approveRequest);
router.put('/requests/:id/decline', protect, ministryController.declineRequest);
router.get('/members', protect, ministryController.getAllMembers);
router.delete('/members/:id', protect, ministryController.removeMember);
router.get('/statistics', protect, ministryController.getStatistics);

module.exports = router;
