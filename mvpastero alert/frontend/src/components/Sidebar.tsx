import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface SidebarProps {
  onFilterChange: (filters: string[]) => void
  onSearchChange: (query: string) => void
  activeFilters: string[]
  searchQuery: string
}

const Sidebar = ({
  onFilterChange,
  onSearchChange,
  activeFilters,
  searchQuery
}: SidebarProps) => {
  const [localFilters, setLocalFilters] = useState<string[]>(activeFilters)
  const [localSearch, setLocalSearch] = useState<string>(searchQuery)

  const handleFilterToggle = (filter: string) => {
    const updatedFilters = localFilters.includes(filter)
      ? localFilters.filter(f => f !== filter)
      : [...localFilters, filter]
    
    setLocalFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value)
    onSearchChange(e.target.value)
  }

  return (
    <div className="w-64 bg-nasa-navy border-r border-gray-700 h-full overflow-y-auto p-4 flex flex-col space-y-4">
      {/* Search */}
      <Card className="bg-nasa-black border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-white">Search Objects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Search by NORAD ID"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-nasa-orange"
              value={localSearch}
              onChange={handleSearchChange}
            />
            {localSearch && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-gray-400 hover:text-white w-full justify-start"
                onClick={() => {
                  setLocalSearch('')
                  onSearchChange('')
                }}
              >
                Clear Search
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orbit Filters */}
      <Card className="bg-nasa-black border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-white">Orbit Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant={localFilters.includes('LEO') ? 'secondary' : 'outline'}
              size="sm"
              className={`w-full justify-start ${localFilters.includes('LEO') ? 'bg-nasa-orange text-white' : 'bg-gray-800 text-gray-300 border-gray-700'}`}
              onClick={() => handleFilterToggle('LEO')}
            >
              LEO (Low Earth Orbit)
            </Button>
            <Button
              variant={localFilters.includes('MEO') ? 'secondary' : 'outline'}
              size="sm"
              className={`w-full justify-start ${localFilters.includes('MEO') ? 'bg-nasa-orange text-white' : 'bg-gray-800 text-gray-300 border-gray-700'}`}
              onClick={() => handleFilterToggle('MEO')}
            >
              MEO (Medium Earth Orbit)
            </Button>
            <Button
              variant={localFilters.includes('GEO') ? 'secondary' : 'outline'}
              size="sm"
              className={`w-full justify-start ${localFilters.includes('GEO') ? 'bg-nasa-orange text-white' : 'bg-gray-800 text-gray-300 border-gray-700'}`}
              onClick={() => handleFilterToggle('GEO')}
            >
              GEO (Geostationary Orbit)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Object Types */}
      <Card className="bg-nasa-black border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-white">Object Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-300">Satellites</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-sm text-gray-300">Debris</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-300">Low Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-300">Medium Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-300">High Risk</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card className="bg-nasa-black border-gray-700 mt-auto">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-white">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Objects Tracked:</span>
              <span className="text-white">3</span>
            </div>
            <div className="flex justify-between">
              <span>Active Alerts:</span>
              <span className="text-nasa-orange">1</span>
            </div>
            <div className="flex justify-between">
              <span>Last Update:</span>
              <span className="text-white">Just now</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Sidebar