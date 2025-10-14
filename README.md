# RTSP Overlay Stream Application

A full-stack web application for streaming RTSP video feeds with customizable text overlays. Built with React frontend and Flask backend, featuring real-time overlay management and HLS video streaming.

## 🚀 Features

- **RTSP Streaming**: Convert RTSP streams to HLS for browser playback
- **Dynamic Overlays**: Add, edit, and delete text overlays in real-time
- **Customizable UI**: Position, color, font size, and background customization
- **Responsive Design**: Works on desktop and mobile devices
- **RESTful API**: Complete API for overlay and stream management
- **Real-time Updates**: Live overlay positioning and editing

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   # Backend
   cd backend && pip install -r requirements.txt

   # Frontend
   cd frontend && npm install
   ```

2. **Start services**:
   ```bash
   # Terminal 1 - Backend (with virtual environment activated)
   cd backend && python app.py

   # Terminal 2 - Frontend
   cd frontend && npm start
   ```

3. **Access the application**:
   Open `http://localhost:3000` in your browser

## 📋 Prerequisites

- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **Python** (v3.8+) - [Download](https://python.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community)
- **FFmpeg** - [Download](https://ffmpeg.org/download.html)

## 🛠 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/rooter09/rtspoverplay.git
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Configure Environment
Create `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017
FLASK_ENV=development
PORT=5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Database Setup
Ensure MongoDB is running:
```bash
mongod
```

## 🎯 Usage

### Starting a Stream

1. **Navigate to Stream Control tab**
2. **Enter RTSP URL** (or use test URLs):
   - `rtsp://rtsp.me/abcd1234/` (Test stream)
   - `rtsp://8.devline.ru:9784/cameras/18/streaming/sub?authorization=Basic%20YWRtaW46&audio=0`
3. **Click "Start Stream"**

### Adding Overlays

1. **Go to "Add Overlay" tab**
2. **Configure overlay**:
   - Text content
   - Position (top/left)
   - Font size and color
   - Background color
3. **Click "Add Overlay"**

### Managing Overlays

1. **Switch to "Manage Overlays" tab**
2. **Edit or delete** existing overlays
3. **Real-time preview** of changes

## 📖 API Documentation

Complete API documentation available in [`API_DOCS.md`](API_DOCS.md)

### Key Endpoints

- `GET /api/health` - Health check
- `POST /api/stream/` - Start RTSP stream
- `GET /api/overlays/` - Get all overlays
- `POST /api/overlays/` - Create overlay
- `PUT /api/overlays/{id}` - Update overlay
- `DELETE /api/overlays/{id}` - Delete overlay

## ⚙ Configuration

### 🌐 Environment Configuration

This project now supports **automatic environment detection** for seamless deployment:

- **Development**: Uses `http://localhost:5000` automatically
- **Production**: Uses `https://rtspoverplay.onrender.com` (Render backend)

See **[ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)** for complete configuration details.

### Backend Configuration
Create `backend/.env`:
```env
CORS_ORIGINS=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/rtsp_overlay
```

For production deployment on Render:
```env
CORS_ORIGINS=http://localhost:3000,https://your-vercel-app.vercel.app
MONGODB_URI=your_mongodb_atlas_connection_string
```

### Frontend Configuration
Environment files are pre-configured:
- `.env.development` → `http://localhost:5000`
- `.env.production` → `https://rtspoverplay.onrender.com`

No code changes needed when switching environments!

## 🚀 Deployment

This application is configured for easy deployment:

- **Frontend**: Deploy to [Vercel](https://vercel.com) (or any React hosting)
- **Backend**: Deploy to [Render](https://render.com) (or any Python hosting)

### Quick Deploy Links

- 📘 **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Step-by-step deployment instructions
- 🔧 **[Environment Setup](ENVIRONMENT_SETUP.md)** - Complete environment configuration guide

### Current Production URLs

- **Backend**: https://rtspoverplay.onrender.com
- **Frontend**: Deploy to your Vercel account

## 🔧 Troubleshooting

### Common Issues

**Stream not loading?**
- Verify RTSP URL accessibility
- Check FFmpeg installation
- Ensure backend is running on port 5000

**Overlays not appearing?**
- Confirm MongoDB connection
- Check browser console for errors
- Verify backend API responses

**Performance issues?**
- Lower video resolution
- Close unnecessary applications
- Use wired network connection

For detailed troubleshooting, see [`USER_GUIDE.md`](USER_GUIDE.md)

## 📁 Project Structure

```
rtsp-overlay-stream/
├── backend/                 # Flask API server
│   ├── routes/             # API route handlers
│   │   ├── overlays.py     # Overlay CRUD operations
│   │   └── stream.py       # RTSP streaming logic
│   ├── models/             # Data models (future use)
│   ├── app.py             # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/               # React client application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── VideoPlayer.jsx     # HLS video player
│   │   │   ├── OverlayControls.jsx # Add/edit overlays
│   │   │   ├── OverlayManager.jsx  # Manage overlays
│   │   │   └── StreamControls.jsx  # RTSP stream control
│   │   ├── pages/         # Page components
│   │   │   └── LandingPage.jsx     # Main application page
│   │   └── App.js         # Root React component
│   ├── package.json       # Node dependencies
│   └── public/            # Static assets
├── API_DOCS.md            # Complete API documentation
├── USER_GUIDE.md          # Detailed user guide
└── README.md             # This file
```

## 🧪 Testing RTSP URLs

The application includes test RTSP URLs for development:

1. **RTSP.ME Test Stream**:
   ```
   rtsp://rtsp.me/abcd1234/
   ```

2. **DevLine Test Stream**:
   ```
   rtsp://8.devline.ru:9784/cameras/18/streaming/sub?authorization=Basic%20YWRtaW46&audio=0
   ```

## 🌟 Features in Detail

### Video Streaming
- RTSP to HLS conversion using FFmpeg
- Low-latency streaming configuration
- Browser-compatible video playback
- Real-time stream status monitoring

### Overlay System
- Dynamic text overlay creation
- Real-time positioning and editing
- Customizable styling options
- Persistent storage in MongoDB

### User Interface
- Modern, responsive design
- Tabbed interface for easy navigation
- Real-time preview of overlays
- Mobile-friendly controls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [HLS.js](https://github.com/video-dev/hls.js/) for browser video streaming
- [React](https://reactjs.org/) for the frontend framework
- [Flask](https://flask.palletsprojects.com/) for the backend API
- [MongoDB](https://www.mongodb.com/) for data storage

## 📞 Support

For support and questions:
- Check the [User Guide](USER_GUIDE.md) for detailed instructions
- Review the [API Documentation](API_DOCS.md) for technical details
- Create an issue in the repository for bugs or feature requests

---

**Built with ❤️ for real-time video streaming and overlay management**
