
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.48.1';

const getSafeEnv = (key: string): string => {
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

const supabaseUrl = getSafeEnv('SUPABASE_URL');
const supabaseAnonKey = getSafeEnv('SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("HUREMA CRITICAL: Supabase URL/Key tidak ditemukan di environment variable!");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

export const SupabaseService = {
  signIn: async (email: string) => {
    if (!supabaseUrl) throw new Error("Supabase URL tidak dikonfigurasi.");
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
    return data;
  },

  getCurrentUser: async () => {
    if (!supabaseUrl) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  getEmployees: async () => {
    if (!supabaseUrl) return [];
    const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  
  saveEmployee: async (employee: any) => {
    if (!supabaseUrl) return employee;
    const { data, error } = await supabase.from('employees').upsert(employee).select().single();
    if (error) throw error;
    return data;
  },

  // Added deleteEmployee to resolve the property missing error in App.tsx line 75
  deleteEmployee: async (id: string) => {
    if (!supabaseUrl) return;
    const { error } = await supabase.from('employees').delete().match({ id });
    if (error) throw error;
  },

  getLocations: async () => {
    if (!supabaseUrl) return [];
    const { data, error } = await supabase.from('locations').select('*').order('name');
    if (error) throw error;
    return data || [];
  },

  saveLocation: async (location: any) => {
    if (!supabaseUrl) {
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
    if (!supabaseUrl) return;
    const { error } = await supabase.from('locations').delete().match({ id });
    if (error) throw error;
  }
};
