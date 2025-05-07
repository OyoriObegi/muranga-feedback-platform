import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const TrackFeedback = () => {
  const [trackingId, setTrackingId] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError('');
    setFeedback(null);

    try {
      const response = await axios.get(`/api/feedback/${trackingId}`);
      setFeedback(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch feedback status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'received':
        return 'info';
      case 'in_review':
        return 'warning';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Track Your Feedback
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph align="center">
          Enter your tracking ID to check the status of your feedback
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Tracking ID"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Track Feedback'}
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {feedback && (
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="div">
                  Feedback Details
                </Typography>
                <Chip
                  label={feedback.status.replace('_', ' ').toUpperCase()}
                  color={getStatusColor(feedback.status)}
                />
              </Box>

              <Typography color="text.secondary" gutterBottom>
                Category: {feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)}
              </Typography>

              <Typography color="text.secondary">
                Submitted on: {formatDate(feedback.createdAt)}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Container>
  );
};

export default TrackFeedback;