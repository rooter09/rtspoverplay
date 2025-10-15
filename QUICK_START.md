# ⚡ Quick Start - Dual Environment Setup

## 🎉 Your App is Now Configured!

Your RTSP Overlay application is configured to work on **both localhost and production** automatically!

## 🚀 What's Been Done

✅ **Frontend Environment Files Created:**
- `frontend/.env.development` → Points to `http://localhost:5000`
- `frontend/.env.production` → Points to `https://rtspoverplay.onrender.com`

✅ **Backend Environment Files Created:**
- `backend/.env` → Local CORS configuration
- `backend/.env.example` → Template for reference

✅ **Documentation Created:**
- `SETUP_INSTRUCTIONS.md` → Complete setup guide
- `DEPLOYMENT_GUIDE.md` → Detailed deployment instructions
- `CHECK_CONFIGURATION.md` → Verification checklist
- `update-cors.bat` → Helper script for CORS updates

## ⚡ Test It Now (Localhost)

Your local environment is ready to go!

```bash
# Terminal 1: Start Backend
cd backend
venv\Scripts\activate
python app.py

# Terminal 2: Start Frontend  
cd frontend
npm start
```

Open http://localhost:3000 and test!

## 📋 Deploy to Production (3 Simple Steps)

### Step 1: Deploy to Vercel

**Option A: Quick Deploy**
```bash
cd frontend
npx vercel --prod
```

**Option B: GitHub Auto-Deploy**
```bash
git add .
git commit -m "Add dual environment configuration"
git push origin main
```
Then connect your repo on [vercel.com](https://vercel.com)

### Step 2: Get Your Vercel URL

After deployment, copy your Vercel URL:
```
Example: https://rtspoverplay-abc123.vercel.app
```

### Step 3: Update Render CORS

**Option A: Use Helper Script**
```bash
update-cors.bat
```
Enter your Vercel URL when prompted.

**Option B: Manual Update**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your `rtspoverplay` service
3. Click **Environment** → Find `CORS_ORIGINS`
4. Update to:
   ```
   http://localhost:3000,https://your-vercel-url.vercel.app
   ```
5. Save (service will restart automatically)

## ✅ Verify Everything Works

### Local Test:
- Open http://localhost:3000
- Start a test stream
- Add some overlays
- ✅ Should work perfectly!

### Production Test:
- Open your Vercel URL
- Press F12 → Network tab
- Start a stream
- Check:
  - ✅ API calls go to `rtspoverplay.onrender.com`
  - ✅ No CORS errors
  - ✅ Stream works
  - ✅ Overlays work

## 🔍 How It Works

The app automatically detects the environment:

**Development Mode** (`npm start`):
```
Loads: frontend/.env.development
API URL: http://localhost:5000
Result: App talks to local backend ✅
```

**Production Mode** (`npm run build` on Vercel):
```
Loads: frontend/.env.production
API URL: https://rtspoverplay.onrender.com
Result: App talks to Render backend ✅
```

**No code changes needed!** Switch between environments seamlessly.

## 📚 Need More Help?

- **Setup Guide:** [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
- **Deployment:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Verification:** [CHECK_CONFIGURATION.md](CHECK_CONFIGURATION.md)
- **API Docs:** [API_DOCS.md](API_DOCS.md)

## 🐛 Common Issues

### "CORS Error" in production
→ Update `CORS_ORIGINS` on Render with your Vercel URL

### "API calls go to localhost" on production
→ Rebuild and redeploy: `npm run build && vercel --prod`

### "Cannot connect to backend"
→ Check Render service is running (may sleep on free tier)

### Still stuck?
→ Check [CHECK_CONFIGURATION.md](CHECK_CONFIGURATION.md) for detailed troubleshooting

## 🎯 Configuration Summary

| Environment | Frontend URL | Backend URL | Config File |
|-------------|-------------|-------------|-------------|
| **Local Dev** | localhost:3000 | localhost:5000 | `.env.development` |
| **Production** | Vercel URL | rtspoverplay.onrender.com | `.env.production` |

## 🎊 You're Ready!

Your app is now configured for dual environment support. 

**Next:** Deploy to Vercel → Update CORS → Enjoy! 🚀

---

**Built with ❤️ for seamless local and production deployment**

