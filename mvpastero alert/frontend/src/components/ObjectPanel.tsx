import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { getRiskColor } from '@/lib/utils'

// Types
interface SpaceObject {
  id: string
  name: string
  type: 'satellite' | 'debris'
  noradId: string
  riskLevel: 'low' | 'medium' | 'high'
  position: {
    x: number
    y: number
    z: number
  }
  velocity: {
    x: number
    y: number
    z: number
  }
}

interface RiskPrediction {
  probability: number
  risk_level: 'Low' | 'Medium' | 'High'
  maneuver_suggestion: string
  explanation: string
}

interface ObjectPanelProps {
  object: SpaceObject | null
  onClose: () => void
}

const ObjectPanel = ({ object, onClose }: ObjectPanelProps) => {
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState<RiskPrediction | null>(null)

  // Fetch risk prediction when object changes
  useEffect(() => {
    if (!object) return

    const fetchPrediction = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an actual API call
        // const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/objects/${object.id}/suggest_maneuver`)
        // const data = await response.json()
        
        // Mock API response
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
        
        // Generate mock prediction based on the object's risk level
        const mockPrediction: RiskPrediction = {
          probability: object.riskLevel === 'low' ? 0.02 : 
                       object.riskLevel === 'medium' ? 0.15 : 0.78,
          risk_level: object.riskLevel === 'low' ? 'Low' : 
                      object.riskLevel === 'medium' ? 'Medium' : 'High',
          maneuver_suggestion: object.riskLevel === 'low' ? 'No maneuver required' : 
                               object.riskLevel === 'medium' ? 'Consider altitude adjustment of +2.5km within 48 hours' : 
                               'Immediate evasive maneuver required: +5km altitude change',
          explanation: `The ML model analyzed ${object.type === 'satellite' ? 'satellite' : 'debris'} trajectory and detected ${object.riskLevel === 'high' ? 'critical' : object.riskLevel} risk factors. Key variables: distance to conjunction point, relative velocity, and time to closest approach.`
        }
        
        setPrediction(mockPrediction)
      } catch (error) {
        console.error('Error fetching prediction:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrediction()
  }, [object])

  if (!object) return null

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">{object.name}</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Object Info */}
        <Card className="bg-nasa-black border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Object Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">NORAD ID:</span>
              <span className="text-white font-mono">{object.noradId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span className="text-white">{object.type === 'satellite' ? 'Satellite' : 'Debris'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Risk Level:</span>
              <span className={`font-semibold ${object.riskLevel === 'low' ? 'text-green-500' : object.riskLevel === 'medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                {object.riskLevel.toUpperCase()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Risk Prediction */}
        <Card className="bg-nasa-black border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">AI Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-nasa-orange"></div>
              </div>
            ) : prediction ? (
              <>
                {/* Probability Gauge */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Collision Probability (Pc):</span>
                    <span className="text-white font-mono">{(prediction.probability * 100).toFixed(4)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${getRiskColor(object.riskLevel)}`}
                      style={{ width: `${Math.min(prediction.probability * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Risk Level */}
                <div className="p-3 rounded-md border border-gray-700 bg-gray-800/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(object.riskLevel)}`}></div>
                    <span className="text-sm font-medium text-white">Risk Level: {prediction.risk_level}</span>
                  </div>
                  <p className="text-xs text-gray-300">{prediction.explanation}</p>
                </div>

                {/* Maneuver Suggestion */}
                <div>
                  <h4 className="text-xs font-medium text-gray-400 mb-1">Maneuver Suggestion:</h4>
                  <p className="text-sm text-white bg-nasa-navy/50 p-2 rounded-md border border-nasa-navy">
                    {prediction.maneuver_suggestion}
                  </p>
                </div>

                {/* SHAP-style Explanation Visualization (simplified) */}
                <div>
                  <h4 className="text-xs font-medium text-gray-400 mb-1">Feature Importance:</h4>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <div className="w-24 text-xs text-gray-400">Distance:</div>
                      <div className="flex-1 bg-gray-700 h-2 rounded-full">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 text-xs text-gray-400">Velocity:</div>
                      <div className="flex-1 bg-gray-700 h-2 rounded-full">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 text-xs text-gray-400">Time to Conj.:</div>
                      <div className="flex-1 bg-gray-700 h-2 rounded-full">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-sm">No prediction available</p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {prediction && prediction.risk_level !== 'Low' && (
          <div className="flex space-x-2">
            <Button variant="warning" className="flex-1">
              Execute Maneuver
            </Button>
            <Button variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:text-white">
              Simulate
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ObjectPanel