import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import useTaskFlow from './store/useTaskFlow';
import StatusBar from './components/dashboard/StatusBar';
import ProjectBoard from './components/board/ProjectBoard';
import Modal from './components/ui/Modal';
import AddProjectForm from './components/forms/AddProjectForm';
import UpgradePrompt from './components/ui/UpgradePrompt';
import AdminSidebar from './components/sidebar/AdminSidebar';
import ProjectDetail from './components/board/ProjectDetail';
import { EnquiryIcon } from './components/icons/UIIcons';
import { applyTheme } from './utils/themes';

export default function App() {
  const [showAddProject,  setShowAddProject]  = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isHydrated,      setIsHydrated]      = useState(false);
  const [darkMode,        setDarkMode]        = useState(true);
  const [sidebarOpen,     setSidebarOpen]     = useState(true);
  const [userPlan,        setUserPlan]        = useState('basic');
  const { projects, activeTheme } = useTaskFlow();

  useEffect(() => { setIsHydrated(true); }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    applyTheme(activeTheme);
  }, [activeTheme]);

  if (!isHydrated) return null;

  const mainLeft = sidebarOpen ? 'ml-56' : 'ml-14';

  const bgStyle = darkMode
    ? { backgroundColor: 'var(--tf-bg, #0d0f14)' }
    : { backgroundColor: '#f8fafc' };

  return (
    <div className={`min-h-screen w-screen transition-colors duration-500 overflow-hidden flex flex-col ${darkMode ? 'text-slate-100' : 'text-slate-900'}`} style={bgStyle}>

      {/* ── HEADER ── */}
      <header
        className="fixed top-0 w-full z-[60] flex items-center justify-between px-5 py-2.5 backdrop-blur-md border-b"
        style={{
          backgroundColor: darkMode ? 'rgba(13,15,20,0.9)' : 'rgba(248,250,252,0.9)',
          borderColor:     darkMode ? 'var(--tf-border,#1e2330)' : '#e2e8f0',
        }}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
            style={{ backgroundColor: 'rgba(124,106,247,0.15)', border: '1px solid rgba(124,106,247,0.35)', color: 'var(--tf-accent,#7c6af7)' }}>
            TF
          </div>
          <h1 className="font-black tracking-tighter text-lg select-none" style={{ color: darkMode ? 'var(--tf-text,#c8d0e8)' : '#1e293b' }}>
            TaskFlow
          </h1>
        </div>

        {/* Center: Stats */}
        <StatusBar />

        {/* Right: New Enquiry + Toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setShowAddProject(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg font-black text-[11px] uppercase tracking-wider transition-all hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: 'var(--tf-accent,#7c6af7)',
              color: 'white',
              boxShadow: '0 0 16px rgba(124,106,247,0.4)',
            }}
          >
            <EnquiryIcon size={14} color="white" />
            New Enquiry
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--tf-muted,#5c6480)' }}>
              {darkMode ? 'Midnight' : 'Daylight'}
            </span>
            <button onClick={() => setDarkMode(v => !v)}
              className="w-11 h-6 rounded-full relative transition-all"
              style={{ backgroundColor: darkMode ? 'var(--tf-border,#1e2330)' : '#cbd5e1', border: `1px solid ${darkMode ? 'var(--tf-border-bright,#2a3045)' : '#94a3b8'}` }}>
              <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-500 shadow-sm ${darkMode ? 'left-6' : 'left-1'}`}
                style={{ backgroundColor: darkMode ? 'var(--tf-accent,#7c6af7)' : 'var(--tf-orange,#f7a26a)' }} />
            </button>
          </div>
        </div>
      </header>

      {/* ── SIDEBAR ── */}
      <AdminSidebar darkMode={darkMode} onToggle={setSidebarOpen} />

      {/* ── BOARD ── */}
      <main className={`flex-1 pt-14 transition-all duration-300 overflow-x-auto custom-scrollbar ${mainLeft}`}>
        <ProjectBoard darkMode={darkMode} onOpenProject={setSelectedProject} />
      </main>

      <UpgradePrompt activeProjects={projects.length} plan={userPlan} onUpgradeClick={() => setUserPlan('pro')} />

      {/* ── PROJECT DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            key={selectedProject.id}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      {/* ── ADD PROJECT MODAL ── */}
      <AnimatePresence mode="wait">
        {showAddProject && (
          <Modal isOpen={showAddProject} onClose={() => setShowAddProject(false)} title="New Enquiry">
            <AddProjectForm onClose={() => setShowAddProject(false)} plan={userPlan} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
