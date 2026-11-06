import React from 'react'
import { CameraFeed } from './CameraFeed'
import { CCTVFeed } from '../../types'

interface CameraCardProps {
  camera: CCTVFeed
  initialOverlayState?: boolean
  isExpanded?: boolean
  onToggleExpand?: () => void
}

/**
 * CameraCard provides full CCTV surveillance feed rendering with 16:9 ratio,
 * live camera telemetry, interactive play/pause controls, and simulated AI detection overlays.
 */
export const CameraCard: React.FC<CameraCardProps> = (props) => {
  return <CameraFeed {...props} />
}

export default CameraCard
