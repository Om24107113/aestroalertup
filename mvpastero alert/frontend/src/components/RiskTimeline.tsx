import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

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

interface TimelinePoint {
  time: string
  probability: number
  distance: number
}

interface RiskTimelineProps {
  selectedObject: SpaceObject | null
}

const RiskTimeline = ({ selectedObject }: RiskTimelineProps) => {
  const [timelineData, setTimelineData] = useState<TimelinePoint[]>([])

  // Generate mock timeline data when selected object changes
  useEffect(() => {
    if (!selectedObject) {
      setTimelineData([])
      return
    }

    // Generate mock data based on risk level
    const now = new Date()
    const data: TimelinePoint[] = []
    
    // Base probability based on risk level
    const baseProbability = 
      selectedObject.riskLevel === 'low' ? 0.01 : 
      selectedObject.riskLevel === 'medium' ? 0.1 : 0.5
    
    // Generate 24 hours of data points (1 per hour)
    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000)
      
      // Create some variation in the data
      let probability = baseProbability
      
      // For high risk, create a spike at hour 8-10
      if (selectedObject.riskLevel === 'high' && i >= 8 && i <= 10) {
        probability = 0.7 + (Math.random() * 0.2) // 0.7-0.9
      } 
      // For medium risk, create a smaller spike at hour 12-14
      else if (selectedObject.riskLevel === 'medium' && i >= 12 && i <= 14) {
        probability = 0.3 + (Math.random() * 0.2) // 0.3-0.5
      }
      // Add some random variation
      else {
        probability += (Math.random() * 0.05) - 0.025 // +/- 0.025
      }
      
      // Ensure probability is between 0 and 1
      probability = Math.max(0, Math.min(1, probability))
      
      // Mock distance (inversely related to probability)
      const distance = 100 - (probability * 100) + (Math.random() * 10) - 5
      
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        probability: parseFloat(probability.toFixed(4)),
        distance: parseFloat(distance.toFixed(1))
      })
    }
    
    setTimelineData(data)
  }, [selectedObject])

  // Get color based on probability
  const getProbabilityColor = (probability: number): string => {
    if (probability >= 0.5) return '#ef4444' // red-500
    if (probability >= 0.1) return '#eab308' // yellow-500
    return '#22c55e' // green-500
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-white">Risk Timeline (24h Forecast)</h2>
      </div>
      
      <div className="flex-1 p-3 overflow-hidden">
        {selectedObject ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timelineData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 10 }}
              />
              <YAxis 
                yAxisId="left"
                label={{ value: 'Probability', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 10 }}
                domain={[0, 1]}
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 10 }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                label={{ value: 'Distance (km)', angle: 90, position: 'insideRight', fill: '#9ca3af', fontSize: 10 }}
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.375rem' }}
                labelStyle={{ color: '#f3f4f6' }}
                itemStyle={{ color: '#f3f4f6' }}
              />
              <ReferenceLine y={0.1} yAxisId="left" stroke="#eab308" strokeDasharray="3 3" label={{ value: 'Warning', fill: '#eab308', fontSize: 10 }} />
              <ReferenceLine y={0.5} yAxisId="left" stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Critical', fill: '#ef4444', fontSize: 10 }} />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="probability" 
                name="Collision Probability" 
                stroke="#FF4C00" 
                strokeWidth={2}
                dot={{ fill: '#FF4C00', r: 4 }}
                activeDot={{ r: 6, stroke: '#FF4C00', strokeWidth: 2 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="distance" 
                name="Distance (km)" 
                stroke="#003366" 
                strokeWidth={2}
                dot={{ fill: '#003366', r: 4 }}
                activeDot={{ r: 6, stroke: '#003366', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400 text-sm">Select an object to view risk timeline</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RiskTimeline