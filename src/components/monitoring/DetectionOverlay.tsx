import React from 'react'
import {
  Sparkles,
  AlertTriangle,
  User,
  Users,
  Utensils,
  CheckCircle,
} from 'lucide-react'
import { DetectionBox } from '../../types'

interface DetectionOverlayProps {
  detections: DetectionBox[]
  visible?: boolean
  showLabels?: boolean
  showConfidence?: boolean
  isLive?: boolean
}

export const DetectionOverlay: React.FC<DetectionOverlayProps> = ({
  detections,
  visible = true,
  showLabels = true,
  showConfidence = true,
}) => {
  if (!visible || !detections || detections.length === 0) {
    return null
  }

  const getTheme = (color?: DetectionBox['color']) => {
    switch (color) {
      case 'amber':
        return {
          border: 'border-amber-400',
          bg: 'bg-amber-500/15',
          tagBg: 'bg-amber-950/90 text-amber-200 border-amber-500/80',
          corner: 'border-amber-300',
          dot: 'bg-amber-400 animate-pulse',
        }
      case 'rose':
        return {
          border: 'border-rose-500',
          bg: 'bg-rose-500/15',
          tagBg: 'bg-rose-950/90 text-rose-200 border-rose-500/80',
          corner: 'border-rose-400',
          dot: 'bg-rose-400 animate-pulse',
        }
      case 'blue':
        return {
          border: 'border-sky-400',
          bg: 'bg-sky-500/10',
          tagBg: 'bg-sky-950/90 text-sky-200 border-sky-400/80',
          corner: 'border-sky-300',
          dot: 'bg-sky-400',
        }
      case 'emerald':
        return {
          border: 'border-emerald-400',
          bg: 'bg-emerald-500/10',
          tagBg: 'bg-emerald-950/90 text-emerald-200 border-emerald-400/80',
          corner: 'border-emerald-300',
          dot: 'bg-emerald-400',
        }
      case 'forest':
      default:
        return {
          border: 'border-forest-400',
          bg: 'bg-forest-500/10',
          tagBg: 'bg-forest-950/90 text-forest-200 border-forest-400/80',
          corner: 'border-forest-300',
          dot: 'bg-forest-400',
        }
    }
  }

  const getIcon = (category: DetectionBox['category']) => {
    switch (category) {
      case 'customer':
      case 'person':
        return <User className="w-2.5 h-2.5 mr-1 shrink-0" />
      case 'waiter':
        return <Users className="w-2.5 h-2.5 mr-1 shrink-0 text-sky-300" />
      case 'table':
        return <Utensils className="w-2.5 h-2.5 mr-1 shrink-0" />
      case 'alert':
        return <AlertTriangle className="w-2.5 h-2.5 mr-1 shrink-0 text-amber-300 animate-pulse" />
      case 'occupancy':
      default:
        return <CheckCircle className="w-2.5 h-2.5 mr-1 shrink-0" />
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden select-none">
      {/* Explicit Required Badge: AI VISION — SIMULATED */}
      <div className="absolute top-2.5 right-2.5 z-20">
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-charcoal-950/90 backdrop-blur-md border border-forest-500/70 shadow-lg font-mono text-[9px] font-bold text-forest-300 tracking-wider uppercase">
          <Sparkles className="w-2.5 h-2.5 text-forest-400 animate-pulse" />
          <span>AI VISION — SIMULATED</span>
        </div>
      </div>

      {/* Render all computer vision bounding boxes precisely positioned over the tables */}
      {detections.map((box) => {
        const theme = getTheme(box.color)
        const baseConf = box.confidence || 0.98

        return (
          <div
            key={box.id}
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
            }}
            className={`absolute border ${theme.border} ${theme.bg} rounded-sm transition-all duration-300`}
          >
            {/* Corner crosshair brackets for AI tracking aesthetic */}
            <div className={`absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 ${theme.corner}`} />
            <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 ${theme.corner}`} />
            <div className={`absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 ${theme.corner}`} />
            <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 ${theme.corner}`} />

            {/* If alert category, render an animated beacon */}
            {box.category === 'alert' && (
              <div className="absolute inset-0 rounded border-2 border-amber-400 animate-ping-slow pointer-events-none opacity-40" />
            )}

            {/* Label Tag on top of bounding box */}
            {showLabels && (
              <div
                className={`absolute -top-5 left-0 z-10 flex items-center px-1.5 py-0.5 rounded border shadow-sm font-mono text-[9px] font-bold tracking-tight whitespace-nowrap ${theme.tagBg}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${theme.dot}`} />
                {getIcon(box.category)}
                <span>{box.label}</span>
                {showConfidence && (
                  <span className="ml-1 opacity-80 font-normal">
                    [{Math.round(baseConf * 100)}%]
                  </span>
                )}
              </div>
            )}

            {/* Sub-label/Status Tag at bottom of bounding box if provided */}
            {box.subLabel && (
              <div className="absolute -bottom-4 left-0 z-10 px-1.5 py-0.2 rounded bg-black/85 text-[8px] font-mono text-charcoal-200 border border-charcoal-700/80 tracking-tight whitespace-nowrap shadow-xs">
                {box.subLabel}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
