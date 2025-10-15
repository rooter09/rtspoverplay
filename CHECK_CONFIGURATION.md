# 🔍 Configuration Verification Checklist

Use this checklist to verify your configuration is correct.

## ✅ Local Environment Configuration

### Frontend Configuration
- [ ] File `frontend/.env.development` exists
- [ ] Contains: `REACT_APP_API_BASE_URL=http://localhost:5000`
- [ ] No syntax errors in the file

### Backend Configuration  
- [ ] File `backend/.env` exists
- [ ] Contains: `CORS_ORIGINS=http://localhost:3000`
- [ ] Contains: `MONGODB_URI=mongodb://localhost:27017/rtsp_overlay`

### Verification Commands

```bash
# Check frontend development config
cat frontend/.env.development

# Check backend config
cat backend/.env

# Test backend health endpoint
curl http://localhost:5000/api/health
```

## ✅ Production Environment Configuration

### Frontend on Vercel
- [ ] Repository connected to Vercel
- [ ] Root directory set to: `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `build`
- [ ] File `frontend/.env.production` contains: `REACT_APP_API_BASE_URL=https://rtspoverplay.onrender.com`

### Backend on Render
- [ ] Service deployed on Render
- [ ] Environment variable `CORS_ORIGINS` includes your Vercel URL
- [ ] Format: `http://localhost:3000,https://your-vercel-url.vercel.app`
- [ ] MongoDB connection string configured (if using MongoDB Atlas)

### Verification Steps

1. **Check Render Backend:**
   ```bash
   # Should return JSON with status: healthy
   curl https://rtspoverplay.onrender.com/api/health
   ```

2. **Check Frontend Environment:**
   - Open your Vercel deployment
   - Open DevTools (F12) → Console
   - Type: `console.log(process.env.REACT_APP_API_BASE_URL)`
   - Should show: `https://rtspoverplay.onrender.com`

3. **Check Network Requests:**
   - Open DevTools (F12) → Network tab
   - Try to start a stream
   - Check that API calls go to Render backend
   - Look for any CORS errors (there should be none)

## ✅ File Structure Verification

Your project should have these files:

```
rtspoverplay/
├── frontend/
│   ├── .env.development          ✅ Points to localhost:5000
│   ├── .env.production           ✅ Points to Render URL
│   └── src/
│       └── config.js             ✅ Uses process.env.REACT_APP_API_BASE_URL
│
├── backend/
│   ├── .env                      ✅ Local CORS config
│   ├── .env.example              ✅ Template
│   └── app.py                    ✅ Reads CORS_ORIGINS from environment
│
├── SETUP_INSTRUCTIONS.md         ✅ Setup guide
├── DEPLOYMENT_GUIDE.md           ✅ Detailed deployment guide
├── CHECK_CONFIGURATION.md        ✅ This file
└── update-cors.bat               ✅ CORS update helper
```

## ✅ Environment Detection Test

### Test Local Development:

```bash
# Start backend
cd backend
venv\Scripts\activate
python app.py

# In new terminal, start frontend
cd frontend
npm start
```

**Expected Results:**
- Frontend opens at http://localhost:3000
- Backend runs at http://localhost:5000
- API calls in Network tab go to localhost:5000
- No CORS errors

### Test Production Build Locally:

```bash
# Build production version
cd frontend
npm run build

# Serve it locally (install serve if needed)
npx serve -s build -p 3000
```

**Expected Results:**
- App opens at http://localhost:3000
- API calls try to go to https://rtspoverplay.onrender.com
- May have CORS errors (normal - Render needs to accept localhost)

## ✅ Common Configuration Issues

### Issue 1: Wrong API URL Being Used

**Check:**
```javascript
// In browser console
console.log(process.env.REACT_APP_API_BASE_URL)
```

**Should be:**
- **Local (npm start):** `http://localhost:5000`
- **Production (deployed):** `https://rtspoverplay.onrender.com`

**If wrong:**
1. Check the correct .env file exists
2. Restart the dev server or redeploy
3. Clear browser cache

### Issue 2: CORS Errors

**Check Render Environment Variables:**
```
CORS_ORIGINS should include your Vercel URL
Example: http://localhost:3000,https://rtspoverplay.vercel.app
```

**Common Mistakes:**
- ❌ `https://*.vercel.app` (wildcards don't work)
- ❌ `https://app.vercel.app/` (trailing slash)
- ❌ Missing comma between URLs
- ❌ Spaces in the URL list

**Correct Format:**
```
CORS_ORIGINS=http://localhost:3000,https://app.vercel.app,https://app2.vercel.app
```

### Issue 3: Environment Variables Not Loading

**Frontend:**
- Environment variable names MUST start with `REACT_APP_`
- Must restart dev server after changing .env files
- Must redeploy to Vercel after changes

**Backend:**
- Check .env file exists in backend/ directory
- Check environment variables on Render dashboard
- Restart service after updating variables

## ✅ Testing Workflow

### 1. Test Health Endpoint

```bash
# Local
curl http://localhost:5000/api/health

# Production
curl https://rtspoverplay.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "message": "RTSP Overlay API is running"
}
```

### 2. Test Stream Status

```bash
# Local
curl http://localhost:5000/api/stream/status

# Production
curl https://rtspoverplay.onrender.com/api/stream/status
```

### 3. Test Frontend API Integration

1. Open the app (local or production)
2. Open DevTools (F12)
3. Go to Network tab
4. Try to start a stream
5. Check the API call:
   - URL should match expected backend
   - Status should be 200 OK
   - No CORS errors

## ✅ Final Verification

Run this complete test on BOTH environments:

1. [ ] App loads without errors
2. [ ] Can start a stream
3. [ ] Video plays
4. [ ] Can add overlays
5. [ ] Overlays appear on video
6. [ ] Can edit overlays
7. [ ] Can delete overlays
8. [ ] Can stop stream
9. [ ] No console errors
10. [ ] Network tab shows correct API endpoint

## 🎯 Quick Configuration Reference

### Local Development
```
Frontend: http://localhost:3000
    ↓ (API calls to)
Backend: http://localhost:5000
```

### Production
```
Frontend: https://your-app.vercel.app
    ↓ (API calls to)
Backend: https://rtspoverplay.onrender.com
```

### CORS Configuration
```
Local:      CORS_ORIGINS=http://localhost:3000
Production: CORS_ORIGINS=http://localhost:3000,https://your-app.vercel.app
```

## 📞 Still Having Issues?

1. Check all files exist with correct content
2. Verify environment variables on Vercel and Render
3. Check browser console for specific error messages
4. Check Render logs for backend errors
5. Clear browser cache and try again
6. Try in incognito/private browsing mode

---

**Everything checked? Great! Your app should work on both localhost and production! 🎉**

