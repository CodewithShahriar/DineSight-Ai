import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Cctv,
  LayoutGrid,
  Users,
  BarChart3,
  Bell,
  Settings,
  ScanEye,
  ChevronRight,
  ShieldCheck,
  Radio,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onCloseMobile?: () => void
  activeAlertsCount?: number
  unreadCount?: number
}

const navItems = [
  {
    name: 'Overview',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Live Monitoring',
    path: '/monitoring',
    icon: Cctv,
    badge: 'LIVE',
    badgeType: 'live',
  },
  {
    name: 'Restaurant Floor Plan',
    path: '/floor-plan',
    icon: LayoutGrid,
  },
  {
    name: 'Waiter Management',
    path: '/waiters',
    icon: Users,
  },
  {
    name: 'Service Analytics',
    path: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Notifications',
    path: '/notifications',
    icon: Bell,
    badgeKey: 'unread',
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings,
  },
]

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onCloseMobile,
  unreadCount = 4,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-charcoal-900 border-r border-charcoal-800 text-charcoal-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-charcoal-800">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-forest-700 to-forest-900 border border-forest-600/40 shadow-inner">
              <ScanEye className="w-5 h-5 text-forest-200" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-bold tracking-tight text-white">DineSight</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-forest-600 text-forest-100 uppercase tracking-wider font-mono">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-charcoal-400 font-medium">Vision Ops Suite</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-5 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
            Operations Console
          </div>

          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-forest-900/90 text-white shadow-sm border border-forest-700/50'
                      : 'text-charcoal-400 hover:text-charcoal-100 hover:bg-charcoal-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-forest-400'
                            : 'text-charcoal-400 group-hover:text-charcoal-200'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badgeType === 'live' && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-950/80 text-red-400 border border-red-800/40">
                        <Radio className="w-2.5 h-2.5 mr-1 animate-pulse" />
                        LIVE
                      </span>
                    )}

                    {item.badgeKey === 'unread' && unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {unreadCount}
                      </span>
                    )}

                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-forest-400 ml-auto" />
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </div>

        {/* Bottom AI Status widget */}
        <div className="p-3.5 m-3 rounded-xl bg-charcoal-950/70 border border-charcoal-800">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center text-[11px] font-semibold text-charcoal-300">
              <ShieldCheck className="w-3.5 h-3.5 text-forest-400 mr-1.5" />
              Vision Engine v2.4
            </span>
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-[11px] text-charcoal-400 leading-tight">
            8 Cameras Streaming
          </div>
          <div className="mt-2 w-full bg-charcoal-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-forest-500 h-1.5 rounded-full"
              style={{ width: '99.4%' }}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5 text-[10px] text-charcoal-500">
            <span>Inference Latency</span>
            <span className="font-mono text-charcoal-300 font-semibold">41ms</span>
          </div>
        </div>
      </aside>
    </>
  )
}
