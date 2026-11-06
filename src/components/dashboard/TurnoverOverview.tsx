import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '../shared/Card'
import { RestaurantTable } from '../../types'

interface TurnoverOverviewProps {
  tables: RestaurantTable[]
}

export const TurnoverOverview: React.FC<TurnoverOverviewProps> = ({ tables }) => {
  const total = tables.length || 1
  const occupied = tables.filter(
    (t) => t.status === 'OCCUPIED' || t.status === 'occupied' || t.status === 'SERVING' || t.status === 'WAITER_ASSIGNED'
  ).length
  const waiting = tables.filter(
    (t) => t.status === 'WAITING_FOR_WAITER' || t.status === 'attention_needed'
  ).length
  const available = tables.filter(
    (t) => t.status === 'AVAILABLE' || t.status === 'available'
  ).length
  const completed = tables.filter(
    (t) => t.status === 'SERVICE_COMPLETED' || t.status === 'dirty'
  ).length

  const occupancyRate = Math.round(((occupied + waiting) / total) * 100)

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader>
          <div>
            <CardTitle>Floor Capacity & Health</CardTitle>
            <CardDescription>Real-time dining room seating distribution</CardDescription>
          </div>
          <span className="text-xl font-extrabold text-charcoal-900 font-mono">
            {occupancyRate}% <span className="text-xs text-charcoal-500 font-normal">Capacity</span>
          </span>
        </CardHeader>

        {/* Multi-segment distribution progress bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-warm-100 gap-0.5">
          <div
            title={`Occupied / Serving: ${occupied}`}
            className="bg-charcoal-700 transition-all"
            style={{ width: `${(occupied / total) * 100}%` }}
          />
          <div
            title={`Waiting for Waiter: ${waiting}`}
            className="bg-amber-500 transition-all"
            style={{ width: `${(waiting / total) * 100}%` }}
          />
          <div
            title={`Service Completed: ${completed}`}
            className="bg-purple-500 transition-all"
            style={{ width: `${(completed / total) * 100}%` }}
          />
          <div
            title={`Available: ${available}`}
            className="bg-emerald-500 transition-all"
            style={{ width: `${(available / total) * 100}%` }}
          />
        </div>

        {/* Legend grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-warm-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-charcoal-700 shrink-0" />
            <span className="text-charcoal-600">Occupied/Serving:</span>
            <strong className="text-charcoal-900 font-mono">{occupied}</strong>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 shrink-0" />
            <span className="text-charcoal-600">Waiting for Waiter:</span>
            <strong className="text-amber-800 font-mono">{waiting}</strong>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 shrink-0" />
            <span className="text-charcoal-600">Completed:</span>
            <strong className="text-purple-700 font-mono">{completed}</strong>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0" />
            <span className="text-charcoal-600">Available:</span>
            <strong className="text-emerald-700 font-mono">{available}</strong>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-warm-100 grid grid-cols-2 gap-3 text-center">
        <div className="p-2.5 rounded-lg bg-warm-100/70 border border-warm-200/60">
          <p className="text-[11px] text-charcoal-500 font-medium">Avg Table Turn Time</p>
          <p className="text-base font-bold text-charcoal-900 font-mono mt-0.5">52 mins</p>
          <span className="text-[10px] text-forest-700 font-semibold">-16m faster vs benchmark</span>
        </div>
        <div className="p-2.5 rounded-lg bg-warm-100/70 border border-warm-200/60">
          <p className="text-[11px] text-charcoal-500 font-medium">Avg Waiter Dispatch</p>
          <p className="text-base font-bold text-charcoal-900 font-mono mt-0.5">1m 18s</p>
          <span className="text-[10px] text-forest-700 font-semibold">98.4% on-time SLA</span>
        </div>
      </div>
    </Card>
  )
}
