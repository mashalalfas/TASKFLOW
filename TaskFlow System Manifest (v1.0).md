# 📄 TaskFlow System Manifest

**Project Name:** TaskFlow (Lighting Project Orchestrator)  
**Version:** 1.0.0  
**Framework:** Vite + React (ESM)  
**Core Principles:** 200-Line Limit, SVG Isolation, Atomic State Management.

---

## 🛠 1. Core Architecture

### **State Engine (`src/store/useTaskFlow.js`)**
* **Technology:** Zustand + `persist` middleware.
* **Logic:** * **Auto-Advance:** Moving projects to the next stage upon 100% subtask completion.
    * **Financial Tracking:** Global selectors for `Won` revenue vs. `Pipeline` potential.
    * **Schema:** `id`, `title`, `client`, `budget`, `stageId`, `lastUpdate`, `subtasks[]`.

### **Logic Utilities (`src/utils/`)**
* **`dateHelpers.js`**: Contains `checkStale(timestamp)`, a sensor-like function returning `true` after 432,000,000ms (5 days) of inactivity.
* **`reportGenerator.js`**: Formats project data into clean, export-ready text strings.

---

## 🎨 2. Design System (Lumina Dark)

### **Tailwind Configuration (`tailwind.config.js`)**
* **Base:** `obsidian` (#0A0A0C) and `surface` (#161618).
* **Glass:** `glass-border` (white/0.08) and `glass-bg` (white/0.03).
* **Lighting Palette:**
    * `enquiry-cyan`: #C5F6FA (Cold Lead)
    * `design-lavender`: #E5DBFF (In-Progress)
    * `follow-coral`: #FFD8D8 (Stale/Alert)
    * `mint-bright`: #B2F2BB (Won/Commissioned)
* **Utilities:** Custom `neon-glow` box-shadows (15px blur).

---

## 📂 3. Component Directory

| Component | Path | Function |
| :--- | :--- | :--- |
| **ProjectBoard** | `src/components/board/` | Horizontal orchestrator with radial lighting gradient. |
| **StageColumn** | `src/components/board/` | Vertical pipeline segment with dynamic project counters. |
| **ProjectCard** | `src/components/board/` | Glassmorphic unit; triggers `coral-pulse` when stale. |
| **StatusBar** | `src/components/ui/` | Global HUD showing Active Count, Stale Alerts, and Total $. |
| **Modal** | `src/components/ui/` | Reusable `backdrop-blur-xl` overlay for all forms. |
| **IconRegistry** | `src/components/icons/` | Isolated SVG components (Bulb, Clock, Check) - **Zero Inlining**. |

---

## ⚡ 4. Automation Rules

1.  **The Follow-up Sensor:** If a project sits in the "Following" stage for >5 days, the UI physically pulses to alert the sales engineer.
2.  **The Subtask Chain:** Marking the final subtask as "Done" triggers an immediate `moveStage` action to the next index in the pipeline.
3.  **Financial Heatmap:** Entering a budget > $10,000 triggers an `amber-warm` glow on the card to denote high-priority "Heavy Lighting" projects.

---

## 🚀 5. Deployment Specs
* **Build Command:** `npm run build` (Vite).
* **Performance:** Code-splitting configured in `vite.config.js` for sub-2s initial load.
* **Persistence:** All data is synced to `localStorage` under the key `taskflow-storage`.

---

**Manifest Status: [VALIDATED]** *All files under 200 lines. Architecture is modular and scalable.*

Would you like me to generate a **Phase 2 Roadmap** for features like Multi-User Auth or Google Calendar integration?