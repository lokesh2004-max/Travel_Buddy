import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null;

const getUrl = (): string | null => {
  // Priority: globals (if injected) -> Vite env (if present) -> localStorage
  const fromGlobal = (globalThis as any)?.__SUPABASE_URL__ as string | undefined;
  const fromEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_SUPABASE_URL : undefined) as string | undefined;
  const fromStorage = typeof window !== 'undefined' ? localStorage.getItem('supabaseUrl') || undefined : undefined;
  return fromGlobal || fromEnv || fromStorage || null;
};

const getAnonKey = (): string | null => {
  const fromGlobal = (globalThis as any)?.__SUPABASE_ANON_KEY__ as string | undefined;
  const fromEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_SUPABASE_ANON_KEY : undefined) as string | undefined;
  const fromStorage = typeof window !== 'undefined' ? localStorage.getItem('supabaseAnonKey') || undefined : undefined;
  return fromGlobal || fromEnv || fromStorage || null;
};

export const isSupabaseConfigured = (): boolean => {
  return !!(getUrl() && getAnonKey());
};

export const setSupabaseConfig = (url: string, anonKey: string) => {
  if (!url || !anonKey) throw new Error('Both URL and anon key are required');
  if (typeof window !== 'undefined') {
    localStorage.setItem('supabaseUrl', url);
    localStorage.setItem('supabaseAnonKey', anonKey);
  }
  client = createClient(url, anonKey);
};

export const getSupabaseClient = (): SupabaseClient => {
  if (client) return client;
  const url = getUrl();
  const anonKey = getAnonKey();
  if (!url || !anonKey) {
    throw new Error('Supabase not configured. Please add your Supabase URL and anon key.');
  }
  client = createClient(url, anonKey);
  return client;
};