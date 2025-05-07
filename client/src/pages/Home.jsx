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
  CardActions
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SecurityIcon from '@mui/icons-material/Security';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FeedbackIcon sx={{ fontSize: 40 }} />,
      title: 'Submit Feedback',
      description: 'Share your complaints, compliments, or suggestions anonymously.',
      action: () => navigate('/submit')
    },
    {
      icon: <TrackChangesIcon sx={{ fontSize: 40 }} />,
      title: 'Track Status',
      description: 'Monitor the progress of your submitted feedback using your tracking ID.',
      action: () => navigate('/track')
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure & Anonymous',
      description: 'Your privacy is guaranteed. No personal information is collected or stored.',
      action: null
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          Murang'a County Feedback Platform
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your voice matters. Share your thoughts anonymously and help us improve our services.
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2, color: 'primary.main' }}>
                  {feature.icon}
                </Box>
                <Typography gutterBottom variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              {feature.action && (
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={feature.action}
                  >
                    Get Started
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="body1" color="text.secondary" paragraph>
          This platform is designed to ensure complete anonymity while providing a channel
          for constructive feedback to improve county services.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;