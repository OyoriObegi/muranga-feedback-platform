import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem, FormControl, InputLabel, Snackbar, TextField, InputAdornment, IconButton, Tooltip, Pagination
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const FEEDBACKS_PER_PAGE = 10;

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
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
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
  let filteredFeedbacks = feedbacks;
  if (categoryFilter) {
    filteredFeedbacks = filteredFeedbacks.filter(fb => fb.category === categoryFilter);
  }
  if (statusFilter) {
    filteredFeedbacks = filteredFeedbacks.filter(fb => fb.status === statusFilter);
  }
  if (search) {
    filteredFeedbacks = filteredFeedbacks.filter(fb =>
      (fb.message && fb.message.toLowerCase().includes(search.toLowerCase())) ||
      (fb.trackingId && fb.trackingId.toLowerCase().includes(search.toLowerCase()))
    );
  }

  // Pagination logic
  const pageCount = Math.ceil(filteredFeedbacks.length / FEEDBACKS_PER_PAGE);
  const paginatedFeedbacks = filteredFeedbacks.slice((page - 1) * FEEDBACKS_PER_PAGE, page * FEEDBACKS_PER_PAGE);

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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by message or tracking ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
            aria-label="Search feedback"
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={e => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="complaint">Complaint</MenuItem>
              <MenuItem value="compliment">Compliment</MenuItem>
              <MenuItem value="suggestion">Suggestion</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={e => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="received">Received</MenuItem>
              <MenuItem value="acknowledged">Acknowledged</MenuItem>
              <MenuItem value="under_investigation">Under Investigation</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
                {paginatedFeedbacks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No feedback found.</TableCell>
                  </TableRow>
                ) : (
                  paginatedFeedbacks.map((fb) => (
                    <TableRow key={fb.id} hover tabIndex={0} aria-label={`Feedback ${fb.trackingId}`}> 
                      <TableCell>{fb.trackingId || fb.tracking_id || fb.id}</TableCell>
                      <TableCell>{fb.category}</TableCell>
                      <TableCell>{fb.status}</TableCell>
                      <TableCell>
                        <Tooltip title="View Details" arrow>
                          <IconButton color="primary" onClick={() => handleViewDetails(fb)} aria-label="View details">
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
              aria-label="Pagination"
            />
          </Box>
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
            <Button onClick={handleCloseModal} color="secondary">Close</Button>
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