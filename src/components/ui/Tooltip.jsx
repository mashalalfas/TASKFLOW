import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Tooltip({ children, content, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
              bg-taskflow-surface border border-taskflow-glass-border rounded text-xs text-gray-200 
              whitespace-nowrap shadow-neon-glow pointer-events-none z-50 ${className}`}
          >
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 
              bg-taskflow-surface border-r border-b border-taskflow-glass-border rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
