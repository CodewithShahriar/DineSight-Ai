import React, { createContext, useContext, useState, useEffect } from 'react'
import { STAFF_AVATARS } from '../utils/avatar'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  terminalId: string
  avatar: string
}

export const DEFAULT_MANAGER: AuthUser = {
  id: 'MGR-001',
  name: 'Arthur Pendelton',
  email: 'gm@thegrandbistro.com',
  role: 'General Manager / Operations Director',
  terminalId: 'Terminal 04-A',
  avatar: STAFF_AVATARS['MGR-001'],
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = 'dinesight_manager_session'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch {
      // Fallback
    }
    return null
  })

  const login = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Realistic authentication delay (600ms)
    await new Promise((resolve) => setTimeout(resolve, 600))

    const cleanEmail = email.trim().toLowerCase()
    const cleanPass = pass.trim()

    // Acceptable authentic manager credentials:
    // Email: gm@thegrandbistro.com or arthur.pendelton@thegrandbistro.com or admin
    // Password: password123, admin123, or dinesight2026
    const validEmails = [
      'gm@thegrandbistro.com',
      'arthur@thegrandbistro.com',
      'arthur.pendelton@thegrandbistro.com',
      'admin',
      'manager',
    ]

    const validPasswords = ['admin123', 'password123', 'dinesight2026', 'admin', 'password', '123456']

    const isEmailValid = validEmails.includes(cleanEmail) || cleanEmail.endsWith('@thegrandbistro.com')
    const isPassValid = validPasswords.includes(cleanPass)

    if (!isEmailValid) {
      return {
        success: false,
        error: 'Manager ID or terminal email address not recognized in The Grand Bistro directory.',
      }
    }

    if (!isPassValid) {
      return {
        success: false,
        error: 'Invalid security passkey. Please check your credentials.',
      }
    }

    const authenticatedUser: AuthUser = {
      ...DEFAULT_MANAGER,
      email: cleanEmail.includes('@') ? cleanEmail : DEFAULT_MANAGER.email,
    }

    setUser(authenticatedUser)
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser))
    } catch (e) {
      console.warn('Could not save auth session to localStorage', e)
    }

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } catch (e) {
      console.warn('Could not remove auth session from localStorage', e)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

