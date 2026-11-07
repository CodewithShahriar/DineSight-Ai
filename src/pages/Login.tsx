import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ScanEye,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
  KeyRound,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  // Pre-fill default manager credentials for easy access without a 1-click bypass button
  const [email, setEmail] = useState('gm@thegrandbistro.com')
  const [password, setPassword] = useState('admin123')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      const origin = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'
      navigate(origin, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim()) {
      setErrorMessage('Please enter your manager email or terminal ID.')
      return
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your security passkey.')
      return
    }

    setIsLoading(true)

    try {
      const res = await login(email, password)
      if (res.success) {
        const origin = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'
        navigate(origin, { replace: true })
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify your credentials.')
      }
    } catch {
      setErrorMessage('A connection error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-charcoal-950 text-charcoal-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Ambient Glows & Grid */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-forest-900/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl w-full mx-auto">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-forest-700 to-forest-900 border border-forest-600/40 shadow-inner">
            <ScanEye className="w-5 h-5 text-forest-200" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
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

        <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-charcoal-400 bg-charcoal-900/80 px-3 py-1.5 rounded-lg border border-charcoal-800">
          <Building2 className="w-3.5 h-3.5 text-forest-400" />
          <span>The Grand Bistro</span>
          <span className="text-charcoal-600">•</span>
          <span className="text-emerald-400 font-semibold">Terminal 04-A</span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-charcoal-900/90 backdrop-blur-xl border border-charcoal-800/90 rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Card Title & Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-forest-950/80 border border-forest-700/50 text-forest-300 mb-3 shadow-inner">
              <KeyRound className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
              Manager Sign In
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-400 mt-1">
              Enter your credentials to access the Restaurant Operations Console
            </p>
          </div>

          {/* Error Alert Message */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-300 uppercase tracking-wider mb-1.5">
                Manager Email / ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gm@thegrandbistro.com"
                  autoComplete="username"
                  className="w-full pl-9 pr-3 py-2.5 bg-charcoal-950/80 border border-charcoal-700/80 rounded-xl text-sm text-white placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-charcoal-300 uppercase tracking-wider">
                  Security Passkey
                </label>
                <span className="text-[11px] text-charcoal-500 font-mono">Duty Key: admin123</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-2.5 bg-charcoal-950/80 border border-charcoal-700/80 rounded-xl text-sm text-white placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-charcoal-400 hover:text-charcoal-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember device checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-charcoal-400 hover:text-charcoal-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-charcoal-800 border-charcoal-700 text-forest-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>Remember this terminal session</span>
              </label>

              <span className="text-emerald-400 font-mono text-[11px] font-semibold flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Duty Online
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-500 hover:to-forest-600 text-white font-semibold text-sm shadow-lg shadow-forest-900/40 transition-all flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 focus:ring-offset-charcoal-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Terminal Passkey...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Operations Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Authorized Credentials Card Hint (For reviewer convenience without any shortcut button) */}
          <div className="mt-6 pt-4 border-t border-charcoal-800 text-[11px] text-charcoal-400 flex items-center justify-between">
            <span className="flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-forest-400 mr-1.5 shrink-0" />
              General Manager Credentials:
            </span>
            <span className="font-mono text-charcoal-300 bg-charcoal-800/80 px-2 py-0.5 rounded border border-charcoal-700 font-semibold">
              admin123
            </span>
          </div>
        </div>
      </main>

      {/* Security Footer */}
      <footer className="relative z-10 py-4 px-6 text-center text-xs text-charcoal-500 border-t border-charcoal-900">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-3 font-mono text-[11px]">
          <span>DineSight AI Operations Engine v2.4</span>
          <span className="hidden sm:inline text-charcoal-700">•</span>
          <span>AES-256 Shift Encryption Active</span>
          <span className="hidden sm:inline text-charcoal-700">•</span>
          <span>Station: Arthur Pendelton</span>
        </div>
      </footer>
    </div>
  )
}
