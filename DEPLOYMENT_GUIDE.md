# Deployment Guide - Making Your App Work on Both Local and Production

This guide will help you deploy your RTSP Overlay application so it works seamlessly on both localhost and production (Vercel + Render).

## 🎯 Current Issue

The app works on `localhost` but fails on production because:
1. ❌ Frontend environment files were missing
2. ❌ Backend CORS not configured for production domain
3. ❌ Frontend not configured to use Render backend URL

## ✅ Solution Implemented

I've created the necessary configuration files:
- `frontend/.env.development` - Uses `http://localhost:5000`
- `frontend/.env.production` - Uses `https://rtspoverplay.onrender.com`
- `backend/.env` - CORS configuration template

## 📋 Step-by-Step Deployment Instructions

### Step 1: Get Your Vercel Deployment URL

1. Deploy your frontend to Vercel:
   ```bash
   # From project root
   cd frontend
   vercel
   ```

2. Or push to GitHub and let Vercel auto-deploy

3. **Copy your Vercel URL** (example: `https://rtspoverplay-frontend.vercel.app`)

### Step 2: Update Backend CORS Configuration

You need to allow your Vercel frontend URL in the backend CORS settings.

#### For Render Deployment:

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your backend service (`rtspoverplay`)
3. Go to **Environment** tab
4. Add or update the `CORS_ORIGINS` variable:
   ```
   http://localhost:3000,https://your-actual-vercel-url.vercel.app
   ```
   **Important:** Replace `your-actual-vercel-url` with your real Vercel URL!

5. Click **Save Changes** (Render will automatically restart your service)

#### For Local Development:

The `backend/.env` file is already configured for localhost:
```env
CORS_ORIGINS=http://localhost:3000
```

To support both local and production during development:
```env
CORS_ORIGINS=http://localhost:3000,https://your-vercel-url.vercel.app
```

### Step 3: Deploy Frontend to Vercel

#### Option A: Using Vercel CLI

```bash
cd frontend
vercel --prod
```

#### Option B: Using GitHub (Automatic)

1. Commit the new environment files:
   ```bash
   git add frontend/.env.development frontend/.env.production
   git commit -m "Add environment configuration files"
   git push origin main
   ```

2. Vercel will automatically deploy when you push to main

#### Option C: Manual Vercel Dashboard

1. Go to Vercel Dashboard
2. Import your GitHub repository
3. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Environment Variables:** (Optional, .env.production already has this)
     - Name: `REACT_APP_API_BASE_URL`
     - Value: `https://rtspoverplay.onrender.com`

4. Click **Deploy**

### Step 4: Update Backend CORS with Real Vercel URL

After Vercel deployment completes:

1. Copy your Vercel deployment URL (e.g., `https://rtspoverplay-abc123.vercel.app`)
2. Go to Render Dashboard → Environment
3. Update `CORS_ORIGINS`:
   ```
   http://localhost:3000,https://rtspoverplay-abc123.vercel.app
   ```
4. Save (Render will restart automatically)

### Step 5: Verify Everything Works

#### Test Local Environment:

```bash
# Terminal 1: Start Backend
cd backend
venv\Scripts\activate
python app.py

# Terminal 2: Start Frontend
cd frontend
npm start
```

- Open http://localhost:3000
- Check browser console - API calls should go to `http://localhost:5000`
- Start a stream and add overlays to test

#### Test Production Environment:

1. Visit your Vercel URL: `https://your-vercel-url.vercel.app`
2. Open Browser DevTools (F12) → **Network** tab
3. Try to start a stream
4. Verify:
   - ✅ API calls go to `https://rtspoverplay.onrender.com`
   - ✅ No CORS errors in console
   - ✅ Stream starts successfully
   - ✅ Overlays can be added/edited

## 🔍 Troubleshooting

### Issue: CORS Error in Production

**Symptom:** Console shows `Access-Control-Allow-Origin` error

**Solution:**
1. Double-check `CORS_ORIGINS` on Render includes your **exact** Vercel URL
2. Ensure no trailing slashes: ✅ `https://app.vercel.app` ❌ `https://app.vercel.app/`
3. Restart Render service after changing environment variables

