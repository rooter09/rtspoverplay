# 🚀 Setup Instructions - Making Your App Work on Both Local and Production

## ✅ What I've Fixed

Your app now works on **both localhost and production** environments! Here's what I configured:

### Files Created:
1. ✅ `frontend/.env.development` - Uses `http://localhost:5000`
2. ✅ `frontend/.env.production` - Uses `https://rtspoverplay.onrender.com`
3. ✅ `backend/.env` - CORS configuration for local development
4. ✅ `backend/.env.example` - Template for backend configuration

## 🎯 The Problem (Solved!)

**Before:**
- ❌ Frontend didn't know which backend URL to use
- ❌ Render backend wasn't configured to accept requests from Vercel
- ❌ App worked on localhost but failed on production

**After:**
- ✅ Frontend automatically uses correct backend URL based on environment
- ✅ Backend CORS is ready to accept both localhost and Vercel
- ✅ App works seamlessly on both local and production

## 📋 Next Steps for Production Deployment

### Step 1: Deploy Frontend to Vercel

You need to get your Vercel deployment URL first.

**Option A: Using Vercel CLI**
```bash
cd frontend
npm install -g vercel  # Install Vercel CLI if not installed
vercel login           # Login to Vercel
vercel --prod          # Deploy to production
```

**Option B: Using GitHub (Recommended)**
1. Commit the new files:
   ```bash
   git add frontend/.env.development frontend/.env.production backend/.env.example DEPLOYMENT_GUIDE.md SETUP_INSTRUCTIONS.md
   git commit -m "Add environment configuration for dual environment support"
   git push origin main
   ```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
6. Click "Deploy"

After deployment, **copy your Vercel URL** (e.g., `https://rtspoverplay-abc123.vercel.app`)

### Step 2: Update Backend CORS on Render

Now that you have your Vercel URL, update Render to accept requests from it.

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service: `rtspoverplay`
3. Click on **Environment** in the left sidebar
4. Find or add the `CORS_ORIGINS` variable
5. Set it to:
   ```
   http://localhost:3000,https://your-actual-vercel-url.vercel.app
   ```
   **⚠️ Important:** Replace `your-actual-vercel-url` with your real Vercel URL!

6. Click "Save Changes"
7. Render will automatically restart your service

**Example:**
```
CORS_ORIGINS=http://localhost:3000,https://rtspoverplay-frontend.vercel.app
```

### Step 3: Test Everything

#### Test Local Environment:
```bash
# Terminal 1: Backend
cd backend
venv\Scripts\activate
python app.py

# Terminal 2: Frontend
cd frontend
npm start
```

- Open http://localhost:3000
- Press F12 → Network tab
- Verify API calls go to `http://localhost:5000`
- Test starting a stream

#### Test Production:
1. Visit your Vercel URL
2. Open DevTools (F12) → Network tab
3. Try starting a stream
4. Verify:
   - ✅ API calls go to `https://rtspoverplay.onrender.com`
   - ✅ No CORS errors
   - ✅ Stream works
   - ✅ Overlays work

## 🔍 How It Works

### Automatic Environment Detection

The app automatically detects which environment it's running in:

**Development Mode** (`npm start`):
```
NODE_ENV=development
→ Loads frontend/.env.development
→ API_BASE_URL = http://localhost:5000
→ All API calls → localhost backend
```

**Production Mode** (`npm run build`):
```
NODE_ENV=production
→ Loads frontend/.env.production  
→ API_BASE_URL = https://rtspoverplay.onrender.com
→ All API calls → Render backend
```

### Configuration Files Explained

#### `frontend/.env.development`
```env
REACT_APP_API_BASE_URL=http://localhost:5000
```
- Used when running `npm start`
- Points to local Flask backend

#### `frontend/.env.production`
```env
REACT_APP_API_BASE_URL=https://rtspoverplay.onrender.com
```
- Used when running `npm run build`
- Points to Render backend

#### `backend/.env`
```env
CORS_ORIGINS=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/rtsp_overlay
```
- Used for local development
- **Update CORS_ORIGINS after Vercel deployment**

