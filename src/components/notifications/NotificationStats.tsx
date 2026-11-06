import React from 'react'
import { AlertTriangle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react'
import { Card } from '../shared/Card'
import { OperationsEvent } from '../../types'

interface NotificationStatsProps {
  events: OperationsEvent[]
}

export const NotificationStats: React.FC<NotificationStatsProps> = ({ events }) => {
  const activeCount = events.filter((e) => e.status === 'active').length
  const inProgressCount = events.filter((e) => e.status === 'in_progress').length
  const resolvedCount = events.filter((e) => e.status === 'resolved').length
  const highSeverityCount = events.filter(
    (e) => (e.severity === 'high' || e.severity === 'critical') && e.status !== 'resolved'
  ).length

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card className="p-3.5 sm:p-4 bg-white border-warm-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-charcoal-500">Active Alerts</span>
          <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
            <AlertTriangle className="w-4 h-4" />
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-charcoal-900 mt-2 font-display">
          {activeCount}
        </div>
        <p className="text-[11px] text-amber-700 font-medium mt-0.5">Awaiting floor response</p>
      </Card>

      <Card className="p-3.5 sm:p-4 bg-white border-warm-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-charcoal-500">In Progress</span>
          <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Clock className="w-4 h-4" />
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-charcoal-900 mt-2 font-display">
          {inProgressCount}
        </div>
        <p className="text-[11px] text-blue-700 font-medium mt-0.5">Server currently at table</p>
      </Card>

      <Card className="p-3.5 sm:p-4 bg-white border-warm-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-charcoal-500">High / Critical</span>
          <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
            <ShieldAlert className="w-4 h-4" />
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-charcoal-900 mt-2 font-display">
          {highSeverityCount}
        </div>
        <p className="text-[11px] text-rose-700 font-medium mt-0.5">Escalated thresholds</p>
      </Card>

      <Card className="p-3.5 sm:p-4 bg-white border-warm-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-charcoal-500">Resolved Today</span>
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-charcoal-900 mt-2 font-display">
          {resolvedCount}
        </div>
        <p className="text-[11px] text-emerald-700 font-medium mt-0.5">SLA fulfilled</p>
      </Card>
    </div>
  )
}

