import { useEffect, useRef } from 'react'
import { formatDateTime } from '@/lib/utils'

// Types
interface Alert {
  id: string
  timestamp: string
  message: string
  severity: 'info' | 'warning' | 'critical'
  objectId?: string
}

interface AlertsFeedProps {
  alerts: Alert[]
}

// Mock alerts for initial state
const mockAlerts: Alert[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    message: 'Debris B on collision course with ISS',
    severity: 'critical',
    objectId: '3'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    message: 'Debris A approaching warning threshold',
    severity: 'warning',
    objectId: '2'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    message: 'System monitoring activated',
    severity: 'info'
  }
]

const AlertsFeed = ({ alerts = mockAlerts }: AlertsFeedProps) => {
  const feedRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new alerts arrive
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight
    }
  }, [alerts])

  // Get severity class
  const getSeverityClass = (severity: string): string => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 border-red-500 text-red-500'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500 text-yellow-500'
      case 'info':
      default:
        return 'bg-blue-500/10 border-blue-500 text-blue-500'
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-white">Live Alerts</h2>
        <div className="flex items-center space-x-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nasa-orange opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-nasa-orange"></span>
          </span>
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </div>
      
      <div ref={feedRef} className="flex-1 overflow-y-auto p-2 space-y-2">
        {alerts.length > 0 ? (
          alerts.map(alert => (
            <div 
              key={alert.id} 
              className={`p-2 rounded-md border text-xs ${getSeverityClass(alert.severity)}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium">{alert.severity.toUpperCase()}</span>
                <span className="text-gray-400 text-[10px]">{formatDateTime(alert.timestamp)}</span>
              </div>
              <p>{alert.message}</p>
              {alert.objectId && (
                <div className="mt-1 text-[10px] text-gray-400">
                  Object ID: {alert.objectId}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400 text-xs">No alerts</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AlertsFeed