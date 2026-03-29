This README serves as the technical manual and "Brand Identity" guide for TaskFlow. It explains how the code reflects the lighting industry's specific needs while maintaining the strict architecture we established.

💡 TaskFlow: Lighting Project Orchestrator
TaskFlow is a high-end, glassmorphic project management tool designed specifically for the professional lighting industry. It tracks the lifecycle of a project from initial Enquiry through Design and Procurement, ending in a Commissioned (Won) or Lost status.

🎨 The Aesthetic: "Lumina Dark"
The UI is built on a "Next Level" dark-mode foundation to simulate a high-end lighting control gallery.

Base: Obsidian (#0A0A0C) with Matte Surface (#161618) cards.

Accents: Vibrant Neon-Pastels representing different light temperatures and urgency levels.

Effects: Heavy backdrop-blur-xl (Glassmorphism) and custom neon-glow utility classes.

🛠 Technical Architecture
Built with Vite + React + Zustand, adhering to strict performance and token-efficiency constraints.

1. Atomic Component Structure
To maintain a < 200-line file limit, the interface is modularized:

ProjectBoard: The horizontal scrolling orchestrator.

StageColumn: Logic-lite container for specific project phases.

ProjectCard: The primary interaction unit with built-in "Stale" detection.

2. The "Lighting Pipeline" Logic
The workflow is automated via the Zustand Store (useTaskFlow.js):

Auto-Advance: When all subtasks in a card are marked "Done," the project automatically slides to the next stage.

Heat-Map Tracking: The checkStale utility monitors the "Following" stage. If a project hasn't been touched in 5 days, the card triggers a Coral-Pulse neon glow, signaling a cold lead.

📂 Directory Map
Plaintext
src/
├── components/
│   ├── board/         # Layout & Kanban Logic
│   ├── ui/            # Reusable Glassmorphic HUD & Modals
│   ├── forms/         # Subtask & Project Editors
│   └── icons/         # Isolated Lighting-Specific SVGs
├── store/             # Zustand State & Persistence Middleware
├── utils/             # Date logic & Reporting helpers
├── App.jsx            # Lean Root (< 50 lines)
└── tailwind.config.js # Custom Design Tokens & Glow Utilities
🚀 Workflow Highlights
Enquiry: Start with an Ice-Cyan glow.

Design: Moves to Lavender as technical specs are drafted.

Quotation: Transitions to Mint once the price is sent.

Following: Triggers Coral-Pulse alerts if no interaction occurs for 5 days.

Won: Finalizes with a Vibrant Pearl glow and enters the "Commissioned" state.