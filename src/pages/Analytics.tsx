import React, { useState } from 'react'
import {
  Clock,
  DollarSign,
  Download,
  Calendar,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { PageHeader } from '../components/shared/PageHeader'
import { Button } from '../components/shared/Button'
import { Badge } from '../components/shared/Badge'
import { StatCard } from '../components/shared/StatCard'
import { TurnoverVelocityChart } from '../components/analytics/TurnoverVelocityChart'
import { AlertDistributionChart } from '../components/analytics/AlertDistributionChart'
import { ServerPerformanceChart } from '../components/analytics/ServerPerformanceChart'

const hourlyData = [
  { time: '11:00 AM', guests: 14, responseSec: 110, revenue: 380 },
  { time: '11:30 AM', guests: 22, responseSec: 95, revenue: 540 },
  { time: '12:00 PM', guests: 48, responseSec: 84, revenue: 1240 },
  { time: '12:30 PM', guests: 62, responseSec: 78, revenue: 1980 },
  { time: '01:00 PM', guests: 58, responseSec: 82, revenue: 1750 },
  { time: '01:30 PM', guests: 38, responseSec: 88, revenue: 980 },
  { time: '02:00 PM', guests: 24, responseSec: 92, revenue: 620 },
]

const alertCategories = [
  { name: 'Hand Wave Gestures', count: 42, color: '#1b4d37' },
  { name: 'Empty Glassware Alerts', count: 28, color: '#f59e0b' },
  { name: 'KDS Order Delay Threshold', count: 18, color: '#e11d48' },
  { name: 'Bussing Prompt Needed', count: 31, color: '#0284c7' },
  { name: 'Check / Bill Requested', count: 25, color: '#8b5cf6' },
]

const serverComparison = [
  { name: 'Elena R.', response: 84, tables: 18, rating: 4.9 },
  { name: 'Marcus V.', response: 96, tables: 15, rating: 4.8 },
  { name: 'Sofia C.', response: 72, tables: 12, rating: 4.95 },
  { name: 'Liam O.', response: 135, tables: 14, rating: 4.6 },
  { name: 'Amara D.', response: 110, tables: 21, rating: 4.85 },
]

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Today (Lunch)')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service & Velocity Analytics"
        subtitle="Executive operational intelligence measuring guest wait-reduction, turnover acceleration, and staff response SLAs."
        badge={
          <Badge variant="forest" dot>
            Reporting Period: Real-Time
          </Badge>
        }
        actions={
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-warm-100 border border-warm-200 text-xs font-semibold text-charcoal-700">
              <Calendar className="w-3.5 h-3.5 text-forest-700" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent border-none text-xs font-semibold text-charcoal-800 focus:outline-none cursor-pointer"
              >
                <option value="Today (Lunch)">Today (Lunch Shift)</option>
                <option value="Yesterday (Dinner)">Yesterday (Dinner Rush)</option>
                <option value="Last 7 Days">Last 7 Days Average</option>
              </select>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={() => alert(`Exporting report for ${timeRange}...`)}
            >
              Export Report
            </Button>
          </div>
        }
      />

      {/* Top Level Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Turnover Acceleration"
          value="52 mins"
          change="-16 mins"
          trend="down"
          isPositive={true}
          description="vs 68m without DineSight"
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-forest-50 text-forest-800 border-forest-200"
        />

        <StatCard
          title="Daily Revenue Velocity"
          value="$7,490"
          change="+18.4%"
          trend="up"
          isPositive={true}
          description="Projected +$1,180 from extra turns"
          icon={<DollarSign className="w-5 h-5" />}
          iconBg="bg-forest-50 text-forest-800 border-forest-200"
        />

        <StatCard
          title="Average Alert SLA"
          value="89 sec"
          change="-42 sec"
          trend="down"
          isPositive={true}
          description="Prompt server attention speed"
          icon={<Sparkles className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-800 border-amber-200"
        />

        <StatCard
          title="Bussing Turn Speed"
          value="3.8 mins"
          change="-5.2 mins"
          trend="down"
          isPositive={true}
          description="Dirty table to re-seated"
          icon={<TrendingUp className="w-5 h-5" />}
          iconBg="bg-forest-50 text-forest-800 border-forest-200"
        />
      </div>

      {/* Primary Volume & Velocity Chart */}
      <TurnoverVelocityChart data={hourlyData} />

      {/* Secondary Metrics: Alert Breakdown and Server Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertDistributionChart categories={alertCategories} />
        <ServerPerformanceChart data={serverComparison} />
      </div>
    </div>
  )
}
