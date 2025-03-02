
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { getCustomer, createCustomer } from '@/lib/database';

// Constants
export const AUTH_USER_KEY = 'auth_user';
export const AUTH_SESSION_KEY = 'auth_session';

// Helper function to save auth state to localStorage
export const saveAuthState = (newSession: Session | null, newUser: User | null) => {
  if (newSession) {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(newSession));
  } else {
    localStorage.removeItem(AUTH_SESSION_KEY);
  }
  
  if (newUser) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
};

// Helper to ensure customer record exists
export const ensureCustomerExists = async (user: User) => {
  try {
    const customer = await getCustomer(user.id);
    if (!customer && user.email) {
      await createCustomer({
        user_id: user.id,
        email: user.email
      });
    }
  } catch (err) {
    console.error('Error ensuring customer record exists:', err);
  }
};

// Auth actions
export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signUpWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password });
};

export const signOutUser = async () => {
  return await supabase.auth.signOut();
};

export const getSessionFromSupabase = async () => {
  return await supabase.auth.getSession();
};
