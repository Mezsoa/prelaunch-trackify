
import { createTrackingSession, updateTrackingSession } from './database';
import { supabase } from './supabase';

let currentSessionId: string | null = null;

/**
 * Start a new tracking session
 */
export const startTrackingSession = async (customerId?: string): Promise<string | null> => {
  try {
    // Get referrer and source information
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('utm_source') || 'direct';
    
    // Create the session
    const session = await createTrackingSession({
      customer_id: customerId,
      source,
      referrer,
      ip_address: '0.0.0.0', // This will be captured by Supabase edge function
      user_agent: navigator.userAgent,
      session_start: new Date().toISOString(),
    });
    
    if (session) {
      currentSessionId = session.id;
      return session.id;
    }
    
    return null;
  } catch (error) {
    console.error('Error starting tracking session:', error);
    return null;
  }
};

/**
 * End the current tracking session
 */
export const endTrackingSession = async (): Promise<boolean> => {
  if (!currentSessionId) return false;
  
  try {
    await updateTrackingSession(currentSessionId, {
      session_end: new Date().toISOString(),
    });
    
    currentSessionId = null;
    return true;
  } catch (error) {
    console.error('Error ending tracking session:', error);
    return false;
  }
};

/**
 * Initialize tracking
 */
export const initializeTracking = async () => {
  // Listen for auth state changes to link sessions to customers
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      // If we have an existing session and a user signs in, end it and start a new one
      if (currentSessionId) {
        endTrackingSession().then(() => {
          startTrackingSession(session.user.id);
        });
      } else {
        // Start a new session if there isn't one
        startTrackingSession(session.user.id);
      }
    }
  });
  
  // Start anonymous session on page load
  startTrackingSession();
  
  // End session when user leaves
  window.addEventListener('beforeunload', () => {
    endTrackingSession();
  });
};
