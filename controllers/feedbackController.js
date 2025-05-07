import Feedback from '../models/Feedback.js';
import { Sequelize } from 'sequelize';

// Submit anonymous feedback
export const submitFeedback = async (req, res) => {
  try {
    const { category, message } = req.body;

    if (!category || !message) {
      return res.status(400).json({ message: 'Please provide category and message' });
    }

    const feedback = await Feedback.create({
      category,
      message
    });

    res.status(201).json({
      success: true,
      trackingId: feedback.trackingId,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to submit feedback. Please try again later.',
      systemMessage: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get feedback status by tracking ID
export const getFeedbackStatus = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const feedback = await Feedback.findOne({ where: { trackingId } });

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({
      trackingId: feedback.trackingId,
      status: feedback.status,
      category: feedback.category,
      createdAt: feedback.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving feedback status' });
  }
};

// Get all feedback (admin only)
export const getAllFeedback = async (req, res) => {
  try {
    const { category, status, startDate, endDate } = req.query;
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const feedback = await Feedback.findAll({
      where: query,
      order: [['createdAt', 'DESC']]
    });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving feedback' });
  }
};

// Update feedback status (admin only)
export const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, department, note } = req.body;

    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (status) feedback.status = status;
    if (department) feedback.department = department;
    if (note) {
      feedback.internalNotes.push({ note });
    }

    await feedback.save();

    res.json({
      success: true,
      message: 'Feedback updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating feedback' });
  }
};

// Get feedback analytics (admin only)
export const getFeedbackAnalytics = async (req, res) => {
  try {
    const totalCount = await Feedback.count();
    
    const categoryStats = await Feedback.findAll({
      attributes: ['category', [Sequelize.fn('COUNT', Sequelize.col('category')), 'count']],
      group: ['category']
    });

    const statusStats = await Feedback.findAll({
      attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']],
      group: ['status']
    });

    const monthlyTrends = await Feedback.findAll({
      attributes: [
        [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['month'],
      order: [['month', 'DESC']],
      limit: 12
    });

    res.json({
      totalCount,
      categoryStats,
      statusStats,
      monthlyTrends
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving analytics', error: error.message });
  }
};