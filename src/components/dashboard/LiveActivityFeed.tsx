import React, { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Filter,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '../shared/Card'
import { Badge } from '../shared/Badge'
import { Button } from '../shared/Button'
import { OperationsEvent } from '../../types'

interface LiveActivityFeedProps {
  events: OperationsEvent[]
  onAcknowledge: (id: string) => void
  onResolve: (id: string) => void
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({
  events,
  onAcknowledge,
  onResolve,
}) => {
  const [filter, setFilter] = useState<'all' | 'actionable' | 'resolved'>('all')

  const filteredEvents = events.filter((evt) => {
    if (filter === 'actionable') return evt.status === 'active' || evt.status === 'in_progress'
    if (filter === 'resolved') return evt.status === 'resolved'
    return true
  })

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <CardTitle>Restaurant Live Activity & Vision Events</CardTitle>
          </div>
          <CardDescription>
            Simulated automated detections, customer gestures, and server dispatch queue
          </CardDescription>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
              filter === 'all'
                ? 'bg-forest-700 text-white shadow-xs'
                : 'bg-warm-100 text-charcoal-600 hover:bg-warm-200'
            }`}
          >
            All ({events.length})
          </button>
          <button
            onClick={() => setFilter('actionable')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
              filter === 'actionable'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-warm-100 text-charcoal-600 hover:bg-warm-200'
            }`}
          >
            Actionable ({events.filter((e) => e.status !== 'resolved').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
              filter === 'resolved'
                ? 'bg-forest-700 text-white shadow-xs'
                : 'bg-warm-100 text-charcoal-600 hover:bg-warm-200'
            }`}
          >
            Resolved
          </button>
        </div>
      </CardHeader>

      <div className="flex-1 space-y-3 overflow-y-auto max-h-[460px] pr-1">
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-charcoal-400 text-xs">
            No events in this category. System operating smoothly.
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isResolved = evt.status === 'resolved'
            const isInProgress = evt.status === 'in_progress'

            return (
              <div
                key={evt.id}
                className={`p-3.5 rounded-xl border transition-all duration-200 ${
                  isResolved
                    ? 'bg-warm-50/50 border-warm-200/60 opacity-75'
                    : isInProgress
                    ? 'bg-blue-50/30 border-blue-200 shadow-xs'
                    : 'bg-white border-amber-200/90 shadow-xs hover:border-amber-300'
                }`}
              >
                {/* Event Top Line */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`p-1.5 rounded-lg shrink-0 ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-800'
                          : isInProgress
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isResolved ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-charcoal-900">
                          Table {evt.tableNumber} • {evt.zone}
                        </span>
                        <span className="font-mono text-[10px] text-charcoal-400">
                          {evt.timestamp}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-charcoal-800 mt-0.5">
                        {evt.title}
                      </div>
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

                {/* Event Description */}
                <p className="mt-2 text-xs text-charcoal-600 leading-relaxed pl-8">
                  {evt.description}
                </p>

                {/* Event Metadata & Actions */}
                <div className="mt-3 pt-2 border-t border-warm-100 pl-8 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-charcoal-500">
                    <span className="flex items-center">
                      <UserCheck className="w-3 h-3 mr-1 text-charcoal-400" />
                      Server: <strong className="text-charcoal-800 ml-1">{evt.assignedWaiter}</strong>
                    </span>
                    <span className="text-charcoal-300">|</span>
                    <span className="font-mono text-emerald-800 font-semibold">
                      {Math.round(evt.aiConfidence * 100)}% Confidence
                    </span>
                  </div>

                  {!isResolved && (
                    <div className="flex items-center space-x-1.5 ml-auto">
                      {evt.status === 'active' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onAcknowledge(evt.id)}
                          className="text-[11px] h-7 px-2.5"
                        >
                          Acknowledge
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onResolve(evt.id)}
                        className="text-[11px] h-7 px-2.5"
                      >
                        Resolve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}

