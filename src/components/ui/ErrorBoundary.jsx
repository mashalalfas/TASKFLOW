import React from 'react';
import { logErrorToSupabase } from '../../utils/errorLogger';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TaskFlow Error:', error, errorInfo);
    
    // Log to Supabase (non-blocking)
    const organizationId = localStorage.getItem('taskflow_org_id');
    logErrorToSupabase(error, errorInfo, organizationId);
  }

  handleClearCache = () => {
    try {
      localStorage.removeItem('taskflow-storage');
      sessionStorage.clear();
      window.location.reload();
    } catch (e) {
      console.error('Failed to clear cache:', e);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen bg-taskflow-obsidian flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md">
            <div className="relative">
              <div className="text-6xl font-bold text-follow-coral animate-pulse">⚠</div>
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse"
                style={{
                  background: 'radial-gradient(circle, #FFD8D8, transparent)',
                  filter: 'blur(24px)',
                }}
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-sent-pearl">System Reset Required</h2>
              <p className="text-sm text-gray-400">
                TaskFlow encountered an unexpected error. Your data is safe, but we need to restart.
              </p>
            </div>

            <button
              onClick={this.handleClearCache}
              className="w-full bg-pastel-follow-coral text-taskflow-obsidian font-bold py-3 rounded
                hover:bg-opacity-90 transition shadow-lg"
            >
              Clear Cache & Restart
            </button>

            <p className="text-xs text-gray-500">
              Error: {this.state.error?.message || 'Unknown error'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
