import React, { useState, useRef, useEffect } from 'react'
import {
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Radio,
  Volume2,
  VolumeX,
  Camera,
  Flame,
  ZoomIn,
  ZoomOut,
  Sparkles,
} from 'lucide-react'
import { CCTVFeed } from '../../types'
import { DetectionOverlay } from './DetectionOverlay'

interface CameraFeedProps {
  camera: CCTVFeed
  initialOverlayState?: boolean
  isExpanded?: boolean
  onToggleExpand?: () => void
}

type VisionMode = 'ai' | 'heatmap' | 'clean'

export const CameraFeed: React.FC<CameraFeedProps> = ({
  camera,
  initialOverlayState = true,
  isExpanded = false,
  onToggleExpand,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [visionMode, setVisionMode] = useState<VisionMode>(initialOverlayState ? 'ai' : 'clean')
  const [nightVision, setNightVision] = useState(false)
  const [isAudioMuted, setIsAudioMuted] = useState(true)
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [snapshotFlash, setSnapshotFlash] = useState(false)
  const [snapshotNotification, setSnapshotNotification] = useState<string | null>(null)

  // Live High-Frequency CCTV Monospace Timestamp with Milliseconds
  const [cctvTimestamp, setCctvTimestamp] = useState('')
  const [liveFps, setLiveFps] = useState('29.9')
  const [liveBitrate, setLiveBitrate] = useState('4.2')
  const [liveLatency, setLiveLatency] = useState(camera.latencyMs)

  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      const now = new Date()
      const y = now.getFullYear()
      const m = String(now.getMonth() + 1).padStart(2, '0')
      const d = String(now.getDate()).padStart(2, '0')
      const hh = String(now.getHours()).padStart(2, '0')
      const mm = String(now.getMinutes()).padStart(2, '0')
      const ss = String(now.getSeconds()).padStart(2, '0')
      const ms = String(now.getMilliseconds()).padStart(3, '0')

      setCctvTimestamp(`${y}-${m}-${d} ${hh}:${mm}:${ss}.${ms}`)
    }, 45)

    return () => clearInterval(timer)
  }, [isPlaying])

  // Subtle stream telemetry fluctuations
  useEffect(() => {
    if (!isPlaying) return

    const telemetryInterval = setInterval(() => {
      const fps = (29.8 + (Math.random() * 0.4 - 0.2)).toFixed(1)
      setLiveFps(fps)

      const br = (4.15 + (Math.random() * 0.35 - 0.15)).toFixed(1)
      setLiveBitrate(br)

      const lat = camera.latencyMs + Math.floor(Math.random() * 4 - 2)
      setLiveLatency(Math.max(18, lat))
    }, 2000)

    return () => clearInterval(telemetryInterval)
  }, [isPlaying, camera.latencyMs])

  // Track browser native fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsNativeFullscreen(document.fullscreenElement === containerRef.current)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleFullscreenToggle = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {
          onToggleExpand?.()
        })
      } else {
        document.exitFullscreen().catch(() => {
          onToggleExpand?.()
        })
      }
    } else {
      onToggleExpand?.()
    }
  }

  // Handle Snapshot Capture
  const handleTakeSnapshot = () => {
    setSnapshotFlash(true)
    setTimeout(() => setSnapshotFlash(false), 200)

    const now = new Date()
    const fileName = `${camera.id}_${now.toISOString().replace(/[:.]/g, '-')}.jpg`
    setSnapshotNotification(`Telemetry Snapshot Captured: ${fileName}`)
    setTimeout(() => setSnapshotNotification(null), 3500)
  }

  // Zoom control
  const handleZoomToggle = () => {
    if (zoomLevel === 1) setZoomLevel(1.5)
    else if (zoomLevel === 1.5) setZoomLevel(2.0)
    else setZoomLevel(1)
  }

  return (
    <div
      ref={containerRef}
      className={`group relative rounded-xl overflow-hidden border border-charcoal-800 bg-charcoal-950 text-white shadow-card flex flex-col transition-all duration-300 ${
        isExpanded ? 'col-span-full z-40' : ''
      }`}
    >
      {/* 3:2 Surveillance Video Container Matching User's CCTV Camera Dimensions Exactly */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-charcoal-950 flex items-center justify-center select-none">
        {/* Real Surveillance Restaurant CCTV Feed */}
        <img
          src={camera.imageUrl}
          alt={camera.name}
          className={`absolute inset-0 w-full h-full object-fill pointer-events-none transition-transform duration-700 ${
            isPlaying ? '' : 'filter grayscale'
          }`}
          style={{
            transform: `scale(${zoomLevel})`,
            filter: nightVision
              ? 'brightness(1.15) contrast(1.35) grayscale(0.7) hue-rotate(95deg) drop-shadow(0 0 6px rgba(34,197,94,0.3))'
              : 'contrast(1.02) brightness(0.98)',
          }}
        />

        {/* Shutter flash effect */}
        {snapshotFlash && (
          <div className="absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-200" />
        )}

        {/* Thermal Heatmap Simulation Layer */}
        {visionMode === 'heatmap' && (
          <div className="absolute inset-0 pointer-events-none z-15 mix-blend-color-dodge animate-heatmap">
            <div
              className="w-full h-full"
              style={{
                background:
                  'radial-gradient(ellipse at 48% 55%, rgba(239, 68, 68, 0.75) 0%, rgba(245, 158, 11, 0.55) 25%, rgba(59, 130, 246, 0.35) 50%, rgba(16, 185, 129, 0.15) 75%, transparent 100%)',
              }}
            />
          </div>
        )}

        {/* Optical CCTV Lens Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/70 pointer-events-none" />

        {/* Moving CRT/CCTV scanline for live feed feel */}
        {isPlaying && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forest-400/6 to-transparent h-20 w-full animate-scanline pointer-events-none" />
        )}

        {/* TOP STATUS BAR OVERLAY (CCTV OSD) */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-2.5 sm:p-3 pointer-events-auto">
          {/* Left: LIVE Badge + Camera Label */}
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] sm:text-xs font-bold tracking-wider ${
                isPlaying
                  ? 'bg-red-950/90 text-red-400 border border-red-700/80 shadow-xs'
                  : 'bg-charcoal-800 text-charcoal-400 border border-charcoal-700'
              }`}
            >
              <Radio
                className={`w-3 h-3 mr-1 ${
                  isPlaying ? 'text-red-500 animate-pulse' : 'text-charcoal-500'
                }`}
              />
              {isPlaying ? 'REC ●' : 'PAUSED'}
            </span>

            <span className="text-xs sm:text-sm font-bold text-white font-mono tracking-wide drop-shadow-md truncate max-w-[200px] sm:max-w-none">
              {camera.name}
            </span>
          </div>

          {/* Right: Vision Mode, Zoom & IR Toggle */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Zoom Indicator */}
            {zoomLevel > 1 && (
              <span className="font-mono text-[9px] sm:text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/60 px-1.5 py-0.5 rounded">
                ZOOM {zoomLevel.toFixed(1)}x
              </span>
            )}

            {/* Stream resolution */}
            <span className="hidden xs:inline-block font-mono text-[10px] text-charcoal-300 bg-black/70 px-2 py-0.5 rounded border border-charcoal-700/60 backdrop-blur-xs">
              {camera.streamQuality}
            </span>

            {/* Night vision toggle */}
            <button
              onClick={() => setNightVision(!nightVision)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                nightVision
                  ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-500 shadow-sm'
                  : 'bg-black/60 text-charcoal-400 hover:text-white border border-charcoal-700/60'
              }`}
              title="Toggle Night Vision / Infrared filter"
            >
              {nightVision ? 'IR: ON' : 'IR: OFF'}
            </button>
          </div>
        </div>

        {/* BOTTOM METADATA & REAL-TIME CCTV TIMESTAMP (Milliseconds OSD) */}
        <div className="absolute bottom-11 inset-x-0 z-20 flex items-center justify-between px-3 pointer-events-none">
          {/* Exact CCTV Timestamp with Milliseconds */}
          <div className="flex items-center space-x-2 font-mono text-[10px] sm:text-[11px] font-semibold text-charcoal-200 bg-black/85 px-2.5 py-1 rounded border border-charcoal-700 backdrop-blur-xs shadow-md">
            <span className="text-forest-400 font-bold">{camera.id}</span>
            <span className="text-charcoal-500">|</span>
            <span className="text-emerald-300 tracking-wider">
              {cctvTimestamp || '2026-11-06 16:00:00.000'}
            </span>
          </div>

          {/* Stream Telemetry (FPS, Bitrate, Latency) */}
          <div className="hidden sm:flex items-center space-x-2 font-mono text-[10px] text-charcoal-300 bg-black/85 px-2.5 py-1 rounded border border-charcoal-700 shadow-md">
            <span className="text-charcoal-400">FPS:</span>
            <span className="text-emerald-400 font-bold">{liveFps}</span>
            <span className="text-charcoal-500">•</span>
            <span>{liveBitrate} Mbps</span>
            <span className="text-charcoal-500">•</span>
            <span className="text-sky-400">{liveLatency}ms</span>
          </div>
        </div>

        {/* Snapshot Notification Toast */}
        {snapshotNotification && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-lg bg-black/90 border border-forest-500 text-forest-300 text-xs font-mono shadow-xl flex items-center space-x-2 animate-bounce">
            <Camera className="w-3.5 h-3.5 text-forest-400" />
            <span>{snapshotNotification}</span>
          </div>
        )}

        {/* Paused Watermark Banner */}
        {!isPlaying && (
          <div className="absolute inset-0 z-25 bg-black/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
            <div className="px-5 py-3 rounded-xl bg-charcoal-900/90 border border-charcoal-700 text-center font-mono shadow-2xl">
              <span className="text-xs font-bold text-amber-400 tracking-wider flex items-center justify-center">
                <Pause className="w-4 h-4 mr-1.5" />
                SIMULATION FREEZE-FRAME
              </span>
              <p className="text-[10px] text-charcoal-400 mt-1">
                Click Play button below to resume live video feed
              </p>
            </div>
          </div>
        )}

        {/* Reusable Computer Vision Detection Overlay (Active when visionMode === 'ai') */}
        <DetectionOverlay
          detections={camera.detections}
          visible={visionMode === 'ai'}
          showLabels={true}
          showConfidence={true}
          isLive={isPlaying}
        />
      </div>

      {/* FOOTER CAMERA CONTROLS BAR */}
      <div className="px-3 py-2 bg-charcoal-900 border-t border-charcoal-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Play/Pause Controls & Mode Switcher */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1.5 rounded-lg border transition-all ${
              isPlaying
                ? 'bg-charcoal-800 text-charcoal-200 border-charcoal-700 hover:bg-charcoal-700 hover:text-white'
                : 'bg-emerald-950 text-emerald-300 border-emerald-600 hover:bg-emerald-900'
            }`}
            title={isPlaying ? 'Pause Feed' : 'Play Feed'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
          </button>

          {/* AI Vision Mode Toggles */}
          <div className="flex items-center rounded-lg border border-charcoal-700 bg-charcoal-800/80 p-0.5 text-[11px] font-mono">
            <button
              onClick={() => setVisionMode('ai')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                visionMode === 'ai'
                  ? 'bg-forest-700 text-white font-bold shadow-xs'
                  : 'text-charcoal-400 hover:text-white'
              }`}
              title="Show AI Vision Bounding Boxes on Every Table"
            >
              AI Boxes
            </button>
            <button
              onClick={() => setVisionMode('heatmap')}
              className={`flex items-center px-2 py-0.5 rounded font-medium transition-colors ${
                visionMode === 'heatmap'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-charcoal-400 hover:text-white'
              }`}
              title="Show Occupancy Density Heatmap"
            >
              <Flame className="w-3 h-3 mr-1" />
              Heatmap
            </button>
            <button
              onClick={() => setVisionMode('clean')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                visionMode === 'clean'
                  ? 'bg-charcoal-700 text-white font-bold shadow-xs'
                  : 'text-charcoal-400 hover:text-white'
              }`}
              title="Clean Surveillance Feed (No Overlays)"
            >
              Clean
            </button>
          </div>
        </div>

        {/* Right: Snapshot, Zoom, Audio & Fullscreen */}
        <div className="flex items-center space-x-1.5 shrink-0 ml-auto sm:ml-0">
          {/* Snapshot Button */}
          <button
            onClick={handleTakeSnapshot}
            className="p-1.5 rounded-lg bg-charcoal-800 text-charcoal-300 hover:text-white hover:bg-charcoal-700 border border-charcoal-700 transition-colors"
            title="Capture AI Telemetry Snapshot"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>

          {/* Digital Zoom Button */}
          <button
            onClick={handleZoomToggle}
            className={`p-1.5 rounded-lg border text-xs font-mono transition-colors ${
              zoomLevel > 1
                ? 'bg-amber-950 text-amber-300 border-amber-600'
                : 'bg-charcoal-800 text-charcoal-300 hover:text-white border-charcoal-700'
            }`}
            title={`Toggle Digital Zoom (Current: ${zoomLevel}x)`}
          >
            {zoomLevel > 1 ? (
              <ZoomOut className="w-3.5 h-3.5" />
            ) : (
              <ZoomIn className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="p-1.5 rounded-lg bg-charcoal-800/80 text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-700 transition-colors"
            title={isAudioMuted ? 'Simulated Audio Muted' : 'Unmute Ambient Room Audio'}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-forest-400" />
            )}
          </button>

          {/* Fullscreen Expand */}
          <button
            onClick={handleFullscreenToggle}
            className={`p-1.5 rounded-lg border transition-all ${
              isExpanded || isNativeFullscreen
                ? 'bg-forest-900 text-forest-200 border-forest-700'
                : 'bg-charcoal-800 text-charcoal-300 border-charcoal-700 hover:bg-charcoal-700 hover:text-white'
            }`}
            title={isExpanded || isNativeFullscreen ? 'Restore View' : 'Toggle Fullscreen'}
          >
            {isExpanded || isNativeFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
