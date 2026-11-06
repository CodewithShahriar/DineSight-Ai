# DineSight AI — Restaurant Operations & Vision Intelligence

A premium, interactive frontend-only restaurant operations management system simulating AI-powered CCTV surveillance, computer vision gesture detection, and waiter coordination for restaurant managers.

## 🌟 Technology Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (custom charcoal, warm white, forest green, and amber palette)
- **Icons**: Lucide React
- **Routing**: React Router v7
- **Analytics Charts**: Recharts
- **Architecture**: Modular domain structure with zero external backend or cloud database dependencies.

## 🎨 Visual Design Direction
- **Sidebar**: Dark charcoal (`#111618`) with glowing AI status indicators and live camera telemetry
- **Content Background**: Warm white (`#fcfbf8`) for comfortable, elevated executive readability
- **Primary Accent**: Forest green (`#1b4d37`)
- **Warning Accent**: Amber (`#d97706` / `#f59e0b`)
- **Typography**: Plus Jakarta Sans, Inter, and JetBrains Mono

## 📁 Project Architecture
```
src/
├── components/
│   ├── layout/            # Persistent Sidebar, TopNavbar, AppLayout
│   ├── dashboard/         # LiveAlertsFeed, TurnoverOverview, Leaderboard
│   ├── monitoring/        # CameraCard with simulated AI bounding box overlays
│   ├── floor-plan/        # TableInspector and interactive floor grid
│   ├── waiters/           # WaiterCard and shift management
│   ├── notifications/     # Alert dispatch and incident actions
│   ├── analytics/         # Recharts turnover and response time metrics
│   └── shared/            # Card, Button, Badge, StatCard, PageHeader
├── data/
│   ├── mockTables.ts      # 13 tables across 4 restaurant zones
│   ├── mockWaiters.ts     # 5 rostered servers with real-time stats
│   └── mockEvents.ts      # Live AI vision events & 4 CCTV camera streams
├── hooks/
│   ├── useClock.ts        # Dynamic live date & time
│   └── useRestaurantData.ts # Local simulated store & actions
├── pages/
│   ├── Overview.tsx       # Operations Command Center
│   ├── LiveMonitoring.tsx # Multi-camera CCTV wall & AI layer toggles
│   ├── FloorPlan.tsx      # Interactive dining room matrix & inspector
│   ├── WaiterManagement.tsx # Staff directory & table reassignment
│   ├── Analytics.tsx      # Velocity, turnover & SLA reports
│   ├── Notifications.tsx  # Chronological incident dispatch log
│   └── Settings.tsx       # AI sensitivity calibration & hardware health
├── types/                 # Domain TypeScript interfaces
├── utils/                 # Formatters, styling helpers, and status badges
├── App.tsx                # Central router configuration
└── main.tsx               # Entrypoint
```