import express from 'express';
import { body } from 'express-validator';

import { protect, authorize, sanitizeRequest } from '../middleware/auth.js';
import { 
  submitFeedback, 
  getFeedbackStatus,
  getAllFeedback,
  updateFeedbackStatus,
  getFeedbackAnalytics
} from '../controllers/feedbackController.js';
import { registerAdmin, login } from '../controllers/authController.js';


const router = express.Router();

router.post('/feedback', sanitizeRequest, submitFeedback);

// GET feedback tracking
router.get('/feedback/:trackingId', getFeedbackStatus);

// Admin routes
router.get('/admin/feedback', protect, authorize('admin'), getAllFeedback);
router.put('/admin/feedback/:id', protect, authorize('admin'), updateFeedbackStatus);
router.get('/admin/analytics', protect, authorize('admin'), getFeedbackAnalytics);

// Admin account creation
router.post(
  '/admin/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['admin', 'supervisor']).withMessage('Invalid role')
  ],
  registerAdmin
);

router.post(
  '/admin/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  login
);

export default router;