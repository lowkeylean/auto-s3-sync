# AssetFlöw by DASSOLS — Hotel Maintenance App

## Overview
A role-based preventive maintenance and defect management platform for hotel engineering teams. Branded as **"AssetFlöw by DASSOLS"**.

## Tech Stack
- **Frontend**: React 19 + TypeScript + Vite 7
- **Styling**: TailwindCSS v4 (via `@tailwindcss/vite` plugin)
- **Routing**: React Router DOM v7
- **Backend**: Supabase (Auth + PostgreSQL + RLS)
- **Charts**: Recharts v3
- **Icons**: Lucide React
- **Deployment**: Vercel (`vercel.json` present)

## Project Structure
```
src/
├── App.tsx              # Route definitions & role-based access control
├── main.tsx             # Entry point
├── index.css            # Global styles & brand tokens
├── components/          # Shared UI components
│   ├── Dashboard.tsx    # Main dashboard layout
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── BottomNav.tsx    # Mobile bottom navigation
│   ├── ProtectedRoute.tsx   # Auth guard + role gating
│   └── RoleBasedRedirect.tsx # Redirects by role on "/"
├── config/
│   └── navConfig.ts     # Navigation items per role (admin can customize)
├── context/
│   ├── AuthContext.tsx   # Supabase auth state management
│   └── TaskContext.tsx   # Preventive maintenance task state
├── data/                # Mock data (to be replaced with Supabase queries)
│   ├── mockUsers.ts     # Worker database (staff vs contractors)
│   ├── mockRooms.ts     # Room inventory with status
│   └── mockDefects.ts   # Defect records
├── lib/
│   ├── supabase.ts      # Supabase client init
│   └── utils.ts         # Utility helpers (cn for classnames)
├── pages/
│   ├── Login.tsx         # Auth login page
│   ├── AdminHome.tsx     # Admin dashboard
│   ├── WorkerHome.tsx    # Worker task queue
│   ├── WorkerTaskDetail.tsx  # Individual task view
│   ├── SupervisorHome.tsx    # Supervisor dashboard
│   ├── SupervisorSchedule.tsx # Scheduling view
│   ├── ManagerHome.tsx   # Manager dashboard
│   ├── ManagerReports.tsx # Reports & analytics
│   ├── RoomMatrixDashboard.tsx # Room status matrix (240 Good, 53 Upcoming, 18 Overdue)
│   ├── admin/            # Admin-only pages
│   │   ├── UserManagement.tsx
│   │   ├── SystemSettings.tsx
│   │   ├── EquipmentRegistry.tsx
│   │   ├── AuditLog.tsx
│   │   └── ButtonCustomizer.tsx  # Per-role nav customization
│   ├── supervisor/
│   │   ├── TeamOverview.tsx
│   │   └── InspectionLog.tsx
│   ├── manager/
│   │   ├── WorkerManagement.tsx
│   │   ├── EquipmentOverview.tsx
│   │   └── NotificationsCenter.tsx
│   ├── worker/
│   │   ├── TaskHistory.tsx
│   │   ├── WorkerProfile.tsx
│   │   └── EquipmentQuickRef.tsx
│   └── defects/          # Defect management system
│       ├── ReportDefect.tsx    # Admin/Manager/Supervisor report defects
│       ├── DefectQueue.tsx     # All roles view defect queue
│       ├── DefectDetail.tsx    # Individual defect view
│       └── DailyReport.tsx     # Daily maintenance + defect report
├── types/
│   ├── user.ts           # Role, EmploymentType, User interface
│   ├── defect.ts         # Defect types
│   └── supabase.ts       # Supabase generated types
└── assets/
    └── staff-logo.png    # Staff vs contractor visual indicator
supabase/
└── schema.sql            # Database schema (profiles, equipment, tasks, photos)
```

## Roles & Access Control
Four roles with hierarchical access:
| Role | Access |
|------|--------|
| `admin` | Everything — all dashboards + system settings + button customizer |
| `manager` | Dashboard, reports, room matrix, worker management, defect reporting |
| `supervisor` | Dashboard, room matrix, team overview, scheduling, inspections, defect reporting |
| `worker` | Task queue, task detail, history, profile, equipment ref, defect queue |

Route protection is handled in `App.tsx` via `<ProtectedRoute allowedRoles={[...]}/>`.

## Worker Types
Workers are categorized as `staff` (internal hotel employees) or `contractor` (outsourced). Each has `subCategory` and `tags` fields. Visual logos differentiate them in the UI.

## Key Patterns
- **Mock data → Supabase migration**: Data in `src/data/` is progressively being replaced with live Supabase queries
- **Role-based navigation**: `config/navConfig.ts` defines nav items per role; admins can customize via ButtonCustomizer
- **Context providers**: `AuthContext` wraps the entire app for auth state; `TaskContext` for maintenance task state
- **Utility**: `cn()` in `lib/utils.ts` merges Tailwind classes using `clsx` + `tailwind-merge`

## Commands
```bash
npm run dev      # Start dev server (Vite)
npm run build    # Type-check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Environment Variables
Copy `.env.example` → `.env` and set:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key

## Database
Schema in `supabase/schema.sql`. Tables: `profiles`, `equipment`, `tasks`, `photos`. All have RLS enabled. Roles in DB are `admin`, `manager`, `worker` (supervisor is an app-level role).

## Current State
- UI is fully built with mock data for all roles
- Supabase auth is integrated (login works)
- Data migration from mock → live Supabase is in progress
- Defect management system is implemented
- Room matrix shows 311 rooms across floors with status breakdowns
- Admin button customizer allows per-role nav configuration
