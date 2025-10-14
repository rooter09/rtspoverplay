# RTSP Overlay Stream - User Guide

## Overview
The RTSP Overlay Stream application allows you to stream RTSP video feeds in your browser and add customizable text overlays on top of the video. This is perfect for surveillance systems, live streaming, or any application where you need to display information over video content.

## Features
- 🎥 Stream RTSP video feeds in web browsers
- ✏️ Add, edit, and delete text overlays
- 🎨 Customize overlay position, color, font size, and background
- 📱 Responsive design for desktop and mobile
- 🔧 Easy-to-use tabbed interface
- ⚡ Real-time overlay management

## Prerequisites

Before running the application, ensure you have the following installed:

### Required Software
1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **Python** (v3.8 or higher) - [Download here](https://python.org/)
3. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
4. **FFmpeg** - [Download here](https://ffmpeg.org/download.html)

### Installation Verification
Open your terminal and verify the installations:

```bash
# Check Node.js
node --version

# Check Python
python --version

# Check MongoDB (should show version if running)
mongod --version

# Check FFmpeg
ffmpeg -version
```

## Installation & Setup

### 1. Clone or Download the Project
```bash
git clone <your-repo-url>
cd rtsp-overlay-stream
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:
```bash
MONGO_URI=mongodb://localhost:27017
FLASK_ENV=development
PORT=5000
```

#### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 3. Frontend Setup

#### Install Node Dependencies
```bash
cd frontend
npm install
```

### 4. Run the Application

#### Start the Backend
Open a terminal and navigate to the backend directory:
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```
The backend will start on `http://localhost:5000`

#### Start the Frontend
Open another terminal and navigate to the frontend directory:
```bash
cd frontend
npm start
```
The frontend will start on `http://localhost:3000`

## How to Use

### 1. Access the Application
Open your web browser and go to `http://localhost:3000`

### 2. Start an RTSP Stream

#### Using the Stream Control Tab
1. Click on the "Stream Control" tab (📹 icon)
2. Enter your RTSP URL in the input field
   - Format: `rtsp://username:password@camera-ip:port/stream`
   - Example: `rtsp://admin:password@192.168.1.100:554/stream`

#### Using Test URLs
The application includes test RTSP URLs you can use:
- **RTSP.ME Test Stream**: `rtsp://rtsp.me/abcd1234/`
- **DevLine Test Stream**: `rtsp://8.devline.ru:9784/cameras/18/streaming/sub?authorization=Basic%20YWRtaW46&audio=0`

#### Start the Stream
Click the "▶️ Start Stream" button to begin streaming.

### 3. Add Overlays

#### Using the Add Overlay Tab
1. Click on the "Add Overlay" tab (✏️ icon)
2. Fill in the overlay details:
   - **Text**: The text you want to display
   - **Position**: Top and Left positions (e.g., "20px", "10%")
   - **Font Size**: Choose from Small (12px) to Extra Large (24px)
   - **Color**: Pick a text color
   - **Background**: Choose a background color for better readability

#### Quick Position Presets
Use the preset buttons for common positions:
- Top Left, Top Center, Top Right
- Bottom Left, Bottom Center, Bottom Right

#### Add the Overlay
Click "Add Overlay" to place it on the video.

### 4. Manage Overlays

#### Using the Manage Overlays Tab
1. Click on the "Manage Overlays" tab (⚙️ icon)
2. View all your overlays in a list
3. Edit any overlay by clicking the ✏️ button
4. Delete overlays by clicking the 🗑️ button

### 5. View the Stream
The video player on the right side will show:
- Your RTSP stream (when active)
- All overlays positioned as configured
- Video controls for play/pause

## Troubleshooting

### Common Issues

#### 1. "Stream Error" Message
**Problem**: Video player shows an error instead of the stream.

**Solutions**:
- Ensure your RTSP URL is correct and accessible
- Check that the RTSP stream is not behind a firewall
- Verify FFmpeg is installed and working
- Make sure the backend is running on port 5000

#### 2. Overlays Not Appearing
**Problem**: Overlays are created but don't show on the video.

**Solutions**:
- Ensure the RTSP stream is running first
- Check that MongoDB is connected and running
- Verify the backend API is responding (visit `http://localhost:5000/api/health`)
- Check browser console for JavaScript errors

#### 3. Cannot Connect to MongoDB
**Problem**: Backend fails to connect to MongoDB.

**Solutions**:
- Ensure MongoDB is installed and running
- Check the `MONGO_URI` in your `.env` file
- Default should be `mongodb://localhost:27017`

#### 4. FFmpeg Not Found
**Problem**: Backend cannot start streams due to missing FFmpeg.

**Solutions**:
- Install FFmpeg from the official website
- Add FFmpeg to your system PATH
- On Windows, you may need to restart your terminal after installation

### Getting Help

#### Check the Logs
- **Backend logs**: Check the terminal where you started `python app.py`
- **Frontend logs**: Open browser DevTools (F12) and check the Console tab

#### API Testing
Test the API endpoints directly:
```bash
# Health check
curl http://localhost:5000/api/health

# Stream status
curl http://localhost:5000/api/stream/status

# Get overlays
curl http://localhost:5000/api/overlays/
```

## Configuration

### Backend Configuration
Edit `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017  # MongoDB connection string
FLASK_ENV=development                # Development mode
PORT=5000                           # Backend port
```

### Frontend Configuration
The frontend is configured to connect to `http://localhost:5000` by default. If you need to change this, edit the API calls in the React components.

## Advanced Features

### Custom RTSP URLs
The application supports any valid RTSP URL:
- IP cameras (Hikvision, Dahua, etc.)
- Professional streaming equipment
- Custom RTSP servers

### Overlay Customization
Overlays support:
- Custom positioning (px, %, em, rem)
- Multiple font sizes
- Any color combination
- Background colors for better visibility
- Real-time editing and deletion

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari (with native HLS support)
- Mobile browsers

## Performance Tips

### For Better Performance:
1. **Use appropriate video resolutions**: Lower resolution streams use less bandwidth
2. **Optimize FFmpeg settings**: The current settings are optimized for low latency
3. **Close unused applications**: Free up system resources
4. **Use a wired connection**: For stable streaming

### FFmpeg Optimization
Current settings are optimized for:
- Low latency streaming
- Browser compatibility
- Reasonable CPU usage

## Support

### Getting Help
1. Check this user guide thoroughly
2. Review the API documentation (`API_DOCS.md`)
3. Check the troubleshooting section above
4. Look at the browser console for errors

### Reporting Issues
When reporting issues, include:
- Your operating system
- Browser and version
- RTSP camera/stream details
- Error messages from logs
- Steps to reproduce the issue

## Security Considerations

### For Production Use:
1. **Add authentication** to the API endpoints
2. **Use HTTPS** for secure communication
3. **Configure firewalls** appropriately
4. **Validate RTSP URLs** to prevent injection attacks
5. **Monitor MongoDB** for performance and security

## License
This project is provided as-is for educational and development purposes.

---

**Happy Streaming! 🎥✨**
