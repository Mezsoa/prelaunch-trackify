
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  // Refresh session only once when component mounts
  useEffect(() => {
    if (!hasAttemptedRefresh) {
      console.log("ProtectedRoute: Attempting to refresh session");
      refreshSession().finally(() => {
        setHasAttemptedRefresh(true);
      });
    }
  }, [refreshSession, hasAttemptedRefresh]);

  // After refresh attempt and still loading for too long, just proceed with what we have
  useEffect(() => {
    if (hasAttemptedRefresh && loading) {
      const timeout = setTimeout(() => {
        console.log("ProtectedRoute: Loading timed out, proceeding with current state");
        setTimeoutReached(true);
      }, 3000); // 3 seconds timeout

      return () => clearTimeout(timeout);
    }
  }, [hasAttemptedRefresh, loading]);

  // Show loading state, but only briefly
  if (loading && !timeoutReached) {
    console.log("ProtectedRoute: Loading state, hasAttemptedRefresh:", hasAttemptedRefresh);
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

  // Redirect if not authenticated
  if (!user) {
    console.log("ProtectedRoute: No authenticated user, redirecting to", redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  // User is authenticated, render children
  console.log("ProtectedRoute: User authenticated, rendering children");
  return children;
};

export default ProtectedRoute;
