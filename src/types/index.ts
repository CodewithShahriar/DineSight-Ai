export type TableStatus = 
  | 'AVAILABLE' 
  | 'OCCUPIED' 
  | 'WAITING_FOR_WAITER' 
  | 'WAITER_ASSIGNED' 
  | 'SERVING' 
  | 'SERVICE_COMPLETED'
  // Backward compatibility alias support
  | 'available'
  | 'occupied'
  | 'attention_needed'
  | 'dirty'
  | 'reserved'

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical'

export type AlertType = 
  | 'hand_wave' 
  | 'empty_glasses' 
  | 'delayed_order' 
  | 'spill' 
  | 'check_requested' 
  | 'table_dirty'
  | 'long_wait'

export interface TableAlert {
  id: string
  type: AlertType
  severity: AlertSeverity
  message: string
  detectedAt: string
  confidence: number
}

export interface ServiceTimelineEvent {
  id: string
  time: string
  title: string
  description?: string
  status: 'completed' | 'current' | 'pending'
  actor?: string
}

export interface TableChair {
  id: string
  side: 'top' | 'bottom' | 'left' | 'right'
  occupied: boolean
}

export interface RestaurantTable {
  id: string // 'T-01' to 'T-12'
  number: number // 1 to 12
  zone: 'Main Dining' | 'Veranda Patio' | 'Bar Lounge' | 'Private Dining'
  capacity: number
  status: TableStatus
  assignedWaiterId: string
  assignedWaiterName: string
  assignedWaiterAvatar?: string
  assignedWaiterRole?: string
  guestCount: number
  timeSeated?: string
  elapsedMinutes?: number
  waitingDuration?: string
  currentBill?: number
  activeAlert?: TableAlert
  cctvCameraId: string
  shape: 'round' | 'rect' | 'booth'
  coordinates: { x: number; y: number } // % positioning on floor
  chairs?: TableChair[]
  timeline?: ServiceTimelineEvent[]
  // 5-minute customer waiting timer & assignment session state
  countdownRemaining?: number // In seconds (e.g. 300)
  countdownTotal?: number // Total (300s)
  timerActive?: boolean
  isQueued?: boolean // True if countdown reached zero but no waiter was available
  assignmentAccepted?: boolean // True once assigned waiter accepts
  sessionId?: string
}

export type WaiterStatus = 'active' | 'busy' | 'on_break' | 'off_duty'

export interface WaiterPersonalDetails {
  email: string
  joinedDate: string // e.g. 'March 15, 2023'
  tenure: string // e.g. '3 Years, 8 Months'
  emergencyContact: {
    name: string
    relation: string
    phone: string
  }
  bloodGroup: string // e.g. 'O+ Positive'
  dateOfBirth?: string // e.g. 'June 14, 1994 (30 yrs)'
  address: string
  workPermitStatus: string // e.g. 'Verified • Full Right to Work'
  contractType: string // e.g. 'Full-Time Permanent (40h/wk)'
  taxId: string // e.g. 'GB-NI-892401-A'
  languages: string[]
  certifications: string[]
  tipsEarnedToday: number
  lifetimeTablesServed: number
  satisfactionRate: number // e.g. 99.2 (%)
  supervisorNotes?: string
  badges?: string[]
}

export interface Waiter {
  id: string
  employeeId: string // e.g. 'EMP-101'
  name: string
  role: string
  avatar: string
  zone: string
  status: WaiterStatus
  assignedTables: number[] // Backward compat numbers e.g. [1, 2]
  assignedTableIds?: string[] // Exact table IDs e.g. ['T-01', 'T-02']
  pendingAssignments?: string[] // Table IDs awaiting waiter acceptance
  activeTickets: number
  avgResponseTimeSec: number
  rating: number
  tablesServedToday: number
  shift: string
  complianceRate: number
  phone: string
  details?: WaiterPersonalDetails
}

export type SimulationSpeed = 1 | 10 | 60

export type DetectionCategory = 'person' | 'customer' | 'table' | 'waiter' | 'occupancy' | 'alert'

export interface DetectionBox {
  id: string
  category: DetectionCategory
  label: string
  subLabel?: string
  confidence?: number // 0.0 - 1.0
  status?: string
  x: number // left %
  y: number // top %
  width: number // %
  height: number // %
  color?: 'forest' | 'amber' | 'emerald' | 'blue' | 'rose'
}

export interface CCTVFeed {
  id: string
  name: string
  zone: string
  status: 'online' | 'degraded' | 'offline'
  streamQuality: '1080p 60fps' | '4K 30fps'
  latencyMs: number
  aiTrackingEnabled: boolean
  currentDetections: number
  thumbnailPlaceholderColor: string
  lastIncident?: string
  imageUrl: string
  detections: DetectionBox[]
}

export interface OperationsEvent {
  id: string
  timestamp: string
  tableNumber: number
  zone: string
  type: AlertType
  title: string
  description: string
  severity: AlertSeverity
  status: 'active' | 'in_progress' | 'resolved'
  assignedWaiter: string
  aiConfidence: number
  cameraId: string
}

export interface MetricSummary {
  label: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'neutral'
  isPositive: boolean
  description: string
}

export type MenuCategory =
  | 'Starters'
  | 'Steaks & Grills'
  | 'Mains'
  | 'Sides'
  | 'Desserts'
  | 'Beverages & Wine'

export type KitchenStation = 'Grill' | 'Saute' | 'Cold Pantry' | 'Pastry' | 'Bar'

export interface MenuItem {
  id: string
  name: string
  category: MenuCategory
  price: number
  is86: boolean // true = 86'd / Sold out, false = In stock
  stockRemaining?: number // portions remaining (if tracked)
  station: KitchenStation
  description: string
  dietary?: string[]
}

export interface OrderItem {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
  notes?: string
  orderedAt: string
  status: 'ordered' | 'in_kitchen' | 'served'
}

export interface TableOrder {
  id: string
  tableId: string
  tableNumber: number
  zone: string
  waiterId: string
  waiterName: string
  waiterAvatar?: string
  guestCount: number
  openedAt: string
  items: OrderItem[]
  status: 'active' | 'billing' | 'paid'
}
