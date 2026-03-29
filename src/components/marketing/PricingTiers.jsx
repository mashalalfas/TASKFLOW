import { useState } from 'react';
import { motion } from 'framer-motion';

const plans = {
  pro: { features: ['✓ Unlimited projects', '✓ Real-time team sync', '✓ Custom stages', '✓ Full analytics'] },
  enterprise: { features: ['✓ Custom webhooks', '✓ SuperAdmin auditing', '✓ Dedicated support', '✓ SLA guarantee'] },
};

export default function PricingTiers() {
  const [isAnnual, setIsAnnual] = useState(false);
  const proPrice = isAnnual ? 50 : 5;

  return (
    <div className="w-screen min-h-screen bg-taskflow-obsidian text-sent-pearl py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Transparent Pricing</h1>
        <p className="text-gray-300 text-center mb-6">No hidden fees. Professional pipeline management for the price of a coffee.</p>
        <div className="flex justify-center mb-12 gap-3">
          <button onClick={() => setIsAnnual(false)} className={`px-5 py-2 rounded-full transition font-semibold ${!isAnnual ? 'bg-pastel-enquiry-cyan text-taskflow-obsidian' : 'text-gray-400'}`}>Monthly</button>
          <button onClick={() => setIsAnnual(true)} className={`px-5 py-2 rounded-full transition font-semibold ${isAnnual ? 'bg-pastel-enquiry-cyan text-taskflow-obsidian' : 'text-gray-400'}`}>Annual <span className="ml-2 text-xs bg-pastel-quote-mint text-taskflow-obsidian px-2 py-0.5 rounded">2 months free</span></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div layout className="p-8 rounded-2xl bg-taskflow-surface/40 backdrop-blur-xl border border-taskflow-glass-border hover:border-pastel-enquiry-cyan/50 hover:shadow-[0_0_20px_rgba(197,246,250,0.2)] transition">
            <h2 className="text-2xl font-bold mb-1">Pro</h2>
            <p className="text-gray-400 text-sm mb-6">$5 per user/month</p>
            <motion.div key={isAnnual ? 'annual' : 'monthly'} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="mb-6">
              <span className="text-5xl font-bold">${proPrice}</span>
              <span className="text-sm text-gray-400">{isAnnual ? '/user/year' : '/user/month'}</span>
            </motion.div>
            <ul className="space-y-2 mb-8">{plans.pro.features.map((f, i) => <li key={i} className="text-sm text-gray-300">{f}</li>)}</ul>
            <button className="w-full py-3 bg-pastel-quote-mint text-taskflow-obsidian font-bold rounded-lg hover:bg-opacity-90 transition shadow-[0_0_20px_rgba(178,242,187,0.3)]">Select Plan</button>
          </motion.div>
          <motion.div layout className="p-8 rounded-2xl bg-gradient-to-br from-taskflow-surface/50 to-taskflow-surface/20 backdrop-blur-xl border border-pastel-enquiry-cyan/30 hover:border-pastel-enquiry-cyan/60 hover:shadow-[0_0_30px_rgba(197,246,250,0.2)] transition">
            <div className="flex justify-between items-start mb-1">
              <h2 className="text-2xl font-bold">Enterprise</h2>
              <span className="text-xs bg-pastel-enquiry-cyan text-taskflow-obsidian px-2 py-1 rounded font-semibold">CUSTOM</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">For large organizations</p>
            <div className="text-4xl font-bold mb-6 text-pastel-enquiry-cyan">Custom</div>
            <ul className="space-y-2 mb-8">{plans.enterprise.features.map((f, i) => <li key={i} className="text-sm text-gray-300">{f}</li>)}</ul>
            <button className="w-full py-3 bg-pastel-enquiry-cyan text-taskflow-obsidian font-bold rounded-lg hover:bg-opacity-90 transition">Request Demo</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
