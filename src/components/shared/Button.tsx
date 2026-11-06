import React from 'react'
import { cn } from '../../utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'amber' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-forest-600/30 disabled:opacity-50 disabled:pointer-events-none select-none'

  const variants = {
    primary:
      'bg-forest-700 text-white hover:bg-forest-800 shadow-sm border border-forest-800 active:bg-forest-900',
    secondary:
      'bg-warm-150 text-charcoal-800 hover:bg-warm-200 border border-warm-200 shadow-xs',
    outline:
      'bg-transparent text-charcoal-700 hover:bg-warm-100 border border-warm-300 hover:border-warm-400',
    amber:
      'bg-amber-600 text-white hover:bg-amber-700 shadow-sm border border-amber-700',
    ghost:
      'bg-transparent text-charcoal-600 hover:bg-warm-100 hover:text-charcoal-900',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 shadow-sm border border-rose-700',
  }

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  )
}
