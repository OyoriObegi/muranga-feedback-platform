# Murang'a Feedback Platform - Render Deployment Guide

This guide will walk you through deploying the Murang'a Feedback Platform on Render.

## Prerequisites

- GitHub repository with your code
- Render account (free tier available)

## Step 1: Database Setup

### Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name:** `muranga-feedback-db`
   - **Database:** `muranga_feedback`
   - **User:** Leave default
   - **Region:** Choose closest to your users
   - **Plan:** Free (for testing)
4. Click "Create Database"
5. Wait for creation and note the connection details

## Step 2: Backend API Deployment

### Deploy Web Service

1. In Render Dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** `muranga-feedback-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** (leave empty)

### Environment Variables

Add these in the "Environment" tab:

```
DB_NAME=muranga_feedback
DB_USER=[from your PostgreSQL service]
DB_PASSWORD=[from your PostgreSQL service]
DB_HOST=[from your PostgreSQL service]
DB_PORT=5432
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
```

4. Click "Create Web Service"

## Step 3: Update Frontend Configuration

### Option A: Single Service Deployment (Recommended)

Since your backend serves the frontend in production, you don't need a separate frontend service. The backend will automatically serve the built React app.

### Option B: Separate Frontend Service (If needed)

If you want separate services:

1. Create another Web Service for the frontend
2. Configure:
   - **Name:** `muranga-feedback-frontend`
   - **Environment:** `Static Site`
   - **Build Command:** `cd client && npm install && npm run build`
   - **Publish Directory:** `client/dist`
   - **Root Directory:** (leave empty)

## Step 4: Update CORS Configuration

Update the CORS origin in `server.js` with your actual frontend URL:

```javascript
origin: process.env.NODE_ENV === 'production' 
  ? ['https://your-frontend-app-name.onrender.com', 'http://localhost:3000']
  : 'http://localhost:3000',
```

## Step 5: Test Your Deployment

1. Wait for both services to deploy
2. Test the API endpoint: `https://your-api-service.onrender.com/api/health`
3. Test the frontend: `https://your-api-service.onrender.com/`

## Step 6: Set Up Custom Domain (Optional)

1. In your Render service settings
2. Go to "Settings" → "Custom Domains"
3. Add your domain and configure DNS

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_NAME` | PostgreSQL database name | `muranga_feedback` |
| `DB_USER` | Database username | `user_abc123` |
| `DB_PASSWORD` | Database password | `password123` |
| `DB_HOST` | Database host | `dpg-abc123-a.oregon-postgres.render.com` |
| `DB_PORT` | Database port | `5432` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key_here` |
| `NODE_ENV` | Environment | `production` |

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check environment variables
   - Ensure database is running
   - Verify network access

2. **Build Failed**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

3. **CORS Errors**
   - Update CORS origin with correct frontend URL
   - Check if frontend is making requests to correct API URL

### Logs

- Check Render service logs for detailed error information
- Use `console.log` statements for debugging

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **JWT Secret**: Use a strong, random secret
3. **Database**: Use strong passwords
4. **HTTPS**: Render provides SSL certificates automatically

## Monitoring

- Set up health checks in Render
- Monitor service logs
- Set up alerts for downtime

## Cost Optimization

- Use free tier for testing
- Upgrade only when needed
- Monitor usage in Render dashboard 