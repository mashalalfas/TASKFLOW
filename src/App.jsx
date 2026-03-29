import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import useTaskFlow from './store/useTaskFlow';
import StatusBar from './components/dashboard/StatusBar';
import ProjectBoard from './components/board/ProjectBoard';
import Modal from './components/ui/Modal';
import AddProjectForm from './components/forms/AddProjectForm';
import UpgradePrompt from './components/ui/UpgradePrompt';
import AdminSidebar from './components/sidebar/AdminSidebar';

export default function App() {
  const [showAddProject, setShowAddProject] = useState(false);
  const [isHydrated, setIsHydrated]         = useState(false);
  const [darkMode, setDarkMode]             = useState(true);
  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [userPlan, setUserPlan]             = useState('basic');
  const { projects } = useTaskFlow();

  useEffect(() => {
    setIsHydrated(true);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  if (!isHydrated) return null;

  const mainLeft = sidebarOpen ? 'ml-56' : 'ml-14';

  return (
    <div
      className={`min-h-screen w-screen transition-colors duration-500 overflow-hidden flex flex-col ${darkMode ? 'text-slate-100' : 'bg-slate-50 text-slate-900'}`}
      style={darkMode ? { backgroundColor: '#0d0f14' } : {}}
    >
      {/* ── HEADER ── */}
      <header
        className="fixed top-0 w-full z-[60] flex items-center justify-between px-6 py-3 backdrop-blur-md border-b"
        style={{
          backgroundColor: darkMode ? 'rgba(13,15,20,0.88)' : 'rgba(255,255,255,0.88)',
          borderColor:     darkMode ? '#1e2330' : '#e2e8f0',
        }}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
            style={{ backgroundColor: 'rgba(124,106,247,0.15)', border: '1px solid rgba(124,106,247,0.35)', color: '#7c6af7' }}
          >
            TF
          </div>
          <h1 className="font-black tracking-tighter text-lg select-none" style={{ color: darkMode ? '#c8d0e8' : '#1e293b' }}>
            TaskFlow
          </h1>
        </div>

        {/* Center: Stats */}
        <StatusBar />

        {/* Right: Toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#5c6480' }}>
            {darkMode ? 'Midnight' : 'Daylight'}
          </span>
          <button
            onClick={() => setDarkMode(v => !v)}
            className="w-11 h-6 rounded-full relative transition-all"
            style={{
              backgroundColor: darkMode ? '#1e2330' : '#cbd5e1',
              border: `1px solid ${darkMode ? '#2a3045' : '#94a3b8'}`,
            }}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-500 shadow-sm ${darkMode ? 'left-6' : 'left-1'}`}
              style={{ backgroundColor: darkMode ? '#7c6af7' : '#f7a26a' }}
            />
          </button>
        </div>
      </header>

      {/* ── SIDEBAR ── */}
      <AdminSidebar darkMode={darkMode} onToggle={setSidebarOpen} />

      {/* ── MAIN BOARD ── */}
      <main className={`flex-1 pt-14 transition-all duration-300 overflow-x-auto custom-scrollbar ${mainLeft}`}>
        <ProjectBoard />
      </main>

      {/* ── UPGRADE PROMPT ── */}
      <UpgradePrompt
        activeProjects={projects.length}
        plan={userPlan}
        onUpgradeClick={() => setUserPlan('pro')}
      />

      {/* ── FAB ── */}
      <button
        onClick={() => setShowAddProject(true)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full font-bold text-2xl shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
        style={{ backgroundColor: '#7c6af7', color: 'white', boxShadow: '0 0 24px rgba(124,106,247,0.5)' }}
      >
        +
      </button>

      {/* ── MODALS ── */}
      <AnimatePresence mode="wait">
        {showAddProject && (
          <Modal isOpen={showAddProject} onClose={() => setShowAddProject(false)} title="New Project">
            <AddProjectForm onClose={() => setShowAddProject(false)} plan={userPlan} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
