import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/database.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://muranga-feedback-frontend.onrender.com', 'http://localhost:3000']
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Remove sensitive information from response headers
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  next();
});

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Feedback routes
import { submitFeedback } from './controllers/feedbackController.js';
import apiRouter from './routes/api.js';
app.use('/api', apiRouter);

// Root route handler
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: 'Muranga Feedback Platform API',
    version: '1.0.0'
  });
});

// Connect to PostgreSQL
sequelize.authenticate()
  .then(() => {
    return sequelize.sync();
  })
  .then(() => console.log('Database synchronized'))
  .catch(err => console.error('Database connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server with port fallback mechanism
const startServer = async (initialPort) => {
  let PORT = Number(initialPort);
  const MAX_PORT = 65535;
  
  try {
    await new Promise((resolve, reject) => {
      const server = app.listen(PORT)
        .once('listening', () => {
          resolve();
        })
        .once('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            if (PORT >= MAX_PORT) {
              reject(new Error(`No available ports found between ${initialPort} and ${MAX_PORT}`));
              return;
            }
            console.log(`Port ${PORT} is busy, trying port ${PORT + 1}`);
            server.close();
            startServer(PORT + 1);
          } else {
            reject(err);
          }
        });
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer(process.env.PORT || 5000);