# 📄 TaskFlow System Manifest

**Project Name:** TaskFlow (Lighting Project Orchestrator)
**Version:** 1.2.0
**Framework:** Vite + React (ESM) + Zustand
**Core Principles:** 200-Line Limit, SVG Isolation, Atomic State Management.

---

## 🛠 1. Core Architecture

### **State Engine (`src/store/useTaskFlow.js`)**
- **Technology:** Zustand (no persist middleware — state lives in memory, reset on reload).
- **Schema:** `id`, `title`, `client`, `clientEmail`, `clientPhone`, `projectType`, `location`, `budget`, `priority`, `stageId`, `assignedId`, `deadline`, `description`, `subtasks[]`, `lastUpdate`, `status`.
- **Actions:** `addProject`, `moveProject`, `assignMember`, `toggleSubtask`, `addSubtask`, `addStage`, `removeStage`, `addTeamMember`, `removeTeamMember`, `setStaleThreshold`.

### **Logic Utilities (`src/utils/`)**
- **`dateHelpers.js`**: `checkStale(timestamp)` → `true` after N days (configurable via `staleThreshold`).
- **`reportGenerator.js`**: Formats project data into export-ready text strings.
- **`billingHelpers.js`**: `canAddProject(count, plan)` gate for project limits.

---

## 🎨 2. Design System (Lumina Dark v2)

### **Color Palette (from `tailwind.config.js` + CSS vars)**
| Token | Hex | Use |
|---|---|---|
| `tf-bg` | `#0d0f14` | Main page background |
| `tf-surface` | `#131620` | Card / panel background |
| `tf-border` | `#1e2330` | Borders |
| `tf-border-bright` | `#2a3045` | Hover borders |
| `tf-text` | `#c8d0e8` | Primary text |
| `tf-muted` | `#5c6480` | Labels / secondary text |
| `tf-purple` | `#7c6af7` | Primary accent, Active, buttons |
| `tf-teal` | `#00d4aa` | Won / Synced / Success |
| `tf-orange` | `#f7a26a` | Daylight toggle, Warning |
| `tf-red` | `#f76a6a` | Stale / Danger |

---

## 📂 3. Component Directory

| Component | Path | Function |
|---|---|---|
| **App** | `src/App.jsx` | Root layout: header + sidebar + board |
| **AdminSidebar** | `src/components/sidebar/` | Collapsible left panel (Pipeline / Team / Analytics / Settings) |
| **PipelinePanel** | `src/components/sidebar/` | Add / remove / view pipeline stages |
| **TeamPanel** | `src/components/sidebar/` | Add / remove team members |
| **AnalyticsPanel** | `src/components/sidebar/` | Win rate, pipeline value, stage breakdown |
| **ProjectBoard** | `src/components/board/` | Horizontal kanban orchestrator |
| **StageColumn** | `src/components/board/` | Droppable column (HTML5 DnD) |
| **ProjectCard** | `src/components/board/` | Draggable card (HTML5 DnD) |
| **StatusBar** | `src/components/dashboard/` | Header stats (Active / Won / Synced) |
| **AddProjectForm** | `src/components/forms/` | Rich 6-section project creation form |
| **Modal** | `src/components/ui/` | Reusable `backdrop-blur` overlay |

---

## ⚡ 4. Automation Rules

1. **Follow-up Sensor:** Project in "Following" stage for >N days triggers `coral-pulse` alert.
2. **Subtask Chain:** Marking final subtask done auto-advances to next stage (`moveStage`).
3. **Financial Heatmap:** Budget > AED 10,000 triggers `amber-warm` glow on card.
4. **Drag & Drop:** Native HTML5 DnD — drag `ProjectCard`, drop onto any `StageColumn`.

---

## 🚀 5. Deployment

- **Build:** `npm run build` (Vite)
- **Host:** Vercel (auto-deploy on `git push` to `main`)
- **Persistence:** In-memory (Zustand). No localStorage yet — data resets on page reload.

---

## 📝 6. Changelog

| Version | Date | Changes |
|---|---|---|
| 1.2.0 | 2026-03-29 | SVG icon system (SidebarIcons, StageIcons, UIIcons), ProjectDetail edit modal (click any card), bottleneck heatmap in analytics, member performance stats, stage color editing via swatch click, 4 color theme presets (Midnight/Ocean/Ember/Forest), day mode background fixed, "New Enquiry" header button, generalized project types (industry-agnostic), themes.js CSS-var system |
| 1.1.0 | 2026-03-29 | Admin sidebar (Pipeline/Team/Analytics/Settings), drag-and-drop, rich project form, color palette update |
| 1.0.0 | — | Initial release: Kanban board, StatusBar, basic project form |
