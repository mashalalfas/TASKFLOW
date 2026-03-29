import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import useTaskFlow from './store/useTaskFlow';
import StatusBar from './components/dashboard/StatusBar';
import ProjectBoard from './components/board/ProjectBoard';
import Modal from './components/ui/Modal';
import AddProjectForm from './components/forms/AddProjectForm';
import UpgradePrompt from './components/ui/UpgradePrompt';

export default function App() {
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to Navy
  const [userPlan, setUserPlan] = useState('basic');
  const { projects } = useTaskFlow();

  useEffect(() => {
    setIsHydrated(true);
    // This connects the toggle to Tailwind's 'dark:' classes
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleUpgrade = () => {
    setUserPlan('pro');
    // Optional: Add analytics tracking or show a success message here
  };

  if (!isHydrated) return null;

 // ... (Keep your imports and logic at the top the same)

  return (
    /* This main wrapper now controls the background for the ENTIRE page */
    <div className={`min-h-screen w-screen transition-colors duration-500 overflow-hidden flex flex-col
      ${darkMode ? 'bg-[#020617] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* 1. STATUS BAR & TOGGLE CONTAINER */}
      <header className="fixed top-0 w-full z-[60] flex items-center justify-between px-6 py-3 bg-white/5 dark:bg-black/20 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-4">
          <h1 className="font-black tracking-tighter text-xl italic">TaskFlow</h1>
          <StatusBar />
        </div>

        {/* Improved Toggle Switch - No more overlapping! */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
            {darkMode ? 'Midnight' : 'Daylight'}
          </span>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="w-11 h-6 rounded-full bg-slate-300 dark:bg-slate-800 relative transition-all border border-slate-400/20 dark:border-white/10"
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-500 shadow-sm 
              ${darkMode ? 'left-6 bg-sky-400' : 'left-1 bg-orange-400'}`} 
            />
          </button>
        </div>
      </header>

      {/* 2. MAIN BOARD AREA */}
      <main className="flex-1 pt-20 overflow-x-auto custom-scrollbar">
        {/* We pass nothing here, the board will inherit the theme from the parent div */}
        <ProjectBoard />
      </main>

      {/* 3. UPGRADE & ACTION BUTTONS */}
      <UpgradePrompt 
        activeProjects={projects.length} 
        plan={userPlan}
        onUpgradeClick={handleUpgrade}
      />

      <button
        onClick={() => setShowAddProjectModal(true)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-sky-500 hover:bg-sky-400 text-white
          font-bold text-2xl shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
      >
        +
      </button>

      {/* 4. MODALS */}
      <AnimatePresence mode="wait">
        {showAddProjectModal && (
          <Modal isOpen={showAddProjectModal} onClose={() => setShowAddProjectModal(false)} title="New Project">
            <AddProjectForm onClose={() => setShowAddProjectModal(false)} plan={userPlan} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}