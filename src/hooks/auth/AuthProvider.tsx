
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  AUTH_USER_KEY,
  AUTH_SESSION_KEY,
  saveAuthState,
  ensureCustomerExists,
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

  const [loading, setLoading] = useState(true); // Always start with loading true
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // Helper function to update auth state
  const updateAuthState = useCallback(
    (newSession: Session | null, newUser: User | null) => {
      console.log("Updating auth state:", newUser?.email);
      saveAuthState(newSession, newUser);
      setSession(newSession);
      setUser(newUser);
    },
    []
  );

  // Helper function to refresh the session
  const refreshSession = useCallback(async () => {
    // Prevent multiple simultaneous refresh attempts
    if (refreshing) return;
    
    try {
      setRefreshing(true);
      console.log("AuthProvider: Refreshing session");
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      if (session?.user) {
        console.log("Session refreshed successfully:", session.user.email);
        updateAuthState(session, session.user);
      } else {
        console.log("No session found during refresh");
        // Only clear auth state if we previously had a session
        if (user) {
          updateAuthState(null, null);
        }
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
  }, [refreshing, updateAuthState, user]);

  // Create auth actions
  const { signIn, signUp, signOut } = createAuthActions({
    updateAuthState,
    setLoading,
    setError,
    refreshSession,
    navigate,
  });

  // Initial session loading - only run once
  useEffect(() => {
    let isMounted = true;
    let isInitialCheck = true;

    const getInitialSession = async () => {
      try {
        if (!isInitialCheck) return;
        
        setLoading(true);
        console.log("Getting initial auth session");
        
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (isMounted) {
          if (session?.user) {
            console.log("Initial session found:", session.user.email);
            updateAuthState(session, session.user);
            await ensureCustomerExists(session.user);
          } else {
            console.log("No initial session found");
            if (user) {
              // Only clear if we had a user before
              updateAuthState(null, null);
            }
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
          isInitialCheck = false;
        }
      }
    };

    getInitialSession();

    // Set up auth subscription - handle events like sign in, sign out
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed event:", _event);
      if (!isMounted) return;

      if (session?.user) {
        console.log("Auth state change - user found:", session.user.email);
        updateAuthState(session, session.user);
        await ensureCustomerExists(session.user);
      } else {
        console.log("Auth state change - no user");
        updateAuthState(null, null);
      }
      setLoading(false);
    });

    return () => {
      console.log("Cleanup - unsubscribing from auth state changes");
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array to run only once

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
