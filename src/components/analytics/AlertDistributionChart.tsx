import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription } from '../shared/Card'
import { Sparkles } from 'lucide-react'

interface AlertCategory {
  name: string
  count: number
  color: string
}

interface AlertDistributionChartProps {
  categories: AlertCategory[]
}

export const AlertDistributionChart: React.FC<AlertDistributionChartProps> = ({ categories }) => {
  const totalAlerts = categories.reduce((acc, c) => acc + c.count, 0)

  return (
    <Card className="bg-white border-warm-200 shadow-subtle">
      <CardHeader>
        <CardTitle className="flex items-center text-base font-bold text-charcoal-900">
          <Sparkles className="w-4 h-4 mr-2 text-forest-700" />
          AI Event Classification Breakdown
        </CardTitle>
        <CardDescription>
          Distribution of visual triggers automatically surfaced by neural cameras
        </CardDescription>
      </CardHeader>
      <div className="p-4 sm:p-6 pt-0">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="h-48 w-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111618',
                    borderRadius: '0.75rem',
                    border: '1px solid #26333a',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 w-full space-y-2">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-charcoal-700 font-medium truncate">{cat.name}</span>
                </div>
                <div className="flex items-center space-x-2 shrink-0 font-mono">
                  <span className="font-bold text-charcoal-900">{cat.count}</span>
                  <span className="text-charcoal-400 text-[11px]">
                    ({Math.round((cat.count / totalAlerts) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

