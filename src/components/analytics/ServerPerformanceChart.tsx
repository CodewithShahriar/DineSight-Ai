import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription } from '../shared/Card'
import { Award } from 'lucide-react'

interface ServerMetric {
  name: string
  response: number
  tables: number
  rating: number
}

interface ServerPerformanceChartProps {
  data: ServerMetric[]
}

export const ServerPerformanceChart: React.FC<ServerPerformanceChartProps> = ({ data }) => {
  return (
    <Card className="bg-white border-warm-200 shadow-subtle">
      <CardHeader>
        <CardTitle className="flex items-center text-base font-bold text-charcoal-900">
          <Award className="w-4 h-4 mr-2 text-forest-700" />
          Server Alert Response SLA (Seconds)
        </CardTitle>
        <CardDescription>
          Average seconds elapsed from AI gesture/bottle trigger until physical server arrival
        </CardDescription>
      </CardHeader>
      <div className="p-4 sm:p-6 pt-0">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ebe1" />
              <XAxis
                dataKey="name"
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
              <Bar
                dataKey="response"
                name="Avg Response Time (s)"
                fill="#1b4d37"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}

