
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
      
      const { data, error } = await signInWithEmail(email, password);

      if (error) {
        setError(error.message);
        toast.error(error.message);
        return;
      }
      
      // Update auth state immediately with the returned data
      if (data?.user) {
        updateAuthState(data.session, data.user);
        await ensureCustomerExists(data.user);
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
      
      const { data, error } = await signUpWithEmail(email, password);

      if (error) {
        setError(error.message);
        toast.error(error.message);
        return;
      }
      
      // If sign up was successful and returned a user, update auth state
      if (data?.user) {
        updateAuthState(data.session, data.user);
        await ensureCustomerExists(data.user);
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
