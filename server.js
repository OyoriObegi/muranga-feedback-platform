import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/database.js';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-app-name.onrender.com', 'http://localhost:3000']
    : 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Remove sensitive information from response headers
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  next();
});

// Serve static files from the React app build directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
}

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

// Catch all handler: send back React's index.html file for any non-API routes
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });
}

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