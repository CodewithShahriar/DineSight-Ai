import React from 'react'
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Clock, TrendingDown, Sparkles, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '../shared/Card'
import { Badge } from '../shared/Badge'

const waitTimeData = [
  { time: '11:00 AM', aiWaitMin: 1.1, benchmarkWaitMin: 3.4, guests: 14 },
  { time: '11:30 AM', aiWaitMin: 1.3, benchmarkWaitMin: 3.8, guests: 22 },
  { time: '12:00 PM', aiWaitMin: 1.4, benchmarkWaitMin: 4.2, guests: 48 },
  { time: '12:30 PM', aiWaitMin: 1.8, benchmarkWaitMin: 4.9, guests: 62 },
  { time: '01:00 PM', aiWaitMin: 1.5, benchmarkWaitMin: 4.5, guests: 58 },
  { time: '01:30 PM', aiWaitMin: 1.3, benchmarkWaitMin: 3.9, guests: 38 },
  { time: '02:00 PM', aiWaitMin: 1.2, benchmarkWaitMin: 3.5, guests: 24 },
]

export const CustomerWaitTimeChart: React.FC = () => {
  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader>
          <div>
            <div className="flex items-center space-x-2">
              <CardTitle>Average Customer Waiting Time</CardTitle>
              <span className="flex items-center text-[10px] font-bold text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
                <TrendingDown className="w-3 h-3 mr-1" />
                -63% Lower Wait
              </span>
            </div>
            <CardDescription>
              Time elapsed from customer gesture or need identification to server table-side arrival
            </CardDescription>
          </div>
          <Badge variant="forest" dot>
            SLA Met: 98.4%
          </Badge>
        </CardHeader>

        {/* Top Summary Stat Pills */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="p-2.5 rounded-lg bg-warm-100/70 border border-warm-200/60">
            <span className="text-[10px] text-charcoal-500 font-medium block">Current Avg Wait</span>
            <span className="text-lg font-extrabold text-charcoal-900 font-mono">1m 24s</span>
            <span className="text-[10px] text-emerald-700 font-semibold block">-2m 36s vs benchmark</span>
          </div>

          <div className="p-2.5 rounded-lg bg-warm-100/70 border border-warm-200/60">
            <span className="text-[10px] text-charcoal-500 font-medium block">Peak Lunch Wait</span>
            <span className="text-lg font-extrabold text-charcoal-900 font-mono">1m 48s</span>
            <span className="text-[10px] text-charcoal-500 font-medium block">At 12:30 PM Rush</span>
          </div>

          <div className="p-2.5 rounded-lg bg-warm-100/70 border border-warm-200/60">
            <span className="text-[10px] text-charcoal-500 font-medium block">SLA Threshold</span>
            <span className="text-lg font-extrabold text-amber-800 font-mono">&lt; 2m 00s</span>
            <span className="text-[10px] text-forest-700 font-semibold block">Fully Compliant</span>
          </div>
        </div>

        {/* Visual Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={waitTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="aiWaitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1b4d37" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#1b4d37" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="benchmarkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b45309" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#b45309" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ede8df" vertical={false} />
              <XAxis dataKey="time" stroke="#7e93a0" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#7e93a0"
                fontSize={11}
                tickLine={false}
                unit="m"
                domain={[0, 6]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111618',
                  borderColor: '#26333a',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: any, name: any) => [
                  `${val} mins`,
                  name === 'aiWaitMin' ? 'DineSight AI Active' : 'Traditional Restaurant Benchmark',
                ]}
              />
              <Area
                type="monotone"
                dataKey="benchmarkWaitMin"
                name="Traditional Benchmark"
                stroke="#d97706"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#benchmarkGrad)"
              />
              <Area
                type="monotone"
                dataKey="aiWaitMin"
                name="DineSight AI Wait Time"
                stroke="#1b4d37"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#aiWaitGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pt-3 border-t border-warm-100 flex items-center justify-between text-xs text-charcoal-500">
        <span className="flex items-center text-charcoal-700">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          Real-time vision dispatch delivers average response within <strong>84 seconds</strong>.
        </span>
        <span className="font-mono text-emerald-800 font-bold hidden sm:inline">
          Continuous In-Service Telemetry
        </span>
      </div>
    </Card>
  )
}

