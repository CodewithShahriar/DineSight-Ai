import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  Bell,
  Clock,
  Sparkles,
  ChevronDown,
  Building2,
  CheckCircle2,
  AlertTriangle,
  User,
  LogOut,
  Sliders,
} from 'lucide-react'
import { useClock } from '../../hooks/useClock'
import { OperationsEvent } from '../../types'

interface TopNavbarProps {
  onToggleSidebar: () => void
  demoMode: boolean
  onToggleDemoMode: () => void
  events?: OperationsEvent[]
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onToggleSidebar,
  demoMode,
  onToggleDemoMode,
  events = [],
}) => {
  const { formattedDate, formattedTime } = useClock()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const activeAlerts = events.filter((e) => e.status === 'active')

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/95 backdrop-blur border-b border-warm-200/80 shadow-subtle transition-all">
      {/* Left: Mobile menu toggle & Restaurant Identity */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-1 text-charcoal-600 rounded-lg lg:hidden hover:bg-warm-100 focus:outline-none"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-forest-50 border border-forest-200/60 text-forest-700">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-bold text-charcoal-900 tracking-tight">
                The Grand Bistro
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-warm-150 text-charcoal-700 border border-warm-200">
                Main Floor & Patio
              </span>
            </div>
            <p className="text-[11px] text-charcoal-500 font-medium hidden md:block">
              Connected System • Terminal 04-A
            </p>
          </div>
        </div>
      </div>

      {/* Right: Live Clock, Demo Mode, Notifications, Profile */}
      <div className="flex items-center space-x-2.5 sm:space-x-4">
        {/* Live Date and Time */}
        <div className="hidden md:flex items-center px-3 py-1.5 rounded-lg bg-warm-100/80 border border-warm-200/70 text-xs font-medium text-charcoal-700">
          <Clock className="w-3.5 h-3.5 mr-2 text-forest-600" />
          <span className="text-charcoal-600 mr-2">{formattedDate}</span>
          <span className="font-mono font-semibold text-charcoal-900 border-l border-warm-300 pl-2">
            {formattedTime}
          </span>
        </div>

        {/* Demo Mode Indicator */}
        <button
          onClick={onToggleDemoMode}
          title="Click to toggle Demo Simulation data"
          className={`flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            demoMode
              ? 'bg-amber-50 text-amber-900 border-amber-300/80 shadow-xs hover:bg-amber-100/70'
              : 'bg-warm-100 text-charcoal-600 border-warm-200 hover:bg-warm-150'
          }`}
        >
          <Sparkles
            className={`w-3.5 h-3.5 mr-1.5 ${
              demoMode ? 'text-amber-600 animate-spin-slow' : 'text-charcoal-400'
            }`}
          />
          <span className="hidden xs:inline">Demo Mode</span>
          <span
            className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              demoMode
                ? 'bg-amber-600 text-white'
                : 'bg-charcoal-300 text-charcoal-700'
            }`}
          >
            {demoMode ? 'ACTIVE' : 'OFF'}
          </span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-charcoal-600 rounded-lg hover:bg-warm-100 transition-colors focus:outline-none"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-xs">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {/* Quick Notification Drawer / Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-warm-200 shadow-floating py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-4 py-2 border-b border-warm-100">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                    Live AI Alerts
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    {activeAlerts.length} Actionable
                  </span>
                </div>
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-forest-700 hover:text-forest-900"
                >
                  View All
                </Link>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-warm-100">
                {activeAlerts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-charcoal-500">
                    No active priority incidents detected.
                  </div>
                ) : (
                  activeAlerts.slice(0, 3).map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3 hover:bg-warm-50/80 transition-colors flex items-start space-x-3"
                    >
                      <div className="mt-0.5 p-1 rounded-md bg-amber-100 text-amber-700">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-charcoal-900 truncate">
                            Table {evt.tableNumber}: {evt.title}
                          </p>
                          <span className="text-[10px] text-charcoal-400">
                            {evt.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-600 line-clamp-2 mt-0.5">
                          {evt.description}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-charcoal-500">
                          <span>Waiter: <strong className="text-charcoal-700">{evt.assignedWaiter}</strong></span>
                          <span className="font-mono text-emerald-700 font-semibold">
                            {Math.round(evt.aiConfidence * 100)}% Conf
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-3 pt-2 pb-1 border-t border-warm-100 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="block w-full py-1.5 text-xs font-semibold text-center rounded-lg bg-warm-100 hover:bg-warm-150 text-charcoal-700 transition-colors"
                >
                  Open Incident Center
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Manager Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2.5 p-1 sm:p-1.5 rounded-xl hover:bg-warm-100 transition-colors focus:outline-none"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Arthur Pendelton"
                className="w-8 h-8 rounded-full object-cover border border-forest-600/30"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-bold text-charcoal-900 leading-none">
                Arthur Pendelton
              </div>
              <div className="text-[10px] text-charcoal-500 font-medium mt-0.5">
                General Manager
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 hidden sm:block" />
          </button>

          {/* Profile Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-warm-200 shadow-floating py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-warm-100">
                <p className="text-xs font-bold text-charcoal-900">Arthur Pendelton</p>
                <p className="text-[11px] text-charcoal-500">gm@thegrandbistro.com</p>
                <span className="inline-flex items-center mt-1 text-[10px] font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Duty Manager On-Shift
                </span>
              </div>

              <div className="py-1 text-xs text-charcoal-700">
                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center px-4 py-2 hover:bg-warm-100"
                >
                  <Sliders className="w-3.5 h-3.5 mr-2.5 text-charcoal-500" />
                  System Preferences
                </Link>
                <Link
                  to="/waiters"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center px-4 py-2 hover:bg-warm-100"
                >
                  <User className="w-3.5 h-3.5 mr-2.5 text-charcoal-500" />
                  Staff Directory
                </Link>
              </div>

              <div className="pt-1 border-t border-warm-100 text-xs">
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center w-full px-4 py-2 text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2.5" />
                  Sign Out (Demo)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
