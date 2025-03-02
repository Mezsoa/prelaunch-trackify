
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, refreshSession } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkCount, setCheckCount] = useState(0);

  useEffect(() => {
    // Prevent infinite loops by limiting checks
    if (checkCount > 2) {
      console.log("Max auth checks reached, stopping to prevent infinite loop");
      setIsCheckingAuth(false);
      return;
    }

    const checkAuthentication = async () => {
      try {
        console.log("Checking authentication...");

        // First check if we already have user in context
        if (user) {
          console.log("User found in context:", user.email);
          setIsAuthenticated(true);
          setIsCheckingAuth(false);
          return;
        }

        // If not, try to get session from Supabase directly (only once)
        if (!user && checkCount === 0) {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Session check error:", error);
            toast.error("Authentication error. Please log in again.");
            setIsAuthenticated(false);
          } else if (data.session) {
            console.log("Valid session found in Supabase");
            // We found a valid session, refresh our auth context
            await refreshSession();
            setIsAuthenticated(true);
          } else {
            console.log("No session found in Supabase");
            setIsAuthenticated(false);
          }
          
          setCheckCount(prevCount => prevCount + 1);
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, [user, refreshSession, checkCount]);

  // Show loading state while checking auth
  if (loading || isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render children
  console.log("Authenticated, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
