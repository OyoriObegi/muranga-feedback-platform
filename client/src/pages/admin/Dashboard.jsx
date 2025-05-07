import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress, Alert, Grid, Paper, Tooltip } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleCardClick = (filterType, filterValue) => {
    navigate(`/admin/feedback?${filterType}=${filterValue}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Welcome to the administration panel
        </Typography>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {!loading && !error && stats && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title="Total number of feedback submissions received." arrow>
                <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer', bgcolor: 'primary.main', color: 'primary.contrastText', boxShadow: 4, '&:hover': { bgcolor: 'primary.dark' } }} onClick={() => handleCardClick('all', 'all')}>
                  <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    Total Feedback <InfoOutlinedIcon fontSize="small" />
                  </Typography>
                  <Typography variant="h4">{stats.totalCount}</Typography>
                </Paper>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title="Number of complaints submitted." arrow>
                <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer', bgcolor: 'secondary.main', color: 'secondary.contrastText', boxShadow: 4, '&:hover': { bgcolor: 'secondary.dark', color: 'secondary.contrastText' } }} onClick={() => handleCardClick('category', 'complaint')}>
                  <Typography variant="h6" sx={{ color: 'primary.dark', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    Complaints <InfoOutlinedIcon fontSize="small" />
                  </Typography>
                  <Typography variant="h4">{stats.categoryStats?.find(c => c.category === 'complaint')?.count || 0}</Typography>
                </Paper>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title="Number of compliments submitted." arrow>
                <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer', bgcolor: 'primary.light', color: 'primary.contrastText', boxShadow: 4, '&:hover': { bgcolor: 'primary.main' } }} onClick={() => handleCardClick('category', 'compliment')}>
                  <Typography variant="h6" sx={{ color: 'secondary.dark', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    Compliments <InfoOutlinedIcon fontSize="small" />
                  </Typography>
                  <Typography variant="h4">{stats.categoryStats?.find(c => c.category === 'compliment')?.count || 0}</Typography>
                </Paper>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title="Number of suggestions submitted." arrow>
                <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer', bgcolor: 'secondary.light', color: 'secondary.contrastText', boxShadow: 4, '&:hover': { bgcolor: 'secondary.main', color: 'secondary.contrastText' } }} onClick={() => handleCardClick('category', 'suggestion')}>
                  <Typography variant="h6" sx={{ color: 'primary.dark', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    Suggestions <InfoOutlinedIcon fontSize="small" />
                  </Typography>
                  <Typography variant="h4">{stats.categoryStats?.find(c => c.category === 'suggestion')?.count || 0}</Typography>
                </Paper>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title="Number of feedback marked as resolved." arrow>
                <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer', bgcolor: 'primary.dark', color: 'primary.contrastText', boxShadow: 4, '&:hover': { bgcolor: 'primary.main' } }} onClick={() => handleCardClick('status', 'resolved')}>
                  <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    Resolved <InfoOutlinedIcon fontSize="small" />
                  </Typography>
                  <Typography variant="h4">{stats.statusStats?.find(s => s.status === 'resolved')?.count || 0}</Typography>
                </Paper>
              </Tooltip>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
}