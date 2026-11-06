import React, { useState } from 'react'
import {
  LayoutGrid,
  Filter,
  Sparkles,
  Info,
  Layers,
  RotateCcw,
  AlertTriangle,
  DoorOpen,
  Coffee,
  UtensilsCrossed,
  ChefHat,
  ArrowDown,
  ArrowRight,
  Footprints,
  UserCheck,
  CheckCircle2,
  Gauge,
  Hourglass,
  UserPlus,
  Play,
} from 'lucide-react'
import { PageHeader } from '../components/shared/PageHeader'
import { Badge } from '../components/shared/Badge'
import { Button } from '../components/shared/Button'
import { Card } from '../components/shared/Card'
import { TableInspector } from '../components/floor-plan/TableInspector'
import { useRestaurantData } from '../hooks/useRestaurantData'
import { RestaurantTable, TableStatus, SimulationSpeed } from '../types'
import { getStatusColor } from '../utils'

export const FloorPlan: React.FC = () => {
  const {
    tables,
    updateTableStatus,
    detectCustomerAtTable,
    acceptAssignment,
    startService,
    simulationSpeed,
    setSimulationSpeed,
  } = useRestaurantData()

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL')
  const [selectedTableId, setSelectedTableId] = useState<string>('T-02')

  const selectedTable = tables.find((t) => t.id === selectedTableId) || tables[0]

  // Filter tables by status
  const filteredTables = tables.filter((t) => {
    if (selectedStatusFilter === 'ALL') return true
    return t.status === selectedStatusFilter
  })

  // Table counts per status
  const countByStatus = (status: TableStatus) =>
    tables.filter((t) => t.status === status).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interactive Restaurant Floor Plan"
        subtitle="Architectural floor layout synchronized with live CCTV vision sensors, 5-minute customer wait timers, and automatic waiter dispatch."
        badge={
          <Badge variant="forest" dot>
            12 Tables Active
          </Badge>
        }
        actions={
          /* Simulation Speed Options (Real Time, 10x, 60x) */
          <div className="flex items-center space-x-1.5 sm:space-x-2 bg-warm-100 p-1 rounded-xl border border-warm-200 max-w-full">
            <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider px-1.5 sm:px-2 flex items-center shrink-0">
              <Gauge className="w-3.5 h-3.5 mr-1 text-forest-700" />
              Speed:
            </span>
            {([1, 10, 60] as SimulationSpeed[]).map((spd) => (
              <button
                key={spd}
                onClick={() => setSimulationSpeed(spd)}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap shrink-0 ${
                  simulationSpeed === spd
                    ? 'bg-forest-700 text-white shadow-xs'
                    : 'text-charcoal-700 hover:bg-warm-200'
                }`}
              >
                {spd === 1 ? <>1x<span className="hidden sm:inline"> (Real Time)</span></> : `${spd}x`}
              </button>
            ))}
          </div>
        }
      />

      {/* Status Filter Toolbar */}
      <Card className="p-4 bg-white border-warm-200 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setSelectedStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wide whitespace-nowrap transition-all ${
                selectedStatusFilter === 'ALL'
                  ? 'bg-forest-700 text-white shadow-xs'
                  : 'bg-warm-100 text-charcoal-700 hover:bg-warm-200'
              }`}
            >
              ALL TABLES ({tables.length})
            </button>

            {(
              [
                'AVAILABLE',
                'OCCUPIED',
                'WAITING_FOR_WAITER',
                'WAITER_ASSIGNED',
                'SERVING',
                'SERVICE_COMPLETED',
              ] as TableStatus[]
            ).map((st) => {
              const count = countByStatus(st)
              const style = getStatusColor(st)
              const isSelected = selectedStatusFilter === st

              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatusFilter(st)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-mono whitespace-nowrap transition-all border flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-charcoal-900 text-white border-charcoal-950 shadow-xs'
                      : 'bg-warm-50 text-charcoal-700 hover:bg-warm-100 border-warm-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                  <span>{st.replace(/_/g, ' ')}</span>
                  <span className="opacity-70">({count})</span>
                </button>
              )
            })}
          </div>

          {/* Quick Simulation Trigger on Next Available Table */}
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="amber"
              onClick={() => {
                const nextAvail = tables.find((t) => t.status === 'AVAILABLE' || t.status === 'available')
                if (nextAvail) {
                  detectCustomerAtTable(nextAvail.id)
                  setSelectedTableId(nextAvail.id)
                }
              }}
              icon={<UserPlus className="w-3.5 h-3.5" />}
              className="text-xs whitespace-nowrap"
            >
              Seat Next Customer (Start 5m Timer)
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Floor Plan Visualizer + Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Architectural Restaurant Map (Left 8 Cols) */}
        <div className="lg:col-span-8">
          <Card className="p-4 sm:p-6 bg-gradient-to-b from-[#fdfcf9] to-[#f7f5ef] border-warm-200/90 shadow-card min-h-[620px] relative overflow-hidden flex flex-col justify-between">
            {/* Top Architectural Zone: KITCHEN & EXPEDITER PASS */}
            <div className="w-full bg-charcoal-900 text-white rounded-xl p-3 border border-charcoal-800 shadow-inner mb-6 relative">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-charcoal-800 pb-2 mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded bg-forest-600 text-white">
                    <ChefHat className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold font-mono tracking-wider text-white">
                      EXECUTIVE KITCHEN & EXPEDITER PASS
                    </span>
                    <span className="text-[10px] text-charcoal-400 block">
                      Hot Plates Station • KDS Order Screen • Runner Pass
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-[10px] font-mono text-charcoal-300">
                  <span className="flex items-center text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                    KDS Active
                  </span>
                  <span>Avg Ticket: 14m</span>
                </div>
              </div>

              {/* Kitchen Counter Surface with Pass Window */}
              <div className="flex items-center justify-between text-[11px] font-mono text-charcoal-400 pt-1">
                <span>[ CHEF EXPEDITER LINE ]</span>
                <span className="text-forest-400 font-bold flex items-center">
                  <ArrowDown className="w-3.5 h-3.5 mr-1 animate-bounce" />
                  Service Pass Windows (Order Pickup)
                </span>
                <span>[ PLATING LINE ]</span>
              </div>
            </div>

            {/* Middle Section: Main Dining Floor with Service Counter & Walkways */}
            <div className="flex-1 flex gap-4">
              {/* West Side: SERVICE COUNTER & BAR */}
              <div className="w-16 sm:w-20 bg-warm-200/70 rounded-xl border border-warm-300 p-2 flex flex-col justify-between items-center text-center shadow-xs">
                <div className="flex flex-col items-center">
                  <Coffee className="w-4 h-4 text-charcoal-700 mb-1" />
                  <span className="text-[9px] font-bold font-mono text-charcoal-800 uppercase tracking-tight writing-vertical">
                    SERVICE COUNTER
                  </span>
                </div>

                <div className="space-y-3 my-auto text-[9px] font-mono text-charcoal-600">
                  <div className="p-1 bg-white rounded border border-warm-300 shadow-2xs">
                    POS
                  </div>
                  <div className="p-1 bg-white rounded border border-warm-300 shadow-2xs">
                    BAR
                  </div>
                  <div className="p-1 bg-white rounded border border-warm-300 shadow-2xs">
                    WINE
                  </div>
                </div>

                <span className="text-[8px] font-mono text-charcoal-500">
                  Station A
                </span>
              </div>

              {/* Central Area: Tables & Walkways Grid */}
              <div className="flex-1 flex flex-col justify-between space-y-4">
                {/* Walkway Indicator A */}
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-charcoal-400 py-1 border-b border-dashed border-warm-300">
                  <span className="flex items-center">
                    <Footprints className="w-3 h-3 mr-1 text-charcoal-400" />
                    NORTH AISLE WALKWAY (EXPEDITER CIRCULATION)
                  </span>
                  <span>➔ PATIO ACCESS</span>
                </div>

                {/* Table Row 1: T-01, T-02, T-03, T-04 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {tables.slice(0, 4).map((table) => (
                    <TableLayoutCard
                      key={table.id}
                      table={table}
                      isSelected={selectedTableId === table.id}
                      onSelect={() => setSelectedTableId(table.id)}
                      isDimmed={selectedStatusFilter !== 'ALL' && table.status !== selectedStatusFilter}
                      onSeat={() => detectCustomerAtTable(table.id)}
                      onAccept={() => acceptAssignment(table.id)}
                      onStart={() => startService(table.id)}
                    />
                  ))}
                </div>

                {/* Walkway Indicator B (Main Central Corridor) */}
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-charcoal-400 py-1.5 border-y border-dashed border-warm-300/90 bg-warm-100/40 rounded px-2">
                  <span className="flex items-center text-charcoal-600 font-bold">
                    <Footprints className="w-3 h-3 mr-1.5 text-forest-700" />
                    CENTRAL SERVER CORRIDOR (MAIN DINING WALKWAY)
                  </span>
                  <span>PATIO ➔ RESTROOMS</span>
                </div>

                {/* Table Row 2: T-05, T-06, T-07, T-08 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {tables.slice(4, 8).map((table) => (
                    <TableLayoutCard
                      key={table.id}
                      table={table}
                      isSelected={selectedTableId === table.id}
                      onSelect={() => setSelectedTableId(table.id)}
                      isDimmed={selectedStatusFilter !== 'ALL' && table.status !== selectedStatusFilter}
                      onSeat={() => detectCustomerAtTable(table.id)}
                      onAccept={() => acceptAssignment(table.id)}
                      onStart={() => startService(table.id)}
                    />
                  ))}
                </div>

                {/* Walkway Indicator C */}
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-charcoal-400 py-1 border-b border-dashed border-warm-300">
                  <span>SOUTH DINING CORRIDOR</span>
                  <span>PRIVATE DINING ALCOVE ➔</span>
                </div>

                {/* Table Row 3: T-09, T-10, T-11, T-12 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {tables.slice(8, 12).map((table) => (
                    <TableLayoutCard
                      key={table.id}
                      table={table}
                      isSelected={selectedTableId === table.id}
                      onSelect={() => setSelectedTableId(table.id)}
                      isDimmed={selectedStatusFilter !== 'ALL' && table.status !== selectedStatusFilter}
                      onSeat={() => detectCustomerAtTable(table.id)}
                      onAccept={() => acceptAssignment(table.id)}
                      onStart={() => startService(table.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Architectural Zone: ENTRANCE, HOST STAND & FOYER */}
            <div className="mt-6 pt-4 border-t-2 border-warm-300/90 w-full bg-warm-100/90 rounded-xl p-3 border border-warm-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-white border border-warm-300 text-charcoal-800 shadow-xs">
                  <DoorOpen className="w-5 h-5 text-forest-700" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold font-mono text-charcoal-900 uppercase">
                      RESTAURANT MAIN ENTRANCE & HOSTESS FOYER
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-forest-100 text-forest-800 border border-forest-300">
                      DOORS OPEN
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-500 font-medium">
                    Host Stand Station #01 • Walk-in Queue Area • Glass Door Entry
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px] font-mono text-charcoal-600">
                <span className="px-2 py-1 bg-white rounded border border-warm-200">
                  Host Desk Manned
                </span>
                <span className="px-2 py-1 bg-white rounded border border-warm-200 text-emerald-800 font-bold">
                  Entrance Flow: Normal
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Details Panel (Right 4 Cols) */}
        <div className="lg:col-span-4 sticky top-20">
          <TableInspector
            table={selectedTable}
            onClose={() => {}}
            onUpdateStatus={updateTableStatus}
            onSeatCustomer={detectCustomerAtTable}
            onAcceptAssignment={acceptAssignment}
            onStartService={startService}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Visual Table Component rendering the Table Surface, Chair arrangements, and Status Ring
 */
