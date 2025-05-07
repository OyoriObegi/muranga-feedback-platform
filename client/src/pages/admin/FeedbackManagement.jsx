import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem, FormControl, InputLabel, Snackbar } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function FeedbackManagement() {
  const { admin } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const query = useQuery();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('/api/admin/feedback', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFeedbacks(response.data.feedbacks || response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch feedback');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  // Filtering logic
  const categoryFilter = query.get('category');
  const statusFilter = query.get('status');
  let filteredFeedbacks = feedbacks;
  if (categoryFilter) {
    filteredFeedbacks = filteredFeedbacks.filter(fb => fb.category === categoryFilter);
  }
  if (statusFilter) {
    filteredFeedbacks = filteredFeedbacks.filter(fb => fb.status === statusFilter);
  }

  const handleViewDetails = (fb) => {
    setSelectedFeedback(fb);
    setNewStatus(fb.status);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFeedback(null);
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    if (!selectedFeedback) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`/api/admin/feedback/${selectedFeedback.id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update local state
      setFeedbacks((prev) => prev.map(fb => fb.id === selectedFeedback.id ? { ...fb, status: newStatus } : fb));
      setSelectedFeedback((prev) => ({ ...prev, status: newStatus }));
      setSnackbarMsg('Status updated successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMsg('Failed to update status');
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Feedback Management
        </Typography>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {!loading && !error && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tracking ID</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFeedbacks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No feedback found.</TableCell>
                  </TableRow>
                ) : (
                  filteredFeedbacks.map((fb) => (
                    <TableRow key={fb.id}>
                      <TableCell>{fb.trackingId || fb.tracking_id || fb.id}</TableCell>
                      <TableCell>{fb.category}</TableCell>
                      <TableCell>{fb.status}</TableCell>
                      <TableCell>
                        <Button variant="outlined" size="small" onClick={() => handleViewDetails(fb)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {/* Feedback Details Modal */}
        <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
          <DialogTitle>Feedback Details</DialogTitle>
          <DialogContent>
            {selectedFeedback && (
              <>
                <DialogContentText><b>Tracking ID:</b> {selectedFeedback.trackingId || selectedFeedback.tracking_id || selectedFeedback.id}</DialogContentText>
                <DialogContentText><b>Category:</b> {selectedFeedback.category}</DialogContentText>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    value={newStatus}
                    label="Status"
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="received">Received</MenuItem>
                    <MenuItem value="acknowledged">Acknowledged</MenuItem>
                    <MenuItem value="under_investigation">Under Investigation</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
                <DialogContentText sx={{ mt: 2 }}><b>Message:</b> {selectedFeedback.message}</DialogContentText>
                <DialogContentText><b>Created At:</b> {new Date(selectedFeedback.createdAt).toLocaleString()}</DialogContentText>
                {selectedFeedback.department && <DialogContentText><b>Department:</b> {selectedFeedback.department}</DialogContentText>}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
            <Button onClick={handleUpdateStatus} variant="contained" color="primary" disabled={newStatus === selectedFeedback?.status}>Update Status</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMsg}
        />
      </Box>
    </Container>
  );
}