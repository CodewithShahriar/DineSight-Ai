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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-warm-200/80">
      <div>
        <div className="flex items-center space-x-3">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-charcoal-900 font-display">
            {title}
          </h1>
          {badge}
        </div>
        <p className="mt-1 text-xs sm:text-sm text-charcoal-500 font-medium max-w-2xl">
          {subtitle}
        </p>
      </div>

      {actions && (
        <div className="flex items-center space-x-2.5 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}
