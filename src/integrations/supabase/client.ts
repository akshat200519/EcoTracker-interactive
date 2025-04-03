
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';
import { Tables } from './schema';

const SUPABASE_URL = "https://obzfcrbvdpnundexzepd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iemZjcmJ2ZHBudW5kZXh6ZXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1OTc4MzksImV4cCI6MjA1OTE3MzgzOX0.g5fnwTlHvYwKe8CmarNSkcf8ojr_M-Qoa23Czt0iJTc";

// Create a custom type that extends the Database type with our tables
type ExtendedDatabase = Database & {
  public: {
    Tables: {
      carbon_logs: {
        Row: Tables['carbon_logs'];
        Insert: Omit<Tables['carbon_logs'], 'id' | 'created_at' | 'log_date'> & { 
          id?: string;
          created_at?: string;
          log_date?: string;
        };
        Update: Partial<Tables['carbon_logs']>;
      };
      profiles: {
        Row: Tables['profiles'];
        Insert: Omit<Tables['profiles'], 'created_at'> & { created_at?: string };
        Update: Partial<Tables['profiles']>;
      };
    };
  };
};

// Initialize Supabase client with authentication persistence options
export const supabase = createClient<ExtendedDatabase>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  }
);
