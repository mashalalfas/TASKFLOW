import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';

export default function TeamInvite({ organizationId }) {
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateInviteLink = async () => {
    setLoading(true);
    try {
      const token = crypto.getRandomValues(new Uint8Array(16)).reduce((a, b) => a + b.toString(16), '');
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

      const { error } = await supabase
        .from('invite_tokens')
        .insert([{ token, organization_id: organizationId, expires_at: expiresAt }]);

      if (error) throw error;

      const baseUrl = window.location.origin;
      const link = `${baseUrl}?invite=${token}`;
      setInviteLink(link);
    } catch (err) {
      console.error('Failed to generate invite:', err);
      alert('Failed to generate invite link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white uppercase">Team Invites</h3>
      <p className="text-sm text-gray-400">Generate a link to invite your team members. Valid for 30 days.</p>

      {!inviteLink ? (
        <button
          onClick={generateInviteLink}
          disabled={loading}
          className="w-full px-4 py-3 bg-pastel-enquiry-cyan text-taskflow-obsidian font-bold rounded-lg
            hover:bg-opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Invite Link'}
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-3"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="flex-1 bg-taskflow-obsidian border border-taskflow-glass-border text-white text-sm px-3 py-2 rounded-lg"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                copied
                  ? 'bg-pastel-quote-mint text-taskflow-obsidian shadow-[0_0_15px_rgba(178,242,187,0.4)]'
                  : 'bg-pastel-enquiry-cyan text-taskflow-obsidian hover:bg-opacity-90'
              }`}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </motion.button>
          </div>
          <button
            onClick={() => setInviteLink('')}
            className="w-full text-xs text-gray-400 hover:text-gray-300 transition"
          >
            Generate new link
          </button>
        </motion.div>
      )}
    </div>
  );
}
