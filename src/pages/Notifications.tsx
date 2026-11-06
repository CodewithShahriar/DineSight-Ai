import React, { useState } from 'react'
import { Check, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '../components/shared/PageHeader'
import { Button } from '../components/shared/Button'
import { Badge } from '../components/shared/Badge'
import { Card } from '../components/shared/Card'
import { NotificationFilterBar } from '../components/notifications/NotificationFilterBar'
import { NotificationItem } from '../components/notifications/NotificationItem'
import { NotificationStats } from '../components/notifications/NotificationStats'
import { useRestaurantData } from '../hooks/useRestaurantData'

export const Notifications: React.FC = () => {
  const { events, acknowledgeAlert, resolveAlert } = useRestaurantData()
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'in_progress' | 'resolved'>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')

  const filteredEvents = events.filter((evt) => {
    const matchesStatus =
      statusFilter === 'all' ? true : evt.status === statusFilter
    const matchesSeverity =
      severityFilter === 'all' ? true : evt.severity === severityFilter
    return matchesStatus && matchesSeverity
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incident & Alert Dispatch Log"
        subtitle="Chronological log of computer-vision hospitality triggers, waiter assignments, and resolution statuses."
        badge={
          <Badge variant="amber" dot>
            {events.filter((e) => e.status !== 'resolved').length} Open Incidents
          </Badge>
        }
        actions={
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Check className="w-3.5 h-3.5 text-forest-700" />}
              onClick={() => {
                events.forEach((e) => resolveAlert(e.id))
              }}
            >
              Resolve All
            </Button>
          </div>
        }
      />

      {/* Metric summary counters */}
      <NotificationStats events={events} />

      {/* Filter Toolbar */}
      <NotificationFilterBar
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        severityFilter={severityFilter}
        onSeverityChange={setSeverityFilter}
        activeCount={events.filter((e) => e.status !== 'resolved').length}
      />

      {/* Incidents List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <Card className="p-8 text-center text-charcoal-500 bg-white">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-charcoal-800">
              No matching incidents in this view
            </p>
            <p className="text-xs text-charcoal-500 mt-1">
              All tables in this filter criteria are operating smoothly within target hospitality thresholds.
            </p>
          </Card>
        ) : (
          filteredEvents.map((evt) => (
            <NotificationItem
              key={evt.id}
              event={evt}
              onAcknowledge={acknowledgeAlert}
              onResolve={resolveAlert}
            />
          ))
        )}
      </div>
    </div>
  )
}
