# AstroAlert: AI-Powered Space Debris Early Warning System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

AstroAlert is a real-time monitoring and alert system for tracking space debris and potential collision risks with satellites and spacecraft. The system uses AI to predict collision risks and suggest evasive maneuvers.

## Features

- **Real-time 3D Visualization**: Interactive Cesium-powered globe showing satellites and debris
- **AI Risk Assessment**: Machine learning model for collision risk prediction
- **Live Alerts**: Real-time notifications for high-risk conjunctions
- **Maneuver Suggestions**: AI-generated evasive maneuver recommendations
- **WebSocket Updates**: Live orbit propagation and status updates

## Tech Stack

### Frontend
- React with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Cesium/Resium for 3D globe visualization
- Recharts for data visualization

### Backend
- FastAPI for REST API and WebSocket support
- Scikit-learn for ML model
- Python for orbit propagation simulation

### Infrastructure
- Docker for containerization
- Nginx for serving frontend and proxying API requests

## Project Structure

```
├── frontend/               # React frontend application
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   │   ├── ui/         # UI components (shadcn/ui)
│   │   │   ├── Navbar.tsx  # Navigation component
│   │   │   ├── Sidebar.tsx # Filters and search
│   │   │   └── ...         # Other components
│   │   ├── lib/            # Utilities and helpers
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static assets
│   ├── index.html          # HTML template
│   └── ...                 # Config files
├── backend/                # FastAPI backend
│   ├── main.py             # API routes and WebSocket
│   ├── ml_model.py         # ML model for risk prediction
│   ├── propagate.py        # Orbit propagation simulation
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.9+)
- Git

### Clone the Repository

```bash
git clone https://github.com/yourusername/astroalert.git
cd astroalert
```

### Backend Setup

```bash
cd backend
python -m venv .venv
# On Windows
.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for Render (backend) and Vercel (frontend).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
│   └── requirements.txt    # Python dependencies
└── docker-compose.yml      # Docker configuration
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Python 3.9+
- Docker and Docker Compose (for containerized setup)

### Local Development

#### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at http://localhost:5173

#### Backend

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload
```

The backend API will be available at http://localhost:8000

### Docker Setup

For a complete containerized setup:

```bash
# Build and start all services
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Configure the build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set environment variables for API endpoints

### Backend (Render/Heroku)

#### Render

1. Create a new Web Service
2. Connect your GitHub repository
3. Configure the service:
   - Runtime: Python 3.9
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

#### Heroku

1. Create a new app on Heroku
2. Connect your GitHub repository
3. Add a `Procfile` in the backend directory with:
   ```
   web: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
4. Deploy the application

## Usage

1. **Dashboard View**: The main interface shows the 3D globe with space objects
2. **Object Selection**: Click on any object to view details and risk assessment
3. **Filtering**: Use the sidebar to filter objects by orbit type or object type
4. **Alerts**: Monitor the alerts feed for real-time conjunction warnings
5. **Risk Timeline**: View predicted risk levels over time for selected objects

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- NASA for space debris tracking data inspiration
- Cesium for the 3D globe visualization library
- The open-source community for the amazing tools and libraries