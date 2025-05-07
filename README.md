# Murang'a County Feedback Platform

A secure, anonymous digital feedback platform for Murang'a County Government employees and administrators.

## Features
- Anonymous feedback submission (complaints, compliments, suggestions)
- Feedback tracking via unique ID
- Admin dashboard with analytics and feedback management
- Status updates and departmental assignment
- JWT-based admin authentication

## Tech Stack
- **Frontend:** React, Material UI, Recharts, Vite
- **Backend:** Node.js, Express, Sequelize
- **Database:** PostgreSQL

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd <your-repo-directory>
```

### 2. Backend Setup
- Create a `.env` file in the root directory (see `.env.example`):
```
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=24h
PORT=5000
```
- Install dependencies:
```sh
npm install
```
- Start the backend:
```sh
npm run server
```

### 3. Frontend Setup
```sh
cd client
npm install
npm run dev
```

### 4. Deployment
- **Frontend:** Build with `npm run build` in `client/` and deploy the `dist/` folder to GitHub Pages or your static host.
- **Backend:** Deploy to a Node.js host (Render, Railway, Heroku, VPS, etc.).
- **Note:** GitHub Pages only supports static sites. The backend must be deployed separately.

## Environment Variables
- Never commit your `.env` file. It is already in `.gitignore`.

## API Endpoints (Summary)
- `POST /api/feedback` — Submit feedback
- `GET /api/feedback/:trackingId` — Track feedback status
- `POST /api/admin/login` — Admin login
- `GET /api/admin/feedback` — List all feedback (admin)
- `PUT /api/admin/feedback/:id` — Update feedback (admin)
- `GET /api/admin/analytics` — Analytics (admin)

## Accessibility & Responsiveness
- Fully responsive and mobile-friendly
- Uses accessible Material UI components

## Future Enhancements
- Pagination and search for feedback management
- Role-based access control for admins
- Email notifications for new feedback/status changes
- Departmental assignment workflow
- Audit logs for admin actions

## License
MIT 