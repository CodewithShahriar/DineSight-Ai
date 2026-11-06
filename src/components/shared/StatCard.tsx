import React from 'react'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { Card } from './Card'
import { cn } from '../../utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  isPositive?: boolean
  description?: string
  icon: React.ReactNode
  iconBg?: string
  highlight?: boolean
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  isPositive = true,
  description,
  icon,
  iconBg = 'bg-forest-50 text-forest-700 border-forest-200/50',
  highlight = false,
}) => {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-200 hover:shadow-card hover:-translate-y-0.5 p-3.5 sm:p-5',
        highlight && 'border-amber-300/80 bg-gradient-to-br from-amber-50/40 via-white to-white'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-charcoal-500 truncate">
            {title}
          </p>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-charcoal-900 font-display">
              {value}
            </span>
          </div>
        </div>

        <div
          className={cn(
            'flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl border shrink-0',
            iconBg
          )}
        >
          {icon}
        </div>
      </div>

      {(change || description) && (
        <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-warm-100 text-xs">
          {change && (
            <div
              className={cn(
                'inline-flex items-center font-bold px-1.5 py-0.5 rounded text-[11px]',
                isPositive
                  ? 'text-forest-700 bg-forest-50'
                  : 'text-rose-700 bg-rose-50'
              )}
            >
              {trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
              {trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
              {trend === 'neutral' && <Minus className="w-3 h-3 mr-0.5" />}
              <span>{change}</span>
            </div>
          )}

          {description && (
            <span className="text-charcoal-400 text-[11px] truncate ml-auto">
              {description}
            </span>
          )}
        </div>
      )}
    </Card>
  )
}
