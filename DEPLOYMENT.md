# Deployment Guide

This guide walks you through deploying the Student Task Manager to MongoDB Atlas, Vercel (frontend), and Render (backend).

## Prerequisites
- GitHub account
- MongoDB Atlas account (free tier available)
- Vercel account (free tier available)
- Render account (free tier available)

---

## Step 1: MongoDB Atlas Setup

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up
2. **Create Cluster**: 
   - Click "Build a Database"
   - Choose FREE (M0) tier
   - Select a cloud provider and region
   - Click "Create"
3. **Create Database User**:
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set user privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"
4. **Network Access**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for Render
   - Click "Confirm"
5. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `taskmanager` (or your preferred database name)
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority`

---

## Step 2: Backend Deployment (Render)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Create Render Service**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub account and select your repository

3. **Configure Service**:
   - **Name**: `student-task-manager-api` (or your choice)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (or set to `backend` if deploying only backend)
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`

4. **Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
   JWT_SECRET=your_very_strong_random_secret_key_here_min_32_chars
   FRONTEND_URL=https://your-app.vercel.app
   NODE_ENV=production
   PORT=5001
   ```
   - Generate a strong JWT_SECRET: `openssl rand -base64 32`
   - For FRONTEND_URL, you'll update this after deploying frontend

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://student-task-manager-api.onrender.com`)

---

## Step 3: Frontend Deployment (Vercel)

1. **Push to GitHub** (if not already done)

2. **Create Vercel Project**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure Project**:
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables**:
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```
   - Replace with your actual Render backend URL

5. **Deploy**:
   - Click "Deploy"
   - Wait for build (2-5 minutes)
   - Copy your frontend URL (e.g., `https://student-task-manager.vercel.app`)

---

## Step 4: Update Backend CORS

1. Go back to Render dashboard
2. Edit your backend service
3. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
4. Save and redeploy (or it will auto-redeploy)

---

## Step 5: Verify Deployment

1. **Test Frontend**: Visit your Vercel URL
2. **Test Registration**: Create a new account
3. **Test Login**: Log in with your credentials
4. **Test Tasks**: Create, edit, delete tasks
5. **Check Console**: Open browser DevTools → Console, ensure no CORS errors

---

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` in Render matches your Vercel URL exactly (including `https://`)
- Check browser console for specific CORS error messages
- Ensure backend is running (check Render logs)

### Database Connection Issues
- Verify MongoDB Atlas connection string is correct
- Check Network Access allows `0.0.0.0/0` (or Render's IPs)
- Verify database user credentials
- Check Render logs for connection errors

### API Not Working
- Verify `VITE_API_URL` in Vercel matches your Render backend URL
- Check that backend is deployed and running
- Verify environment variables are set correctly
- Check browser Network tab for failed requests

### Build Failures
- Check Render/Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

---

## Environment Variables Summary

### Backend (Render)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
PORT=5001
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## Post-Deployment Checklist

- [ ] MongoDB Atlas cluster is running
- [ ] Database user created and password saved
- [ ] Network access configured (0.0.0.0/0)
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set correctly
- [ ] CORS configured with frontend URL
- [ ] Can register new users
- [ ] Can login
- [ ] Can create/edit/delete tasks
- [ ] No console errors

---

## Cost Estimate (Free Tier)

- **MongoDB Atlas**: Free (M0 cluster, 512MB storage)
- **Vercel**: Free (unlimited projects, 100GB bandwidth)
- **Render**: Free (750 hours/month, sleeps after 15min inactivity)

**Note**: Render free tier services "spin down" after 15 minutes of inactivity. First request after spin-down takes ~30 seconds to wake up.

