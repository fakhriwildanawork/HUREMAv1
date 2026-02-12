
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.48.1';

/**
 * Mendapatkan environment variable secara aman di berbagai runtime (Vite/Browser).
 * Prioritas: import.meta.env (Vite) -> process.env (Vercel/Node)
 */
const getSafeEnv = (key: string): string => {
  // Jalur 1: Standar Vite (Client-side)
  // @ts-ignore
  if (import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }

  // Jalur 2: process.env (Build-time/Polyfill)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
    if (typeof window !== 'undefined' && (window as any).process?.env?.[key]) {
      return (window as any).process.env[key];
    }
  } catch (e) {}

  return '';
};

// Mencoba mengambil dengan prefix VITE_ dahulu, lalu tanpa prefix
const supabaseUrl = getSafeEnv('VITE_SUPABASE_URL') || getSafeEnv('SUPABASE_URL');
const supabaseAnonKey = getSafeEnv('VITE_SUPABASE_ANON_KEY') || getSafeEnv('SUPABASE_ANON_KEY');

// Log hanya muncul jika benar-benar kosong di production
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("HUREMA INFO: Supabase credentials not found. App will run in Mock Mode.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

export const SupabaseService = {
  signIn: async (email: string) => {
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) throw new Error("Supabase tidak terkonfigurasi.");
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
    return data;
  },

  getCurrentUser: async () => {
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  getEmployees: async () => {
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) return [];
    const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  
  saveEmployee: async (employee: any) => {
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) return employee;
    const { data, error } = await supabase.from('employees').upsert(employee).select().single();
    if (error) throw error;
    return data;
  },

  deleteEmployee: async (id: string) => {
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) return;
    const { error } = await supabase.from('employees').delete().match({ id });
    if (error) throw error;
  },

  getLocations: async () => {
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) return [];
    const { data, error } = await supabase.from('locations').select('*').order('name');
    if (error) throw error;
    return data || [];
  },

  saveLocation: async (location: any) => {
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      console.warn("Saving to local memory only (Mock Mode)");
      return location;
    }
    const { data, error } = await supabase
      .from('locations')
      .upsert(location)
      .select()
      .single();
    
    if (error) {
      console.error("Supabase Save Error:", error);
      throw error;
    }
    return data;
  },

  deleteLocation: async (id: string) => {
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) return;
    const { error } = await supabase.from('locations').delete().match({ id });
    if (error) throw error;
  }
};
