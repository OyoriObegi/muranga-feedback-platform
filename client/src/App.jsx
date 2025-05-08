import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public pages
import Home from './pages/Home';
import SubmitFeedback from './pages/SubmitFeedback';
import TrackFeedback from './pages/TrackFeedback';

// Admin pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import FeedbackManagement from './pages/admin/FeedbackManagement';
import Analytics from './pages/admin/Analytics';
import AdminRegister from './pages/admin/Register';

// Auth context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AuthProvider>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          overflow: 'hidden'
        }}
      >
        <Navbar />
        <Container 
          component="main" 
          sx={{ 
            flex: 1,
            py: { xs: 2, sm: 3, md: 4 },
            px: { xs: 2, sm: 3, md: 4 },
            maxWidth: '100% !important',
            width: '100%',
            overflow: 'auto'
          }}
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/submit" element={<SubmitFeedback />} />
            <Route path="/track" element={<TrackFeedback />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/feedback"
              element={
                <ProtectedRoute>
                  <FeedbackManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/register" element={<AdminRegister />} />
          </Routes>
        </Container>
        <Footer />
      </Box>
    </AuthProvider>
  );
}

export default App;