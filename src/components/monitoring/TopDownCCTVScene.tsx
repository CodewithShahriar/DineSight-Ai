import React from 'react'

interface TopDownCCTVSceneProps {
  cameraId: string
  isNightVision?: boolean
  isLive?: boolean
}

export const TopDownCCTVScene: React.FC<TopDownCCTVSceneProps> = ({
  cameraId,
  isNightVision = false,
  isLive = true,
}) => {
  // Render distinct top-down ceiling surveillance views for each of the 4 cameras
  switch (cameraId) {
    case 'CAM-01':
      return <Camera01MainDiningScene isNightVision={isNightVision} isLive={isLive} />
    case 'CAM-02':
      return <Camera02WindowSeatingScene isNightVision={isNightVision} isLive={isLive} />
    case 'CAM-03':
      return <Camera03PrivateDiningScene isNightVision={isNightVision} isLive={isLive} />
    case 'CAM-04':
    default:
      return <Camera04EntranceScene isNightVision={isNightVision} isLive={isLive} />
  }
}

// ============================================================================
// CAMERA 01 — MAIN DINING AREA (Overhead 360° Ceiling Dome View)
// ============================================================================
const Camera01MainDiningScene: React.FC<{ isNightVision?: boolean; isLive?: boolean }> = ({
  isNightVision,
  isLive,
}) => {
  return (
    <svg
      viewBox="0 0 1000 562.5"
      className="w-full h-full object-cover"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Parquet hardwood floor pattern */}
        <pattern id="floor-parquet" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill="#171e22" />
          <path
            d="M0 0h30v60H0zM30 0h30v60H30z"
            fill="#14191d"
            stroke="#1b2328"
            strokeWidth="0.8"
          />
          <path d="M0 30h60" stroke="#1b2328" strokeWidth="0.8" />
        </pattern>

        {/* Oak wood table gradient */}
        <linearGradient id="oak-table" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a3b2c" />
          <stop offset="50%" stopColor="#5c4a37" />
          <stop offset="100%" stopColor="#3d3023" />
        </linearGradient>

        {/* Leather booth gradient */}
        <linearGradient id="leather-booth" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#222b30" />
          <stop offset="50%" stopColor="#2c383f" />
          <stop offset="100%" stopColor="#1e262b" />
        </linearGradient>

        {/* Plate gradient */}
        <radialGradient id="plate-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5f2eb" />
          <stop offset="80%" stopColor="#ded7ca" />
          <stop offset="100%" stopColor="#b8ad9c" />
        </radialGradient>
      </defs>

      {/* 1. Base Flooring */}
      <rect width="1000" height="562.5" fill="url(#floor-parquet)" />

      {/* Surveillance Grid Lines & Calibration Markers */}
      <g stroke="#263339" strokeWidth="0.5" strokeDasharray="3,6" opacity="0.6">
        <line x1="250" y1="0" x2="250" y2="562.5" />
        <line x1="500" y1="0" x2="500" y2="562.5" />
        <line x1="750" y1="0" x2="750" y2="562.5" />
        <line x1="0" y1="187.5" x2="1000" y2="187.5" />
        <line x1="0" y1="375" x2="1000" y2="375" />
      </g>

      {/* Zone Label Watermark */}
      <text
        x="980"
        y="40"
        textAnchor="end"
        fill="#3b4d54"
        fontFamily="monospace"
        fontSize="12"
        fontWeight="bold"
        letterSpacing="2"
      >
        CAM-01 • OVERHEAD FOV 110° • SECTOR N-1
      </text>

      {/* ---------------------------------------------------------------------- */}
      {/* LEFT: TABLE T-01 (Booth 2p) - Positioned at x: 4%, y: 35%, w: 22%, h: 42% */}
      {/* ---------------------------------------------------------------------- */}
      <g id="table-t01">
        {/* Booth backrest */}
        <rect x="40" y="200" width="30" height="220" rx="6" fill="url(#leather-booth)" stroke="#1a2327" />
        {/* Table top */}
        <rect
          x="75"
          y="230"
          width="135"
          height="160"
          rx="10"
          fill="url(#oak-table)"
          stroke="#6d5842"
          strokeWidth="2"
          filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))"
        />
        {/* Plates & cutlery */}
        <circle cx="120" cy="310" r="18" fill="url(#plate-grad)" stroke="#9c8e7c" strokeWidth="1" />
        <circle cx="165" cy="310" r="18" fill="url(#plate-grad)" stroke="#9c8e7c" strokeWidth="1" />
        <circle cx="142" cy="270" r="7" fill="#6ba4b8" opacity="0.8" /> {/* Wine glass */}

        {/* Customer #101 (Left Diner at T-01) */}
        <g id="person-c101" transform="translate(60, 280)">
          {/* Shoulders */}
          <ellipse cx="25" cy="30" rx="20" ry="14" fill="#31424a" stroke="#1c272c" strokeWidth="1.5" />
          {/* Head */}
          <circle cx="25" cy="30" r="11" fill="#c49b76" />
          <path d="M15 26 Q25 18 35 26 Q25 22 15 26" fill="#2d221a" /> {/* Hair */}
        </g>
      </g>

      {/* ---------------------------------------------------------------------- */}
      {/* CENTER: TABLE T-02 (Round 4p) - Positioned at x: 34%, y: 24%, w: 34%, h: 58% */}
      {/* ---------------------------------------------------------------------- */}
      <g id="table-t02">
        {/* 4 Chairs around round table */}
        {/* Top chair */}
        <ellipse cx="500" cy="170" rx="22" ry="14" fill="#2a363d" stroke="#1d262b" />
        {/* Bottom chair */}
        <ellipse cx="500" cy="450" rx="22" ry="14" fill="#2a363d" stroke="#1d262b" />
        {/* Left chair */}
        <ellipse cx="360" cy="310" rx="14" ry="22" fill="#2a363d" stroke="#1d262b" />
        {/* Right chair */}
        <ellipse cx="640" cy="310" rx="14" ry="22" fill="#2a363d" stroke="#1d262b" />

        {/* Large Round Wooden Table */}
        <circle
          cx="500"
          cy="310"
          r="115"
          fill="url(#oak-table)"
          stroke="#735c45"
          strokeWidth="3"
          filter="drop-shadow(0 6px 14px rgba(0,0,0,0.6))"
        />

        {/* Center table Lazy Susan / Centerpiece & Wine Bucket */}
        <circle cx="500" cy="310" r="40" fill="#36291e" stroke="#523f2f" strokeWidth="1.5" />
        <circle cx="500" cy="310" r="14" fill="#7ba397" stroke="#4a6e64" opacity="0.8" />

        {/* Place Settings */}
        <circle cx="500" cy="235" r="18" fill="url(#plate-grad)" stroke="#9c8e7c" />
        <circle cx="500" cy="385" r="18" fill="url(#plate-grad)" stroke="#9c8e7c" />
        <circle cx="425" cy="310" r="18" fill="url(#plate-grad)" stroke="#9c8e7c" />
        <circle cx="575" cy="310" r="18" fill="url(#plate-grad)" stroke="#9c8e7c" />

        {/* CUSTOMER #104 (Diner at T-02 Bottom with Raised Hand Gesture) */}
        <g id="person-c104" transform="translate(475, 410)">
          {/* Shoulders */}
          <ellipse cx="25" cy="32" rx="24" ry="16" fill="#8c5835" stroke="#573620" strokeWidth="1.5" />
          {/* Head */}
          <circle cx="25" cy="30" r="12" fill="#d2a679" />
          <path d="M14 26 Q25 18 36 26" fill="#1f1813" />
          {/* Right Arm extended toward aisle / Raised Hand */}
          <path
            d="M40 30 Q58 20 62 10"
            fill="none"
            stroke="#8c5835"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Hand Palm with animated wave ping */}
          <circle cx="62" cy="10" r="5" fill="#d2a679" />
          <circle cx="62" cy="10" r="12" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.8" className="animate-ping" />
        </g>

        {/* Top Diner at T-02 */}
        <g id="person-c105" transform="translate(475, 140)">
          <ellipse cx="25" cy="25" rx="22" ry="15" fill="#364954" stroke="#223038" strokeWidth="1.5" />
          <circle cx="25" cy="26" r="11" fill="#e0b88f" />
          <path d="M14 24 Q25 16 36 24" fill="#38291c" />
        </g>

        {/* Left Diner at T-02 */}
        <g id="person-c106" transform="translate(335, 285)">
          <ellipse cx="25" cy="25" rx="15" ry="22" fill="#2f3d45" stroke="#1d272d" strokeWidth="1.5" />
          <circle cx="25" cy="25" r="11" fill="#cfa780" />
        </g>
      </g>

      {/* ---------------------------------------------------------------------- */}
      {/* RIGHT: TABLE T-03 (Booth 4p) - Positioned at x: 74%, y: 44%, w: 22%, h: 48% */}
      {/* ---------------------------------------------------------------------- */}
      <g id="table-t03">
        {/* Right Booth Backrest */}
        <rect x="940" y="260" width="30" height="230" rx="6" fill="url(#leather-booth)" />
        {/* Table Top */}
        <rect
          x="770"
          y="280"
          width="160"
          height="190"
          rx="10"
          fill="url(#oak-table)"
          stroke="#6d5842"
          strokeWidth="2"
          filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))"
        />
        {/* 4 Place Settings */}
        <circle cx="815" cy="330" r="16" fill="url(#plate-grad)" />
        <circle cx="815" cy="420" r="16" fill="url(#plate-grad)" />
        <circle cx="885" cy="330" r="16" fill="url(#plate-grad)" />
        <circle cx="885" cy="420" r="16" fill="url(#plate-grad)" />

        {/* Seated Diners */}
        <g transform="translate(895, 310)">
          <ellipse cx="20" cy="20" rx="14" ry="18" fill="#443445" />
          <circle cx="20" cy="20" r="10" fill="#d2a679" />
        </g>
        <g transform="translate(895, 400)">
          <ellipse cx="20" cy="20" rx="14" ry="18" fill="#2b3b44" />
          <circle cx="20" cy="20" r="10" fill="#c49b76" />
        </g>
      </g>

      {/* ---------------------------------------------------------------------- */}
      {/* TOP BACKGROUND: TABLE T-04 (Available) - x: 44%, y: 6%, w: 20%, h: 22% */}
      {/* ---------------------------------------------------------------------- */}
      <g id="table-t04">
        {/* Empty Round Table */}
        <circle cx="500" cy="70" r="48" fill="url(#oak-table)" stroke="#6d5842" strokeWidth="1.5" />
        {/* Clean wine glasses & folded napkin set */}
        <circle cx="500" cy="70" r="16" fill="#2a2017" opacity="0.6" />
        <circle cx="485" cy="70" r="10" fill="url(#plate-grad)" />
        <circle cx="515" cy="70" r="10" fill="url(#plate-grad)" />
        {/* 2 Empty Chairs */}
        <ellipse cx="435" cy="70" rx="10" ry="15" fill="#253036" />
        <ellipse cx="565" cy="70" rx="10" ry="15" fill="#253036" />
      </g>

      {/* ---------------------------------------------------------------------- */}
      {/* WAITER: Ahmed Rahman (EMP-101) Walking Central Aisle */}
      {/* Positioned at x: 72%, y: 16%, w: 10%, h: 24% */}
      {/* ---------------------------------------------------------------------- */}
      <g id="waiter-ahmed" transform="translate(735, 110)">
        {/* Server Shoulder silhouette in sharp black vest */}
        <ellipse cx="35" cy="35" rx="26" ry="18" fill="#0f171c" stroke="#2563eb" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.6))" />
        {/* Waiter White Collar */}
        <polygon points="35,28 30,38 40,38" fill="#f8fafc" />
        {/* Head */}
        <circle cx="35" cy="32" r="12" fill="#cfa780" />
        <path d="M24 28 Q35 20 46 28" fill="#14110f" />
        {/* Server Tablet / Order Pad in Left Hand */}
        <rect x="52" y="32" width="16" height="24" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
        <rect x="55" y="35" width="10" height="18" fill="#0284c7" opacity="0.8" />
        {/* Live Footstep Vector Indicator */}
        <line x1="35" y1="52" x2="35" y2="70" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,3" />
        <polygon points="35,74 32,68 38,68" fill="#38bdf8" />
      </g>
    </svg>
  )
}

