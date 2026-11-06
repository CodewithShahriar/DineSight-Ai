import React, { useState } from 'react'
import {
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { PageHeader } from '../components/shared/PageHeader'
import { Button } from '../components/shared/Button'
import { Badge } from '../components/shared/Badge'
import { Card } from '../components/shared/Card'
import { CameraFeed } from '../components/monitoring/CameraFeed'
import { useRestaurantData } from '../hooks/useRestaurantData'

export const LiveMonitoring: React.FC = () => {
  const { cameras, events } = useRestaurantData()
  const [selectedCameraFilter, setSelectedCameraFilter] = useState<string>('all')
  const [expandedFeedId, setExpandedFeedId] = useState<string | null>(null)
  const [globalOverlayState, setGlobalOverlayState] = useState<boolean>(true)

  // Filter cameras if user selects a single camera tab
  const displayedCameras =
    selectedCameraFilter === 'all'
      ? cameras
      : cameras.filter((c) => c.id === selectedCameraFilter)

  // Total active detections across all cameras
  const totalDetections = cameras.reduce(
    (acc, c) => acc + (c.detections ? c.detections.length : c.currentDetections),
    0
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live CCTV & Vision AI Matrix"
        subtitle="Real-time multi-angle restaurant surveillance synchronized with simulated computer vision object tracking, gesture flags, and customer dwell time monitoring."
        badge={
          <Badge variant="amber" dot>
            4 Feeds Active • 1080p/4K
          </Badge>
        }
        actions={
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon={
                globalOverlayState ? (
                  <EyeOff className="w-3.5 h-3.5 text-charcoal-600" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-forest-700" />
                )
              }
              onClick={() => setGlobalOverlayState(!globalOverlayState)}
            >
              {globalOverlayState ? 'Hide All Overlays' : 'Show All Overlays'}
            </Button>
          </div>
        }
      />

      {/* Global Monitoring Controls & Layout Selector */}
      <Card className="p-4 bg-white border-warm-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Camera View Switcher Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => {
                setSelectedCameraFilter('all')
                setExpandedFeedId(null)
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCameraFilter === 'all'
                  ? 'bg-forest-700 text-white shadow-xs'
                  : 'bg-warm-100 text-charcoal-700 hover:bg-warm-200'
              }`}
            >
              Quad Grid View (All 4)
            </button>

            {cameras.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCameraFilter(c.id)
                  setExpandedFeedId(null)
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCameraFilter === c.id
                    ? 'bg-forest-700 text-white shadow-xs'
                    : 'bg-warm-100 text-charcoal-700 hover:bg-warm-200'
                }`}
              >
                {c.name.split('—')[0].trim()}
              </button>
            ))}
          </div>

          {/* Vision Inference Diagnostics telemetry */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-forest-50 border border-forest-200 text-forest-800 font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-forest-600" />
              <span>AI VISION — SIMULATED</span>
            </div>

            <div className="flex items-center space-x-1 text-charcoal-600 font-mono text-[11px]">
              <span>TRACKED ENTITIES:</span>
              <strong className="text-charcoal-900 font-bold">{totalDetections} Objects</strong>
            </div>

            <div className="flex items-center space-x-1 text-charcoal-600 font-mono text-[11px]">
              <span>INFERENCE:</span>
              <strong className="text-emerald-700 font-bold">8.2ms</strong>
            </div>
          </div>
        </div>
      </Card>

      {/* Responsive CCTV Camera Feeds Grid */}
      <div
        className={`grid gap-5 transition-all ${
          selectedCameraFilter === 'all' && !expandedFeedId
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1'
        }`}
      >
        {displayedCameras.map((camera) => (
          <CameraFeed
            key={camera.id}
            camera={camera}
            initialOverlayState={globalOverlayState}
            isExpanded={expandedFeedId === camera.id}
            onToggleExpand={() =>
              setExpandedFeedId((prev) => (prev === camera.id ? null : camera.id))
            }
          />
        ))}
      </div>

      {/* Live AI Vision Inference Telemetry Feed */}
      <Card>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-warm-100">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-forest-700" />
            <h3 className="text-sm font-bold text-charcoal-900">
              Live Computer Vision Event Log
            </h3>
          </div>
          <span className="text-xs text-charcoal-500 font-mono">
            4 Nodes Active • H.265 Hardware Acceleration
          </span>
        </div>

        <div className="divide-y divide-warm-100 text-xs">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-warm-50/60 transition-colors px-1 rounded-md"
            >
              <div className="flex items-center space-x-2.5">
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-charcoal-800 text-white shrink-0">
                  {evt.cameraId.split('—')[0].trim()}
                </span>
                <span className="font-semibold text-charcoal-900">
                  {evt.title} — Table {evt.tableNumber} ({evt.zone})
                </span>
              </div>

              <div className="flex items-center space-x-3 text-charcoal-500 text-[11px] shrink-0">
                <span>
                  Staff: <strong className="text-charcoal-700">{evt.assignedWaiter}</strong>
                </span>
                <span className="font-mono text-emerald-700 font-bold">
                  {Math.round(evt.aiConfidence * 100)}% Match
                </span>
                <span className="font-mono text-charcoal-400">{evt.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
