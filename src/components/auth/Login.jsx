import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRequestAccess, setShowRequestAccess] = useState(false);
  const [requestEmail, setRequestEmail] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Import Supabase client dynamically
      const { createSupabaseClient } = await import('../../lib/supabaseClient');
      const supabase = createSupabaseClient();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Fetch user's organization
      const { data: orgData, error: orgError } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', data.user.id)
        .single();

      if (orgError) {
        setError('No organization found. Request access to join a team.');
        return;
      }

      // Store organization context
      localStorage.setItem('taskflow_org_id', orgData.organization_id);
      localStorage.setItem('taskflow_user_id', data.user.id);

      onLoginSuccess(data.user, orgData.organization_id);
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAccess = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { createSupabaseClient } = await import('../../lib/supabaseClient');
      const supabase = createSupabaseClient();

      // Insert access request
      const { error: reqError } = await supabase.from('access_requests').insert({
        email: requestEmail,
        status: 'pending',
        requested_at: new Date().toISOString(),
      });

      if (reqError) throw reqError;

      setShowRequestAccess(false);
      setRequestEmail('');
      setError('');
      alert('✓ Request sent! A team admin will review your request shortly.');
    } catch (err) {
      setError(err.message || 'Request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-taskflow-obsidian flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-taskflow-surface border border-taskflow-glass-border rounded-lg p-8 space-y-6 backdrop-blur-xl">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-sent-pearl">TaskFlow</h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Lighting Pipeline Manager</p>
          </div>

          {!showRequestAccess ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-taskflow-obsidian border border-taskflow-glass-border text-white text-sm px-4 py-3 rounded
                  focus:outline-none focus:ring-2 focus:ring-pastel-enquiry-cyan transition"
                required
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-taskflow-obsidian border border-taskflow-glass-border text-white text-sm px-4 py-3 rounded
                  focus:outline-none focus:ring-2 focus:ring-pastel-enquiry-cyan transition"
                required
              />

              {error && (
                <div className="p-3 bg-follow-coral bg-opacity-10 border border-follow-coral rounded text-xs text-follow-coral">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-pastel-enquiry-cyan text-taskflow-obsidian font-bold py-3 rounded
                  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => setShowRequestAccess(true)}
                className="w-full text-xs text-pastel-enquiry-cyan hover:text-opacity-80 transition py-2"
              >
                Request Access for Your Team
              </button>
            </form>
          ) : (
            <form onSubmit={handleRequestAccess} className="space-y-4">
              <p className="text-xs text-gray-400 text-center">
                A team admin will review your request and add you to the organization.
              </p>

              <input
                type="email"
                value={requestEmail}
                onChange={(e) => setRequestEmail(e.target.value)}
                placeholder="Your email"
                className="w-full bg-taskflow-obsidian border border-taskflow-glass-border text-white text-sm px-4 py-3 rounded
                  focus:outline-none focus:ring-2 focus:ring-pastel-enquiry-cyan transition"
                required
              />

              {error && (
                <div className="p-3 bg-follow-coral bg-opacity-10 border border-follow-coral rounded text-xs text-follow-coral">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-pastel-quote-mint text-taskflow-obsidian font-bold py-3 rounded
                  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition"
              >
                {isLoading ? 'Sending...' : 'Request Access'}
              </button>

              <button
                type="button"
                onClick={() => setShowRequestAccess(false)}
                className="w-full text-xs text-gray-400 hover:text-gray-300 transition py-2"
              >
                Back to Sign In
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
