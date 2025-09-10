import { useState } from 'react'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { toast } = useToast()

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    
    // For demo purposes, show a toast when switching tabs
    if (tab !== 'dashboard') {
      toast({
        title: 'Feature in Development',
        description: `The ${tab.charAt(0).toUpperCase() + tab.slice(1)} feature is coming soon.`,
        variant: 'warning',
      })
    }
  }

  return (
    <div className="bg-nasa-navy text-white p-4 flex items-center justify-between border-b border-gray-700">
      {/* Logo and Title */}
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-nasa-orange flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold">AstroAlert</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1">
        <Button 
          variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'} 
          onClick={() => handleTabClick('dashboard')}
          className={activeTab === 'dashboard' ? 'bg-nasa-orange text-white' : 'text-white hover:bg-nasa-navy/50'}
        >
          Dashboard
        </Button>
        <Button 
          variant={activeTab === 'alerts' ? 'secondary' : 'ghost'} 
          onClick={() => handleTabClick('alerts')}
          className={activeTab === 'alerts' ? 'bg-nasa-orange text-white' : 'text-white hover:bg-nasa-navy/50'}
        >
          Alerts
        </Button>
        <Button 
          variant={activeTab === 'settings' ? 'secondary' : 'ghost'} 
          onClick={() => handleTabClick('settings')}
          className={activeTab === 'settings' ? 'bg-nasa-orange text-white' : 'text-white hover:bg-nasa-navy/50'}
        >
          Settings
        </Button>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-sm">System Online</span>
      </div>
    </div>
  )
}

export default Navbar