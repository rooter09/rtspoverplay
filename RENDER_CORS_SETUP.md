# 🔧 Render CORS Configuration Guide

## ⚠️ Important: Required for Production

Your Render backend **must** be configured to accept requests from your Vercel frontend. Without this, you'll get CORS errors.

## 🎯 What is CORS?

**CORS (Cross-Origin Resource Sharing)** is a security feature that:
- Prevents unauthorized websites from accessing your API
- Must be explicitly configured to allow your frontend domain
- Is already implemented in your Flask backend

## 📋 Step-by-Step: Update CORS on Render

### Option 1: Using the Helper Script (Recommended)

After deploying to Vercel:

```bash
# Run this script
update-cors.bat
```

1. Script will ask for your Vercel URL
2. Enter it (e.g., `https://rtspoverplay-frontend.vercel.app`)
3. Script updates local `.env` file
4. Follow instructions to update Render manually

### Option 2: Manual Configuration on Render

#### Step 1: Log into Render

Go to: https://dashboard.render.com

#### Step 2: Select Your Service

1. Click on your `rtspoverplay` service
2. You should see your service dashboard

#### Step 3: Access Environment Variables

1. Look for **Environment** in the left sidebar
2. Click on it
3. You'll see a list of environment variables

#### Step 4: Find or Add CORS_ORIGINS

Look for `CORS_ORIGINS` in the list:

**If it exists:**
- Click the **Edit** button (pencil icon)

**If it doesn't exist:**
- Click **Add Environment Variable**
- Name: `CORS_ORIGINS`

#### Step 5: Set the Value

Enter this value (replace with your actual Vercel URL):

```
http://localhost:3000,https://your-vercel-url.vercel.app
```

**Important Details:**
- ✅ Use commas to separate URLs (no spaces!)
- ✅ Include http://localhost:3000 (for local testing)
- ✅ Include your exact Vercel URL
- ❌ No trailing slashes
- ❌ No wildcards like `*.vercel.app`

**Example:**
```
http://localhost:3000,https://rtspoverplay-frontend.vercel.app
```

#### Step 6: Save Changes

1. Click **Save Changes**
2. Render will automatically restart your service
3. Wait 30-60 seconds for the service to restart

## ✅ Verify Configuration

### Test 1: Check Render Environment

1. Go to your service on Render
2. Click **Environment**
3. Verify `CORS_ORIGINS` is set correctly

### Test 2: Test API Health

```bash
# Should return JSON without CORS errors
curl https://rtspoverplay.onrender.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "RTSP Overlay API is running"
}
```

### Test 3: Test from Frontend

1. Open your Vercel deployment
2. Press F12 (DevTools)
3. Go to **Network** tab
4. Try to start a stream
5. Check for CORS errors (should be none!)

## 🔍 Common CORS Issues

### Issue 1: "Access-Control-Allow-Origin" Error

**Error Message:**
```
Access to fetch at 'https://rtspoverplay.onrender.com/api/stream/status' 
from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```

**Solution:**
1. Check `CORS_ORIGINS` on Render
2. Verify it includes your **exact** Vercel URL
3. Ensure no typos in the URL
4. Restart Render service if needed

### Issue 2: Multiple Vercel Domains

If you have:
- Main production URL
- Preview deployment URLs
- Custom domain

**Solution:**
Add all of them to `CORS_ORIGINS`:
```
http://localhost:3000,https://app.vercel.app,https://app-preview.vercel.app,https://customdomain.com
```

### Issue 3: Trailing Slash

**Wrong:**
```
http://localhost:3000/,https://app.vercel.app/
```

**Correct:**
```
http://localhost:3000,https://app.vercel.app
```

### Issue 4: Spaces in Configuration

**Wrong:**
```
http://localhost:3000, https://app.vercel.app
```

**Correct:**
```
http://localhost:3000,https://app.vercel.app
```

### Issue 5: Using Wildcards

**Wrong:**
```
https://*.vercel.app
```

**Correct:**
```
https://rtspoverplay-frontend.vercel.app
```

Flask-CORS **does not support** wildcards!

## 🔄 When to Update CORS

You need to update CORS when:
- ✅ First deploying to Vercel
- ✅ Changing Vercel domain
- ✅ Adding custom domain
- ✅ Creating preview deployments (optional)

You **don't** need to update when:
- ❌ Redeploying same app to Vercel
- ❌ Making code changes
- ❌ Updating other environment variables

## 📊 Configuration Examples

### For Local Development Only:
```
CORS_ORIGINS=http://localhost:3000
```

### For Production (Vercel + Local):
```
CORS_ORIGINS=http://localhost:3000,https://rtspoverplay-frontend.vercel.app
```

### For Multiple Environments:
```
CORS_ORIGINS=http://localhost:3000,https://rtspoverplay-staging.vercel.app,https://rtspoverplay-prod.vercel.app
```

### With Custom Domain:
```
CORS_ORIGINS=http://localhost:3000,https://rtspoverplay.vercel.app,https://stream.yourdomain.com
```

## 🛡️ Security Best Practices

### ✅ Good Practices:
- Only list domains you control
- Use exact URLs (no wildcards)
- Include `http://localhost:3000` for development
- Keep the list minimal

### ❌ Bad Practices:
- Don't use `*` (allows all origins - security risk!)
- Don't use wildcards
- Don't include unknown domains
- Don't leave CORS disabled

## 🔍 Debugging CORS Issues

### Check Browser Console:

1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for CORS-related errors

**Error Example:**
```
Access-Control-Allow-Origin header is missing
```

**Solution:** Add Vercel URL to Render CORS_ORIGINS

### Check Network Tab:

1. Open DevTools (F12)
2. Go to **Network** tab
3. Find failed request
4. Check **Headers** section
5. Look for CORS-related headers

### Check Render Logs:

1. Go to Render dashboard
2. Select your service
3. Click **Logs**
4. Look for CORS or request errors

## 🎯 Quick Checklist

Before you deploy to production, ensure:

- [ ] Vercel deployment is complete
- [ ] You have your Vercel URL
- [ ] `CORS_ORIGINS` is set on Render
- [ ] URL format is correct (no trailing slash)
- [ ] No spaces in the URL list
- [ ] Render service has restarted
- [ ] Can access health endpoint
- [ ] Frontend can call backend APIs
- [ ] No CORS errors in browser console

## 🆘 Still Having Issues?

1. **Double-check the URL** - Copy it directly from Vercel
2. **Check for typos** - Even one character wrong will fail
3. **Verify format** - Must be: `http://localhost:3000,https://app.vercel.app`
4. **Restart Render** - Environment changes need a restart
5. **Clear cache** - Clear browser cache and try again
6. **Check Render logs** - Look for errors in the logs
7. **Test health endpoint** - Verify backend is running

## 📞 Support Resources

- [Flask-CORS Documentation](https://flask-cors.readthedocs.io/)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## 🎉 Success!

Once configured correctly, you should see:

- ✅ No CORS errors in browser console
- ✅ API calls succeed
- ✅ Streams start successfully
- ✅ Overlays work properly
- ✅ All features functional

---

**Your Render backend is now configured to accept requests from your Vercel frontend! 🚀**

**Remember:** Update `CORS_ORIGINS` whenever you change your Vercel domain!

