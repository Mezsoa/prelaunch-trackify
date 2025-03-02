import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  AUTH_USER_KEY,
  AUTH_SESSION_KEY,
  saveAuthState,
  ensureCustomerExists,
  getSessionFromSupabase,
} from "./authUtils";
import { createAuthActions } from "./authActions";
import { AuthContext } from "./AuthContext";

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
  const updateAuthState = useCallback(
    (newSession: Session | null, newUser: User | null) => {
      saveAuthState(newSession, newUser);
      setSession(newSession);
      setUser(newUser);
    },
    []
  );

  // Helper function to refresh the session
  const refreshSession = useCallback(async () => {
    // Skip if already refreshing
    if (refreshing) {
      console.log("AuthProvider: Already refreshing, skipping");
      return;
    }

    try {
      setRefreshing(true);
      console.log("AuthProvider: Refreshing session");
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      if (session?.user) {
        updateAuthState(session, session.user);
      } else {
        // Clear auth state if no session
        updateAuthState(null, null);
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
      setError(
        error instanceof Error ? error.message : "Session refresh failed"
      );
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [refreshing, updateAuthState]);

  // Create auth actions
  const { signIn, signUp, signOut } = createAuthActions({
    updateAuthState,
    setLoading,
    setError,
    refreshSession,
    navigate,
  });

  // Initial session loading
  useEffect(() => {
    let isMounted = true;

    const getInitialSession = async () => {
      // Skip if we already have a user and aren't refreshing
      if (user && !refreshing) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (isMounted) {
          if (session?.user) {
            updateAuthState(session, session.user);
            await ensureCustomerExists(session.user);
          } else {
            // Clear auth state if no session
            updateAuthState(null, null);
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Set up auth subscription
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        updateAuthState(session, session.user);
        await ensureCustomerExists(session.user);
      } else {
        updateAuthState(null, null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [user, refreshing, updateAuthState]); // Add dependencies

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
