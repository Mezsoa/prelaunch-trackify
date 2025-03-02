
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

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
      }, 3000); // 3 seconds timeout

      return () => clearTimeout(timeout);
    }
  }, [hasAttemptedRefresh, loading]);

  // Show loading state, but only if we haven't attempted refresh yet
  if (loading && !hasAttemptedRefresh) {
    console.log("ProtectedRoute: Initial loading state");
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
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