// ============================================================================
// CAMERA 02 — WINDOW SEATING (Overhead Sunlit Terrace / Window Booths)
// ============================================================================
const Camera02WindowSeatingScene: React.FC<{ isNightVision?: boolean; isLive?: boolean }> = () => {
  return (
    <svg viewBox="0 0 1000 562.5" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="terrazzo-floor" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="#1c2429" />
          <circle cx="12" cy="12" r="1.5" fill="#334148" />
          <circle cx="38" cy="24" r="2" fill="#28353b" />
          <circle cx="20" cy="40" r="1" fill="#3d4f57" />
        </pattern>
        <linearGradient id="window-glass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="85%" stopColor="rgba(56, 189, 248, 0.08)" />
          <stop offset="100%" stopColor="rgba(56, 189, 248, 0.22)" />
        </linearGradient>
      </defs>

      {/* Flooring */}
      <rect width="1000" height="562.5" fill="url(#terrazzo-floor)" />

      {/* Glass Window Wall on Right */}
      <rect x="940" y="0" width="60" height="562.5" fill="url(#window-glass)" stroke="#38bdf8" strokeWidth="2" strokeDasharray="20,10" opacity="0.8" />
      <text x="965" y="280" fill="#38bdf8" fontFamily="monospace" fontSize="11" transform="rotate(90 965 280)" letterSpacing="4">
        FLOOR-TO-CEILING GLASS FACADE
      </text>

      {/* Calibration grid */}
      <g stroke="#263339" strokeWidth="0.5" strokeDasharray="4,8" opacity="0.5">
        <line x1="333" y1="0" x2="333" y2="562.5" />
        <line x1="666" y1="0" x2="666" y2="562.5" />
      </g>

      {/* TABLE T-05 (Needs Bussing / Vacated) - x: 6%, y: 18%, w: 28%, h: 52% */}
      <g id="table-t05">
        <rect x="70" y="140" width="220" height="240" rx="14" fill="#423427" stroke="#634e3a" strokeWidth="2" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.5))" />
        {/* Dirty Plates & Used Napkins */}
        <circle cx="130" cy="210" r="18" fill="#d4c9b8" stroke="#8a7963" />
        <circle cx="210" cy="210" r="18" fill="#d4c9b8" stroke="#8a7963" />
        <circle cx="150" cy="300" r="18" fill="#d4c9b8" stroke="#8a7963" />
        <circle cx="220" cy="300" r="18" fill="#d4c9b8" stroke="#8a7963" />
        <rect x="160" y="240" width="24" height="16" fill="#e2d9cc" transform="rotate(25 160 240)" />
        {/* 4 Empty Chairs pushed back */}
        <ellipse cx="180" cy="115" rx="26" ry="14" fill="#202a30" />
        <ellipse cx="180" cy="405" rx="26" ry="14" fill="#202a30" />
        <ellipse cx="40" cy="260" rx="14" ry="26" fill="#202a30" />
        <ellipse cx="320" cy="260" rx="14" ry="26" fill="#202a30" />
      </g>

      {/* TABLE T-06 (Window Booth Active Dining) - x: 40%, y: 20%, w: 32%, h: 56% */}
      <g id="table-t06">
        <rect x="420" y="150" width="260" height="260" rx="16" fill="#4f3e2e" stroke="#755d45" strokeWidth="2.5" filter="drop-shadow(0 6px 14px rgba(0,0,0,0.6))" />
        {/* Shared Dining Platter & Drinks */}
        <ellipse cx="550" cy="280" rx="45" ry="32" fill="#8f3d38" stroke="#b91c1c" strokeWidth="1.5" />
        <circle cx="480" cy="220" r="18" fill="#f1ece1" />
        <circle cx="620" cy="220" r="18" fill="#f1ece1" />
        <circle cx="480" cy="340" r="18" fill="#f1ece1" />
        <circle cx="620" cy="340" r="18" fill="#f1ece1" />

        {/* 4 Diners Seated */}
        {/* Customer #201 (Top Left) */}
        <g transform="translate(450, 110)">
          <ellipse cx="30" cy="25" rx="22" ry="16" fill="#2563eb" />
          <circle cx="30" cy="24" r="12" fill="#d2a679" />
        </g>
        {/* Customer #202 (Top Right) */}
        <g transform="translate(590, 110)">
          <ellipse cx="30" cy="25" rx="22" ry="16" fill="#059669" />
          <circle cx="30" cy="24" r="12" fill="#c49b76" />
        </g>
        {/* Customer #203 (Bottom Left) */}
        <g transform="translate(450, 420)">
          <ellipse cx="30" cy="25" rx="22" ry="16" fill="#d97706" />
          <circle cx="30" cy="24" r="12" fill="#e0b88f" />
        </g>
        {/* Customer #204 (Bottom Right) */}
        <g transform="translate(590, 420)">
          <ellipse cx="30" cy="25" rx="22" ry="16" fill="#7c3aed" />
          <circle cx="30" cy="24" r="12" fill="#cfa780" />
        </g>
      </g>

      {/* WAITER: Tanvir Hasan (EMP-102) Standing at Service Hub */}
      {/* Positioned at x: 78%, y: 18%, w: 14%, h: 32% */}
      <g id="waiter-tanvir" transform="translate(790, 130)">
        {/* Server Credenza / POS console */}
        <rect x="0" y="80" width="85" height="40" rx="4" fill="#2d3748" stroke="#4a5568" />
        <rect x="25" y="86" width="35" height="24" rx="2" fill="#0284c7" />

        {/* Tanvir Figure */}
        <ellipse cx="42" cy="40" rx="24" ry="17" fill="#0f171c" stroke="#2563eb" strokeWidth="2" />
        <circle cx="42" cy="38" r="12" fill="#d2a679" />
        <path d="M30 34 Q42 26 54 34" fill="#17120e" />
      </g>
    </svg>
  )
}

