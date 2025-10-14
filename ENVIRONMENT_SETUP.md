# Environment Configuration Guide

This project is configured to work seamlessly with both **localhost** (development) and **production** (Vercel + Render) environments.

## 🎯 Current Configuration

### Frontend (Vercel Deployment)
- **Development URL**: http://localhost:3000
- **Production URL**: Your Vercel deployment URL
- **Backend Connection**: Automatically switches based on environment

### Backend (Render Deployment)
- **Production URL**: https://rtspoverplay.onrender.com
- **Development URL**: http://localhost:5000

## 📁 Environment Files

### Frontend Environment Files

Located in `frontend/` directory:

#### `.env.development` (for local development)
```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

#### `.env.production` (for Vercel deployment)
```env
REACT_APP_API_BASE_URL=https://rtspoverplay.onrender.com
```

#### `.env.example` (template)
```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

### Backend Environment Configuration

Create a `.env` file in `backend/` directory:

#### For Local Development:
```env
CORS_ORIGINS=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/rtsp_overlay
```

#### For Production (Render):
Set these environment variables in Render dashboard:
```env
CORS_ORIGINS=http://localhost:3000,https://your-vercel-app.vercel.app
MONGODB_URI=your_mongodb_atlas_connection_string
```

**Important**: Replace `your-vercel-app` with your actual Vercel deployment URL.

## 🚀 How It Works

### Automatic Environment Detection

The frontend automatically uses the correct backend URL based on the build environment:

1. **Development Mode** (`npm start`):
   - Uses `.env.development`
   - Connects to: `http://localhost:5000`

2. **Production Build** (`npm run build`):
   - Uses `.env.production`
   - Connects to: `https://rtspoverplay.onrender.com`

### Configuration File

The `frontend/src/config.js` file exports the API base URL:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
export { API_BASE_URL };
```

All API calls in the frontend use this `API_BASE_URL` constant.

## 🔧 Setup Instructions

### First Time Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd rtspoverplay
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Environment files are already configured!
   ```

3. **Backend Setup**
   ```bash
   cd backend
   
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Create .env file
   echo CORS_ORIGINS=http://localhost:3000 > .env
   echo MONGODB_URI=mongodb://localhost:27017/rtsp_overlay >> .env
   ```

### Running Locally

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The app will open at `http://localhost:3000` and connect to `http://localhost:5000`.

## 🌐 Production Deployment

### Update Vercel Deployment

After getting your Vercel URL, update the backend CORS configuration on Render:

1. Go to Render Dashboard → Your Service → Environment
2. Update `CORS_ORIGINS`:
   ```
   http://localhost:3000,https://your-actual-vercel-url.vercel.app
   ```
3. Click "Save Changes" (service will automatically restart)

### Vercel Environment Variables

In your Vercel project settings, ensure this variable is set:
```
REACT_APP_API_BASE_URL=https://rtspoverplay.onrender.com
```

## ✅ Verification

### Test Local Setup

1. Start backend and frontend locally
2. Open http://localhost:3000
3. Check browser console - should see API calls to `http://localhost:5000`

### Test Production Setup

1. Visit your Vercel URL
2. Open browser DevTools → Network tab
3. Verify API calls go to `https://rtspoverplay.onrender.com`
4. Check for CORS errors (there should be none!)

## 🔍 Troubleshooting

### CORS Errors in Production

**Symptom**: Frontend can't connect to backend, CORS errors in console

**Solution**:
1. Verify Render environment variable `CORS_ORIGINS` includes your Vercel URL
2. Restart Render service after updating environment variables
3. Clear browser cache and reload

### Environment Variables Not Loading

**Frontend**:
- Environment variables MUST start with `REACT_APP_`
- Rebuild the app after changing `.env` files: `npm run build`
- On Vercel, redeploy after changing environment variables

**Backend**:
- Verify `.env` file exists in `backend/` directory
- On Render, check Environment tab in dashboard
- Restart service after updating variables

### Wrong Backend URL Being Used

**Check**:
1. Open browser DevTools → Console
2. Type: `console.log(process.env.REACT_APP_API_BASE_URL)`
3. Verify it shows the correct URL for your environment

**Fix**:
- Local: Check `frontend/.env.development`
- Production: Check Vercel environment variables

## 📝 Files Modified

The following files now use the dynamic API configuration:

- `frontend/src/config.js` - Central configuration
- `frontend/src/components/StreamControls.jsx`
- `frontend/src/components/OverlayControls.jsx`
- `frontend/src/components/OverlayManager.jsx`
- `frontend/src/components/VideoPlayer.jsx`
- `frontend/src/pages/LandingPage.jsx`
- `backend/app.py` - CORS configuration

## 🎉 Summary

✅ **Localhost** support maintained for development  
✅ **Render** backend URL configured for production  
✅ Automatic environment detection  
✅ CORS properly configured  
✅ No code changes needed when switching environments  

Your application now seamlessly works in both development and production!

