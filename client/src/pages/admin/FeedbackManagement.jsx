import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem, FormControl, InputLabel, Snackbar, TextField, InputAdornment, IconButton, Tooltip, Pagination, Chip
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const FEEDBACKS_PER_PAGE = 10;

const getStatusColor = (status) => {
  switch (status) {
    case 'resolved':
      return 'success';
    case 'under_investigation':
      return 'warning';
    case 'received':
      return 'info';
    case 'closed':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'resolved':
      return <CheckCircleIcon />;
    case 'under_investigation':
      return <PendingIcon />;
    case 'received':
      return <InfoIcon />;
    case 'closed':
      return <ErrorIcon />;
    default:
      return null;
  }
};

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

  // Set initial filters from URL parameters
  useEffect(() => {
    const categoryFromUrl = query.get('categoryFilter');
    if (categoryFromUrl) {
      setCategoryFilter(categoryFromUrl);
    }
  }, [query]);

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
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          color: 'primary.main',
          fontWeight: 'bold'
        }}>
          <FeedbackIcon sx={{ fontSize: 40 }} />
          Feedback Management
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Manage and respond to user feedback effectively
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          mb: 3, 
          alignItems: 'center',
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1
        }}>
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
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              }
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
              startAdornment={
                <InputAdornment position="start">
                  <SortIcon />
                </InputAdornment>
              }
              aria-label="Filter by status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="received">Received</MenuItem>
              <MenuItem value="under_investigation">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {!loading && !error && (
          <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Tracking ID</TableCell>
                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedFeedbacks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No feedback found matching your criteria.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedFeedbacks.map((fb) => (
                    <TableRow 
                      key={fb.id} 
                      hover 
                      tabIndex={0} 
                      aria-label={`Feedback ${fb.trackingId}`}
                      sx={{ 
                        '&:hover': { 
                          bgcolor: 'action.hover',
                          transition: 'background-color 0.3s ease'
                        }
                      }}
                    > 
                      <TableCell>{fb.trackingId || fb.tracking_id || fb.id}</TableCell>
                      <TableCell>
                        <Chip 
                          label={fb.category} 
                          color={fb.category === 'complaint' ? 'error' : fb.category === 'compliment' ? 'success' : 'info'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(fb.status)}
                          label={fb.status.replace('_', ' ')}
                          color={getStatusColor(fb.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details" arrow>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleViewDetails(fb)} 
                            aria-label="View details"
                            sx={{
                              '&:hover': {
                                transform: 'scale(1.1)',
                                transition: 'transform 0.2s ease'
                              }
                            }}
                          >
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
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
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

        <Dialog 
          open={modalOpen} 
          onClose={handleCloseModal} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: 6
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: 'primary.main', 
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <FeedbackIcon />
            Feedback Details
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedFeedback && (
              <>
                <DialogContentText sx={{ mb: 2 }}>
                  <strong>Tracking ID:</strong> {selectedFeedback.trackingId || selectedFeedback.tracking_id || selectedFeedback.id}
                </DialogContentText>
                <DialogContentText sx={{ mb: 2 }}>
                  <strong>Category:</strong>{' '}
                  <Chip 
                    label={selectedFeedback.category} 
                    color={selectedFeedback.category === 'complaint' ? 'error' : selectedFeedback.category === 'compliment' ? 'success' : 'info'}
                    size="small"
                  />
                </DialogContentText>
                <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    value={newStatus}
                    label="Status"
                    onChange={handleStatusChange}
                    startAdornment={
                      <InputAdornment position="start">
                        {getStatusIcon(newStatus)}
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="received">Received</MenuItem>
                    <MenuItem value="under_investigation">In Progress</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
                <DialogContentText sx={{ mb: 2 }}>
                  <strong>Message:</strong>
                  <Paper sx={{ p: 2, mt: 1, bgcolor: 'grey.50' }}>
                    {selectedFeedback.message}
                  </Paper>
                </DialogContentText>
                <DialogContentText>
                  <strong>Created At:</strong> {new Date(selectedFeedback.createdAt).toLocaleString()}
                </DialogContentText>
                {selectedFeedback.department && (
                  <DialogContentText sx={{ mt: 1 }}>
                    <strong>Department:</strong> {selectedFeedback.department}
                  </DialogContentText>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Button 
              onClick={handleCloseModal} 
              color="secondary"
              variant="outlined"
            >
              Close
            </Button>
            <Button 
              onClick={handleUpdateStatus} 
              variant="contained" 
              color="primary" 
              disabled={newStatus === selectedFeedback?.status}
              startIcon={<CheckCircleIcon />}
            >
              Update Status
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMsg}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </Container>
  );
}