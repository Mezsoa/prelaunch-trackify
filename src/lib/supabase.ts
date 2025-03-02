
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
      toast.error("Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.");
    }, 1000);
  }
}

// Always create a client, even with empty values which will be handled by error checking in functions
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
