import React from 'react'
import { cn } from '../../utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-warm-200/90 bg-white p-5 shadow-card transition-all hover:border-warm-300/80',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('flex items-center justify-between pb-3 mb-4 border-b border-warm-100', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h3
      className={cn('text-sm font-bold tracking-tight text-charcoal-900', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <p className={cn('text-xs text-charcoal-500 font-medium', className)} {...props}>
      {children}
    </p>
  )
}
