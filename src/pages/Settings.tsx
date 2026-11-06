import React, { useState } from 'react'
import {
  Cctv,
  Bell,
  Save,
  Check,
  Cpu,
  Sparkles,
  RotateCcw,
} from 'lucide-react'
import { PageHeader } from '../components/shared/PageHeader'
import { Button } from '../components/shared/Button'
import { Badge } from '../components/shared/Badge'
import { Card, CardHeader, CardTitle, CardDescription } from '../components/shared/Card'

export const Settings: React.FC = () => {
  const [gestureSensitivity, setGestureSensitivity] = useState(85)
  const [glasswareThreshold, setGlasswareThreshold] = useState(15)
  const [turnoverBussingDelay, setTurnoverBussingDelay] = useState(5)
  const [escalateWaitSec, setEscalateWaitSec] = useState(180)
  const [soundAlerts, setSoundAlerts] = useState(true)
  const [smartwatchSync, setSmartwatchSync] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="System & AI Vision Settings"
        subtitle="Calibrate neural network inference thresholds, alert dispatch timing, and CCTV hardware parameters."
        badge={
          <Badge variant="forest" dot>
            Engine v2.4 Active
          </Badge>
        }
        actions={
          <div className="flex items-center space-x-2">
            <Button
              variant="primary"
              size="sm"
              icon={isSaved ? <Check className="w-3.5 h-3.5 text-white" /> : <Save className="w-3.5 h-3.5 text-white" />}
              onClick={handleSave}
            >
              {isSaved ? 'Settings Applied' : 'Save Configuration'}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Vision Inference Sensitivity */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-forest-700" />
                <div>
                  <CardTitle>Computer Vision Neural Calibration</CardTitle>
                  <CardDescription>
                    Adjust sensitivity parameters for dining room gesture and tableware recognition
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <div className="space-y-5">
              {/* Gesture Sensitivity */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-charcoal-800 mb-1.5">
                  <span>Guest Hand Wave & Gesture Sensitivity</span>
                  <span className="font-mono text-forest-700 font-bold">{gestureSensitivity}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={gestureSensitivity}
                  onChange={(e) => setGestureSensitivity(Number(e.target.value))}
                  className="w-full accent-forest-700 h-1.5 bg-warm-200 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-charcoal-500 mt-1">
                  Higher values prevent false positives from natural dining conversation gestures.
                </p>
              </div>

              {/* Glassware Threshold */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-charcoal-800 mb-1.5">
                  <span>Empty Glassware Refill Alert Level</span>
                  <span className="font-mono text-forest-700 font-bold">&lt; {glasswareThreshold}% Full</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  value={glasswareThreshold}
                  onChange={(e) => setGlasswareThreshold(Number(e.target.value))}
                  className="w-full accent-forest-700 h-1.5 bg-warm-200 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-charcoal-500 mt-1">
                  Triggers an automatic server refill reminder when liquid volume drops below threshold.
                </p>
              </div>

              {/* Table Turnover Delay */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-charcoal-800 mb-1.5">
                  <span>Vacated Table Bussing Alert Delay</span>
                  <span className="font-mono text-forest-700 font-bold">{turnoverBussingDelay} minutes</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={turnoverBussingDelay}
                  onChange={(e) => setTurnoverBussingDelay(Number(e.target.value))}
                  className="w-full accent-forest-700 h-1.5 bg-warm-200 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-charcoal-500 mt-1">
                  Time allowed before alerting bussers to sanitize and reset vacated tables.
                </p>
              </div>

              {/* Escalation SLA */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-charcoal-800 mb-1.5">
                  <span>Manager Escalation Timer</span>
                  <span className="font-mono text-amber-700 font-bold">{escalateWaitSec} seconds</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="360"
                  step="30"
                  value={escalateWaitSec}
                  onChange={(e) => setEscalateWaitSec(Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 bg-warm-200 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-charcoal-500 mt-1">
                  If assigned server does not acknowledge a gesture flag within this period, GM is notified.
                </p>
              </div>
            </div>
          </Card>

          {/* Dispatch & Smartwatch channels */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-forest-700" />
                <div>
                  <CardTitle>Staff Alert Dispatch Channels</CardTitle>
                  <CardDescription>Configure smart device haptic delivery & audio chimes</CardDescription>
                </div>
              </div>
            </CardHeader>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-warm-200 hover:bg-warm-50/50 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-charcoal-900">
                    Waiter Smartwatch Haptic Sync
                  </p>
                  <p className="text-[11px] text-charcoal-500">
                    Vibrate staff wearables immediately when table flags occur in their zone.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={smartwatchSync}
                  onChange={(e) => setSmartwatchSync(e.target.checked)}
                  className="w-4 h-4 accent-forest-700 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-warm-200 hover:bg-warm-50/50 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-charcoal-900">
                    Host Stand Audio Chime
                  </p>
                  <p className="text-[11px] text-charcoal-500">
                    Subtle audio chime at host stand for critical hospitality bottlenecks.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="w-4 h-4 accent-forest-700 rounded cursor-pointer"
                />
              </label>
            </div>
          </Card>
        </div>

        {/* Right Column: Demo Controls & Hardware Stream Diagnostics */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-amber-300 bg-amber-50/30">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <div>
                  <CardTitle className="text-amber-950">Sales Demonstration Sandbox</CardTitle>
                  <CardDescription>Presentation controls for sales walk-throughs</CardDescription>
                </div>
              </div>
            </CardHeader>

            <div className="space-y-3 text-xs text-charcoal-700">
              <p>
                This instance is operating in <strong>Frontend-Only Simulation Mode</strong>. No external camera or backend server connections are required.
              </p>

              <div className="pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                  onClick={() => alert('Demo scenario reset to standard lunch service.')}
                  className="w-full text-xs"
                >
                  Reset Demo Data to Lunch Baseline
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Cctv className="w-4 h-4 text-forest-700" />
                <div>
                  <CardTitle>Surveillance Hardware Health</CardTitle>
                  <CardDescription>RTSP / WebRTC Edge cameras</CardDescription>
                </div>
              </div>
            </CardHeader>

            <div className="space-y-2.5 text-xs">
              {[
                { name: 'Camera 01 (East Dining)', ip: '192.168.1.101', fps: '60 fps', status: 'Online' },
                { name: 'Camera 02 (West Dining)', ip: '192.168.1.102', fps: '60 fps', status: 'Online' },
                { name: 'Camera 03 (Patio Garden)', ip: '192.168.1.103', fps: '60 fps', status: 'Online' },
                { name: 'Camera 04 (Bar High-Tops)', ip: '192.168.1.104', fps: '30 fps', status: 'Online' },
              ].map((c) => (
                <div
                  key={c.ip}
                  className="p-2.5 rounded-lg bg-warm-100/60 border border-warm-200 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-charcoal-900">{c.name}</p>
                    <p className="text-[10px] text-charcoal-500 font-mono">
                      {c.ip} • {c.fps}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
