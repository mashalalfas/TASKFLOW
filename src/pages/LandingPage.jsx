import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const features = [
  {
    title: 'Stale Pulse',
    description: 'Never miss a follow-up with heat-map alerts.',
    icon: '🔥',
  },
  {
    title: 'Auto-Advance',
    description: 'Move from Design to Won automatically.',
    icon: '⚡',
  },
  {
    title: 'Team Sync',
    description: 'Real-time collaboration for site and office.',
    icon: '🔗',
  },
];

export default function LandingPage() {
  const handleStartTrial = () => {
    // TODO: Navigate to signup/trial flow
    console.log('Start Free Trial clicked');
  };

  return (
    <div className="w-screen min-h-screen bg-taskflow-obsidian text-sent-pearl overflow-hidden">
      {/* Radial Gradient Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(197, 246, 250, 0.15) 0%, transparent 60%)',
        }}
      />

      {/* Hero Section */}
      <motion.div
        className="relative flex items-center justify-center min-h-screen px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl text-center space-y-8 z-10">
          {/* Logo/Brand */}
          <motion.div variants={itemVariants} className="text-6xl font-bold">
            💡 TaskFlow
          </motion.div>

          {/* Hook Text */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold leading-tight"
          >
            Stop losing enquiries in the dark.
            <br />
            <span className="bg-gradient-to-r from-pastel-enquiry-cyan to-pastel-quote-mint bg-clip-text text-transparent">
              The only Pipeline Manager built for the Lighting Industry.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >
            Real-time pipeline visibility, automated follow-ups, and team collaboration
            designed for lighting sales professionals.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            variants={itemVariants}
            onClick={handleStartTrial}
            className="mx-auto block px-8 py-4 bg-pastel-enquiry-cyan text-taskflow-obsidian font-bold text-lg rounded-lg
              hover:bg-opacity-90 transition transform hover:scale-105
              shadow-[0_0_30px_rgba(197,246,250,0.4)]"
          >
            Start Free Trial
          </motion.button>

          <motion.p
            variants={itemVariants}
            className="text-sm text-gray-400"
          >
            No credit card required • 14-day free trial
          </motion.p>
        </div>
      </motion.div>

      {/* Feature Cards Section */}
      <motion.div
        className="relative py-24 px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold text-center mb-16"
          >
            Built for Lighting Sales
          </motion.h2>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative p-8 rounded-2xl
                  bg-taskflow-surface/40 backdrop-blur-xl
                  border border-taskflow-glass-border
                  hover:border-pastel-enquiry-cyan/50 transition
                  hover:shadow-[0_0_20px_rgba(197,246,250,0.2)]"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Footer CTA */}
      <motion.div
        className="relative py-20 px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-6">Ready to transform your pipeline?</h3>
          <button
            onClick={handleStartTrial}
            className="px-8 py-4 bg-pastel-enquiry-cyan text-taskflow-obsidian font-bold rounded-lg
              hover:bg-opacity-90 transition transform hover:scale-105
              shadow-[0_0_30px_rgba(197,246,250,0.4)]"
          >
            Start Your Free Trial
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
