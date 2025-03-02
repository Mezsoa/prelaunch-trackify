
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { 
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  saveAuthState,
  ensureCustomerExists
} from './authUtils';

type AuthActionsProps = {
  updateAuthState: (session: any, user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshSession: () => Promise<void>;
  navigate: (path: string) => void;
};

export const createAuthActions = ({
  updateAuthState,
  setLoading,
  setError,
  refreshSession,
  navigate
}: AuthActionsProps) => {
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

  return {
    signIn,
    signUp,
    signOut
  };
};
