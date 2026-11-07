import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ScanEye,
  Lock,
  Unlock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  AlertCircle,
  Loader2,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  // Real credentials inputs requiring manual user entry
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  // Accepted manager credentials check
  const cleanEmail = email.trim().toLowerCase()
  const cleanPass = password.trim()

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

  const isFilled = cleanEmail.length > 0 && cleanPass.length > 0
  const isCredentialsValid = isFilled && isEmailValid && isPassValid
  const isCredentialsInvalid = isFilled && (!isEmailValid || !isPassValid)

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      const origin = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'
      navigate(origin, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const triggerShake = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  const handleEmailChange = (val: string) => {
    setEmail(val)
    if (errorMessage) setErrorMessage(null)
    if (hasAttemptedSubmit) setHasAttemptedSubmit(false)
  }

  const handlePasswordChange = (val: string) => {
    setPassword(val)
    if (errorMessage) setErrorMessage(null)
    if (hasAttemptedSubmit) setHasAttemptedSubmit(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setHasAttemptedSubmit(false)

    if (!cleanEmail) {
      setErrorMessage('Please enter your manager email or terminal ID.')
      triggerShake()
      return
    }

    if (!cleanPass) {
      setErrorMessage('Please enter your security passkey.')
      triggerShake()
      return
    }

    if (!isCredentialsValid) {
      setHasAttemptedSubmit(true)
      triggerShake()
    }

    setIsLoading(true)

    try {
      const res = await login(cleanEmail, cleanPass)
      if (res.success) {
        const origin = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'
        navigate(origin, { replace: true })
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify your credentials.')
        setHasAttemptedSubmit(true)
        triggerShake()
      }
    } catch {
      setErrorMessage('A connection error occurred. Please try again.')
      setHasAttemptedSubmit(true)
      triggerShake()
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
            <div className="mb-5 p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-start space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-charcoal-300 uppercase tracking-wider">
                  Manager Email / ID
                </label>
                {isFilled && isEmailValid && (
                  <span className="flex items-center text-[10px] text-emerald-400 font-mono font-semibold">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Recognized
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="gm@thegrandbistro.com"
                  autoComplete="username"
                  className={`w-full pl-9 pr-3 py-2.5 bg-charcoal-950/80 border rounded-xl text-sm text-white placeholder-charcoal-500 focus:outline-none transition-all ${
                    isFilled && isEmailValid
                      ? 'border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/50'
                      : hasAttemptedSubmit && !isEmailValid
                      ? 'border-rose-600/80 focus:ring-2 focus:ring-rose-500/50'
                      : 'border-charcoal-700/80 focus:ring-2 focus:ring-forest-600'
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-charcoal-300 uppercase tracking-wider">
                  Security Passkey
                </label>
                {isFilled && isPassValid && (
                  <span className="flex items-center text-[10px] text-emerald-400 font-mono font-semibold">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Valid Key
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-9 pr-10 py-2.5 bg-charcoal-950/80 border rounded-xl text-sm text-white placeholder-charcoal-500 focus:outline-none transition-all ${
                    isFilled && isPassValid
                      ? 'border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/50'
                      : hasAttemptedSubmit && !isPassValid
                      ? 'border-rose-600/80 focus:ring-2 focus:ring-rose-500/50'
                      : 'border-charcoal-700/80 focus:ring-2 focus:ring-forest-600'
                  }`}
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

            {/* Dynamic Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !isFilled}
                className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 focus:outline-none ${
                  // State 1: Loading
                  isLoading
                    ? 'bg-forest-900/90 border border-forest-600/70 text-forest-200 cursor-wait shadow-inner'
                    // State 2: Has error after submit attempt
                    : hasAttemptedSubmit && (errorMessage || isCredentialsInvalid)
                    ? `bg-gradient-to-r from-rose-900 via-rose-950 to-rose-900 border-2 border-rose-600/90 text-rose-100 shadow-xl shadow-rose-950/70 cursor-pointer hover:brightness-110 ${
                        isShaking ? 'animate-auth-shake' : ''
                      }`
                    // State 3: Correct Manager Credentials Match
                    : isCredentialsValid
                    ? 'bg-gradient-to-r from-emerald-600 via-forest-600 to-emerald-600 hover:from-emerald-500 hover:to-forest-500 text-white font-bold border border-emerald-400/60 shadow-xl shadow-emerald-950/60 ring-2 ring-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer group'
                    // State 4: Filled with unrecognized credentials (caution state)
                    : isCredentialsInvalid
                    ? 'bg-charcoal-800 hover:bg-charcoal-750 border border-amber-600/50 hover:border-amber-500/80 text-amber-200 shadow-md cursor-pointer hover:scale-[1.005]'
                    // State 5: Empty / Incomplete
                    : 'bg-charcoal-850 border border-charcoal-800 text-charcoal-500 cursor-not-allowed opacity-60'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin text-emerald-400" />
                    <span>Verifying Terminal Security...</span>
                  </>
                ) : hasAttemptedSubmit && (errorMessage || isCredentialsInvalid) ? (
                  <>
                    <XCircle className="w-4.5 h-4.5 text-rose-400 shrink-0" />
                    <span>Access Denied — Invalid Credentials</span>
                  </>
                ) : isCredentialsValid ? (
                  <>
                    <span className="relative flex h-2.5 w-2.5 mr-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300" />
                    </span>
                    <Unlock className="w-4.5 h-4.5 text-emerald-200" />
                    <span>Authorize & Sign In to Operations Console</span>
                    <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform ml-0.5" />
                  </>
                ) : isCredentialsInvalid ? (
                  <>
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>Verify Credentials & Sign In</span>
                    <ArrowRight className="w-4 h-4 text-amber-300 ml-0.5" />
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-charcoal-600" />
                    <span>Enter Credentials to Sign In</span>
                  </>
                )}
              </button>

              {/* Dynamic Status Badges under button */}
              {isCredentialsValid && !isLoading && (
                <p className="text-[11px] text-center text-emerald-400 mt-2 font-mono flex items-center justify-center font-semibold animate-in fade-in duration-200">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Duty Manager Credentials Recognized
                </p>
              )}
              {hasAttemptedSubmit && (errorMessage || isCredentialsInvalid) && !isLoading && (
                <p className="text-[11px] text-center text-rose-400 mt-2 font-mono flex items-center justify-center animate-in fade-in duration-200">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-400" /> Check manager email or security passkey
                </p>
              )}
            </div>
          </form>
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
export default Login
