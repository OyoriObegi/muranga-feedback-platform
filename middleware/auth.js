import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Protect routes - verify token
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach admin to request object
      req.admin = await Admin.findByPk(decoded.id);
      
      if (!req.admin) {
        return res.status(401).json({ message: 'Not authorized to access this route' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error authenticating request' });
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        message: 'Not authorized to perform this action'
      });
    }
    next();
  };
};

// Remove sensitive information from requests
export const sanitizeRequest = (req, res, next) => {
  // Remove IP address and other identifying information
  delete req.ip;
  delete req.ips;
  delete req.hostname;
  
  // Remove headers that might contain identifying information
  const sanitizedHeaders = { ...req.headers };
  delete sanitizedHeaders['x-forwarded-for'];
  delete sanitizedHeaders['x-real-ip'];
  delete sanitizedHeaders['user-agent'];
  req.headers = sanitizedHeaders;

  next();
};