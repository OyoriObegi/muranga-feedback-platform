import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress, Alert, Grid, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
              <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }} onClick={() => handleCardClick('all', 'all')}>
                <Typography variant="h6">Total Feedback</Typography>
                <Typography variant="h4">{stats.totalCount}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }} onClick={() => handleCardClick('category', 'complaint')}>
                <Typography variant="h6">Complaints</Typography>
                <Typography variant="h4">{stats.categoryStats?.find(c => c.category === 'complaint')?.count || 0}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }} onClick={() => handleCardClick('category', 'compliment')}>
                <Typography variant="h6">Compliments</Typography>
                <Typography variant="h4">{stats.categoryStats?.find(c => c.category === 'compliment')?.count || 0}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }} onClick={() => handleCardClick('category', 'suggestion')}>
                <Typography variant="h6">Suggestions</Typography>
                <Typography variant="h4">{stats.categoryStats?.find(c => c.category === 'suggestion')?.count || 0}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }} onClick={() => handleCardClick('status', 'resolved')}>
                <Typography variant="h6">Resolved</Typography>
                <Typography variant="h4">{stats.statusStats?.find(s => s.status === 'resolved')?.count || 0}</Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
}