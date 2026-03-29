import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/authContext';
import useTaskFlow from '../../store/useTaskFlow';

export default function SuperAdmin() {
  const { user } = useAuth();
  const { staleThreshold, setStaleThreshold } = useTaskFlow();
  const [organizations, setOrganizations] = useState([]);
  const [platformStats, setPlatformStats] = useState({
    totalOrgs: 0,
    totalWonValue: 0,
    totalProjects: 0,
    activeTrials: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlatformData();
  }, []);

  const fetchPlatformData = async () => {
    try {
      const { createSupabaseClient } = await import('../../lib/supabaseClient');
      const supabase = createSupabaseClient();

      // Fetch all organizations (superadmin only)
      const { data: orgsData, error: orgsError } = await supabase
        .from('organizations')
        .select('id, name, slug, created_at, trial_ends_at');

      if (orgsError) throw orgsError;

      // Fetch total won projects across all orgs
      const { data: projectsData, error: projError } = await supabase
        .from('projects')
        .select('organization_id, title, client')
        .eq('stage_id', 7); // Won stage

      if (projError) throw projError;

      setOrganizations(orgsData || []);
      setPlatformStats({
        totalOrgs: orgsData?.length || 0,
        totalWonValue: projectsData?.length || 0,
        totalProjects: orgsData?.length || 0,
        activeTrials: orgsData?.filter((o) => new Date(o.trial_ends_at) > new Date()).length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch platform data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKillTrial = async (orgId) => {
    if (!window.confirm('Are you sure? This will end the trial immediately.')) return;

    try {
      const { createSupabaseClient } = await import('../../lib/supabaseClient');
      const supabase = createSupabaseClient();

      const { error } = await supabase
        .from('organizations')
        .update({ trial_ends_at: new Date().toISOString(), status: 'trial_ended' })
        .eq('id', orgId);

      if (error) throw error;

      setOrganizations(organizations.map((org) =>
        org.id === orgId ? { ...org, trial_ends_at: new Date().toISOString() } : org
      ));
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Role-based access control
  if (user?.role !== 'superadmin') {
    return (
      <div className="w-screen h-screen bg-taskflow-obsidian flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-follow-coral">Access Denied</h2>
          <p className="text-gray-400">You do not have superadmin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-taskflow-obsidian p-8 overflow-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-pastel-quote-mint">Lumina Command Center</h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Platform Analytics & Control</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Active Organizations', value: platformStats.totalOrgs, color: 'pastel-enquiry-cyan' },
            { label: 'Total Won Projects', value: platformStats.totalWonValue, color: 'pastel-quote-mint' },
            { label: 'Active Trials', value: platformStats.activeTrials, color: 'follow-coral' },
            { label: 'Total Projects', value: platformStats.totalProjects, color: 'yellow-400' },
          ].map((metric) => (
            <div key={metric.label} className="bg-taskflow-surface border border-taskflow-glass-border rounded-lg p-4">
              <p className="text-xs text-gray-400 uppercase">{metric.label}</p>
              <p className={`text-3xl font-bold text-${metric.color} mt-2`}>{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Stale Threshold Control */}
        <div className="bg-taskflow-surface border border-taskflow-glass-border rounded-lg p-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-pastel-quote-mint uppercase">Days Until Project Pulses Red</h3>
            <p className="text-xs text-gray-400">Set stale threshold: {staleThreshold} days</p>
            <input
              type="range"
              min="1"
              max="30"
              value={staleThreshold}
              onChange={(e) => setStaleThreshold(parseInt(e.target.value))}
              className="w-full h-2 bg-taskflow-glass-border rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 day (Quick-Turn)</span>
              <span>30 days (Long-Lead)</span>
            </div>
          </div>
        </div>

        {/* Organizations Table */}
        <div className="bg-taskflow-surface border border-taskflow-glass-border rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-pastel-quote-mint to-pastel-enquiry-cyan px-6 py-4">
            <h2 className="text-sm font-bold text-taskflow-obsidian uppercase">Organizations</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-taskflow-obsidian bg-opacity-50 border-b border-taskflow-glass-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">Trial Ends</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-taskflow-glass-border">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">Loading...</td>
                  </tr>
                ) : (
                  organizations.map((org) => {
                    const trialEnds = new Date(org.trial_ends_at);
                    const isExpired = trialEnds < new Date();
                    return (
                      <tr key={org.id} className="hover:bg-taskflow-obsidian transition">
                        <td className="px-6 py-4 text-sent-pearl font-medium">{org.name}</td>
                        <td className="px-6 py-4 text-gray-400 text-xs">{org.slug}</td>
                        <td className="px-6 py-4 text-gray-400 text-xs">{new Date(org.created_at).toLocaleDateString()}</td>
                        <td className={`px-6 py-4 text-xs font-semibold ${isExpired ? 'text-follow-coral' : 'text-pastel-quote-mint'}`}>
                          {trialEnds.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleKillTrial(org.id)}
                            disabled={isExpired}
                            className="px-3 py-1 bg-follow-coral text-white text-xs rounded font-semibold
                              disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition"
                          >
                            {isExpired ? 'Expired' : 'End Trial'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
