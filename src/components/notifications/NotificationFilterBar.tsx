import React from 'react'
import { Card } from '../shared/Card'

interface NotificationFilterBarProps {
  statusFilter: 'all' | 'active' | 'in_progress' | 'resolved'
  onStatusChange: (status: 'all' | 'active' | 'in_progress' | 'resolved') => void
  severityFilter: string
  onSeverityChange: (severity: string) => void
  activeCount: number
}

export const NotificationFilterBar: React.FC<NotificationFilterBarProps> = ({
  statusFilter,
  onStatusChange,
  severityFilter,
  onSeverityChange,
}) => {
  const tabs = [
    { id: 'all', label: 'All Incidents' },
    { id: 'active', label: 'Active Alerts' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'resolved', label: 'Resolved' },
  ] as const

  return (
    <Card className="p-4 bg-white border-warm-200 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onStatusChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                statusFilter === tab.id
                  ? 'bg-forest-700 text-white shadow-xs'
                  : 'bg-warm-100 text-charcoal-700 hover:bg-warm-150'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Severity Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-charcoal-500">Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => onSeverityChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-warm-100 border border-warm-200 text-xs font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-600/30"
          >
            <option value="all">All Severities</option>
            <option value="high">High & Critical Only</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
    </Card>
  )
}

