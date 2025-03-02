
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  AUTH_USER_KEY, 
  AUTH_SESSION_KEY, 
  saveAuthState, 
  ensureCustomerExists,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  getSessionFromSupabase
} from './authUtils';
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
  
  const [loading, setLoading] = useState(!user); // Only show loading if no user
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // Helper function to update auth state
  const updateAuthState = useCallback((newSession: Session | null, newUser: User | null) => {
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
      
      console.log("AuthProvider: Session refreshed", !!data.session);
    } catch (err) {
      console.error('Error in refreshSession:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing, updateAuthState]);

  // Initial session loading and auth state subscription
  useEffect(() => {
    let isMounted = true;
    
    // Get initial session
    const getInitialSession = async () => {
      if (!isMounted) return;
      
      // If we already have a user from localStorage, don't show loading
      if (user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        console.log("AuthProvider: Getting initial session");
        const { data, error } = await getSessionFromSupabase();
        
        if (error) {
          console.error('Error getting session:', error.message);
          setError(error.message);
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
      async (_event, newSession) => {
        if (!isMounted) return;
        
        console.log('Auth state changed:', _event, !!newSession);
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
  }, [updateAuthState, user]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await signInWithEmail(email, password);

      if (error) {
        setError(error.message);
        toast.error(error.message);
        return;
      }
      
      // Manual refresh to ensure we have the latest session
      setTimeout(() => refreshSession(), 300);
      toast.success('Signed in successfully!');
      navigate('/dashboard');
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await signUpWithEmail(email, password);

      if (error) {
        setError(error.message);
        toast.error(error.message);
        return;
      }
      
      toast.success('Signed up successfully! Please check your email for the confirmation link.');
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await signOutUser();
      
      if (error) {
        setError(error.message);
        toast.error(error.message);
        return;
      }
      
      // Clear user and session state and localStorage
      updateAuthState(null, null);
      
      toast.success('Signed out successfully!');
      navigate('/');
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

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
