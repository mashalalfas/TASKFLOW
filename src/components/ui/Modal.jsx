import { motion } from 'framer-motion';

export default function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-40"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-taskflow-surface border border-taskflow-glass-border rounded-lg p-6 max-w-md w-full shadow-2xl"
      >
        {title && (
          <h2 className="text-lg font-bold text-white mb-4">{title}</h2>
        )}
        {children}
      </motion.div>
    </motion.div>
  );
}
