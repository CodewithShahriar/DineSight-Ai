import React from 'react'
import { cn } from '../../utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'forest' | 'amber' | 'slate' | 'rose' | 'sky' | 'neutral'
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  dot = false,
  ...props
}) => {
  const variants = {
    forest: 'bg-forest-50 text-forest-800 border-forest-200/80',
    amber: 'bg-amber-50 text-amber-900 border-amber-300',
    slate: 'bg-charcoal-100 text-charcoal-800 border-charcoal-200',
    rose: 'bg-rose-50 text-rose-800 border-rose-200',
    sky: 'bg-sky-50 text-sky-800 border-sky-200',
    neutral: 'bg-warm-150 text-charcoal-700 border-warm-200',
  }

  const dotColors = {
    forest: 'bg-forest-600',
    amber: 'bg-amber-500 animate-pulse',
    slate: 'bg-charcoal-500',
    rose: 'bg-rose-500 animate-pulse',
    sky: 'bg-sky-500',
    neutral: 'bg-charcoal-400',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border tracking-wide uppercase font-mono',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5 shrink-0', dotColors[variant])} />}
      {children}
    </span>
  )
}
