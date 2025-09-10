import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import CesiumView from './components/CesiumView'
import ObjectPanel from './components/ObjectPanel'
import RiskTimeline from './components/RiskTimeline'
import AlertsFeed from './components/AlertsFeed'
import { AnimatePresence, motion } from 'framer-motion'

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

interface Alert {
  id: string
  timestamp: string
  message: string
  severity: 'info' | 'warning' | 'critical'
  objectId?: string
}

function App() {
  const [selectedObject, setSelectedObject] = useState<SpaceObject | null>(null)
  const [showObjectPanel, setShowObjectPanel] = useState(false)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [orbitFilter, setOrbitFilter] = useState<string[]>(['LEO', 'MEO', 'GEO'])
  const [searchQuery, setSearchQuery] = useState('')

  // WebSocket connection for real-time updates
  useEffect(() => {
    const wsUrl = `${import.meta.env.VITE_BACKEND_URL || 'ws://localhost:8000'}/ws/orbits`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log('WebSocket connection established')
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      // Handle different types of messages
      if (data.type === 'alert') {
        setAlerts(prev => [data.alert, ...prev].slice(0, 50))
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed')
    }

    return () => {
      ws.close()
    }
  }, [])

  // Handle object selection
  const handleObjectSelect = (object: SpaceObject) => {
    setSelectedObject(object)
    setShowObjectPanel(true)
  }

  // Handle filter changes
  const handleFilterChange = (filters: string[]) => {
    setOrbitFilter(filters)
  }

  // Handle search query changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="flex flex-col h-screen bg-nasa-black text-white overflow-hidden">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar 
          onFilterChange={handleFilterChange} 
          onSearchChange={handleSearchChange}
          activeFilters={orbitFilter}
          searchQuery={searchQuery}
        />
        
        {/* Center Panel - CesiumView */}
        <div className="flex-1 relative">
          <CesiumView 
            onObjectSelect={handleObjectSelect} 
            filters={orbitFilter}
            searchQuery={searchQuery}
          />
        </div>
        
        {/* Right Sidebar - Object Panel */}
        <AnimatePresence>
          {showObjectPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 350, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full bg-nasa-navy border-l border-gray-700"
            >
              <ObjectPanel 
                object={selectedObject} 
                onClose={() => setShowObjectPanel(false)} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Bottom Panel */}
      <div className="h-64 border-t border-gray-700 flex">
        {/* Risk Timeline */}
        <div className="w-2/3 border-r border-gray-700">
          <RiskTimeline selectedObject={selectedObject} />
        </div>
        
        {/* Alerts Feed */}
        <div className="w-1/3">
          <AlertsFeed alerts={alerts} />
        </div>
      </div>
    </div>
  )
}

export default App