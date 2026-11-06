import React from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
} from 'lucide-react'
import { Card } from '../shared/Card'
import { Button } from '../shared/Button'
import { Badge } from '../shared/Badge'
import { DemoState } from '../../hooks/useRestaurantData'

interface DemoControlPanelProps {
  demoState: DemoState
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onTriggerEvent?: () => void
  lastMessage?: string
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({
  demoState,
  onStart,
  onPause,
  onReset,
  onTriggerEvent,
  lastMessage,
}) => {
  return (
    <Card className="p-4 bg-gradient-to-r from-white via-warm-50 to-white border-warm-200/90 shadow-card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Title & Status indicator */}
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-forest-50 border border-forest-200/80 text-forest-700 shrink-0">
            <Sparkles className="w-5 h-5 text-forest-700" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
                Sales Demo Simulation Control
              </h3>
              <Badge
                variant={
                  demoState === 'running'
                    ? 'forest'
                    : demoState === 'paused'
                    ? 'amber'
                    : 'neutral'
                }
                dot
              >
                {demoState === 'running'
                  ? 'Simulation Active'
                  : demoState === 'paused'
                  ? 'Simulation Paused'
                  : 'Demo Ready'}
              </Badge>
            </div>
            <p className="text-xs text-charcoal-500 font-medium mt-0.5 truncate max-w-xl">
              {lastMessage || 'Simulate restaurant guest arrivals, gesture recognitions, and server dispatch in real time.'}
            </p>
          </div>
        </div>

        {/* Right: Controls (Start Demo, Pause Demo, Reset Demo, Trigger) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Start Demo */}
          <Button
            size="sm"
            variant={demoState === 'running' ? 'secondary' : 'primary'}
            onClick={onStart}
            disabled={demoState === 'running'}
            icon={<Play className="w-3.5 h-3.5 fill-current" />}
            className="text-xs"
          >
            Start Demo
          </Button>

          {/* Pause Demo */}
          <Button
            size="sm"
            variant={demoState === 'paused' ? 'secondary' : 'outline'}
            onClick={onPause}
            disabled={demoState === 'paused' || demoState === 'idle'}
            icon={<Pause className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Pause Demo
          </Button>

          {/* Reset Demo */}
          <Button
            size="sm"
            variant="outline"
            onClick={onReset}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs text-charcoal-700 hover:text-charcoal-900"
          >
            Reset Demo
          </Button>

          {/* Quick Trigger Event button */}
          {onTriggerEvent && (
            <Button
              size="sm"
              variant="amber"
              onClick={onTriggerEvent}
              icon={<Zap className="w-3.5 h-3.5 text-white" />}
              className="text-xs"
              title="Manually inject a simulated hospitality incident"
            >
              Simulate Incident
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