### Issue: Frontend Still Uses Localhost in Production

**Symptom:** Network tab shows calls to `http://localhost:5000` on production

**Solution:**
1. Verify `frontend/.env.production` exists and contains:
   ```
   REACT_APP_API_BASE_URL=https://rtspoverplay.onrender.com
   ```
2. Rebuild and redeploy:
   ```bash
   npm run build
   vercel --prod
   ```

### Issue: Preview Deployments Don't Work

**Symptom:** Vercel preview deployments (for PRs) show CORS errors

**Solution:**
Preview deployments have different URLs. Either:
1. Add each preview URL to CORS_ORIGINS (not recommended)
2. Or test only on main production deployment

### Issue: Stream Not Loading

**Symptom:** "Stream Error" or infinite loading

**Possible Causes:**
1. Render backend might be sleeping (free tier sleeps after inactivity)
2. RTSP stream source might be unreachable from Render
3. FFmpeg might not be installed on Render

**Solution:**
1. Check Render logs for errors
2. Ensure FFmpeg is installed in Render environment
3. Test with public RTSP stream first: `rtsp://rtsp.me/abcd1234/`

## 📁 Configuration Files Summary

After following this guide, you should have:

```
rtspoverplay/
├── frontend/
│   ├── .env.development          # ✅ Created - uses localhost:5000
│   ├── .env.production           # ✅ Created - uses Render URL
│   └── src/config.js             # ✅ Already exists - auto-detects environment
│
└── backend/
    ├── .env                       # ✅ Created - local development
    ├── .env.example              # ✅ Created - template
    └── app.py                    # ✅ Already configured for CORS
```

## 🎯 Environment Detection Flow

### Local Development (`npm start`):
```
1. React detects NODE_ENV=development
2. Loads frontend/.env.development
3. Sets REACT_APP_API_BASE_URL=http://localhost:5000
4. All API calls go to localhost backend
```

### Production Build (`npm run build`):
```
1. React detects NODE_ENV=production
2. Loads frontend/.env.production
3. Sets REACT_APP_API_BASE_URL=https://rtspoverplay.onrender.com
4. All API calls go to Render backend
```

### Backend CORS:
```
1. Flask reads CORS_ORIGINS from environment
2. Local: Allows http://localhost:3000
3. Production (Render): Allows both localhost + Vercel URL
4. Validates origin on each request
```

## 🚀 Quick Deploy Checklist

Use this checklist when deploying:

### Backend (Render):
- [ ] Service created and connected to GitHub
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `gunicorn app:app`
- [ ] Environment variables set:
  - [ ] `CORS_ORIGINS` includes Vercel URL
  - [ ] `MONGODB_URI` points to MongoDB Atlas
- [ ] Service is running (check logs)

### Frontend (Vercel):
- [ ] Project imported from GitHub
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `build`
- [ ] `.env.production` file exists with Render URL
- [ ] Deployment successful

### Testing:
- [ ] Local environment works (localhost:3000 → localhost:5000)
- [ ] Production works (Vercel URL → Render URL)
- [ ] No CORS errors in console
- [ ] Stream starts successfully
- [ ] Overlays work correctly

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ **Local development:** App loads on http://localhost:3000, connects to localhost:5000
2. ✅ **Production:** App loads on Vercel URL, connects to Render backend
3. ✅ **No CORS errors** in browser console
4. ✅ **Network tab** shows correct API calls
5. ✅ **Stream works** on both environments
6. ✅ **Overlays work** on both environments

## 📚 Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Render Environment Variables Documentation](https://render.com/docs/environment-variables)
- [Flask-CORS Documentation](https://flask-cors.readthedocs.io/)
- [Create React App Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)

## 🆘 Need Help?

If you're still having issues:

1. **Check browser console** for errors
2. **Check Render logs** for backend errors
3. **Verify all URLs** are correct (no typos!)
4. **Clear browser cache** and try again
5. **Test health endpoint:** Visit `https://rtspoverplay.onrender.com/api/health`

---

**Made with ❤️ to help your app work everywhere!**

