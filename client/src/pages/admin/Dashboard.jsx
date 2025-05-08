import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress, Alert, Grid, Paper, Tooltip, Divider, useTheme, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import WarningIcon from '@mui/icons-material/Warning';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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

  const handleCardClick = (category) => {
    if (category === 'all') {
      navigate('/admin/feedback');
    } else {
      const categoryMap = {
        'complaint': 'complaint',
        'compliment': 'compliment',
        'suggestion': 'suggestion'
      };
      navigate(`/admin/feedback?categoryFilter=${categoryMap[category]}`);
    }
  };

  const getStatusCount = (status) => {
    return stats?.statusStats?.find(s => s.status === status)?.count || 0;
  };

  const getCategoryCount = (category) => {
    return stats?.categoryStats?.find(c => c.category === category)?.count || 0;
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        py: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Box sx={{ 
        mb: { xs: 2, sm: 3 },
        mt: { xs: 1, sm: 2 }
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            color: 'primary.main',
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
          }}
        >
          <FeedbackIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
          Admin Dashboard
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: { xs: 2, sm: 3 }, 
            color: 'text.secondary',
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Welcome to the administration panel. Monitor and manage feedback effectively.
        </Typography>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {!loading && !error && stats && (
          <>
            {/* Category Cards */}
            <Grid 
              container 
              spacing={{ xs: 2, sm: 3 }} 
              sx={{ mb: { xs: 3, sm: 4 } }}
            >
              <Grid item xs={12} sm={6} md={3}>
                <Tooltip title="Total number of feedback submissions received." arrow>
                  <Paper 
                    sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      textAlign: 'center', 
                      cursor: 'pointer', 
                      bgcolor: 'primary.main', 
                      color: 'primary.contrastText', 
                      boxShadow: 4,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: 'primary.dark',
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                      } 
                    }} 
                    onClick={() => handleCardClick('all')}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'secondary.main', 
                        fontWeight: 700, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: 1,
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }}
                    >
                      Total Feedback <InfoOutlinedIcon fontSize="small" />
                    </Typography>
                    <Typography 
                      variant="h4"
                      sx={{ 
                        fontSize: { xs: '1.5rem', sm: '2rem' }
                      }}
                    >
                      {stats.totalCount}
                    </Typography>
                  </Paper>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Tooltip title="View all complaints." arrow>
                  <Paper 
                    sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      textAlign: 'center', 
                      cursor: 'pointer', 
                      bgcolor: 'error.main', 
                      color: 'error.contrastText', 
                      boxShadow: 4,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: 'error.dark',
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                      } 
                    }} 
                    onClick={() => handleCardClick('complaint')}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: 1,
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }}
                    >
                      Complaints <WarningIcon fontSize="small" />
                    </Typography>
                    <Typography 
                      variant="h4"
                      sx={{ 
                        fontSize: { xs: '1.5rem', sm: '2rem' }
                      }}
                    >
                      {getCategoryCount('complaint')}
                    </Typography>
                  </Paper>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Tooltip title="View all compliments." arrow>
                  <Paper 
                    sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      textAlign: 'center', 
                      cursor: 'pointer', 
                      bgcolor: 'success.main', 
                      color: 'success.contrastText', 
                      boxShadow: 4,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: 'success.dark',
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                      } 
                    }} 
                    onClick={() => handleCardClick('compliment')}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: 1,
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }}
                    >
                      Compliments <ThumbUpIcon fontSize="small" />
                    </Typography>
                    <Typography 
                      variant="h4"
                      sx={{ 
                        fontSize: { xs: '1.5rem', sm: '2rem' }
                      }}
                    >
                      {getCategoryCount('compliment')}
                    </Typography>
                  </Paper>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Tooltip title="View all suggestions." arrow>
                  <Paper 
                    sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      textAlign: 'center', 
                      cursor: 'pointer', 
                      bgcolor: 'info.main', 
                      color: 'info.contrastText', 
                      boxShadow: 4,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: 'info.dark',
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                      } 
                    }} 
                    onClick={() => handleCardClick('suggestion')}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: 1,
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }}
                    >
                      Suggestions <LightbulbIcon fontSize="small" />
                    </Typography>
                    <Typography 
                      variant="h4"
                      sx={{ 
                        fontSize: { xs: '1.5rem', sm: '2rem' }
                      }}
                    >
                      {getCategoryCount('suggestion')}
                    </Typography>
                  </Paper>
                </Tooltip>
              </Grid>
            </Grid>

            {/* Status Overview Card */}
            <Paper 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                mt: { xs: 2, sm: 3 },
                boxShadow: 3,
                borderRadius: 2,
                background: 'linear-gradient(to right, #ffffff, #f8f9fa)'
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: { xs: 2, sm: 3 }, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                <InfoOutlinedIcon color="primary" />
                Status Overview
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: { xs: 1, sm: 2 },
                    p: 1,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'success.light',
                      transition: 'background-color 0.3s ease'
                    }
                  }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: { xs: 24, sm: 32 } }} />
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Resolved
                      </Typography>
                      <Typography 
                        variant="h5"
                        sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                      >
                        {getStatusCount('resolved')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: { xs: 1, sm: 2 },
                    p: 1,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'warning.light',
                      transition: 'background-color 0.3s ease'
                    }
                  }}>
                    <PendingIcon color="warning" sx={{ fontSize: { xs: 24, sm: 32 } }} />
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        In Progress
                      </Typography>
                      <Typography 
                        variant="h5"
                        sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                      >
                        {getStatusCount('under_investigation')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: { xs: 1, sm: 2 },
                    p: 1,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'info.light',
                      transition: 'background-color 0.3s ease'
                    }
                  }}>
                    <InfoOutlinedIcon color="info" sx={{ fontSize: { xs: 24, sm: 32 } }} />
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Received
                      </Typography>
                      <Typography 
                        variant="h5"
                        sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                      >
                        {getStatusCount('received')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: { xs: 1, sm: 2 },
                    p: 1,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'error.light',
                      transition: 'background-color 0.3s ease'
                    }
                  }}>
                    <ErrorIcon color="error" sx={{ fontSize: { xs: 24, sm: 32 } }} />
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Closed
                      </Typography>
                      <Typography 
                        variant="h5"
                        sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                      >
                        {getStatusCount('closed')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
}