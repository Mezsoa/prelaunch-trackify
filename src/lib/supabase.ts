
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase environment variables are not set. Authentication features will not work."
  );

  // Only show toast in browser environment
  if (typeof window !== "undefined") {
    // Use setTimeout to ensure this runs after the component mounts
    setTimeout(() => {
      toast({
        title: "Configuration Error",
        description:
          "Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.",
        variant: "destructive",
      });
    }, 1000);
  }
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () =>
          Promise.resolve({
            data: null,
            error: new Error("Supabase not configured"),
          }),
        signUp: () =>
          Promise.resolve({
            data: null,
            error: new Error("Supabase not configured"),
          }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
          error: null,
        }),
      },
    };
