import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Login } from './pages/Login'
import { AppLayout } from './components/layout/AppLayout'
import { Overview } from './pages/Overview'
import { LiveMonitoring } from './pages/LiveMonitoring'
import { FloorPlan } from './pages/FloorPlan'
import { WaiterManagement } from './pages/WaiterManagement'
import { Analytics } from './pages/Analytics'
import { Notifications } from './pages/Notifications'
import { Settings } from './pages/Settings'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
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
    </AuthProvider>
  )
}

export default App
