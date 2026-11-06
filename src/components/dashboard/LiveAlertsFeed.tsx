import React from 'react'
import { AlertTriangle, Clock, CheckCircle, ChevronRight, UserCheck } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '../shared/Card'
import { Badge } from '../shared/Badge'
import { Button } from '../shared/Button'
import { OperationsEvent } from '../../types'

interface LiveAlertsFeedProps {
  events: OperationsEvent[]
  onAcknowledge: (id: string) => void
  onResolve: (id: string) => void
}

export const LiveAlertsFeed: React.FC<LiveAlertsFeedProps> = ({
  events,
  onAcknowledge,
  onResolve,
}) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div>
          <div className="flex items-center space-x-2">
            <CardTitle>Live AI Operations Feed</CardTitle>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          </div>
          <CardDescription>
            Real-time computer vision triggers and hospitality bottleneck detections
          </CardDescription>
        </div>
        <Badge variant="amber" dot>
          {events.filter((e) => e.status !== 'resolved').length} Active Flags
        </Badge>
      </CardHeader>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {events.map((evt) => {
          const isResolved = evt.status === 'resolved'
          const isInProgress = evt.status === 'in_progress'

          return (
            <div
              key={evt.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isResolved
                  ? 'bg-warm-50/50 border-warm-200/50 opacity-70'
                  : isInProgress
                  ? 'bg-blue-50/40 border-blue-200 shadow-xs'
                  : 'bg-white border-amber-200/90 shadow-xs hover:border-amber-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`p-1.5 rounded-lg ${
                      isResolved
                        ? 'bg-emerald-100 text-emerald-700'
                        : isInProgress
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {isResolved ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-charcoal-900">
                      Table {evt.tableNumber} • {evt.zone}
                    </span>
                    <span className="text-[10px] text-charcoal-400 ml-2 font-mono">
                      {evt.timestamp}
                    </span>
                  </div>
                </div>

                <Badge
                  variant={
                    isResolved
                      ? 'forest'
                      : isInProgress
                      ? 'sky'
                      : evt.severity === 'high'
                      ? 'amber'
                      : 'slate'
                  }
                >
                  {evt.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="mt-2 text-xs font-bold text-charcoal-800">
                {evt.title}
              </div>
              <p className="mt-0.5 text-xs text-charcoal-600 leading-relaxed">
                {evt.description}
              </p>

              <div className="mt-3 pt-2.5 border-t border-warm-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2 text-[11px] text-charcoal-500">
                  <UserCheck className="w-3.5 h-3.5 text-charcoal-400" />
                  <span>
                    Server: <strong className="text-charcoal-800">{evt.assignedWaiter}</strong>
                  </span>
                  <span className="text-charcoal-300">|</span>
                  <span className="font-mono text-emerald-700 font-semibold">
                    {Math.round(evt.aiConfidence * 100)}% Match
                  </span>
                </div>

                {!isResolved && (
                  <div className="flex items-center space-x-1.5 ml-auto">
                    {evt.status === 'active' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onAcknowledge(evt.id)}
                        className="text-[11px] h-7 px-2"
                      >
                        Acknowledge
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onResolve(evt.id)}
                      className="text-[11px] h-7 px-2"
                    >
                      Resolve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
