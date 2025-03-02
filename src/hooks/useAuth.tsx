
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { getCustomer, createCustomer } from '@/lib/database';

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
};

const AUTH_USER_KEY = 'auth_user';
const AUTH_SESSION_KEY = 'auth_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  // Helper function to save auth state to localStorage
  const saveAuthState = useCallback((newSession: Session | null, newUser: User | null) => {
    if (newSession) {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(newSession));
    } else {
      localStorage.removeItem(AUTH_SESSION_KEY);
    }
    
    if (newUser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
    
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
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error refreshing session:', error.message);
        setError(error.message);
        return;
      }

      saveAuthState(data.session, data.session?.user ?? null);
      
      console.log("AuthProvider: Session refreshed", !!data.session);
    } catch (err) {
      console.error('Error in refreshSession:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing, saveAuthState]);

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
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error.message);
          setError(error.message);
        }

        if (isMounted) {
          saveAuthState(data.session, data.session?.user ?? null);
        
          // Ensure customer record exists
          if (data.session?.user) {
            try {
              const customer = await getCustomer(data.session.user.id);
              if (!customer && data.session.user.email) {
                await createCustomer({
                  user_id: data.session.user.id,
                  email: data.session.user.email
                });
              }
            } catch (err) {
              console.error('Error ensuring customer record exists:', err);
            }
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
        saveAuthState(newSession, newSession?.user ?? null);
        
        // Create customer record on sign in/sign up
        if (newSession?.user) {
          try {
            const customer = await getCustomer(newSession.user.id);
            if (!customer && newSession.user.email) {
              await createCustomer({
                user_id: newSession.user.id,
                email: newSession.user.email
              });
            }
          } catch (err) {
            console.error('Error creating customer record:', err);
          }
        }
        
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [saveAuthState, user]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

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
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

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
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
        toast.error(error.message);
        return;
      }
      
      // Clear user and session state and localStorage
      saveAuthState(null, null);
      
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
