import asyncio
import json
import logging
import os
import time
from datetime import datetime
from typing import Dict, List, Optional, Any, Union

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Import our modules
from ml_model import get_model, CollisionRiskModel
from propagate import get_propagator, OrbitPropagator

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="AstroAlert API", description="AI-Powered Space Debris Early Warning System")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class ManeuverRequest(BaseModel):
    object_id: str
    distance_km: float
    velocity_kmps: float
    altitude: float
    inclination: float
    time_to_conjunction: float

class ManeuverResponse(BaseModel):
    probability: float
    risk_level: str
    maneuver_suggestion: str
    explanation: str
    feature_importance: List[Dict[str, Union[str, float]]]

# Connected WebSocket clients
connected_clients: List[WebSocket] = []

# Dependency to get model instance
def get_model_instance() -> CollisionRiskModel:
    return get_model()

# Dependency to get propagator instance
def get_propagator_instance() -> OrbitPropagator:
    return get_propagator()

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to AstroAlert API"}

@app.get("/objects")
async def get_objects(propagator: OrbitPropagator = Depends(get_propagator_instance)):
    """Get all space objects"""
    return propagator.get_objects()

@app.get("/objects/{object_id}")
async def get_object(object_id: str, propagator: OrbitPropagator = Depends(get_propagator_instance)):
    """Get a specific space object by ID"""
    obj = propagator.get_object_by_id(object_id)
    if obj is None:
        raise HTTPException(status_code=404, detail="Object not found")
    return obj

@app.post("/objects/{object_id}/suggest_maneuver", response_model=ManeuverResponse)
async def suggest_maneuver(
    object_id: str, 
    request: ManeuverRequest,
    model: CollisionRiskModel = Depends(get_model_instance),
    propagator: OrbitPropagator = Depends(get_propagator_instance)
):
    """Suggest a maneuver for a space object based on ML risk assessment"""
    # Check if object exists
    obj = propagator.get_object_by_id(object_id)
    if obj is None:
        raise HTTPException(status_code=404, detail="Object not found")
    
    # Extract features from request
    features = {
        "distance_km": request.distance_km,
        "velocity_kmps": request.velocity_kmps,
        "altitude": request.altitude,
        "inclination": request.inclination,
        "time_to_conjunction": request.time_to_conjunction
    }
    
    # Get prediction from model
    prediction = model.predict_risk(features)
    
    return prediction

@app.get("/alerts")
async def get_alerts(propagator: OrbitPropagator = Depends(get_propagator_instance)):
    """Get all alerts"""
    return propagator.get_alerts()

@app.websocket("/ws/orbits")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time orbit updates"""
    await websocket.accept()
    connected_clients.append(websocket)
    
    try:
        # Send initial data
        propagator = get_propagator()
        objects, alerts = propagator.get_objects(), propagator.get_alerts()
        await websocket.send_json({"type": "initial", "objects": objects, "alerts": alerts})
        
        # Keep connection alive
        while True:
            # Wait for any message (can be used as a ping)
            data = await websocket.receive_text()
            
            # Echo back a pong
            await websocket.send_json({"type": "pong", "timestamp": datetime.now().isoformat()})
    
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
        logger.info("Client disconnected")

# Background task to update orbits and send updates to clients
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(update_orbits_task())

async def update_orbits_task():
    """Background task to update orbits and send updates to clients"""
    propagator = get_propagator()
    
    while True:
        # Update orbits
        objects, alerts = propagator.update()
        
        # Send updates to all connected clients
        if connected_clients:
            message = {"type": "update", "objects": objects, "alerts": alerts}
            for client in connected_clients.copy():
                try:
                    await client.send_json(message)
                except Exception as e:
                    logger.error(f"Error sending to client: {e}")
                    try:
                        connected_clients.remove(client)
                    except ValueError:
                        pass
        
        # Wait before next update (random interval between 2-5 seconds)
        await asyncio.sleep(2 + 3 * (time.time() % 1))

# Run the app with uvicorn
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)