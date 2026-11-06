import React from 'react'
import {
  Clock,
  Star,
  ShieldCheck,
  Phone,
  LayoutGrid,
  CheckCircle,
  MoreVertical,
  Bell,
  CheckCircle2,
  Play,
  UserCheck,
} from 'lucide-react'
import { Waiter, WaiterStatus } from '../../types'
import { Card } from '../shared/Card'
import { Badge } from '../shared/Badge'
import { Button } from '../shared/Button'

interface WaiterCardProps {
  waiter: Waiter
  onSelect?: (waiter: Waiter) => void
  onUpdateStatus?: (waiterId: string, status: WaiterStatus) => void
  onAcceptPending?: (tableId: string) => void
  onStartService?: (tableId: string) => void
}

export const WaiterCard: React.FC<WaiterCardProps> = ({
  waiter,
  onSelect,
  onUpdateStatus,
  onAcceptPending,
  onStartService,
}) => {
  const isAvailable = waiter.status === 'active'

  return (
    <Card className="hover:shadow-card transition-all flex flex-col justify-between border-warm-200">
      <div>
        {/* Header: Employee ID, Name, Role, Availability Status */}
        <div className="flex items-start justify-between pb-3.5 border-b border-warm-100">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={waiter.avatar}
                alt={waiter.name}
                className="w-13 h-13 rounded-full object-cover border-2 border-warm-200 shadow-xs"
              />
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  waiter.status === 'busy'
                    ? 'bg-amber-500'
                    : waiter.status === 'active'
                    ? 'bg-emerald-500 animate-pulse'
                    : waiter.status === 'on_break'
                    ? 'bg-sky-500'
                    : 'bg-charcoal-400'
                }`}
                title={`Status: ${waiter.status}`}
              />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-charcoal-900">{waiter.name}</h4>
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-charcoal-800 text-white">
                  {waiter.employeeId}
                </span>
              </div>
              <p className="text-xs text-charcoal-500 font-medium mt-0.5">{waiter.role}</p>
              <div className="flex items-center space-x-1 mt-0.5 text-[11px] text-charcoal-400">
                <Phone className="w-3 h-3 text-charcoal-400" />
                <span>{waiter.phone}</span>
              </div>
            </div>
          </div>

          {/* Availability Status Selector */}
          <div className="text-right">
            <select
              value={waiter.status}
              onChange={(e) => onUpdateStatus?.(waiter.id, e.target.value as WaiterStatus)}
              className={`text-[11px] font-mono font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                waiter.status === 'active'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : waiter.status === 'busy'
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : waiter.status === 'on_break'
                  ? 'bg-sky-50 text-sky-800 border-sky-300'
                  : 'bg-charcoal-100 text-charcoal-700 border-charcoal-300'
              }`}
            >
              <option value="active">● AVAILABLE (ON FLOOR)</option>
              <option value="busy">● BUSY WITH PARTY</option>
              <option value="on_break">● ON BREAK</option>
              <option value="off_duty">● OFF DUTY</option>
            </select>
          </div>
        </div>

        {/* Shift and Assigned Zone */}
        <div className="py-2.5 grid grid-cols-2 gap-2 text-xs border-b border-warm-100">
          <div>
            <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">
              Assigned Zone
            </span>
            <p className="font-bold text-charcoal-800 truncate mt-0.5">{waiter.zone}</p>
          </div>
          <div>
            <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">
              Shift Window
            </span>
            <p className="font-medium text-charcoal-700 truncate mt-0.5">{waiter.shift}</p>
          </div>
        </div>

        {/* Pending Assignment Alert Banner */}
        {waiter.pendingAssignments && waiter.pendingAssignments.length > 0 && (
          <div className="my-2.5 p-2.5 rounded-xl bg-sky-50 border border-sky-300 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-sky-900">
              <span className="flex items-center">
                <Bell className="w-3.5 h-3.5 mr-1 text-sky-600 animate-bounce" />
                New Auto-Assignment Dispatched!
              </span>
              <span className="text-[10px] font-mono bg-sky-200 px-1.5 py-0.2 rounded text-sky-900">
                Action Required
              </span>
            </div>

            {waiter.pendingAssignments.map((tblId) => (
              <div key={tblId} className="flex items-center justify-between pt-1">
                <span className="text-xs font-mono font-bold text-sky-950">
                  Table {tblId}
                </span>
                <div className="flex items-center space-x-1.5">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onAcceptPending?.(tblId)}
                    className="text-[11px] h-6 px-2 bg-sky-700 hover:bg-sky-800"
                  >
                    Accept Ticket
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onStartService?.(tblId)}
                    className="text-[11px] h-6 px-2 bg-forest-700 hover:bg-forest-800"
                  >
                    Start Service
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active Tables Count & Current Assignments */}
        <div className="py-2.5">
          <div className="flex items-center justify-between text-[11px] text-charcoal-500 mb-1.5 font-medium">
            <span className="flex items-center">
              <LayoutGrid className="w-3 h-3 mr-1 text-charcoal-400" />
              Active Table Count: <strong className="text-charcoal-900 ml-1 font-mono text-xs">{waiter.assignedTables.length} Tables</strong>
            </span>
            <span className="font-mono text-emerald-800 font-semibold text-[10px]">
              {isAvailable ? 'Eligible for Auto-Dispatch' : 'Unavailable for Dispatch'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {waiter.assignedTableIds && waiter.assignedTableIds.length > 0 ? (
              waiter.assignedTableIds.map((tblId) => (
                <span
                  key={tblId}
                  className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-warm-100 text-charcoal-800 border border-warm-200"
                >
                  {tblId}
                </span>
              ))
            ) : waiter.assignedTables.length > 0 ? (
              waiter.assignedTables.map((tblNum) => (
                <span
                  key={tblNum}
                  className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-warm-100 text-charcoal-800 border border-warm-200"
                >
                  T-{String(tblNum).padStart(2, '0')}
                </span>
              ))
            ) : (
              <span className="text-xs text-charcoal-400 italic">No tables currently assigned (Lowest load)</span>
            )}
          </div>
        </div>

        {/* Service Performance Metrics */}
        <div className="grid grid-cols-3 gap-2 py-2.5 bg-warm-50/80 rounded-xl px-3 my-2 border border-warm-150 text-center">
          <div>
            <div className="text-[9px] text-charcoal-400 font-bold uppercase">Response Time</div>
            <div className="font-bold text-charcoal-900 font-mono text-sm mt-0.5">
              {waiter.avgResponseTimeSec}s
            </div>
            <span className="text-[9px] text-forest-700 font-semibold">&lt; 90s SLA</span>
          </div>

          <div>
            <div className="text-[9px] text-charcoal-400 font-bold uppercase">Guest Rating</div>
            <div className="flex items-center justify-center font-bold text-amber-700 text-sm mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 mr-0.5" />
              <span>{waiter.rating}</span>
            </div>
            <span className="text-[9px] text-charcoal-400 font-mono">{waiter.tablesServedToday} served</span>
          </div>

          <div>
            <div className="text-[9px] text-charcoal-400 font-bold uppercase">SLA Compliance</div>
            <div className="font-bold text-forest-800 font-mono text-sm mt-0.5">
              {waiter.complianceRate}%
            </div>
            <span className="text-[9px] text-emerald-700 font-semibold">Tier 1</span>
          </div>
        </div>
      </div>

      {/* Card Action footer */}
      <div className="pt-3 border-t border-warm-100 flex items-center justify-between">
        <Button
          size="sm"
          variant="outline"
          className="text-xs w-full"
          onClick={() => onSelect?.(waiter)}
        >
          Reassign Sections & View Load
        </Button>
      </div>
    </Card>
  )
}
