import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar
} from '@mui/material';
import axios from 'axios';

const SubmitFeedback = () => {
  const [formData, setFormData] = useState({
    category: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/feedback', formData);
      setTrackingId(response.data.trackingId);
      setSuccess(true);
      setFormData({ category: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setSuccess(false);
  };

  const handleCloseError = () => {
    setError('');
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Submit Anonymous Feedback
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph align="center">
          Your feedback helps us improve. No personal information is collected.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="category-label">Feedback Category</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Feedback Category"
              required
            >
              <MenuItem value="complaint">Complaint</MenuItem>
              <MenuItem value="compliment">Compliment</MenuItem>
              <MenuItem value="suggestion">Suggestion</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={6}
            name="message"
            label="Your Feedback"
            value={formData.message}
            onChange={handleChange}
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
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </Box>
      </Paper>

      {/* Success Dialog */}
      <Dialog open={success} onClose={handleCloseDialog}>
        <DialogTitle>Feedback Submitted Successfully</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your feedback has been submitted successfully.
          </DialogContentText>
          <Typography variant="h6" sx={{ 
            mt: 2, 
            fontFamily: 'monospace',
            backgroundColor: theme => theme.palette.grey[100],
            p: 2,
            borderRadius: 1
          }}>
            Tracking ID: {trackingId}
          </Typography>
          <DialogContentText sx={{ mt: 2 }}>
            Please save this ID to track the status of your feedback.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SubmitFeedback;