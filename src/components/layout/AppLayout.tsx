import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNavbar } from './TopNavbar'
import { useRestaurantData } from '../../hooks/useRestaurantData'

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {
    events,
    unreadNotificationsCount,
    demoMode,
    setDemoMode,
  } = useRestaurantData()

  return (
    <div className="min-h-screen bg-warm-50 text-charcoal-900 flex">
      {/* Persistent Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        unreadCount={unreadNotificationsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all w-full overflow-x-hidden">
        {/* Top Navbar */}
        <TopNavbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          demoMode={demoMode}
          onToggleDemoMode={() => setDemoMode(!demoMode)}
          events={events}
        />

        {/* Dynamic Route View */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
