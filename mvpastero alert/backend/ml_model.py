import os
import random
from typing import Dict, List, Tuple, Union, Optional

# Define risk levels
RISK_LEVELS = {
    0: "Low",
    1: "Medium",
    2: "High"
}

class CollisionRiskModel:
    def __init__(self):
        self.feature_names = [
            'distance_km', 
            'velocity_kmps', 
            'altitude', 
            'inclination', 
            'time_to_conjunction'
        ]
        
        # No actual model needed for this simplified version
        self.model_ready = True
    
    def _calculate_risk_score(self, features: Dict[str, float]) -> float:
        """Calculate risk score based on input features"""
        # Simplified risk calculation
        distance = features.get('distance_km', 50)
        velocity = features.get('velocity_kmps', 7.5)
        time_to_conjunction = features.get('time_to_conjunction', 48)
        
        # High risk: close distance, high velocity, short time to conjunction
        risk_score = (1 / (distance + 1)) * velocity * (1 / (time_to_conjunction + 1))
        
        # Normalize to 0-1 range (simplified)
        normalized_score = min(max(risk_score * 10, 0), 1)
        
        return normalized_score
    
    def predict_risk(self, features: Dict[str, float]) -> Dict[str, Union[float, str, List[Dict[str, float]]]]:
        """Predict collision risk based on input features"""
        # Calculate risk score
        risk_score = self._calculate_risk_score(features)
        
        # Determine risk level based on score
        risk_level_idx = 0  # Low
        if risk_score > 0.6:
            risk_level_idx = 2  # High
        elif risk_score > 0.2:
            risk_level_idx = 1  # Medium
            
        risk_level = RISK_LEVELS[risk_level_idx]
        
        # Simulate probability
        probability = risk_score if risk_level_idx == 2 else (
            0.5 + risk_score/2 if risk_level_idx == 1 else 1 - risk_score
        )
        
        # Generate maneuver suggestion based on risk level
        maneuver_suggestion = self._generate_maneuver_suggestion(risk_level, features)
        
        # Generate simplified explanation
        explanation = self._generate_explanation(features, risk_level_idx)
        
        return {
            "probability": probability,
            "risk_level": risk_level,
            "maneuver_suggestion": maneuver_suggestion,
            "explanation": explanation,
            "feature_importance": self._get_feature_importance()
        }
    
    def _generate_maneuver_suggestion(self, risk_level: str, features: Dict[str, float]) -> str:
        """Generate a maneuver suggestion based on risk level and features"""
        if risk_level == "Low":
            return "No maneuver required. Continue monitoring."
        
        distance = features.get('distance_km', 100)
        time_to_conjunction = features.get('time_to_conjunction', 24)
        
        if risk_level == "Medium":
            if time_to_conjunction < 12:
                return f"Consider altitude adjustment of +{distance/20:.1f}km within 12 hours."
            else:
                return f"Consider altitude adjustment of +{distance/40:.1f}km within 48 hours."
        
        if risk_level == "High":
            if time_to_conjunction < 6:
                return f"URGENT: Immediate evasive maneuver required: +{distance/10:.1f}km altitude change."
            else:
                return f"Critical: Execute evasive maneuver of +{distance/15:.1f}km within {min(24, time_to_conjunction/2):.1f} hours."
    
    def _generate_explanation(self, features, risk_level_idx) -> str:
        """Generate a human-readable explanation of the prediction"""
        # Get simplified feature importance
        feature_importance = self._get_feature_importance()
        
        # Get top features based on our simplified model
        distance = features.get('distance_km', 100)
        velocity = features.get('velocity_kmps', 7.5)
        time_to_conjunction = features.get('time_to_conjunction', 24)
        
        if risk_level_idx == 0:  # Low risk
            return f"Low collision risk detected. The distance of {distance:.1f}km and time to conjunction of {time_to_conjunction:.1f} hours indicate minimal risk."
        elif risk_level_idx == 1:  # Medium risk
            return f"Medium collision risk detected. Pay attention to the distance of {distance:.1f}km and relative velocity of {velocity:.1f}km/s."
        else:  # High risk
            return f"High collision risk detected. Critical factors are the close distance of {distance:.1f}km and short time to conjunction of {time_to_conjunction:.1f} hours. Immediate action recommended."
    
    def _get_feature_importance(self) -> List[Dict[str, Union[str, float]]]:
        """Get simplified feature importance"""
        # Simplified fixed importance values
        return [
            {"name": "distance_km", "importance": 0.4},
            {"name": "velocity_kmps", "importance": 0.3},
            {"name": "time_to_conjunction", "importance": 0.2},
            {"name": "altitude", "importance": 0.05},
            {"name": "inclination", "importance": 0.05}
        ]

# Singleton instance
_model_instance = None

def get_model() -> CollisionRiskModel:
    """Get or create the collision risk model instance"""
    global _model_instance
    if _model_instance is None:
        _model_instance = CollisionRiskModel()
    return _model_instance

# Example usage
if __name__ == "__main__":
    model = get_model()
    
    # Example prediction
    features = {
        "distance_km": 15.0,
        "velocity_kmps": 10.0,
        "altitude": 450.0,
        "inclination": 51.6,
        "time_to_conjunction": 8.0
    }
    
    prediction = model.predict_risk(features)
    print(f"Risk Level: {prediction['risk_level']}")
    print(f"Probability: {prediction['probability']:.4f}")
    print(f"Maneuver Suggestion: {prediction['maneuver_suggestion']}")
    print(f"Explanation: {prediction['explanation']}")
    print("Feature Importance:")
    for feature in sorted(prediction['feature_importance'], key=lambda x: x['importance'], reverse=True):
        print(f"  {feature['name']}: {feature['importance']:.4f}")