import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';

export default function OrgOnboarding({ onOrgCreated }) {
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('Retail');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const sectors = ['Retail', 'Industrial', 'Residential'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('No user session');
      const { data, error } = await supabase.rpc('create_organization', { p_name: companyName, p_sector: sector, p_owner_id: user.id });
      if (error) throw error;
      const orgId = data?.[0]?.id;
      if (!orgId) throw new Error('No organization ID returned');
      await supabase.auth.updateUser({ data: { organization_id: orgId } });
      setSuccess(true);
      setTimeout(() => onOrgCreated?.(orgId), 1200);
    } catch (err) {
      console.error('Org creation failed:', err);
      alert('Failed to create organization. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-taskflow-obsidian flex items-center justify-center p-6">
      {success ? (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 z-10">
          <div className="text-6xl animate-pulse">✨</div>
          <h2 className="text-3xl font-bold text-sent-pearl">Welcome aboard!</h2>
          <p className="text-gray-300">Setting up your pipeline...</p>
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [0, 0.3, 0], scale: [0.5, 2, 3] }} transition={{ duration: 1.5 }} className="fixed inset-0 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(178,242,187,0.4) 0%, transparent 70%)' }} />
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-8 rounded-2xl bg-taskflow-surface/40 backdrop-blur-xl border border-taskflow-glass-border">
          <h1 className="text-3xl font-bold mb-2 text-sent-pearl">Create Your Organization</h1>
          <p className="text-gray-400 text-sm mb-8">Let's get your lighting pipeline ready.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-300 mb-3">Company Name</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g., Apex Lighting Solutions" className="w-full bg-taskflow-obsidian border border-taskflow-glass-border text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-enquiry-cyan transition" required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-300 mb-3">Primary Sector</label>
              <select value={sector} onChange={(e) => setSector(e.target.value)} className="w-full bg-taskflow-obsidian border border-taskflow-glass-border text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-enquiry-cyan transition">
                {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" disabled={loading || !companyName.trim()} className="w-full py-3 bg-pastel-enquiry-cyan text-taskflow-obsidian font-bold rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating...' : 'Get Started'}
            </button>
          </form>
          <p className="text-xs text-gray-500 text-center mt-6">You'll be the owner of this organization and can invite team members anytime.</p>
        </motion.div>
      )}
    </div>
  );
}
