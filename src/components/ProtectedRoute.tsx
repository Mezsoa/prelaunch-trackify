
import { useEffect } from 'react';
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

  // Refresh session when component mounts
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Show loading state
  if (loading) {
    console.log("ProtectedRoute: Loading state");
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
