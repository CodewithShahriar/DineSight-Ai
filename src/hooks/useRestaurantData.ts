import { useState, useCallback, useEffect, useRef } from 'react'
import { mockTables as initialTables } from '../data/mockTables'
import { mockWaiters as initialWaiters } from '../data/mockWaiters'
import { mockEvents as initialEvents, mockCameras } from '../data/mockEvents'
import {
  RestaurantTable,
  OperationsEvent,
  Waiter,
  CCTVFeed,
  TableStatus,
  SimulationSpeed,
  WaiterStatus,
} from '../types'

export type DemoState = 'running' | 'paused' | 'idle'

export function useRestaurantData() {
  const [tables, setTables] = useState<RestaurantTable[]>(initialTables)
  const [waiters, setWaiters] = useState<Waiter[]>(initialWaiters)
  const [events, setEvents] = useState<OperationsEvent[]>(initialEvents)
  const [cameras, setCameras] = useState<CCTVFeed[]>(mockCameras)

  // Ensure cameras always stay updated with fresh mockCameras data
  useEffect(() => {
    setCameras(mockCameras)
  }, [])
  const [demoMode, setDemoMode] = useState<boolean>(true)
  const [demoState, setDemoState] = useState<DemoState>('running')
  const [simulationSpeed, setSimulationSpeed] = useState<SimulationSpeed>(1)
  const [lastActivityMessage, setLastActivityMessage] = useState<string>(
    'DineSight AI operational. 10 staff members on active shift roster.'
  )

  // Ref to hold current state inside interval callbacks without stale closures
  const stateRef = useRef({ tables, waiters, simulationSpeed, demoState })
  useEffect(() => {
    stateRef.current = { tables, waiters, simulationSpeed, demoState }
  }, [tables, waiters, simulationSpeed, demoState])

  // KPI Calculations
  const totalTables = tables.length
  const availableTables = tables.filter((t) => t.status === 'AVAILABLE' || t.status === 'available').length
  const occupiedTables = tables.filter(
    (t) =>
      t.status === 'OCCUPIED' ||
      t.status === 'occupied' ||
      t.status === 'SERVING' ||
      t.status === 'WAITER_ASSIGNED'
  ).length
  const waitingForWaiter = tables.filter(
    (t) => t.status === 'WAITING_FOR_WAITER' || t.status === 'attention_needed'
  ).length
  const availableWaiters = waiters.filter((w) => w.status === 'active').length

  const totalResponseTime = waiters.reduce((sum, w) => sum + w.avgResponseTimeSec, 0)
  const avgResponseTimeSec = Math.round(totalResponseTime / (waiters.length || 1))
  const activeAlertsCount = waitingForWaiter
  const unreadNotificationsCount = events.filter((e) => e.status === 'active').length

  // Helper to append a real-time event notification
  const addOperationsEvent = useCallback(
    (event: Omit<OperationsEvent, 'id' | 'timestamp'>) => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })

      const newEvt: OperationsEvent = {
        ...event,
        id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: timeStr,
      }

      setEvents((prev) => [newEvt, ...prev.slice(0, 19)])
    },
    []
  )

  // --------------------------------------------------------------------------
  // WORKFLOW STEP 1: DETECT CUSTOMER AT TABLE
  // 1. Update table status to OCCUPIED.
  // 2. Create a simulated seating session.
  // 3. Start a five-minute countdown (300 seconds).
  // 4. Notify the manager immediately.
  // 5. Set table status to WAITING_FOR_WAITER.
  // --------------------------------------------------------------------------
  const detectCustomerAtTable = useCallback(
    (tableId: string, customGuestCount?: number) => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })

      setTables((prev) =>
        prev.map((tbl) => {
          if (tbl.id === tableId) {
            const guestCount = customGuestCount || Math.min(tbl.capacity, Math.floor(Math.random() * 3) + 2)
            const updatedChairs = tbl.chairs?.map((c, i) => ({
              ...c,
              occupied: i < guestCount,
            }))

            return {
              ...tbl,
              status: 'WAITING_FOR_WAITER', // Final status after seating sequence
              guestCount,
              timeSeated: timeStr,
              elapsedMinutes: 0,
              waitingDuration: '5m 00s',
              countdownRemaining: 300, // 5-minute countdown in seconds
              countdownTotal: 300,
              timerActive: true,
              isQueued: false,
              assignmentAccepted: false,
              sessionId: `SES-${Date.now().toString().slice(-6)}`,
              chairs: updatedChairs,
              timeline: [
                {
                  id: `tl-${Date.now()}-1`,
                  time: timeStr,
                  title: `Customer Detected at Table (OCCUPIED)`,
                  status: 'completed',
                  actor: 'Vision AI Camera',
                },
                {
                  id: `tl-${Date.now()}-2`,
                  time: timeStr,
                  title: `5-Minute Waiting Countdown Started`,
                  status: 'completed',
                  actor: 'DineSight Dispatcher',
                },
                {
                  id: `tl-${Date.now()}-3`,
                  time: timeStr,
                  title: `Manager Alert Sent (WAITING_FOR_WAITER)`,
                  status: 'current',
                  actor: 'System Escalation',
                },
                {
                  id: `tl-${Date.now()}-4`,
                  time: 'Pending',
                  title: `Auto-Assign Waiter on Countdown Zero`,
                  status: 'pending',
                  actor: 'Floor Captain',
                },
              ],
            }
          }
          return tbl
        })
      )

      // Notify the manager immediately
      addOperationsEvent({
        tableNumber: parseInt(tableId.replace(/\D/g, '')) || 1,
        zone: 'Main Dining',
        type: 'long_wait',
        title: `Customer Seated at ${tableId} — 5m Timer Active`,
        description: `Computer Vision detected new party seated at ${tableId}. 5-minute countdown initiated for staff assignment.`,
        severity: 'high',
        status: 'active',
        assignedWaiter: 'Unassigned (Waiting Queue)',
        aiConfidence: 0.98,
        cameraId: 'Camera 01 — Main Dining Area',
      })

      setLastActivityMessage(
        `Customer detected at ${tableId}. 5-minute countdown timer started for staff assignment.`
      )
    },
    [addOperationsEvent]
  )

  // --------------------------------------------------------------------------
  // WORKFLOW STEP 2: COUNTDOWN REACHES ZERO
  // 1. Find the available waiter with the lowest active table count.
  // 2. Assign the waiter.
  // 3. Update table status to WAITER_ASSIGNED.
  // 4. Notify the waiter.
  // If no waiter is available, keep table in waiting queue.
  // --------------------------------------------------------------------------
  const handleCountdownZero = useCallback(
    (tableId: string) => {
      const currentWaiters = stateRef.current.waiters
      const availableWaitersList = currentWaiters.filter((w) => w.status === 'active')

      const tableNumber = parseInt(tableId.replace(/\D/g, '')) || 1

      if (availableWaitersList.length > 0) {
        // Find waiter with lowest active table count
        const targetWaiter = [...availableWaitersList].sort(
          (a, b) => (a.assignedTableIds?.length || a.assignedTables.length) - (b.assignedTableIds?.length || b.assignedTables.length)
        )[0]

        // 1. Update Table
        setTables((prev) =>
          prev.map((tbl) => {
            if (tbl.id === tableId) {
              const now = new Date()
              const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

              return {
                ...tbl,
                status: 'WAITER_ASSIGNED',
                timerActive: false,
                countdownRemaining: 0,
                waitingDuration: '0m 00s (Timer Expired)',
                isQueued: false,
                assignmentAccepted: false,
                assignedWaiterId: targetWaiter.id,
                assignedWaiterName: targetWaiter.name,
                assignedWaiterRole: targetWaiter.role,
                assignedWaiterAvatar: targetWaiter.avatar,
                timeline: [
                  ...(tbl.timeline || []),
                  {
                    id: `tl-${Date.now()}-zero`,
                    time: timeStr,
                    title: `5m Countdown Expired: Assigned to ${targetWaiter.name}`,
                    description: `${targetWaiter.name} (${targetWaiter.employeeId}) selected with lowest active load (${targetWaiter.assignedTables.length} tables).`,
                    status: 'current',
                    actor: 'Smart Dispatcher',
                  },
                ],
              }
            }
            return tbl
          })
        )

        // 2. Update Waiter's assignments
        setWaiters((prev) =>
          prev.map((w) => {
            if (w.id === targetWaiter.id) {
              const existingTables = w.assignedTableIds || []
              const existingNums = w.assignedTables || []
              return {
                ...w,
                assignedTables: existingNums.includes(tableNumber) ? existingNums : [...existingNums, tableNumber],
                assignedTableIds: existingTables.includes(tableId) ? existingTables : [...existingTables, tableId],
                pendingAssignments: [...(w.pendingAssignments || []), tableId],
              }
            }
            return w
          })
        )

        // 3. Notify Waiter & Manager
        addOperationsEvent({
          tableNumber,
          zone: 'Main Dining',
          type: 'hand_wave',
          title: `Assignment Dispatched: ${tableId} ➔ ${targetWaiter.name}`,
          description: `5-minute waiting timer hit 00:00. Assigned to ${targetWaiter.name} (${targetWaiter.employeeId}). Acceptance required.`,
          severity: 'high',
          status: 'active',
          assignedWaiter: targetWaiter.name,
          aiConfidence: 0.99,
          cameraId: 'Camera 01 — Main Dining Area',
        })

        setLastActivityMessage(
          `5m timer expired on ${tableId}. Auto-assigned to ${targetWaiter.name} (${targetWaiter.employeeId}).`
        )
      } else {
        // No waiter available: Keep in waiting queue
        setTables((prev) =>
          prev.map((tbl) => {
            if (tbl.id === tableId) {
              return {
                ...tbl,
                status: 'WAITING_FOR_WAITER',
                timerActive: false,
                countdownRemaining: 0,
                waitingDuration: 'Queued (Awaiting Server)',
                isQueued: true,
              }
            }
            return tbl
          })
        )

        addOperationsEvent({
          tableNumber,
          zone: 'Main Dining',
          type: 'long_wait',
          title: `STAFF SHORTAGE QUEUE: ${tableId}`,
          description: `5-minute timer expired on ${tableId}, but all waiters are currently busy/on-break. Retrying automatically.`,
          severity: 'critical',
          status: 'active',
          assignedWaiter: 'Queue (No Staff Available)',
          aiConfidence: 0.99,
          cameraId: 'Camera 01 — Main Dining Area',
        })

        setLastActivityMessage(
          `Alert: No waiters available for ${tableId}. Table placed in priority dispatch queue.`
        )
      }
    },
    [addOperationsEvent]
  )

  // --------------------------------------------------------------------------
  // WORKFLOW STEP 3: WAITER ACCEPTS ASSIGNMENT
  // --------------------------------------------------------------------------
  const acceptAssignment = useCallback(
    (tableId: string) => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

      setTables((prev) =>
        prev.map((tbl) => {
          if (tbl.id === tableId) {
            return {
              ...tbl,
              assignmentAccepted: true,
              timeline: [
                ...(tbl.timeline || []),
                {
                  id: `tl-${Date.now()}-accept`,
                  time: timeStr,
                  title: `Assignment Accepted by ${tbl.assignedWaiterName}`,
                  status: 'current',
                  actor: tbl.assignedWaiterName,
                },
              ],
            }
          }
          return tbl
        })
      )

      setWaiters((prev) =>
        prev.map((w) => ({
          ...w,
          pendingAssignments: (w.pendingAssignments || []).filter((id) => id !== tableId),
        }))
      )

      setLastActivityMessage(`Waiter accepted assignment for Table ${tableId}.`)
    },
    []
  )

  // --------------------------------------------------------------------------
  // WORKFLOW STEP 4: WAITER STARTS SERVICE ➔ UPDATE STATUS TO SERVING
  // --------------------------------------------------------------------------
  const startService = useCallback(
    (tableId: string) => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

      setTables((prev) =>
        prev.map((tbl) => {
          if (tbl.id === tableId) {
            return {
              ...tbl,
              status: 'SERVING',
              waitingDuration: 'None',
              timerActive: false,
              countdownRemaining: 0,
              assignmentAccepted: true,
              timeline: [
                ...(tbl.timeline || []),
                {
                  id: `tl-${Date.now()}-serving`,
                  time: timeStr,
                  title: `Service Started Table-Side (SERVING)`,
                  description: `Server table-side taking orders and beverage requests.`,
                  status: 'current',
                  actor: tbl.assignedWaiterName,
                },
              ],
            }
          }
          return tbl
        })
      )

      addOperationsEvent({
        tableNumber: parseInt(tableId.replace(/\D/g, '')) || 1,
        zone: 'Main Dining',
        type: 'delayed_order',
        title: `Service Underway at ${tableId} (SERVING)`,
        description: `Assigned waiter arrived table-side. Table status updated to SERVING.`,
        severity: 'low',
        status: 'resolved',
        assignedWaiter: 'Floor Server',
        aiConfidence: 0.98,
        cameraId: 'Camera 01 — Main Dining Area',
      })

      setLastActivityMessage(`Service started at ${tableId}. Status set to SERVING.`)
    },
    [addOperationsEvent]
  )

  // --------------------------------------------------------------------------
  // TIMERS LOOP: Independent Countdown Timers for Multiple Tables
  // Supports Real Time (1x), 10x, and 60x simulation speeds with clean interval
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (demoState !== 'running') return

    const tickIntervalMs = 500 // 500ms heartbeat
    const interval = setInterval(() => {
      const { tables: currentTables, simulationSpeed: speed } = stateRef.current

      // Calculate how many seconds to deduct in this tick:
      // (tickIntervalMs / 1000) * speed
      const secondsToDeduct = Math.max(1, Math.round((tickIntervalMs / 1000) * speed))

      let hasCompletedCountdown = false
      let zeroTableId: string | null = null

      setTables((prev) =>
        prev.map((tbl) => {
          if (tbl.timerActive && tbl.countdownRemaining !== undefined && tbl.countdownRemaining > 0) {
            const nextRemaining = Math.max(0, tbl.countdownRemaining - secondsToDeduct)

            // Format human-readable waiting duration e.g. "04:32"
            const mins = Math.floor(nextRemaining / 60)
            const secs = nextRemaining % 60
            const formattedWait = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

            if (nextRemaining === 0) {
              hasCompletedCountdown = true
              zeroTableId = tbl.id
            }

            return {
              ...tbl,
              countdownRemaining: nextRemaining,
              waitingDuration: formattedWait,
            }
          }
          return tbl
        })
      )

      if (hasCompletedCountdown && zeroTableId) {
        handleCountdownZero(zeroTableId)
      }
    }, tickIntervalMs)

    return () => clearInterval(interval)
  }, [demoState, handleCountdownZero])

  // Update Waiter Availability Status
  const updateWaiterStatus = useCallback((waiterId: string, newStatus: WaiterStatus) => {
    setWaiters((prev) =>
      prev.map((w) => (w.id === waiterId ? { ...w, status: newStatus } : w))
    )
    setLastActivityMessage(`Waiter availability updated to ${newStatus.toUpperCase()}.`)
  }, [])

  // Reassign table allocations for a waiter with synchronized table & waiter state
  const reassignWaiterTables = useCallback(
    (waiterId: string, assignedTableNumbers: number[]) => {
      const assignedTableIds = assignedTableNumbers.map(
        (n) => `T-${String(n).padStart(2, '0')}`
      )

      setWaiters((prev) => {
        const targetWaiter = prev.find((w) => w.id === waiterId)
        const targetName = targetWaiter ? targetWaiter.name : 'Server'

        // Synchronize tables as well
        setTables((prevTables) =>
          prevTables.map((tbl) => {
            const num = parseInt(tbl.id.replace('T-', ''), 10)
            if (assignedTableNumbers.includes(num)) {
              return {
                ...tbl,
                assignedWaiterId: waiterId,
                assignedWaiterName: targetName,
              }
            } else if (tbl.assignedWaiterId === waiterId) {
              return {
                ...tbl,
                assignedWaiterId: '',
                assignedWaiterName: 'Unassigned',
              }
            }
            return tbl
          })
        )

        return prev.map((w) => {
          if (w.id === waiterId) {
            return {
              ...w,
              assignedTables: assignedTableNumbers,
              assignedTableIds,
            }
          }
          // Remove tables that were moved to target waiter
          const filteredNums = w.assignedTables.filter(
            (tNum) => !assignedTableNumbers.includes(tNum)
          )
          const filteredIds = (w.assignedTableIds || []).filter(
            (tId) => !assignedTableIds.includes(tId)
          )
          return {
            ...w,
            assignedTables: filteredNums,
            assignedTableIds: filteredIds,
          }
        })
      })

      setLastActivityMessage(
        `Floor coverage updated: ${assignedTableNumbers.length} tables allocated.`
      )
    },
    []
  )

  const acknowledgeAlert = useCallback((eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === eventId ? { ...evt, status: 'in_progress' } : evt))
    )
    setLastActivityMessage('Alert acknowledged by staff dispatch.')
  }, [])

  const resolveAlert = useCallback((eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === eventId ? { ...evt, status: 'resolved' } : evt))
    )
    setLastActivityMessage('Incident marked resolved.')
  }, [])

  // Centralized table status updater
  const updateTableStatus = useCallback((tableId: string, newStatus: TableStatus) => {
    setTables((prev) =>
      prev.map((tbl) => {
        if (tbl.id === tableId) {
          const isNowAvailable = newStatus === 'AVAILABLE' || newStatus === 'available'
          const isNowWaiting = newStatus === 'WAITING_FOR_WAITER' || newStatus === 'attention_needed'
          const isNowCompleted = newStatus === 'SERVICE_COMPLETED' || newStatus === 'dirty'

          const updatedChairs = tbl.chairs?.map((c) => ({
            ...c,
            occupied: isNowAvailable ? false : c.occupied,
          }))

          return {
            ...tbl,
            status: newStatus,
            guestCount: isNowAvailable ? 0 : tbl.guestCount || Math.min(tbl.capacity, 2),
            waitingDuration: isNowWaiting
              ? tbl.waitingDuration && tbl.waitingDuration !== 'None'
                ? tbl.waitingDuration
                : '5m 00s'
              : 'None',
            timerActive: isNowWaiting,
            countdownRemaining: isNowWaiting ? tbl.countdownRemaining || 300 : 0,
            chairs: updatedChairs,
            activeAlert: isNowAvailable || isNowCompleted ? undefined : tbl.activeAlert,
          }
        }
        return tbl
      })
    )
    setLastActivityMessage(`Table ${tableId} status updated to ${newStatus.replace(/_/g, ' ')}`)
  }, [])

  // Demo Control Handlers
  const startDemo = useCallback(() => {
    setDemoState('running')
    setLastActivityMessage('Simulation active: Timers and Vision streams running.')
  }, [])

  const pauseDemo = useCallback(() => {
    setDemoState('paused')
    setLastActivityMessage('Simulation paused. Floor telemetry static.')
  }, [])

  const resetDemo = useCallback(() => {
    setTables(initialTables)
    setWaiters(initialWaiters)
    setEvents(initialEvents)
    setCameras(mockCameras)
    setDemoState('idle')
    setLastActivityMessage('Demo reset: Initial 4-waiter baseline restored.')
  }, [])

  const triggerManualEvent = useCallback(() => {
    // Find an available table to seat a customer, or default to T-02
    const avail = tables.find((t) => t.status === 'AVAILABLE' || t.status === 'available')
    const targetTableId = avail ? avail.id : 'T-02'
    detectCustomerAtTable(targetTableId, 2)
  }, [tables, detectCustomerAtTable])

  return {
    tables,
    waiters,
    events,
    cameras,
    demoMode,
    setDemoMode,
    demoState,
    simulationSpeed,
    setSimulationSpeed,
    startDemo,
    pauseDemo,
    resetDemo,
    triggerManualEvent,
    detectCustomerAtTable,
    acceptAssignment,
    startService,
    updateWaiterStatus,
    reassignWaiterTables,
    lastActivityMessage,
    totalTables,
    availableTables,
    occupiedTables,
    waitingForWaiter,
    availableWaiters,
    avgResponseTimeSec,
    activeAlertsCount,
    unreadNotificationsCount,
    acknowledgeAlert,
    resolveAlert,
    updateTableStatus,
  }
}
