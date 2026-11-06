import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription } from '../shared/Card'
import { Badge } from '../shared/Badge'
import { TrendingUp } from 'lucide-react'

interface HourlyTurnoverPoint {
  time: string
  guests: number
  responseSec: number
  revenue: number
}

interface TurnoverVelocityChartProps {
  data: HourlyTurnoverPoint[]
}

export const TurnoverVelocityChart: React.FC<TurnoverVelocityChartProps> = ({ data }) => {
  return (
    <Card className="bg-white border-warm-200 shadow-subtle">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="flex items-center text-base font-bold text-charcoal-900">
              <TrendingUp className="w-4 h-4 mr-2 text-forest-700" />
              Hourly Guest Volume & Revenue Velocity
            </CardTitle>
            <CardDescription>
              Correlation between seated diner volume and concurrent gross billing velocity
            </CardDescription>
          </div>
          <Badge variant="forest">Peak Lunch Rush 12:30 PM</Badge>
        </div>
      </CardHeader>
      <div className="p-4 sm:p-6 pt-0">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1b4d37" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1b4d37" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="guestsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ebe1" />
              <XAxis
                dataKey="time"
                stroke="#7e93a0"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#7e93a0"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111618',
                  borderRadius: '0.75rem',
                  border: '1px solid #26333a',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue ($)"
                stroke="#1b4d37"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGrad)"
              />
              <Area
                type="monotone"
                dataKey="guests"
                name="Guests Seated"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#guestsGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}

