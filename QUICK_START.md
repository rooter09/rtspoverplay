# 🚀 Quick Start Guide - RTSP Overlay Stream

## ✅ Prerequisites Installed
- ✅ Node.js and npm
- ✅ Python 3
- ✅ MongoDB
- ✅ FFmpeg
- ✅ All dependencies installed

## 📋 Running the Application

### **Terminal 1: Start Backend (Flask API)**

```powershell
cd E:\rtspoverplay\backend
venv\Scripts\activate
python app.py
```

**Expected Output:**
```
* Running on http://127.0.0.1:5000
* Running on http://192.168.x.x:5000
Press CTRL+C to quit
```

✅ Leave this terminal running!

---

### **Terminal 2: Start Frontend (React)**

```powershell
cd E:\rtspoverplay\frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view frontend in the browser.
Local: http://localhost:3000
```

✅ Browser will open automatically at http://localhost:3000

---

## 🎯 Using the Application

### **Option 1: RTSP Streaming (Recommended)**

1. **Go to "Stream Control" tab** (📹)
2. **Enter RTSP URL:**
   - **Fast test stream:** `rtsp://rtsp.me/abcd1234/`
   - Or use your own RTSP camera URL
3. **Click "▶️ Start Stream"**
4. **Wait 5-10 seconds** for HLS conversion
5. **Video starts playing**

### **Option 2: Embedded Stream (Quick Test)**

If you want to test overlays immediately without waiting for RTSP conversion:

1. The embedded stream from rtsp.me is already working
2. Use the interface to add overlays
3. They will appear on top of the video

---

## 🎨 Adding Overlays

1. **Click "Add Overlay" tab** (✏️)
2. **Fill in the form:**
   - **Text:** "LIVE" or any text you want
   - **Position:** Use preset buttons or custom px/% values
   - **Font Size:** Choose from dropdown
   - **Color:** Pick text color
   - **Background:** Choose background color
3. **Click "Add Overlay"**
4. **Overlay appears on video**

---

## ⚙️ Managing Overlays

1. **Click "Manage Overlays" tab** (⚙️)
2. **View all your overlays**
3. **Edit (✏️):** Modify text, position, colors
4. **Delete (🗑️):** Remove overlays

---

## 🔧 Troubleshooting

### ❌ Backend Not Starting

**Problem:** Flask doesn't start or shows errors

**Solution:**
```powershell
cd E:\rtspoverplay\backend
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

---

### ❌ Frontend Shows Errors

**Problem:** "Cannot resolve 'axios'" or "Cannot resolve 'hls.js'"

**Solution:**
```powershell
cd E:\rtspoverplay\frontend
npm install axios hls.js
npm start
```

---

###  ❌ Stream Not Loading

**Problem:** Video player shows "Stream Error"

**Possible Causes:**
1. **Backend not running** → Start Flask (see Terminal 1)
2. **FFmpeg not converting** → Check if FFmpeg is in PATH
3. **RTSP stream too slow** → Use `rtsp://rtsp.me/abcd1234/` instead
4. **Stream not started** → Click "Start Stream" button first

**Solution:**
- Ensure both backend (port 5000) and frontend (port 3000) are running
- Use the faster RTSP.ME test stream
- Wait 10-15 seconds after clicking "Start Stream"

---

### ❌ MongoDB Connection Error

**Problem:** Backend shows "Cannot connect to MongoDB"

**Solution:**
```powershell
# Start MongoDB service
net start MongoDB
# Or if installed manually:
mongod
```

---

## 📊 System Status Check

### Check if Backend is Running:
```powershell
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "message": "RTSP Overlay API is running",
  "status": "healthy"
}
```

### Check if Frontend is Running:
Open browser: http://localhost:3000

---

## 🧪 Test RTSP URLs

### 1. RTSP.ME Test Stream (Fast, Recommended)
```
rtsp://rtsp.me/abcd1234/
```
- ✅ Public test stream
- ✅ Fast and reliable
- ✅ No authentication required

### 2. DevLine Camera Stream (Slow, Not Recommended)
```
rtsp://8.devline.ru:9784/cameras/18/streaming/sub?authorization=Basic%20YWRtaW46&audio=0
```
- ⚠️ Very slow (0.02x speed)
- ⚠️ Not suitable for real-time streaming
- ⚠️ Only use for testing connectivity

### 3. Your Own RTSP Camera
```
rtsp://username:password@camera-ip:port/stream
```
Example:
```
rtsp://admin:password123@192.168.1.100:554/stream1
```

---

## 🎬 Complete Workflow

1. **Start MongoDB** (if not running as service)
2. **Open Terminal 1** → Start Backend (Flask)
3. **Open Terminal 2** → Start Frontend (React)
4. **Browser opens** → http://localhost:3000
5. **Stream Control tab** → Enter RTSP URL → Start Stream
6. **Wait 10 seconds** → Video starts playing
7. **Add Overlay tab** → Create overlays
8. **Manage Overlays tab** → Edit/delete overlays
9. **Enjoy** → Your RTSP stream with custom overlays!

---

## 📝 Important Notes

- **Keep both terminals running** while using the application
- **Don't close the terminal windows** - they're running your servers
- **Press CTRL+C** in terminals to stop the servers when done
- **MongoDB must be running** for overlays to be saved
- **FFmpeg must be in PATH** for RTSP streaming to work

---

## 🎯 Project URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health:** http://localhost:5000/api/health
- **Stream Status:** http://localhost:5000/api/stream/status
- **Overlays API:** http://localhost:5000/api/overlays/

---

## 📚 Documentation

- **README.md** - Project overview and installation
- **USER_GUIDE.md** - Detailed user manual
- **API_DOCS.md** - Complete API documentation
- **QUICK_START.md** - This file

---

**Happy Streaming! 🎥✨**
