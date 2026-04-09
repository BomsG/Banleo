import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Strict URL check to prevent "Invalid supabaseUrl" error
const isValidUrl = (url: any): url is string => {
  return typeof url === 'string' && url.startsWith('http');
};

// Only initialize if we have a valid configuration
export const supabase = isValidUrl(supabaseUrl) && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

if (!supabase) {
  console.warn(
    'Supabase configuration is missing or invalid. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.'
  );
}
