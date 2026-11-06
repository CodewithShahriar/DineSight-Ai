import React from 'react'
import {
  X,
  Users,
  Clock,
  DollarSign,
  UserCheck,
  AlertTriangle,
  Cctv,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Hourglass,
  Play,
  FastForward,
  UserPlus,
  Coffee,
} from 'lucide-react'
import { RestaurantTable, TableStatus } from '../../types'
import { Button } from '../shared/Button'
import { Badge } from '../shared/Badge'
import { getStatusColor, formatCurrency } from '../../utils'
import { STAFF_AVATARS } from '../../utils/avatar'

interface TableInspectorProps {
  table: RestaurantTable | null
  onClose: () => void
  onUpdateStatus: (id: string, status: TableStatus) => void
  onSeatCustomer?: (tableId: string) => void
  onAcceptAssignment?: (tableId: string) => void
  onStartService?: (tableId: string) => void
}

const statusOptions: Array<{ status: TableStatus; label: string; desc: string }> = [
  { status: 'AVAILABLE', label: 'AVAILABLE', desc: 'Sanitized & ready to seat' },
  { status: 'OCCUPIED', label: 'OCCUPIED', desc: 'Guests seated & dining' },
  { status: 'WAITING_FOR_WAITER', label: 'WAITING FOR WAITER', desc: '5m timer / attention active' },
  { status: 'WAITER_ASSIGNED', label: 'WAITER ASSIGNED', desc: 'Server dispatched & en route' },
  { status: 'SERVING', label: 'SERVING', desc: 'Food/drinks service active' },
  { status: 'SERVICE_COMPLETED', label: 'SERVICE COMPLETED', desc: 'Paid bill, awaiting reset' },
]

