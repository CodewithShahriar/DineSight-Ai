import React, { useState } from 'react'
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  UserCheck,
  Sparkles,
  X,
  Check,
  Hourglass,
  Gauge,
  UserPlus,
  FastForward,
  Play,
  Bell,
  ArrowRight,
  Clock,
} from 'lucide-react'
import { PageHeader } from '../components/shared/PageHeader'
import { Button } from '../components/shared/Button'
import { Badge } from '../components/shared/Badge'
import { Card, CardHeader, CardTitle, CardDescription } from '../components/shared/Card'
import { WaiterCard } from '../components/waiters/WaiterCard'
import { useRestaurantData } from '../hooks/useRestaurantData'
import { Waiter, SimulationSpeed, WaiterStatus } from '../types'
import { getStatusColor } from '../utils'

export const WaiterManagement: React.FC = () => {
  const {
    waiters,
    tables,
    detectCustomerAtTable,
    acceptAssignment,
    startService,
    updateWaiterStatus,
    simulationSpeed,
    setSimulationSpeed,
  } = useRestaurantData()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedWaiter, setSelectedWaiter] = useState<Waiter | null>(null)
  const [assignedTablesDraft, setAssignedTablesDraft] = useState<number[]>([])
  const [selectedTableToSeat, setSelectedTableToSeat] = useState<string>('T-01')

  const handleSelectWaiter = (w: Waiter) => {
    setSelectedWaiter(w)
    setAssignedTablesDraft([...w.assignedTables])
  }

  const toggleTableDraft = (tableNum: number) => {
    if (assignedTablesDraft.includes(tableNum)) {
      setAssignedTablesDraft(assignedTablesDraft.filter((t) => t !== tableNum))
    } else {
      setAssignedTablesDraft([...assignedTablesDraft, tableNum].sort((a, b) => a - b))
    }
  }

  const filteredWaiters = waiters.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' ? true : w.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Tables currently active in the 5-minute waiting / assignment workflow
  const activeWorkflowTables = tables.filter(
    (t) =>
      t.status === 'WAITING_FOR_WAITER' ||
      t.status === 'WAITER_ASSIGNED' ||
      (t.timerActive && (t.countdownRemaining ?? 0) > 0)
  )

  const availableTables = tables.filter(
    (t) => t.status === 'AVAILABLE' || t.status === 'available'
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Waiter Management & Table Assignment"
        subtitle="Manage the active floor staff roster, balance live dining section loads, track server SLAs, and monitor automated 5-minute customer waiting dispatch."
        badge={
          <Badge variant="forest" dot>
            {waiters.length} Staff Rostered • {waiters.filter((w) => w.status === 'active').length} On Active Duty
          </Badge>
        }
        actions={
          /* Simulation Speed Controls: Real Time, 10x, 60x */
          <div className="flex items-center space-x-2 bg-warm-100 p-1 rounded-xl border border-warm-200">
            <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider px-2 flex items-center">
              <Gauge className="w-3.5 h-3.5 mr-1 text-forest-700" />
              Speed:
            </span>
            {([1, 10, 60] as SimulationSpeed[]).map((spd) => (
              <button
                key={spd}
                onClick={() => setSimulationSpeed(spd)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  simulationSpeed === spd
                    ? 'bg-forest-700 text-white shadow-xs'
                    : 'text-charcoal-700 hover:bg-warm-200'
                }`}
              >
                {spd === 1 ? '1x (Real Time)' : `${spd}x`}
              </button>
            ))}
          </div>
        }
      />

      {/* 5-MINUTE CUSTOMER WAITING TIMER WORKFLOW CONSOLE */}
      <Card className="p-5 bg-gradient-to-br from-white via-amber-50/20 to-warm-50 border-amber-300/80 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-warm-200/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <Hourglass className="w-4 h-4 animate-spin-slow" />
              </span>
              <h3 className="text-sm font-extrabold text-charcoal-900 tracking-tight">
                5-Minute Customer Waiting Timer & Auto-Assignment Engine
              </h3>
              <Badge variant="amber" dot>
                {activeWorkflowTables.length} Tables In Queue
              </Badge>
            </div>
            <p className="text-xs text-charcoal-600 mt-1">
              When a guest is seated, a <strong>5-minute countdown starts</strong>. Upon reaching <strong>00:00</strong>, the available waiter with the lowest active table count is auto-assigned.
            </p>
          </div>

          {/* Seating Trigger Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            <select
              value={selectedTableToSeat}
              onChange={(e) => setSelectedTableToSeat(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white border border-warm-300 text-xs font-mono font-bold text-charcoal-800 focus:outline-none"
            >
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id} ({t.status.replace(/_/g, ' ')})
                </option>
              ))}
            </select>

            <Button
              size="sm"
              variant="amber"
              onClick={() => detectCustomerAtTable(selectedTableToSeat)}
              icon={<UserPlus className="w-3.5 h-3.5" />}
              className="text-xs font-semibold whitespace-nowrap"
            >
              Seat Customer (Start 5m Timer)
            </Button>
          </div>
        </div>

        {/* Live Active Countdown Queue Table */}
        <div className="pt-4">
          <div className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Active Countdown & Auto-Assignment Queue</span>
            <span className="text-[11px] font-mono text-charcoal-500 font-normal">
              Simulation Clock: {simulationSpeed}x Speed Active
            </span>
          </div>

          {activeWorkflowTables.length === 0 ? (
            <div className="py-6 text-center text-xs text-charcoal-400 bg-white/60 rounded-xl border border-warm-200">
              No tables currently in the waiting queue. Select a table above and click "Seat Customer" to begin a 5-minute countdown.
            </div>
          ) : (
            <div className="space-y-2">
              {activeWorkflowTables.map((t) => {
                const style = getStatusColor(t.status)
                const remaining = t.countdownRemaining || 0
                const mins = Math.floor(remaining / 60)
                const secs = remaining % 60
                const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

                return (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-white border border-warm-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-2xs hover:border-warm-300"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-base font-black font-display text-charcoal-900 font-mono w-12">
                        {t.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${style.badgeBg}`}
                      >
                        {t.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-charcoal-500">
                        {t.guestCount} Guests • Seated: {t.timeSeated || '12:05 PM'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Timer Display */}
                      <div className="text-right">
                        <span className="text-[10px] text-charcoal-400 font-bold uppercase block">
                          Waiting Countdown
                        </span>
                        <span className="text-sm font-mono font-black text-amber-800 flex items-center justify-end">
                          <Hourglass className="w-3.5 h-3.5 mr-1 text-amber-600 animate-spin-slow" />
                          {t.isQueued ? 'QUEUED (NO STAFF)' : formattedTime}
                        </span>
                      </div>

                      {/* Waiter Info / Action */}
                      <div className="text-right pl-3 border-l border-warm-200">
                        <span className="text-[10px] text-charcoal-400 font-bold uppercase block">
                          Assigned Staff
                        </span>
                        <span className="text-xs font-bold text-charcoal-800 block">
                          {t.assignedWaiterName || 'Pending 00:00'}
                        </span>
                      </div>

                      {/* Interactive Actions for Workflow */}
                      <div className="flex items-center space-x-1.5 pl-2">
                        {t.status === 'WAITER_ASSIGNED' && !t.assignmentAccepted && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => acceptAssignment(t.id)}
                            className="text-[11px] h-7 px-2.5 bg-sky-700 hover:bg-sky-800"
                          >
                            Accept Assignment
                          </Button>
                        )}

                        {t.status === 'WAITER_ASSIGNED' && t.assignmentAccepted && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => startService(t.id)}
                            className="text-[11px] h-7 px-2.5 bg-forest-700 hover:bg-forest-800"
                          >
                            Start Service (SERVING)
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Filter and Search Bar for Waiters */}
      <Card className="p-4 bg-white border-warm-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by waiter name, employee ID, or section..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-warm-50 border border-warm-200 text-xs sm:text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-600/30"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'active', 'busy', 'on_break'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all ${
                  filterStatus === status
                    ? 'bg-forest-700 text-white shadow-xs'
                    : 'bg-warm-100 text-charcoal-700 hover:bg-warm-200'
                }`}
              >
                {status === 'active' ? 'AVAILABLE' : status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Four Waiter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredWaiters.map((waiter) => (
          <WaiterCard
            key={waiter.id}
            waiter={waiter}
            onSelect={handleSelectWaiter}
            onUpdateStatus={updateWaiterStatus}
            onAcceptPending={acceptAssignment}
            onStartService={startService}
          />
        ))}
      </div>

      {/* Reassignment Modal */}
      {selectedWaiter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-warm-200 shadow-floating max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-warm-100">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedWaiter.avatar}
                  alt={selectedWaiter.name}
                  className="w-11 h-11 rounded-full object-cover border border-warm-200"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-charcoal-900">
                      {selectedWaiter.name}
                    </h3>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-charcoal-800 text-white">
                      {selectedWaiter.employeeId}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-500">
                    {selectedWaiter.role} • {selectedWaiter.zone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWaiter(null)}
                className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-warm-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs text-charcoal-600 mb-2">
                Toggle tables to reallocate floor coverage. Tables with active service will update their assigned server.
              </p>

              <div className="grid grid-cols-4 gap-2 pt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                  const isAssigned = assignedTablesDraft.includes(num)
                  return (
                    <button
                      key={num}
                      onClick={() => toggleTableDraft(num)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isAssigned
                          ? 'bg-forest-50 border-forest-500 text-forest-900 font-bold shadow-xs'
                          : 'bg-warm-50/70 border-warm-200 text-charcoal-600 hover:bg-warm-100'
                      }`}
                    >
                      <div className="text-xs font-mono">T-{String(num).padStart(2, '0')}</div>
                      <div className="text-[10px] mt-0.5">
                        {isAssigned ? 'Assigned' : 'Available'}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-warm-100 flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWaiter(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  selectedWaiter.assignedTables = assignedTablesDraft
                  selectedWaiter.assignedTableIds = assignedTablesDraft.map(
                    (n) => `T-${String(n).padStart(2, '0')}`
                  )
                  setSelectedWaiter(null)
                }}
              >
                Save Shift Reassignment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
