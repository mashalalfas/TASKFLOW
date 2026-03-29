import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { createSupabaseClient } = await import('../../lib/supabaseClient');
        const supabase = createSupabaseClient();

        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData.session?.user) {
          setUser(sessionData.session.user);
          const storedOrgId = localStorage.getItem('taskflow_org_id');
          if (storedOrgId) {
            setOrgId(storedOrgId);
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = (authUser, organizationId) => {
    // Security: Leak-Proof Guard - Verify non-null org_id
    if (!organizationId) throw new Error('Security: organization_id is required');
    if (!authUser?.id) throw new Error('Security: user id is required');
    setUser(authUser);
    setOrgId(organizationId);
    localStorage.setItem('taskflow_org_id', organizationId);
    localStorage.setItem('taskflow_user_id', authUser.id);
  };

  const logout = async () => {
    try {
      const { createSupabaseClient } = await import('../../lib/supabaseClient');
      const supabase = createSupabaseClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setOrgId(null);
      localStorage.removeItem('taskflow_org_id');
      localStorage.removeItem('taskflow_user_id');
    }
  };

  return (
    <AuthContext.Provider value={{ user, orgId, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