export const TableInspector: React.FC<TableInspectorProps> = ({
  table,
  onClose,
  onUpdateStatus,
  onSeatCustomer,
  onAcceptAssignment,
  onStartService,
}) => {
  if (!table) return null

  const statusStyle = getStatusColor(table.status)
  const isAvailable = table.status === 'AVAILABLE' || table.status === 'available'
  const isWaiting = table.status === 'WAITING_FOR_WAITER' || table.status === 'attention_needed'
  const isAssigned = table.status === 'WAITER_ASSIGNED'
  const isServing = table.status === 'SERVING'
  const isCompleted = table.status === 'SERVICE_COMPLETED' || table.status === 'dirty'

  const remaining = table.countdownRemaining !== undefined ? table.countdownRemaining : 0
  const total = table.countdownTotal || 300
  const progressPct = Math.round(((total - remaining) / total) * 100)

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const formattedCountdown = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  return (
    <div className="bg-white rounded-2xl border border-warm-200/90 shadow-card p-5 flex flex-col h-full animate-in fade-in zoom-in-95 duration-150">
      {/* Header: Table ID and Status */}
      <div className="flex items-start justify-between pb-4 border-b border-warm-100">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl font-black text-charcoal-900 font-display tracking-tight">
              {table.id}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border font-mono tracking-wide ${statusStyle.badgeBg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusStyle.dot}`} />
              {statusStyle.label}
            </span>
          </div>
          <p className="text-xs text-charcoal-500 font-medium mt-1">
            {table.zone} • Table #{table.number} ({table.shape.toUpperCase()} SHAPE)
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-warm-100 transition-colors"
          aria-label="Close Inspector"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="py-4 space-y-4 flex-1 overflow-y-auto pr-1">
        {/* WORKFLOW BANNER 1: 5-MINUTE CUSTOMER WAITING TIMER */}
        {isWaiting && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/50 border-2 border-amber-400 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center text-xs font-bold text-amber-950">
                <Hourglass className="w-4 h-4 mr-1.5 text-amber-600 animate-spin-slow" />
                5-Minute Customer Waiting Timer
              </span>
              <span className="font-mono text-xs font-black text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                {table.isQueued ? 'QUEUED' : formattedCountdown}
              </span>
            </div>

            {/* Countdown Progress bar */}
            {!table.isQueued && (
              <div className="w-full bg-amber-200/80 rounded-full h-2 overflow-hidden my-2">
                <div
                  className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            )}

            <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
              {table.isQueued
                ? 'All waiters are currently busy. Table is at top of priority dispatch queue.'
                : 'Customer is waiting for waiter. When countdown hits 00:00, DineSight will auto-assign the available waiter with lowest table load.'}
            </p>

            {/* Fast forward trigger for demo testing */}
            {!table.isQueued && (
              <div className="mt-2.5 pt-2 border-t border-amber-200/80 flex justify-end">
                <button
                  onClick={() => onUpdateStatus(table.id, 'WAITER_ASSIGNED')}
                  className="inline-flex items-center text-[10px] font-bold text-amber-900 bg-amber-200/90 hover:bg-amber-300 px-2 py-1 rounded transition-colors"
                >
                  <FastForward className="w-3 h-3 mr-1" />
                  Fast-Forward to 00:00 (Assign Waiter Now)
                </button>
              </div>
            )}
          </div>
        )}

        {/* WORKFLOW BANNER 2: WAITER ASSIGNED — ACCEPT & START SERVICE */}
        {isAssigned && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50/50 border-2 border-sky-400 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-950 flex items-center">
                <UserCheck className="w-4 h-4 mr-1.5 text-sky-600" />
                Waiter Assigned: {table.assignedWaiterName}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-200 text-sky-900 font-mono">
                {table.assignmentAccepted ? 'ACCEPTED' : 'PENDING ACCEPTANCE'}
              </span>
            </div>

            <p className="text-[11px] text-sky-800 leading-relaxed">
              {table.assignmentAccepted
                ? 'Assignment accepted. Waiter is moving table-side to begin service.'
                : 'Waiter dispatch notification delivered to smartwatch/app. Acceptance required.'}
            </p>

            <div className="flex items-center space-x-2 pt-1">
              {!table.assignmentAccepted ? (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onAcceptAssignment?.(table.id)}
                  className="w-full text-xs"
                >
                  Accept Assignment as Waiter
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onStartService?.(table.id)}
                  className="w-full text-xs bg-forest-700 hover:bg-forest-800"
                >
                  Arrived Table-Side: Start Service (SERVING)
                </Button>
              )}
            </div>
          </div>
        )}

        {/* WORKFLOW BANNER 3: TABLE AVAILABLE — DETECT & START TIMER */}
        {isAvailable && (
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-300 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-900 block">
                Table Ready for Seating
              </span>
              <span className="text-[10px] text-emerald-700 block">
                Cleaned and sanitized for walk-ins or reservations.
              </span>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={() => onSeatCustomer?.(table.id)}
              icon={<UserPlus className="w-3.5 h-3.5" />}
              className="text-xs bg-emerald-700 hover:bg-emerald-800 shrink-0"
            >
              Seat Customer (Start 5m Timer)
            </Button>
          </div>
        )}

        {/* Active AI Alert banner if present */}
        {table.activeAlert && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900">
              <span className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-600 shrink-0" />
                AI Vision Detection Flag
              </span>
              <span className="font-mono text-[10px] bg-amber-200/80 px-1.5 py-0.2 rounded">
                {Math.round(table.activeAlert.confidence * 100)}% Match
              </span>
            </div>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed font-medium">
              {table.activeAlert.message}
            </p>
          </div>
        )}

        {/* 4 Core Table Metrics */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          {/* Seating Capacity */}
          <div className="p-3 rounded-xl bg-warm-100/70 border border-warm-200/60">
            <div className="flex items-center text-charcoal-500 text-[11px] mb-1">
              <Users className="w-3.5 h-3.5 mr-1 text-forest-600" />
              <span>Seating Capacity</span>
            </div>
            <div className="font-extrabold text-charcoal-900 font-display text-base">
              {table.capacity} Seats
            </div>
            <span className="text-[10px] text-charcoal-500 font-medium">
              {table.chairs ? `${table.chairs.length} chairs arranged` : 'Standard arrangement'}
            </span>
          </div>

          {/* Customer Count */}
          <div className="p-3 rounded-xl bg-warm-100/70 border border-warm-200/60">
            <div className="flex items-center text-charcoal-500 text-[11px] mb-1">
              <Users className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              <span>Customer Count</span>
            </div>
            <div className="font-extrabold text-charcoal-900 font-display text-base">
              {table.guestCount} Guests
            </div>
            <span className="text-[10px] font-semibold text-charcoal-600">
              {table.guestCount > 0 ? `${Math.round((table.guestCount / table.capacity) * 100)}% Filled` : 'Unseated'}
            </span>
          </div>

          {/* Seating Time */}
          <div className="p-3 rounded-xl bg-warm-100/70 border border-warm-200/60">
            <div className="flex items-center text-charcoal-500 text-[11px] mb-1">
              <Clock className="w-3.5 h-3.5 mr-1 text-forest-600" />
              <span>Seating Time</span>
            </div>
            <div className="font-extrabold text-charcoal-900 font-mono text-sm">
              {table.timeSeated || '—'}
            </div>
            <span className="text-[10px] text-charcoal-500">
              {table.elapsedMinutes ? `${table.elapsedMinutes} mins on floor` : 'Session inactive'}
            </span>
          </div>

          {/* Waiting Duration */}
          <div className="p-3 rounded-xl bg-warm-100/70 border border-warm-200/60">
            <div className="flex items-center text-charcoal-500 text-[11px] mb-1">
              <Hourglass className="w-3.5 h-3.5 mr-1 text-amber-600" />
              <span>Waiting Duration</span>
            </div>
            <div
              className={`font-extrabold font-mono text-sm ${
                table.waitingDuration && table.waitingDuration !== 'None'
                  ? 'text-amber-800'
                  : 'text-charcoal-900'
              }`}
            >
              {table.waitingDuration || 'None'}
            </div>
            <span className="text-[10px] text-charcoal-500">
              {isWaiting ? '5m Countdown Active' : 'SLA Satisfied'}
            </span>
          </div>
        </div>

        {/* Assigned Waiter Card */}
        <div className="p-3 rounded-xl border border-warm-200 bg-white">
          <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider mb-2">
            Assigned Waiter
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={table.assignedWaiterAvatar || STAFF_AVATARS['EMP-101']}
                alt={table.assignedWaiterName}
                className="w-10 h-10 rounded-full object-cover border border-warm-200 shrink-0"
              />
              <div>
                <p className="text-xs font-bold text-charcoal-900">
                  {table.assignedWaiterName}
                </p>
                <p className="text-[11px] text-charcoal-500">
                  {table.assignedWaiterRole || 'Floor Server'} • {table.zone}
                </p>
              </div>
            </div>

            {isServing && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-forest-100 text-forest-800">
                TABLE-SIDE
              </span>
            )}
          </div>
        </div>

        {/* Service Timeline */}
        <div className="p-3.5 rounded-xl border border-warm-200 bg-warm-50/40">
          <div className="text-xs font-bold text-charcoal-900 mb-3 flex items-center justify-between">
            <span>Service Timeline & Workflow</span>
            <span className="text-[10px] text-charcoal-400 font-mono">Live Logs</span>
          </div>

          <div className="space-y-3 relative pl-4 border-l-2 border-warm-200 ml-2">
            {table.timeline && table.timeline.length > 0 ? (
              table.timeline.map((item) => (
                <div key={item.id} className="relative">
                  <span
                    className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                      item.status === 'completed'
                        ? 'bg-emerald-600'
                        : item.status === 'current'
                        ? 'bg-amber-500 animate-ping-slow'
                        : 'bg-charcoal-300'
                    }`}
                  />
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-bold text-charcoal-900">{item.title}</span>
                    <span className="text-[10px] font-mono text-charcoal-400">{item.time}</span>
                  </div>
                  {item.actor && (
                    <p className="text-[10px] text-charcoal-500 mt-0.5">By {item.actor}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-charcoal-400">No prior service milestones recorded.</p>
            )}
          </div>
        </div>
      </div>

      {/* Manual Status Changer (All 6 Table Statuses) */}
      <div className="pt-3 border-t border-warm-100">
        <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-2">
          Manual Status Override
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {statusOptions.map((opt) => {
            const isCurrent = table.status === opt.status
            return (
              <button
                key={opt.status}
                onClick={() => onUpdateStatus(table.id, opt.status)}
                className={`px-2 py-1.5 rounded-lg text-left transition-all flex flex-col justify-between border ${
                  isCurrent
                    ? 'bg-forest-700 text-white border-forest-800 shadow-xs'
                    : 'bg-warm-50 text-charcoal-700 hover:bg-warm-100 border-warm-200'
                }`}
              >
                <div className="font-mono text-[10px] font-bold truncate">
                  {opt.label}
                </div>
                <div
                  className={`text-[9px] truncate mt-0.5 ${
                    isCurrent ? 'text-forest-200' : 'text-charcoal-400'
                  }`}
                >
                  {opt.desc}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
