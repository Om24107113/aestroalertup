import { useEffect, useState } from 'react'
import { Viewer, Entity, Globe, CameraFlyTo } from 'resium'
import { Cartesian3, Color, ConstantProperty, JulianDate, SampledPositionProperty, TimeInterval, TimeIntervalCollection } from 'cesium'
import { useToast } from './ui/use-toast'

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

interface CesiumViewProps {
  onObjectSelect: (object: SpaceObject) => void
  filters: string[]
  searchQuery: string
}

// Mock data for space objects
const mockSpaceObjects: SpaceObject[] = [
  {
    id: '1',
    name: 'International Space Station',
    type: 'satellite',
    noradId: '25544',
    riskLevel: 'low',
    position: {
      x: 6371000 + 408000, // Earth radius + altitude
      y: 0,
      z: 0
    },
    velocity: {
      x: 0,
      y: 7660, // ISS orbital velocity
      z: 0
    }
  },
  {
    id: '2',
    name: 'Debris A',
    type: 'debris',
    noradId: 'D12345',
    riskLevel: 'medium',
    position: {
      x: 6371000 + 500000,
      y: 200000,
      z: 100000
    },
    velocity: {
      x: -1000,
      y: 6000,
      z: 2000
    }
  },
  {
    id: '3',
    name: 'Debris B',
    type: 'debris',
    noradId: 'D67890',
    riskLevel: 'high',
    position: {
      x: 6371000 + 450000,
      y: -300000,
      z: 150000
    },
    velocity: {
      x: 1500,
      y: 5500,
      z: -1000
    }
  }
]

const CesiumView = ({ onObjectSelect, filters, searchQuery }: CesiumViewProps) => {
  const [spaceObjects, setSpaceObjects] = useState<SpaceObject[]>(mockSpaceObjects)
  const { toast } = useToast()

  // Filter objects based on search query and filters
  const filteredObjects = spaceObjects.filter(obj => {
    // Filter by search query
    if (searchQuery && !obj.noradId.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !obj.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    // Filter by orbit type (simplified for demo)
    if (filters.length > 0) {
      // This is a simplified check - in a real app, you'd have actual orbit classifications
      const objAltitude = Math.sqrt(
        obj.position.x * obj.position.x + 
        obj.position.y * obj.position.y + 
        obj.position.z * obj.position.z
      ) - 6371000 // Subtract Earth radius
      
      // Simplified orbit classification
      const orbitType = 
        objAltitude < 2000000 ? 'LEO' : 
        objAltitude < 35786000 ? 'MEO' : 'GEO'
      
      if (!filters.includes(orbitType)) {
        return false
      }
    }
    
    return true
  })

  // Get color based on risk level
  const getRiskColor = (riskLevel: string): Color => {
    switch (riskLevel) {
      case 'low':
        return Color.GREEN
      case 'medium':
        return Color.YELLOW
      case 'high':
        return Color.RED
      default:
        return Color.WHITE
    }
  }

  // Handle object click
  const handleObjectClick = (object: SpaceObject) => {
    onObjectSelect(object)
    
    toast({
      title: `Selected: ${object.name}`,
      description: `NORAD ID: ${object.noradId} | Risk Level: ${object.riskLevel.toUpperCase()}`,
      variant: object.riskLevel === 'high' ? 'destructive' : 
               object.riskLevel === 'medium' ? 'warning' : 'default',
    })
  }

  // Create position property for animation
  const createPositionProperty = (object: SpaceObject) => {
    const property = new SampledPositionProperty()
    
    const start = JulianDate.fromDate(new Date())
    const stop = JulianDate.addSeconds(start, 360, new JulianDate())
    
    // Add positions at regular intervals
    for (let i = 0; i <= 360; i += 30) {
      const time = JulianDate.addSeconds(start, i, new JulianDate())
      const position = Cartesian3.fromElements(
        object.position.x + object.velocity.x * i / 30,
        object.position.y + object.velocity.y * i / 30,
        object.position.z + object.velocity.z * i / 30
      )
      property.addSample(time, position)
    }
    
    return { property, start, stop }
  }

  return (
    <div className="w-full h-full">
      <Viewer 
        full 
        timeline={false} 
        animation={false} 
        baseLayerPicker={false}
        homeButton={false}
        navigationHelpButton={false}
        geocoder={false}
        sceneModePicker={false}
        className="w-full h-full"
      >
        <Globe enableLighting />
        <CameraFlyTo destination={Cartesian3.fromDegrees(0, 0, 20000000)} duration={0} />
        
        {filteredObjects.map(object => {
          const { property, start, stop } = createPositionProperty(object)
          
          return (
            <Entity
              key={object.id}
              name={object.name}
              description={`NORAD ID: ${object.noradId}<br/>Risk Level: ${object.riskLevel.toUpperCase()}`}
              position={property}
              point={{
                pixelSize: object.type === 'satellite' ? 10 : 5,
                color: getRiskColor(object.riskLevel),
                outlineColor: Color.WHITE,
                outlineWidth: 2,
              }}
              path={{
                material: new ConstantProperty(getRiskColor(object.riskLevel)),
                width: 1,
                leadTime: 0,
                trailTime: 60,
                resolution: 120
              }}
              availability={new TimeIntervalCollection([
                new TimeInterval({ start, stop })
              ])}
              onClick={() => handleObjectClick(object)}
            />
          )
        })}
      </Viewer>
    </div>
  )
}

export default CesiumView