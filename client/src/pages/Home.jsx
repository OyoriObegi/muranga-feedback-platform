import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SecurityIcon from '@mui/icons-material/Security';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <FeedbackIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />,
      title: 'Submit Feedback',
      description: 'Share your complaints, compliments, or suggestions anonymously.',
      action: () => navigate('/submit')
    },
    {
      icon: <TrackChangesIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />,
      title: 'Track Status',
      description: 'Monitor the progress of your submitted feedback using your tracking ID.',
      action: () => navigate('/track')
    },
    {
      icon: <SecurityIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />,
      title: 'Secure & Anonymous',
      description: 'Your privacy is guaranteed. No personal information is collected or stored.',
      action: null
    }
  ];

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: { xs: 3, sm: 4, md: 6 },
          mt: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Murang'a County Feedback Platform
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          paragraph
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
          }}
        >
          Your voice matters. Share your thoughts anonymously and help us improve our services.
        </Typography>
      </Box>

      <Grid 
        container 
        spacing={{ xs: 2, sm: 3, md: 4 }} 
        justifyContent="center"
        sx={{ flex: 1 }}
      >
        {features.map((feature, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={index}
            sx={{ 
              display: 'flex',
              height: { xs: 'auto', sm: '100%' }
            }}
          >
            <Card
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                <Box sx={{ mb: { xs: 1, sm: 2 }, color: 'primary.main' }}>
                  {feature.icon}
                </Box>
                <Typography 
                  gutterBottom 
                  variant="h5" 
                  component="h2"
                  sx={{
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
              {feature.action && (
                <CardActions sx={{ justifyContent: 'center', pb: { xs: 2, sm: 3 } }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={feature.action}
                    size={isMobile ? "small" : "medium"}
                  >
                    Get Started
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box 
        sx={{ 
          textAlign: 'center', 
          mt: { xs: 3, sm: 4, md: 6 },
          mb: { xs: 2, sm: 3 }
        }}
      >
        <Typography 
          variant="body1" 
          color="text.secondary" 
          paragraph
          sx={{
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          This platform is designed to ensure complete anonymity while providing a channel
          for constructive feedback to improve county services.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;