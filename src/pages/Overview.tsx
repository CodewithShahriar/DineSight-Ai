import React from 'react'
import {
  LayoutGrid,
  CheckCircle2,
  Users,
  AlertTriangle,
  UserCheck,
  Clock,
  Cctv,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/shared/PageHeader'
import { StatCard } from '../components/shared/StatCard'
import { Button } from '../components/shared/Button'
import { Badge } from '../components/shared/Badge'
import { Card, CardHeader, CardTitle, CardDescription } from '../components/shared/Card'
import { DemoControlPanel } from '../components/dashboard/DemoControlPanel'
import { CustomerWaitTimeChart } from '../components/dashboard/CustomerWaitTimeChart'
import { OperationsSummary } from '../components/dashboard/OperationsSummary'
import { LiveActivityFeed } from '../components/dashboard/LiveActivityFeed'
import { TurnoverOverview } from '../components/dashboard/TurnoverOverview'
import { WaiterEfficiencyLeaderboard } from '../components/dashboard/WaiterEfficiencyLeaderboard'
import { useRestaurantData } from '../hooks/useRestaurantData'

export const Overview: React.FC = () => {
  const {
    tables,
    waiters,
    events,
    cameras,
    demoState,
    startDemo,
    pauseDemo,
    resetDemo,
    triggerManualEvent,
    lastActivityMessage,
    // The exact 6 KPIs requested
    totalTables,
    availableTables,
    occupiedTables,
    waitingForWaiter,
    availableWaiters,
    avgResponseTimeSec,
    acknowledgeAlert,
    resolveAlert,
  } = useRestaurantData()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manager Operations Dashboard"
        subtitle="Executive command center monitoring table capacity, staff SLA compliance, computer-vision gesture alerts, and floor turnaround velocity."
        badge={
          <Badge variant="forest" dot>
            Live Lunch Shift
          </Badge>
        }
        actions={
          <div className="flex items-center space-x-2">
            <Link to="/monitoring">
              <Button
                variant="outline"
                size="sm"
                icon={<Cctv className="w-4 h-4 text-forest-700" />}
              >
                CCTV Feeds
              </Button>
            </Link>
            <Link to="/floor-plan">
              <Button
                variant="primary"
                size="sm"
                icon={<Sparkles className="w-4 h-4 text-forest-200" />}
              >
                Interactive Floor
              </Button>
            </Link>
          </div>
        }
      />

      {/* Demo Control Panel with Start Demo, Pause Demo, Reset Demo */}
      <DemoControlPanel
        demoState={demoState}
        onStart={startDemo}
        onPause={pauseDemo}
        onReset={resetDemo}
        onTriggerEvent={triggerManualEvent}
        lastMessage={lastActivityMessage}
      />

      {/* The 6 Required KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* 1. Total Tables */}
        <StatCard
          title="Total Tables"
          value={totalTables}
          change="4 Zones"
          trend="neutral"
          isPositive={true}
          description="56 Total Seats"
          icon={<LayoutGrid className="w-4 h-4" />}
          iconBg="bg-charcoal-100 text-charcoal-800 border-charcoal-200"
        />

        {/* 2. Available Tables */}
        <StatCard
          title="Available Tables"
          value={availableTables}
          change="Ready to Seat"
          trend="up"
          isPositive={true}
          description="Walk-ins Welcome"
          icon={<CheckCircle2 className="w-4 h-4" />}
          iconBg="bg-emerald-50 text-emerald-800 border-emerald-200"
        />

        {/* 3. Occupied Tables */}
        <StatCard
          title="Occupied Tables"
          value={occupiedTables}
          change="54% Seated"
          trend="up"
          isPositive={true}
          description="Active Dining Parties"
          icon={<Users className="w-4 h-4" />}
          iconBg="bg-forest-50 text-forest-800 border-forest-200"
        />

        {/* 4. Waiting for Waiter */}
        <StatCard
          title="Waiting for Waiter"
          value={waitingForWaiter}
          change="Action Required"
          trend="down"
          isPositive={false}
          description="Gestures & Delays"
          icon={<AlertTriangle className="w-4 h-4" />}
          iconBg="bg-amber-100 text-amber-900 border-amber-300"
          highlight={waitingForWaiter > 0}
        />

        {/* 5. Available Waiters */}
        <StatCard
          title="Available Waiters"
          value={`${availableWaiters} / ${waiters.length}`}
          change="On Active Duty"
          trend="up"
          isPositive={true}
          description="Full Floor Coverage"
          icon={<UserCheck className="w-4 h-4" />}
          iconBg="bg-sky-50 text-sky-800 border-sky-200"
        />

        {/* 6. Average Service Response Time */}
        <StatCard
          title="Avg Service Response Time"
          value={`${avgResponseTimeSec}s`}
          change="-18s vs SLA"
          trend="down"
          isPositive={true}
          description="Target: < 90s"
          icon={<Clock className="w-4 h-4" />}
          iconBg="bg-forest-50 text-forest-800 border-forest-200"
        />
      </div>

      {/* Main Operational Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Analytics Chart & Operations Summary */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Waiting Time Analytics Chart */}
          <CustomerWaitTimeChart />

          {/* Restaurant Operations Summary */}
          <OperationsSummary tables={tables} waiters={waiters} />

          {/* Table Capacity & Health Breakdown */}
          <TurnoverOverview tables={tables} />
        </div>

        {/* Right Column (5 cols): Restaurant Live Activity & Waiter Leaderboard */}
        <div className="lg:col-span-5 space-y-6">
          {/* Restaurant Live Activity Section */}
          <LiveActivityFeed
            events={events}
            onAcknowledge={acknowledgeAlert}
            onResolve={resolveAlert}
          />

          {/* Staff Efficiency Leaderboard */}
          <WaiterEfficiencyLeaderboard waiters={waiters} />
        </div>
      </div>

      {/* Vision Sensor Hardware Status Banner */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Cctv className="w-4 h-4 text-forest-700 shrink-0" />
            <div>
              <CardTitle>Surveillance Telemetry & Hardware Nodes</CardTitle>
              <CardDescription>
                Edge AI Vision inference running across {cameras.length} synchronous video feeds
              </CardDescription>
            </div>
          </div>
          <Link
            to="/monitoring"
            className="text-xs font-semibold text-forest-700 hover:text-forest-900 inline-flex items-center shrink-0 self-start sm:self-auto"
          >
            Open CCTV Matrix Wall <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </Link>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cameras.map((cam) => (
            <div
              key={cam.id}
              className="p-3 rounded-xl bg-charcoal-900 text-white border border-charcoal-800 relative overflow-hidden group hover:border-forest-600 transition-all min-w-0"
            >
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="font-mono text-charcoal-300 font-semibold">{cam.id}</span>
                <span className="inline-flex items-center text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                  {cam.status}
                </span>
              </div>

              <div className="h-24 rounded-lg bg-charcoal-950 border border-charcoal-800/80 flex flex-col justify-between p-2.5 relative">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-charcoal-400 font-mono">{cam.streamQuality}</span>
                  <span className="text-[10px] text-forest-400 font-mono">{cam.latencyMs}ms</span>
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-white tracking-wide truncate block">{cam.zone}</span>
                  <p className="text-[10px] text-charcoal-400 mt-0.5 font-mono">
                    {cam.detections ? cam.detections.length : cam.currentDetections} Tracked Objects
                  </p>
                </div>
                <div className="text-[9px] text-charcoal-500 font-mono text-right">
                  AI BBOX: ACTIVE
                </div>
              </div>

              <div className="mt-2 text-[11px] text-charcoal-400 truncate">
                Last: <span className="text-charcoal-200">{cam.lastIncident}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
