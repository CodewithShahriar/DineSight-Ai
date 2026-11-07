import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  LayoutGrid,
  CheckCircle2,
  Users,
  ShieldCheck,
  Check,
  Sparkles,
  RefreshCw,
  UtensilsCrossed,
  Info,
} from 'lucide-react'
import { Waiter, RestaurantTable } from '../../types'

interface ReassignTablesModalProps {
  waiter: Waiter | null
  isOpen: boolean
  tables: RestaurantTable[]
  onClose: () => void
  onSave: (waiterId: string, assignedTableNumbers: number[]) => void
}

export const ReassignTablesModal: React.FC<ReassignTablesModalProps> = ({
  waiter,
  isOpen,
  tables,
  onClose,
  onSave,
}) => {
  const [draftTables, setDraftTables] = useState<number[]>([])

  // Initialize draft tables whenever the waiter changes
  useEffect(() => {
    if (waiter) {
      setDraftTables([...waiter.assignedTables])
    }
  }, [waiter])

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !waiter) return null

  const toggleTable = (num: number) => {
    if (draftTables.includes(num)) {
      setDraftTables(draftTables.filter((n) => n !== num))
    } else {
      setDraftTables([...draftTables, num].sort((a, b) => a - b))
    }
  }

  const handleSelectZone = () => {
    // Extract tables located in this waiter's zone
    const zoneLower = waiter.zone.toLowerCase()
    const matchingNums = tables
      .filter((t) => zoneLower.includes(t.zone.toLowerCase()) || t.zone.toLowerCase().includes('main'))
      .map((t) => parseInt(t.id.replace('T-', ''), 10))

    setDraftTables(Array.from(new Set([...draftTables, ...matchingNums])).sort((a, b) => a - b))
  }

  const handleClearAll = () => {
    setDraftTables([])
  }

  const handleSave = () => {
    onSave(waiter.id, draftTables)
    onClose()
  }

  // Calculate total capacity of selected tables
  const totalCapacity = tables
    .filter((t) => draftTables.includes(parseInt(t.id.replace('T-', ''), 10)))
    .reduce((sum, t) => sum + t.capacity, 0)

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-charcoal-950/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative bg-white border border-warm-200 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 p-5 border-b border-warm-200 bg-warm-50/90 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <img
              src={waiter.avatar}
              alt={waiter.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-forest-600 shadow-xs shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-charcoal-900 truncate">
                  {waiter.name}
                </h3>
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-charcoal-800 text-white shrink-0">
                  {waiter.employeeId}
                </span>
              </div>
              <p className="text-xs text-charcoal-500 font-medium truncate mt-0.5">
                {waiter.role} • <span className="text-forest-700 font-semibold">{waiter.zone}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-warm-100 transition-colors cursor-pointer"
            aria-label="Close reassignment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Quick Helper Banner */}
          <div className="p-3 rounded-xl bg-forest-50/70 border border-forest-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-start space-x-2 text-xs text-forest-900">
              <Info className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
              <span>
                Click tables to allocate or release coverage. Active service tickets will sync automatically.
              </span>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleSelectZone}
                className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-forest-100 text-forest-800 rounded-lg border border-forest-300 transition-colors cursor-pointer shadow-2xs"
              >
                + Auto-Assign Zone
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-2 py-1 text-[11px] font-semibold bg-white hover:bg-warm-100 text-charcoal-600 rounded-lg border border-warm-200 transition-colors cursor-pointer shadow-2xs"
              >
                Clear
              </button>
            </div>
          </div>

          {/* 12-Table Interactive Grid */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-charcoal-700 mb-2 uppercase tracking-wider">
              <span>Select Active Dining Tables</span>
              <span className="font-mono text-forest-800">
                {draftTables.length} Tables Selected ({totalCapacity} Max Guests)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                const isAssigned = draftTables.includes(num)
                const tableObj = tables.find((t) => t.id === `T-${String(num).padStart(2, '0')}`)
                const capacity = tableObj ? tableObj.capacity : 4
                const isOccupied =
                  tableObj && (tableObj.status === 'OCCUPIED' || tableObj.status === 'occupied')

                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => toggleTable(num)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      isAssigned
                        ? 'bg-forest-50 border-forest-600 text-forest-950 shadow-sm ring-1 ring-forest-500/30'
                        : 'bg-white border-warm-200 text-charcoal-600 hover:border-warm-300 hover:bg-warm-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm">
                        T-{String(num).padStart(2, '0')}
                      </span>
                      {isAssigned ? (
                        <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-warm-300 shrink-0" />
                      )}
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[11px]">
                      <span className="text-charcoal-500 font-medium">{capacity}p Seats</span>
                      <span
                        className={`font-semibold ${
                          isOccupied ? 'text-amber-700' : 'text-emerald-700'
                        }`}
                      >
                        {isOccupied ? 'Dining' : 'Free'}
                      </span>
                    </div>

                    <div className="mt-1 pt-1 border-t border-warm-100 text-[10px] font-semibold">
                      {isAssigned ? (
                        <span className="text-forest-800 font-bold">✓ Assigned</span>
                      ) : (
                        <span className="text-charcoal-400">+ Assign</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Load Status Summary */}
          <div className="p-3 bg-warm-50 rounded-xl border border-warm-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <LayoutGrid className="w-4 h-4 text-charcoal-500" />
              <span className="text-charcoal-700">Section Capacity Load:</span>
            </div>

            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                draftTables.length === 0
                  ? 'bg-charcoal-100 text-charcoal-600'
                  : draftTables.length <= 3
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {draftTables.length === 0
                ? 'Standby (0 Tables)'
                : draftTables.length <= 3
                ? `Optimal (${draftTables.length} Tables)`
                : `Heavy Load (${draftTables.length} Tables)`}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 p-4 border-t border-warm-200 bg-white flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-warm-300 hover:bg-warm-100 text-charcoal-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 text-emerald-300" />
            <span>Save Shift Reassignment</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
