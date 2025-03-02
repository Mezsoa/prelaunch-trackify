
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) => {
  const { user, loading, refreshSession } = useAuth();
  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Refresh session only once when component mounts
  useEffect(() => {
    if (!hasAttemptedRefresh && !user) {
      console.log("ProtectedRoute: Attempting to refresh session");
      refreshSession().finally(() => {
        setHasAttemptedRefresh(true);
      });
    } else if (user) {
      // If we already have a user, no need to refresh or wait
      setHasAttemptedRefresh(true);
    }
  }, [refreshSession, hasAttemptedRefresh, user]);

  // After refresh attempt and still loading for too long, just proceed with what we have
  useEffect(() => {
    if (hasAttemptedRefresh && loading) {
      const timeout = setTimeout(() => {
        console.log("ProtectedRoute: Loading timed out, proceeding with current state");
        setTimeoutReached(true);
      }, 2000); // 2 seconds timeout

      return () => clearTimeout(timeout);
    }
  }, [hasAttemptedRefresh, loading]);

  // Check localStorage directly as a last resort if no user in context
  const checkLocalStorage = () => {
    if (!user) {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        console.log("ProtectedRoute: User found in localStorage");
        return true;
      }
    }
    return !!user;
  };

  // Show loading state, but only briefly
  if (loading && !timeoutReached && !checkLocalStorage()) {
    console.log("ProtectedRoute: Loading state");
    return (
      <div className="flex flex-col min-h-screen items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-muted-foreground">Loading your account...</p>
        {hasAttemptedRefresh && (
          <Button 
            variant="outline" 
            onClick={() => setTimeoutReached(true)}
          >
            Continue anyway
          </Button>
        )}
      </div>
    );
  }

  // First check context user, then localStorage as backup
  const isAuthenticated = checkLocalStorage();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    console.log("ProtectedRoute: No authenticated user, redirecting to", redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  // User is authenticated, render children
  console.log("ProtectedRoute: User authenticated, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
