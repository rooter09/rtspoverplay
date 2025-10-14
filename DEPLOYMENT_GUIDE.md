# Deployment Guide

This guide explains how to deploy your RTSP Overlay application to production.

## Backend Deployment (Render)

### Setup

1. **Create a new Web Service on Render**
   - Repository: Connect your GitHub repository
   - Branch: `main`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`

2. **Environment Variables on Render**
   
   Add these environment variables in Render dashboard:
   
   ```
   CORS_ORIGINS=http://localhost:3000,https://your-vercel-app.vercel.app
   MONGODB_URI=your_mongodb_connection_string
   ```
   
   Replace `your-vercel-app` with your actual Vercel deployment URL.

3. **Your Backend URL**
   
   Once deployed, your backend will be available at:
   ```
   https://rtspoverplay.onrender.com
   ```

## Frontend Deployment (Vercel)

### Setup

1. **Create a new Project on Vercel**
   - Import your GitHub repository
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

2. **Environment Variables on Vercel**
   
   Add this environment variable in Vercel dashboard:
   
   ```
   REACT_APP_API_BASE_URL=https://rtspoverplay.onrender.com
   ```

3. **Deployment**
   
   - Push to main branch to trigger automatic deployment
   - Vercel will build and deploy automatically

### Production Environment Files

The application uses different environment configurations:

**Development (.env.development)**
```
REACT_APP_API_BASE_URL=http://localhost:5000
```

**Production (.env.production)**
```
REACT_APP_API_BASE_URL=https://rtspoverplay.onrender.com
```

## Local Development

### Frontend

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. The app will automatically use `.env.development` when running locally:
   ```bash
   npm start
   ```

### Backend

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file:
   ```
   CORS_ORIGINS=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/rtsp_overlay
   ```

3. Activate virtual environment:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the backend:
   ```bash
   python app.py
   ```

## Update CORS Origins

After deploying your frontend to Vercel, update the `CORS_ORIGINS` environment variable on Render to include your Vercel URL:

```
CORS_ORIGINS=http://localhost:3000,https://your-vercel-app.vercel.app
```

This allows your frontend to communicate with the backend from both localhost (development) and Vercel (production).

## Testing

1. **Local Testing**: Start both backend (localhost:5000) and frontend (localhost:3000)
2. **Production Testing**: Access your Vercel URL and ensure it connects to the Render backend

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:
1. Verify the `CORS_ORIGINS` environment variable on Render includes your Vercel URL
2. Restart the Render service after updating environment variables
3. Clear browser cache and reload

### API Connection Issues

If the frontend can't connect to the backend:
1. Check that `REACT_APP_API_BASE_URL` on Vercel points to your Render URL
2. Verify the Render service is running (check Render dashboard)
3. Test the backend health endpoint: `https://rtspoverplay.onrender.com/api/health`

### Environment Variables Not Loading

- For Vercel: Environment variables must start with `REACT_APP_`
- For Render: Restart the service after adding/changing environment variables
- Redeploy both services after updating environment variables

