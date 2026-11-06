import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { Overview } from './pages/Overview'
import { LiveMonitoring } from './pages/LiveMonitoring'
import { FloorPlan } from './pages/FloorPlan'
import { WaiterManagement } from './pages/WaiterManagement'
import { Analytics } from './pages/Analytics'
import { Notifications } from './pages/Notifications'
import { Settings } from './pages/Settings'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Overview />} />
          <Route path="monitoring" element={<LiveMonitoring />} />
          <Route path="floor-plan" element={<FloorPlan />} />
          <Route path="waiters" element={<WaiterManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
