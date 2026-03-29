import { supabase } from '../lib/supabaseClient';

/**
 * Log errors to Supabase without PII
 * Captures: error message, stack trace, browser specs, organization_id
 */
export async function logErrorToSupabase(error, errorInfo, organizationId) {
  try {
    const browserSpecs = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    };

    const errorLog = {
      error_message: error?.message || 'Unknown error',
      error_stack: error?.stack || '',
      component_stack: errorInfo?.componentStack || '',
      browser_specs: JSON.stringify(browserSpecs),
      organization_id: organizationId || null,
      timestamp: new Date().toISOString(),
    };

    // Insert into system_logs table with RLS policy check
    const { error: insertError } = await supabase
      .from('system_logs')
      .insert([errorLog]);

    if (insertError) {
      console.error('Failed to log error to Supabase:', insertError);
    }
  } catch (e) {
    // Fail silently to avoid double-error
    console.error('Error logging system:', e);
  }
}
