import React from 'react'
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Send,
  Sparkles,
  ShieldAlert,
} from 'lucide-react'
import { OperationsEvent, AlertSeverity } from '../../types'
import { Button } from '../shared/Button'
import { Badge, BadgeProps } from '../shared/Badge'
import { Card } from '../shared/Card'

const getSeverityBadgeVariant = (severity: AlertSeverity): NonNullable<BadgeProps['variant']> => {
  switch (severity) {
    case 'critical':
      return 'rose'
    case 'high':
      return 'amber'
    case 'medium':
      return 'sky'
    case 'low':
      return 'neutral'
  }
}

interface NotificationItemProps {
  event: OperationsEvent
  onAcknowledge: (id: string) => void
  onResolve: (id: string) => void
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  event,
  onAcknowledge,
  onResolve,
}) => {
  return (
    <Card
      key={event.id}
      className={`p-4 transition-all hover:shadow-card ${
        event.status === 'active'
          ? 'border-l-4 border-l-amber-500 bg-white'
          : event.status === 'in_progress'
          ? 'border-l-4 border-l-blue-500 bg-white'
          : 'border-l-4 border-l-emerald-600 bg-warm-50/60 opacity-80'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left column: Event details */}
        <div className="flex items-start space-x-3.5">
          <div
            className={`p-2 rounded-xl mt-0.5 ${
              event.severity === 'high' || event.severity === 'critical'
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : event.severity === 'medium'
                ? 'bg-amber-50 text-amber-600 border border-amber-200'
                : 'bg-warm-100 text-charcoal-600 border border-warm-200'
            }`}
          >
            {event.severity === 'high' || event.severity === 'critical' ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-charcoal-900">
                Table {event.tableNumber} — {event.title}
              </span>
              <Badge variant={getSeverityBadgeVariant(event.severity)}>
                {event.severity.toUpperCase()}
              </Badge>
              <span className="text-[11px] font-medium text-charcoal-400">
                • {event.zone}
              </span>
            </div>

            <p className="text-xs text-charcoal-600 mt-1 font-medium leading-relaxed max-w-3xl">
              {event.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-2.5 text-[11px] text-charcoal-500">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1 text-charcoal-400" />
                {event.timestamp}
              </span>
              <span>
                Assigned Waiter:{' '}
                <strong className="text-charcoal-800 font-semibold">
                  {event.assignedWaiter}
                </strong>
              </span>
              <span className="flex items-center text-forest-700 font-semibold">
                <Sparkles className="w-3 h-3 mr-1 text-forest-600" />
                Vision Confidence: {Math.round(event.aiConfidence * 100)}%
              </span>
              <span className="text-charcoal-400">{event.cameraId}</span>
            </div>
          </div>
        </div>

        {/* Right column: Action buttons */}
        <div className="flex items-center sm:self-end md:self-center space-x-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-warm-100">
          {event.status === 'active' && (
            <Button
              variant="amber"
              size="sm"
              icon={<Send className="w-3.5 h-3.5 text-amber-900" />}
              onClick={() => onAcknowledge(event.id)}
            >
              Dispatch Waiter
            </Button>
          )}

          {event.status === 'in_progress' && (
            <Button
              variant="primary"
              size="sm"
              icon={<CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              onClick={() => onResolve(event.id)}
            >
              Mark Resolved
            </Button>
          )}

          {event.status === 'resolved' && (
            <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Completed & Logged
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}
