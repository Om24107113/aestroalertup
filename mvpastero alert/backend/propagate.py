import time
import math
import random
from typing import Dict, List, Tuple, Any
from datetime import datetime, timedelta

# Constants
EARTH_RADIUS = 6371.0  # km

# Orbit types
ORBIT_TYPES = {
    "LEO": {"min_altitude": 160, "max_altitude": 2000},
    "MEO": {"min_altitude": 2000, "max_altitude": 35786},
    "GEO": {"min_altitude": 35786, "max_altitude": 35786}
}

class OrbitPropagator:
    def __init__(self):
        # Initialize space objects
        self.space_objects = [
            # ISS
            {
                "id": "25544",
                "name": "ISS (ZARYA)",
                "type": "satellite",
                "orbit_type": "LEO",
                "altitude": 408.0,
                "inclination": 51.6,
                "position": self._random_position(408.0),
                "velocity": 7.66,  # km/s
                "last_update": datetime.now(),
                "risk_objects": []
            },
            # Debris 1
            {
                "id": "48274",
                "name": "COSMOS 2251 DEB",
                "type": "debris",
                "orbit_type": "LEO",
                "altitude": 385.0,
                "inclination": 74.2,
                "position": self._random_position(385.0),
                "velocity": 7.7,  # km/s
                "last_update": datetime.now(),
                "risk_objects": []
            },
            # Debris 2
            {
                "id": "33692",
                "name": "FENGYUN 1C DEB",
                "type": "debris",
                "orbit_type": "LEO",
                "altitude": 420.0,
                "inclination": 98.5,
                "position": self._random_position(420.0),
                "velocity": 7.62,  # km/s
                "last_update": datetime.now(),
                "risk_objects": []
            }
        ]
        
        # Initialize alerts
        self.alerts = []
        
        # Last alert time to control frequency
        self.last_alert_time = datetime.now() - timedelta(minutes=5)
    
    def _random_position(self, altitude: float) -> List[float]:
        """Generate a random position for a space object at a given altitude"""
        # Convert altitude to radius from Earth center
        radius = EARTH_RADIUS + altitude
        
        # Random spherical coordinates
        theta = random.uniform(0, 2 * math.pi)  # longitude
        phi = random.uniform(0, math.pi)  # latitude
        
        # Convert to Cartesian coordinates
        x = radius * math.sin(phi) * math.cos(theta)
        y = radius * math.sin(phi) * math.sin(theta)
        z = radius * math.cos(phi)
        
        return [x, y, z]
    
    def _update_position(self, obj: Dict[str, Any], dt: float) -> None:
        """Update the position of a space object based on simple orbital mechanics"""
        # Current position
        x, y, z = obj["position"]
        
        # Convert to spherical coordinates
        r = math.sqrt(x**2 + y**2 + z**2)
        theta = math.atan2(y, x)
        phi = math.acos(z / r)
        
        # Orbital period (in seconds) based on altitude
        altitude = obj["altitude"]
        orbital_radius = EARTH_RADIUS + altitude
        orbital_period = 2 * math.pi * math.sqrt(orbital_radius**3 / 398600.4418)  # Using μ = GM for Earth
        
        # Angular velocity
        angular_velocity = 2 * math.pi / orbital_period
        
        # Update theta based on angular velocity and time step
        theta += angular_velocity * dt
        
        # Add some perturbation to make it more realistic
        phi += random.gauss(0, 0.001)
        
        # Convert back to Cartesian coordinates
        x = r * math.sin(phi) * math.cos(theta)
        y = r * math.sin(phi) * math.sin(theta)
        z = r * math.cos(phi)
        
        # Update position
        obj["position"] = [float(x), float(y), float(z)]
    
    def _calculate_distance(self, pos1: List[float], pos2: List[float]) -> float:
        """Calculate the Euclidean distance between two positions"""
        return math.sqrt(sum((a - b)**2 for a, b in zip(pos1, pos2)))
    
    def _check_conjunctions(self) -> None:
        """Check for close conjunctions between space objects"""
        # Clear previous risk objects
        for obj in self.space_objects:
            obj["risk_objects"] = []
        
        # Check each pair of objects
        for i, obj1 in enumerate(self.space_objects):
            for j, obj2 in enumerate(self.space_objects[i+1:], i+1):
                # Calculate distance
                distance = self._calculate_distance(obj1["position"], obj2["position"])
                
                # Calculate relative velocity (simplified)
                rel_velocity = abs(obj1["velocity"] - obj2["velocity"])
                
                # Calculate time to closest approach (simplified)
                time_to_conjunction = max(0.1, distance / (rel_velocity + 0.001))  # Avoid division by zero
                
                # Check if objects are at risk of conjunction
                if distance < 100:  # 100 km threshold for risk
                    # Add to risk objects
                    risk_data = {
                        "object_id": obj2["id"],
                        "distance_km": distance,
                        "velocity_kmps": rel_velocity,
                        "time_to_conjunction": time_to_conjunction,
                        "risk_level": self._calculate_risk_level(distance, time_to_conjunction)
                    }
                    obj1["risk_objects"].append(risk_data)
                    
                    risk_data = {
                        "object_id": obj1["id"],
                        "distance_km": distance,
                        "velocity_kmps": rel_velocity,
                        "time_to_conjunction": time_to_conjunction,
                        "risk_level": self._calculate_risk_level(distance, time_to_conjunction)
                    }
                    obj2["risk_objects"].append(risk_data)
                    
                    # Generate alert if high risk and enough time has passed since last alert
                    current_time = datetime.now()
                    if (risk_data["risk_level"] == "High" and 
                        (current_time - self.last_alert_time).total_seconds() > 10):
                        self._generate_alert(obj1, obj2, distance, time_to_conjunction)
                        self.last_alert_time = current_time
    
    def _calculate_risk_level(self, distance: float, time_to_conjunction: float) -> str:
        """Calculate risk level based on distance and time to conjunction"""
        if distance < 20 and time_to_conjunction < 2:
            return "High"
        elif distance < 50 and time_to_conjunction < 12:
            return "Medium"
        else:
            return "Low"
    
    def _generate_alert(self, obj1: Dict[str, Any], obj2: Dict[str, Any], 
                        distance: float, time_to_conjunction: float) -> None:
        """Generate an alert for a high-risk conjunction"""
        alert = {
            "id": len(self.alerts) + 1,
            "timestamp": datetime.now().isoformat(),
            "severity": "high",
            "message": f"Potential collision between {obj1['name']} and {obj2['name']}. "
                      f"Distance: {distance:.2f} km, Time to conjunction: {time_to_conjunction:.2f} hours.",
            "object_ids": [obj1["id"], obj2["id"]]
        }
        self.alerts.append(alert)
        
        # Keep only the last 100 alerts
        if len(self.alerts) > 100:
            self.alerts = self.alerts[-100:]
    
    def update(self, dt: float = 60.0) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """Update all space objects and return their current state"""
        # Update positions
        for obj in self.space_objects:
            self._update_position(obj, dt)
            obj["last_update"] = datetime.now()
        
        # Check for conjunctions
        self._check_conjunctions()
        
        # Return current state
        return self.get_objects(), self.get_alerts()
    
    def get_objects(self) -> List[Dict[str, Any]]:
        """Get the current state of all space objects"""
        # Convert to serializable format
        objects = []
        for obj in self.space_objects:
            serialized_obj = {
                "id": obj["id"],
                "name": obj["name"],
                "type": obj["type"],
                "orbit_type": obj["orbit_type"],
                "altitude": obj["altitude"],
                "inclination": obj["inclination"],
                "position": obj["position"],
                "velocity": obj["velocity"],
                "last_update": obj["last_update"].isoformat(),
                "risk_objects": obj["risk_objects"]
            }
            objects.append(serialized_obj)
        return objects
    
    def get_alerts(self) -> List[Dict[str, Any]]:
        """Get all alerts"""
        return self.alerts
    
    def get_object_by_id(self, object_id: str) -> Dict[str, Any]:
        """Get a space object by its ID"""
        for obj in self.space_objects:
            if obj["id"] == object_id:
                return {
                    "id": obj["id"],
                    "name": obj["name"],
                    "type": obj["type"],
                    "orbit_type": obj["orbit_type"],
                    "altitude": obj["altitude"],
                    "inclination": obj["inclination"],
                    "position": obj["position"],
                    "velocity": obj["velocity"],
                    "last_update": obj["last_update"].isoformat(),
                    "risk_objects": obj["risk_objects"]
                }
        return None

# Singleton instance
_propagator_instance = None

def get_propagator() -> OrbitPropagator:
    """Get or create the orbit propagator instance"""
    global _propagator_instance
    if _propagator_instance is None:
        _propagator_instance = OrbitPropagator()
    return _propagator_instance

# Example usage
if __name__ == "__main__":
    propagator = get_propagator()
    
    # Simulate for a few steps
    for _ in range(5):
        objects, alerts = propagator.update()
        print(f"Objects: {len(objects)}, Alerts: {len(alerts)}")
        time.sleep(1)