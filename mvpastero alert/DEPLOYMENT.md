# AstroAlert Deployment Guide

## Backend Deployment on Render

1. **Create a Render Account**
   - Sign up at [render.com](https://render.com)

2. **Create a New Web Service**
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your AstroAlert project

3. **Configure the Web Service**
   - Name: `astroalert-api` (or your preferred name)
   - Root Directory: `backend`
   - Environment: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Select the appropriate plan (Free tier works for testing)

4. **Set Environment Variables**
   - Add `PYTHON_VERSION`: `3.9.0`
   - Add `CORS_ORIGINS`: Your frontend URL (e.g., `https://astroalert-frontend.vercel.app`)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for the deployment to complete
   - Note the URL provided by Render (e.g., `https://astroalert-api.onrender.com`)

## Frontend Deployment on Vercel

1. **Create a Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)

2. **Install Vercel CLI (Optional)**
   ```bash
   npm install -g vercel
   ```

3. **Deploy via Vercel Dashboard**
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository containing your AstroAlert project
   - Configure the project:
     - Framework Preset: Vite
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`

4. **Set Environment Variables**
   - Add `VITE_API_URL`: Your Render backend URL (e.g., `https://astroalert-api.onrender.com`)

5. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete
   - Your frontend will be available at the provided Vercel URL

## Connecting Frontend and Backend

After deploying both services, ensure they can communicate with each other:

1. **Update CORS Settings**
   - In your backend's `main.py`, ensure the CORS origins include your Vercel frontend URL
   - In your Render environment variables, update `CORS_ORIGINS` if needed

2. **Update API URL in Frontend**
   - In your Vercel environment variables, ensure `VITE_API_URL` points to your Render backend

3. **Test the Connection**
   - Visit your Vercel frontend URL
   - Verify that API calls to the backend are working
   - Check WebSocket connections for real-time updates

## Troubleshooting

- **CORS Issues**: Ensure your backend's CORS settings include your frontend URL
- **WebSocket Connection Failures**: Check that your WebSocket URL is correctly configured
- **API Errors**: Verify environment variables and API endpoints

## Maintenance

- Both Render and Vercel support automatic deployments when you push to your repository
- Free tier services may sleep after periods of inactivity, causing slow initial loads