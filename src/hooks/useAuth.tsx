
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

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

      setSession(data.session);
      setUser(data.session?.user ?? null);
      
      console.log("AuthProvider: Session refreshed", !!data.session);
    } catch (err) {
      console.error('Error in refreshSession:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  // Initial session loading and auth state subscription
  useEffect(() => {
    let isMounted = true;
    
    // Get initial session
    const getInitialSession = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      
      try {
        console.log("AuthProvider: Getting initial session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error.message);
          setError(error.message);
        }

        if (isMounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
        
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
      async (_event, session) => {
        if (!isMounted) return;
        
        console.log('Auth state changed:', _event, !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Create customer record on sign in/sign up
        if (session?.user) {
          try {
            const customer = await getCustomer(session.user.id);
            if (!customer && session.user.email) {
              await createCustomer({
                user_id: session.user.id,
                email: session.user.email
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
  }, []);

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
      
      // Clear user and session state
      setUser(null);
      setSession(null);
      
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
