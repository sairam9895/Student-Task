# Student Task Manager (MERN)

A full-stack app to manage student tasks with auth, CRUD, priority/status, filtering/sorting, and a responsive UI.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, Axios
- Backend: Node.js, Express, JWT, bcrypt
- Database: MongoDB (Atlas/local) with in-memory fallback

## Features
- JWT auth: register/login
- Task CRUD with priority (low/medium/high), status (todo/in-progress/completed), completed flag, due date
- Filter/search/sort: status filters, search, sort by newest/oldest/priority/due date
- Responsive UI with modal create/edit

## Prerequisites
- Node.js 16+ and npm
- MongoDB URI (optional; in-memory used if absent)

## Setup
1) Install (root + subprojects):
```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```
2) Env vars
- Backend (`backend/.env`):
```
MONGO_URI=your_mongodb_url        # optional; in-memory if missing
JWT_SECRET=your_jwt_secret        # optional; dev default if missing
DEFAULT_USER_EMAIL=student@example.com
DEFAULT_USER_NAME=Demo Student
DEFAULT_USER_PASSWORD=Password123!
PORT=5001
```
- Frontend (`frontend/.env`):
```
VITE_API_URL=http://localhost:5001
```

## Run Locally
- From root (concurrent):
```bash
npm run dev
```
- Or separately:
```bash
npm run server --prefix backend
npm run dev --prefix frontend
```
Frontend: http://localhost:5173 (proxies /api to backend). Backend: first open port from 5001.

## Demo Login
- Email: student@example.com
- Password: Password123!

## API (base `/api`, auth required for tasks)
- Auth: `POST /api/auth/register` `{ name, email, password }`; `POST /api/auth/login` `{ email, password }` → JWT
- Tasks: `POST /api/tasks` create `{ title, description, priority, dueDate, status?, completed? }`
- `GET /api/tasks?userId=...&status=pending|completed|todo|in-progress` list
- `GET /api/tasks/:id` get one
- `PUT /api/tasks/:id` update any of `{ title, description, priority, dueDate, status, completed }`
- `DELETE /api/tasks/:id` remove

## Data Models
Task:
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "title": "String",
  "description": "String",
  "priority": "low|medium|high",
  "status": "todo|in-progress|completed",
  "completed": "Boolean",
  "dueDate": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
User:
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "passwordHash": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Deployment

### MongoDB Atlas Setup
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier: M0)
3. Create a database user (Database Access)
4. Whitelist IP addresses (Network Access) - add `0.0.0.0/0` for Render
5. Get connection string: Click "Connect" → "Connect your application" → Copy the connection string
6. Replace `<password>` and `<dbname>` in the connection string

### Backend Deployment (Render)
1. Push code to GitHub
2. Go to [Render](https://render.com) and create a new "Web Service"
3. Connect your GitHub repository
4. Settings:
   - **Name**: `student-task-manager-api` (or your choice)
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (or set to `backend` if deploying only backend)
5. Environment Variables (add these in Render dashboard):
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_strong_random_secret_key
   FRONTEND_URL=https://your-app.vercel.app
   NODE_ENV=production
   PORT=5001
   ```
6. Deploy and copy the backend URL (e.g., `https://your-backend.onrender.com`)

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Environment Variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
5. Deploy
6. After deployment, update `FRONTEND_URL` in Render backend env vars with your Vercel URL

### Post-Deployment
- Test login/register functionality
- Verify CORS is working (check browser console for errors)
- Ensure MongoDB Atlas allows connections from Render's IPs

