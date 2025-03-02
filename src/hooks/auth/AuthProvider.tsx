
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { 
  AUTH_USER_KEY, 
  AUTH_SESSION_KEY, 
  saveAuthState, 
  ensureCustomerExists,
  getSessionFromSupabase
} from './authUtils';
import { createAuthActions } from './authActions';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state from localStorage if available
  const [session, setSession] = useState<Session | null>(() => {
    const savedSession = localStorage.getItem(AUTH_SESSION_KEY);
    return savedSession ? JSON.parse(savedSession) : null;
  });
  
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(AUTH_USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [loading, setLoading] = useState(true); // Always start with loading to check auth
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // Helper function to update auth state
  const updateAuthState = useCallback((newSession: Session | null, newUser: User | null) => {
    console.log('Updating auth state:', !!newSession, !!newUser);
    saveAuthState(newSession, newUser);
    setSession(newSession);
    setUser(newUser);
  }, []);

  // Helper function to refresh the session
  const refreshSession = useCallback(async () => {
    // Skip if already refreshing to prevent multiple calls
    if (refreshing) {
      console.log("AuthProvider: Already refreshing, skipping");
      return;
    }
    
    try {
      setRefreshing(true);
      console.log("AuthProvider: Refreshing session");
      const { data, error } = await getSessionFromSupabase();
      
      if (error) {
        console.error('Error refreshing session:', error.message);
        setError(error.message);
        return;
      }

      updateAuthState(data.session, data.session?.user ?? null);
      
      // Ensure customer record exists if we have a user
      if (data.session?.user) {
        await ensureCustomerExists(data.session.user);
      }
      
      console.log("AuthProvider: Session refreshed", !!data.session);
    } catch (err) {
      console.error('Error in refreshSession:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing, updateAuthState]);

  // Create auth actions
  const { signIn, signUp, signOut } = createAuthActions({
    updateAuthState,
    setLoading,
    setError,
    refreshSession,
    navigate
  });

  // Initial session loading and auth state subscription
  useEffect(() => {
    let isMounted = true;
    
    // Get initial session
    const getInitialSession = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      
      try {
        console.log("AuthProvider: Getting initial session");
        const { data, error } = await getSessionFromSupabase();
        
        if (error) {
          console.error('Error getting session:', error.message);
          setError(error.message);
          setLoading(false);
          return;
        }

        if (isMounted) {
          updateAuthState(data.session, data.session?.user ?? null);
        
          // Ensure customer record exists
          if (data.session?.user) {
            await ensureCustomerExists(data.session.user);
          }
        }
        
        console.log("AuthProvider: Initial session loaded", !!data.session);
      } catch (err) {
        console.error('Error in getInitialSession:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Set up auth subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;
        
        console.log('Auth state changed:', event, !!newSession);
        updateAuthState(newSession, newSession?.user ?? null);
        
        // Create customer record on sign in/sign up
        if (newSession?.user) {
          await ensureCustomerExists(newSession.user);
        }
        
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [updateAuthState]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        signIn,
        signUp,
        signOut,
        loading,
        error,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
