import React from 'react'
import { Star, Clock, Award } from 'lucide-react'
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
      <CardHeader>
        <div>
          <div className="flex items-center space-x-2">
            <CardTitle>Staff Shift Performance</CardTitle>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <CardDescription>Live response metrics and guest service speed</CardDescription>
        </div>
        <Badge variant="forest" dot>
          {waiters.filter((w) => w.status === 'active' || w.status === 'busy').length} Active
        </Badge>
      </CardHeader>

      <div className="space-y-3">
        {sortedWaiters.slice(0, 4).map((waiter, idx) => (
          <div
            key={waiter.id}
            className="flex items-center justify-between p-2.5 rounded-xl border border-warm-150 hover:bg-warm-50/80 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="w-5 text-xs font-bold text-charcoal-400 font-mono text-center">
                #{idx + 1}
              </span>
              <div className="relative">
                <img
                  src={waiter.avatar}
                  alt={waiter.name}
                  className="w-10 h-10 rounded-full object-cover border border-warm-200"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    waiter.status === 'busy'
                      ? 'bg-amber-500'
                      : waiter.status === 'active'
                      ? 'bg-emerald-500'
                      : 'bg-charcoal-400'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-charcoal-900">
                    {waiter.name}
                  </span>
                  <span className="text-[10px] text-charcoal-500 font-medium">
                    {waiter.role}
                  </span>
                </div>
                <div className="text-[11px] text-charcoal-500 flex items-center space-x-2 mt-0.5">
                  <span>Zone: {waiter.zone}</span>
                  <span>•</span>
                  <span>Tables: {waiter.assignedTables.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-right">
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
    </Card>
  )
}