// ============================================================================
// CAMERA 03 — PRIVATE DINING (VIP Suite Overhead Banquet Table)
// ============================================================================
const Camera03PrivateDiningScene: React.FC<{ isNightVision?: boolean; isLive?: boolean }> = () => {
  return (
    <svg viewBox="0 0 1000 562.5" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      {/* Dark Walnut Hardwood */}
      <rect width="1000" height="562.5" fill="#14181a" />

      {/* Opulent Crimson Area Rug */}
      <rect
        x="120"
        y="80"
        width="760"
        height="400"
        rx="24"
        fill="#261214"
        stroke="#4a1d20"
        strokeWidth="3"
        filter="drop-shadow(0 8px 24px rgba(0,0,0,0.7))"
      />

      {/* Private Wine Cellar Cabinet on Upper Wall */}
      <rect x="740" y="15" width="220" height="45" rx="6" fill="#1e2428" stroke="#334148" strokeWidth="1.5" />
      <text x="850" y="42" fill="#64748b" fontFamily="monospace" fontSize="10" textAnchor="middle" fontWeight="bold">
        WINE RESERVE CELLAR • 14°C
      </text>

      {/* VIP BANQUET TABLE T-11 - Positioned at x: 18%, y: 24%, w: 64%, h: 52% */}
      <g id="table-t11">
        {/* Long Polished Mahogany Banquet Table */}
        <rect
          x="200"
          y="160"
          width="580"
          height="240"
          rx="30"
          fill="#3b2518"
          stroke="#5c3b27"
          strokeWidth="3"
          filter="drop-shadow(0 10px 20px rgba(0,0,0,0.8))"
        />

        {/* Center Crystal Wine Decanters & Flower Arrangement */}
        <ellipse cx="490" cy="280" rx="80" ry="35" fill="#24160e" stroke="#452a1a" />
        <circle cx="430" cy="280" r="14" fill="#991b1b" opacity="0.8" /> {/* Red wine decanter */}
        <circle cx="550" cy="280" r="14" fill="#ca8a04" opacity="0.8" /> {/* White wine decanter */}

        {/* 6 Luxury Place Settings */}
        <circle cx="280" cy="210" r="18" fill="#f5f2eb" />
        <circle cx="490" cy="210" r="18" fill="#f5f2eb" />
        <circle cx="700" cy="210" r="18" fill="#f5f2eb" />
        <circle cx="280" cy="350" r="18" fill="#f5f2eb" />
        <circle cx="490" cy="350" r="18" fill="#f5f2eb" />
        <circle cx="700" cy="350" r="18" fill="#f5f2eb" />

        {/* Seated VIP Guests */}
        <g transform="translate(250, 115)"><ellipse cx="30" cy="25" rx="24" ry="16" fill="#1e293b" /><circle cx="30" cy="24" r="12" fill="#d2a679" /></g>
        <g transform="translate(460, 115)"><ellipse cx="30" cy="25" rx="24" ry="16" fill="#334155" /><circle cx="30" cy="24" r="12" fill="#c49b76" /></g>
        <g transform="translate(670, 115)"><ellipse cx="30" cy="25" rx="24" ry="16" fill="#1e1b4b" /><circle cx="30" cy="24" r="12" fill="#e0b88f" /></g>
        <g transform="translate(250, 395)"><ellipse cx="30" cy="25" rx="24" ry="16" fill="#0f172a" /><circle cx="30" cy="24" r="12" fill="#cfa780" /></g>
        <g transform="translate(460, 395)"><ellipse cx="30" cy="25" rx="24" ry="16" fill="#3f3f46" /><circle cx="30" cy="24" r="12" fill="#d2a679" /></g>
        <g transform="translate(670, 395)"><ellipse cx="30" cy="25" rx="24" ry="16" fill="#1c1917" /><circle cx="30" cy="24" r="12" fill="#c49b76" /></g>
      </g>

      {/* HEAD WAITER / SOMMELIER: Sakib Ahmed (EMP-103) Table-Side */}
      {/* Positioned at x: 82%, y: 32%, w: 12%, h: 36% */}
      <g id="waiter-sakib" transform="translate(825, 200)">
        <ellipse cx="32" cy="35" rx="25" ry="18" fill="#0f171c" stroke="#2563eb" strokeWidth="2" />
        <circle cx="32" cy="33" r="12" fill="#c49b76" />
        {/* Serving White Napkin & Wine Bottle */}
        <rect x="5" y="32" width="12" height="24" fill="#f8fafc" rx="2" />
        <rect x="18" y="28" width="8" height="28" rx="2" fill="#14532d" />
      </g>
    </svg>
  )
}

