import React from 'react'
import { Star, Clock, Award, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription } from '../shared/Card'
import { Badge } from '../shared/Badge'
import { Waiter } from '../../types'

interface WaiterEfficiencyLeaderboardProps {
  waiters: Waiter[]
}

export const WaiterEfficiencyLeaderboard: React.FC<WaiterEfficiencyLeaderboardProps> = ({
  waiters,
}) => {
  const sortedWaiters = [...waiters].sort(
    (a, b) => b.rating * 100 - a.avgResponseTimeSec - (a.rating * 100 - b.avgResponseTimeSec)
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <CardTitle>Staff Shift Performance</CardTitle>
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
          </div>
          <CardDescription>Live response metrics and guest service speed</CardDescription>
        </div>
        <Badge variant="forest" dot className="shrink-0">
          {waiters.filter((w) => w.status === 'active' || w.status === 'busy').length} Active
        </Badge>
      </CardHeader>

      <div className="space-y-3">
        {sortedWaiters.slice(0, 5).map((waiter, idx) => (
          <div
            key={waiter.id}
            className="flex items-center justify-between p-2.5 rounded-xl border border-warm-150 hover:bg-warm-50/80 transition-colors"
          >
            <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
              <span className="w-4 sm:w-5 text-xs font-bold text-charcoal-400 font-mono text-center shrink-0">
                #{idx + 1}
              </span>
              <div className="relative shrink-0">
                <img
                  src={waiter.avatar}
                  alt={waiter.name}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-warm-200"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white ${
                    waiter.status === 'busy'
                      ? 'bg-amber-500'
                      : waiter.status === 'active'
                      ? 'bg-emerald-500'
                      : 'bg-charcoal-400'
                  }`}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="text-xs font-bold text-charcoal-900 truncate">
                    {waiter.name}
                  </span>
                  <span className="text-[10px] text-charcoal-500 font-medium truncate hidden sm:inline">
                    • {waiter.role}
                  </span>
                </div>
                <div className="text-[11px] text-charcoal-500 flex items-center space-x-1 sm:space-x-2 mt-0.5 truncate">
                  <span className="truncate">{waiter.zone}</span>
                  {waiter.assignedTables && waiter.assignedTables.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="shrink-0">T-{waiter.assignedTables.join(', ')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 text-right shrink-0 ml-2">
              <div>
                <div className="flex items-center justify-end space-x-1 text-xs font-bold text-charcoal-900">
                  <Clock className="w-3 h-3 text-forest-600" />
                  <span className="font-mono">{waiter.avgResponseTimeSec}s</span>
                </div>
                <div className="flex items-center justify-end space-x-1 text-[11px] text-amber-600 font-semibold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  <span>{waiter.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-warm-100 flex items-center justify-between text-xs">
        <span className="text-charcoal-500 font-medium">
          Showing top 5 of {waiters.length} rostered staff
        </span>
        <Link
          to="/waiters"
          className="font-semibold text-forest-700 hover:text-forest-900 inline-flex items-center"
        >
          View Full Roster ({waiters.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    </Card>
  )
}
