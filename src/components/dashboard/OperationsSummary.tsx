import React from 'react'
import {
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Layers,
  Building2,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '../shared/Card'
import { RestaurantTable, Waiter } from '../../types'
import { formatCurrency } from '../../utils'

interface OperationsSummaryProps {
  tables: RestaurantTable[]
  waiters: Waiter[]
}

export const OperationsSummary: React.FC<OperationsSummaryProps> = ({
  tables,
  waiters,
}) => {
  const total = tables.length || 1
  const occupiedCount = tables.filter((t) => t.status !== 'AVAILABLE' && t.status !== 'available').length
  const occupancyPercentage = Math.round((occupiedCount / total) * 100)
  const totalOpenRevenue = tables.reduce((acc, t) => acc + (t.currentBill || 0), 0)
  const totalGuests = tables.reduce((acc, t) => acc + (t.guestCount || 0), 0)
  const activeWaiters = waiters.filter((w) => w.status === 'active' || w.status === 'busy').length

  const zones: Array<{ name: string; tables: RestaurantTable[] }> = [
    { name: 'Main Dining', tables: tables.filter((t) => t.zone === 'Main Dining') },
    { name: 'Veranda Patio (Window)', tables: tables.filter((t) => t.zone === 'Veranda Patio') },
    { name: 'Private Dining Suite', tables: tables.filter((t) => t.zone === 'Private Dining') },
    { name: 'Bar & Lounge Area', tables: tables.filter((t) => t.zone === 'Bar Lounge') },
  ]

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-forest-700" />
            <div>
              <CardTitle>Restaurant Operations Summary</CardTitle>
              <CardDescription>
                Shift operational throughput, zone utilization, and revenue velocity
              </CardDescription>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-forest-50 text-forest-800 px-2.5 py-1 rounded-md border border-forest-200">
            {occupancyPercentage}% Occupied
          </span>
        </CardHeader>

        {/* 4 Core Operational Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-5">
          <div className="p-2.5 sm:p-3 rounded-xl bg-warm-100/60 border border-warm-200/60 min-w-0">
            <div className="flex items-center text-charcoal-500 text-xs mb-1">
              <Users className="w-3.5 h-3.5 mr-1 text-forest-600 shrink-0" />
              <span className="truncate">Current Diners</span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-charcoal-900 font-display truncate">
              {totalGuests} <span className="text-xs text-charcoal-500 font-normal">Guests</span>
            </div>
            <span className="text-[10px] text-forest-700 font-semibold block mt-0.5 truncate">
              Across {occupiedCount} tables
            </span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-warm-100/60 border border-warm-200/60 min-w-0">
            <div className="flex items-center text-charcoal-500 text-xs mb-1">
              <DollarSign className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
              <span className="truncate">Active Bill Total</span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-charcoal-900 font-display truncate">
              {formatCurrency(totalOpenRevenue)}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5 truncate">
              +18.4% velocity vs avg
            </span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-warm-100/60 border border-warm-200/60 min-w-0">
            <div className="flex items-center text-charcoal-500 text-xs mb-1">
              <Clock className="w-3.5 h-3.5 mr-1 text-forest-600 shrink-0" />
              <span className="truncate">Avg Table Turn</span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-charcoal-900 font-display truncate">
              52 mins
            </div>
            <span className="text-[10px] text-forest-700 font-semibold block mt-0.5 truncate">
              -16m faster turnaround
            </span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-warm-100/60 border border-warm-200/60 min-w-0">
            <div className="flex items-center text-charcoal-500 text-xs mb-1">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-forest-600 shrink-0" />
              <span className="truncate">Floor Staffing</span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-charcoal-900 font-display truncate">
              {activeWaiters} / {waiters.length}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5 truncate">
              100% Sections Covered
            </span>
          </div>
        </div>

        {/* Zone Utilization Matrix */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-charcoal-700 uppercase tracking-wider flex items-center justify-between">
            <span>Dining Room Zone Utilization</span>
            <span className="text-charcoal-400 font-normal">Active Seating Distribution</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {zones.map((zone) => {
              const zoneTotal = zone.tables.length || 1
              const zoneOccupied = zone.tables.filter((t) => t.status !== 'AVAILABLE' && t.status !== 'available').length
              const zonePct = Math.round((zoneOccupied / zoneTotal) * 100)
              const hasAlert = zone.tables.some((t) => t.status === 'WAITING_FOR_WAITER' || t.status === 'attention_needed')

              return (
                <div
                  key={zone.name}
                  className="p-3 rounded-xl border border-warm-200 bg-white hover:border-warm-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-charcoal-900">{zone.name}</span>
                    <span className="font-mono text-charcoal-600 font-semibold">
                      {zoneOccupied} / {zoneTotal} Tables ({zonePct}%)
                    </span>
                  </div>

                  <div className="w-full bg-warm-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        hasAlert ? 'bg-amber-500' : 'bg-forest-600'
                      }`}
                      style={{ width: `${zonePct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2 text-[10px] text-charcoal-500">
                    <span>
                      {hasAlert ? (
                        <span className="text-amber-700 font-semibold flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1 text-amber-500" />
                          Needs Staff Attention
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Service Smooth
                        </span>
                      )}
                    </span>
                    <span className="font-mono">
                      Cap: {zone.tables.reduce((acc, t) => acc + t.capacity, 0)} Seats
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-warm-100 flex items-center justify-between text-xs text-charcoal-500">
        <span>Vision Engine Accuracy: <strong className="text-emerald-800 font-mono">99.4%</strong></span>
        <span>Kitchen Expediter Sync: <strong className="text-charcoal-800 font-mono">Normal (38s avg)</strong></span>
      </div>
    </Card>
  )
}