// ============================================================================
// CAMERA 04 — ENTRANCE & HOST STAND (Foyer Ceiling Dome Camera)
// ============================================================================
const Camera04EntranceScene: React.FC<{ isNightVision?: boolean; isLive?: boolean }> = () => {
  return (
    <svg viewBox="0 0 1000 562.5" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      {/* Granite Foyer Floor */}
      <rect width="1000" height="562.5" fill="#171c1f" />

      {/* Glass Automatic Entry Doors at Top */}
      <rect x="340" y="0" width="320" height="25" fill="#0284c7" opacity="0.3" stroke="#38bdf8" strokeWidth="2" />
      <text x="500" y="16" fill="#38bdf8" fontFamily="monospace" fontSize="10" textAnchor="middle" fontWeight="bold" letterSpacing="3">
        AUTOMATED ENTRY GLASS SLIDERS (IN / OUT)
      </text>

      {/* Velvet Carpet Runner along entry walkway */}
      <rect x="380" y="25" width="240" height="537.5" fill="#2d1518" stroke="#4a1e23" strokeWidth="1" />

      {/* HOST STAND & RECEPTION - Positioned at x: 8%, y: 28%, w: 24%, h: 42% */}
      <g id="host-stand">
        {/* Mahogany Host Podium */}
        <rect
          x="80"
          y="170"
          width="210"
          height="190"
          rx="12"
          fill="#3b2b1e"
          stroke="#5c432f"
          strokeWidth="2.5"
          filter="drop-shadow(0 6px 12px rgba(0,0,0,0.6))"
        />
        {/* Tablet Console for Guest Seating */}
        <rect x="135" y="210" width="80" height="55" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
        <rect x="142" y="218" width="66" height="38" rx="2" fill="#0284c7" opacity="0.85" />
        <circle cx="175" cy="237" r="6" fill="#f8fafc" />
        {/* Reservation Guest Book */}
        <rect x="145" y="285" width="60" height="45" rx="3" fill="#1e293b" stroke="#64748b" />
      </g>

      {/* HOST: Fahim Chowdhury (EMP-104) behind Podium */}
      {/* Positioned at x: 14%, y: 14%, w: 12%, h: 28% */}
      <g id="waiter-fahim" transform="translate(145, 95)">
        <ellipse cx="32" cy="35" rx="24" ry="17" fill="#0f171c" stroke="#2563eb" strokeWidth="2" />
        <circle cx="32" cy="33" r="12" fill="#d2a679" />
        <path d="M20 29 Q32 21 44 29" fill="#1f1610" />
      </g>

      {/* ARRIVING GUEST PARTY (Party of 3 in Entry Foyer) */}
      {/* Positioned at x: 42%, y: 32%, w: 20%, h: 42% */}
      <g id="arriving-party">
        {/* Guest 1 */}
        <g transform="translate(430, 200)">
          <ellipse cx="26" cy="28" rx="20" ry="15" fill="#475569" stroke="#334155" />
          <circle cx="26" cy="27" r="11" fill="#d2a679" />
        </g>
        {/* Guest 2 */}
        <g transform="translate(510, 220)">
          <ellipse cx="26" cy="28" rx="20" ry="15" fill="#059669" stroke="#047857" />
          <circle cx="26" cy="27" r="11" fill="#c49b76" />
        </g>
        {/* Guest 3 */}
        <g transform="translate(470, 310)">
          <ellipse cx="26" cy="28" rx="20" ry="15" fill="#b45309" stroke="#92400e" />
          <circle cx="26" cy="27" r="11" fill="#e0b88f" />
        </g>
      </g>

      {/* WAITING FOYER LOUNGE (Right side bench) - x: 74%, y: 32%, w: 20%, h: 48% */}
      <g id="foyer-lounge">
        {/* Leather Waiting Bench */}
        <rect x="760" y="190" width="180" height="230" rx="14" fill="#263138" stroke="#374751" strokeWidth="2" />
        {/* Seated Guest in Lounge */}
        <g transform="translate(820, 260)">
          <ellipse cx="28" cy="28" rx="22" ry="16" fill="#6d28d9" />
          <circle cx="28" cy="27" r="11" fill="#cfa780" />
        </g>
      </g>
    </svg>
  )
}

