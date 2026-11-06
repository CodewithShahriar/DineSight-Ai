import React from 'react'

interface PageHeaderProps {
  title: string
  subtitle: string
  badge?: React.ReactNode
  actions?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-warm-200/80">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-charcoal-900 font-display">
            {title}
          </h1>
          {badge}
        </div>
        <p className="mt-1 text-xs sm:text-sm text-charcoal-500 font-medium max-w-2xl">
          {subtitle}
        </p>
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}