interface TableLayoutCardProps {
  table: RestaurantTable
  isSelected: boolean
  onSelect: () => void
  isDimmed: boolean
  onSeat?: () => void
  onAccept?: () => void
  onStart?: () => void
}

const TableLayoutCard: React.FC<TableLayoutCardProps> = ({
  table,
  isSelected,
  onSelect,
  isDimmed,
  onSeat,
  onAccept,
  onStart,
}) => {
  const statusTheme = getStatusColor(table.status)
  const isWaiting = table.status === 'WAITING_FOR_WAITER' || table.status === 'attention_needed'
  const isAvailable = table.status === 'AVAILABLE' || table.status === 'available'
  const isServing = table.status === 'SERVING'
  const isAssigned = table.status === 'WAITER_ASSIGNED'
  const isCompleted = table.status === 'SERVICE_COMPLETED' || table.status === 'dirty'

  return (
    <div
      onClick={onSelect}
      className={`relative p-2.5 rounded-xl cursor-pointer transition-all duration-200 flex flex-col justify-between select-none ${
        isSelected
          ? 'ring-2 ring-forest-700 bg-white shadow-card scale-[1.02]'
          : isWaiting
          ? 'bg-amber-50/70 border-2 border-amber-400 shadow-xs hover:bg-amber-100/60'
          : 'bg-white border border-warm-200/90 shadow-2xs hover:border-warm-300 hover:shadow-xs'
      } ${isDimmed ? 'opacity-30 filter grayscale' : 'opacity-100'}`}
    >
      {/* Top Chairs row */}
      <div className="flex justify-center space-x-1.5 mb-1">
        {table.chairs
          ?.filter((c) => c.side === 'top')
          .map((c) => (
            <span
              key={c.id}
              className={`w-3 h-1.5 rounded-xs transition-colors ${
                c.occupied ? 'bg-charcoal-700' : 'bg-warm-200 border border-warm-300'
              }`}
              title={c.occupied ? 'Seated Chair' : 'Available Chair'}
            />
          ))}
      </div>

      {/* Main Table Body */}
      <div
        className={`relative p-2.5 rounded-lg border flex flex-col justify-between items-center text-center transition-all ${
          table.shape === 'round'
            ? 'rounded-full aspect-square'
            : table.shape === 'booth'
            ? 'rounded-lg bg-warm-100/80 border-warm-300'
            : 'rounded-lg'
        } ${
          isWaiting
            ? 'bg-amber-100/80 border-amber-400'
            : isServing
            ? 'bg-forest-50/80 border-forest-400'
            : isAssigned
            ? 'bg-sky-50/80 border-sky-300'
            : isCompleted
            ? 'bg-purple-50/80 border-purple-300'
            : isAvailable
            ? 'bg-emerald-50/80 border-emerald-300'
            : 'bg-warm-50 border-warm-200'
        }`}
      >
        {/* Pulsing Radar Ring for Waiting Status */}
        {isWaiting && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-600"></span>
          </span>
        )}

        <div className="flex items-center justify-between w-full">
          <span className="font-mono text-[9px] text-charcoal-400 font-bold">
            {table.capacity}p
          </span>
          <span
            className={`w-2 h-2 rounded-full ${statusTheme.dot}`}
            title={table.status}
          />
        </div>

        {/* Table ID in Big Bold Typography */}
        <div className="my-1">
          <span className="text-sm font-black font-display text-charcoal-900 tracking-tight">
            {table.id}
          </span>
        </div>

        {/* Customer Count OR Countdown Timer */}
        <div className="text-[10px] font-mono leading-tight">
          {isWaiting ? (
            <span className="text-amber-900 font-black flex items-center justify-center">
              <Hourglass className="w-2.5 h-2.5 mr-0.5 animate-spin-slow" />
              {table.isQueued ? 'QUEUED' : table.waitingDuration || '05:00'}
            </span>
          ) : table.guestCount > 0 ? (
            <span className="text-charcoal-700 font-bold">
              {table.guestCount} Guests
            </span>
          ) : (
            <span className="text-emerald-700 font-bold">READY</span>
          )}
        </div>
      </div>

      {/* Bottom Chairs row */}
      <div className="flex justify-center space-x-1.5 mt-1">
        {table.chairs
          ?.filter((c) => c.side === 'bottom')
          .map((c) => (
            <span
              key={c.id}
              className={`w-3 h-1.5 rounded-xs transition-colors ${
                c.occupied ? 'bg-charcoal-700' : 'bg-warm-200 border border-warm-300'
              }`}
              title={c.occupied ? 'Seated Chair' : 'Available Chair'}
            />
          ))}
      </div>

      {/* Mini status pill at very bottom */}
      <div className="mt-1 pt-1 border-t border-warm-100 flex items-center justify-between text-[9px] font-mono">
        <span className="truncate max-w-[65px] text-charcoal-500">
          {table.assignedWaiterName.split(' ')[0]}
        </span>
        <span
          className={`font-bold truncate ${
            isWaiting
              ? 'text-amber-800'
              : isServing
              ? 'text-forest-700'
              : isAssigned
              ? 'text-sky-700'
              : isCompleted
              ? 'text-purple-700'
              : isAvailable
              ? 'text-emerald-700'
              : 'text-charcoal-600'
          }`}
        >
          {table.status.replace(/_/g, ' ').slice(0, 7)}
        </span>
      </div>
    </div>
  )
}