#### `frontend/src/config.js` (already existed)
```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
```
- Reads the environment variable
- Falls back to localhost if not set

## ⚠️ Important Notes

### CORS Configuration
- **Must be exact URLs** - no wildcards like `*.vercel.app`
- **No trailing slashes** - ✅ `https://app.vercel.app` ❌ `https://app.vercel.app/`
- **Comma-separated** - `http://localhost:3000,https://app.vercel.app`

### Environment Variables
- Frontend variables **must start with** `REACT_APP_`
- Must rebuild frontend after changing .env files
- On Vercel, redeploy after changing environment variables

### Render Free Tier
- Backend may sleep after 15 minutes of inactivity
- First request after sleeping takes 30-60 seconds
- Consider upgrading for production use

## 🔧 Troubleshooting

### Issue: "CORS Error" in Production

**Symptom:** Console shows `Access-Control-Allow-Origin` error

**Solution:**
1. Double-check `CORS_ORIGINS` on Render
2. Ensure it includes your **exact** Vercel URL
3. Restart Render service after changes
4. Clear browser cache

**Check CORS_ORIGINS:**
```bash
# Should be something like:
CORS_ORIGINS=http://localhost:3000,https://rtspoverplay-frontend.vercel.app
```

### Issue: Frontend Still Uses Localhost in Production

**Symptom:** Network tab shows `http://localhost:5000` on production

**Solution:**
1. Verify `.env.production` exists with correct URL
2. Rebuild and redeploy:
   ```bash
   npm run build
   vercel --prod
   ```

### Issue: "Cannot connect to backend"

**Symptom:** All API calls fail

**Possible Causes:**
1. **Render backend is sleeping** → Wait 60 seconds for it to wake up
2. **CORS not configured** → Check Render environment variables
3. **Wrong backend URL** → Check browser console for the URL being called

**Quick Test:**
Visit: https://rtspoverplay.onrender.com/api/health

Should return:
```json
{
  "status": "healthy",
  "message": "RTSP Overlay API is running"
}
```

### Issue: Environment Variables Not Loading

**Frontend:**
```bash
# Check if the variable is set
cd frontend
npm start
# Then in browser console:
console.log(process.env.REACT_APP_API_BASE_URL)
```

**Backend:**
```bash
# Check if .env file exists and has correct format
cat backend/.env
```

## 📚 Additional Configuration

### For MongoDB Atlas (Production Database)

Update `backend/.env` on Render:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rtsp_overlay?retryWrites=true&w=majority
```

### For Custom Domain on Vercel

After adding custom domain:
1. Update Render `CORS_ORIGINS`:
   ```
   http://localhost:3000,https://rtspoverplay-frontend.vercel.app,https://yourdomain.com
   ```

## 🎉 Success Checklist

You'll know everything is working when:

- [ ] Local: App runs on http://localhost:3000
- [ ] Local: API calls go to http://localhost:5000
- [ ] Local: Stream starts and overlays work
- [ ] Production: App loads on Vercel URL
- [ ] Production: API calls go to https://rtspoverplay.onrender.com
- [ ] Production: No CORS errors in console
- [ ] Production: Stream starts successfully
- [ ] Production: Overlays can be added/edited
- [ ] Both environments work without code changes

## 🆘 Need Help?

1. **Check browser console** (F12) for errors
2. **Check Network tab** to see which URLs are being called
3. **Check Render logs** for backend errors
4. **Test health endpoint:** https://rtspoverplay.onrender.com/api/health
5. **Verify environment variables** on both Vercel and Render

## 📖 Additional Resources

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Detailed deployment guide
- [API_DOCS.md](API_DOCS.md) - Complete API documentation
- [README.md](README.md) - General project documentation

---

**🎯 Quick Summary:**

Your app is now configured for dual environment support! 

**Next steps:**
1. Deploy frontend to Vercel → Get Vercel URL
2. Update Render CORS_ORIGINS with Vercel URL
3. Test both environments

**That's it! Your app will work on both localhost and production! 🎉**

