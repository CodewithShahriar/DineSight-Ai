import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNavbar } from './TopNavbar'
import { useRestaurantData } from '../../hooks/useRestaurantData'

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const {
    events,
    unreadNotificationsCount,
    demoMode,
    setDemoMode,
  } = useRestaurantData()

  // Reset scroll to top cleanly on page navigation to eliminate jumping
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-warm-50 text-charcoal-900 flex">
      {/* Persistent Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        unreadCount={unreadNotificationsCount}
      />

      {/* Main Content Area without layout-stretching transition-all */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 w-full overflow-x-hidden">
        {/* Top Navbar */}
        <TopNavbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          demoMode={demoMode}
          onToggleDemoMode={() => setDemoMode(!demoMode)}
          events={events}
        />

        {/* Dynamic Route View with premium silky-smooth fade transition */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <div key={location.pathname} className="animate-page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
