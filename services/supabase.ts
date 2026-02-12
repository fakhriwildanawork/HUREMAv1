
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.48.1';

// Fungsi bantuan untuk mengambil env secara aman tanpa menyebabkan ReferenceError
const getSafeEnv = (key: string): string => {
  try {
    // Coba ambil dari process.env (Node/Build time)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
    // Coba ambil dari window.process (Polyfill browser)
    if (typeof window !== 'undefined' && (window as any).process?.env?.[key]) {
      return (window as any).process.env[key];
    }
  } catch (e) {
    // Abaikan error
  }
  return '';
};

const supabaseUrl = getSafeEnv('SUPABASE_URL');
const supabaseAnonKey = getSafeEnv('SUPABASE_ANON_KEY');

// Jika tidak ada URL, kita buat client dummy atau log error daripada crash
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("HUREMA Warning: Supabase Credentials tidak ditemukan. Aplikasi berjalan dalam mode Demo/Mock.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

export const SupabaseService = {
  signIn: async (email: string) => {
    if (!supabaseUrl) return { data: null };
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: async () => {
    if (!supabaseUrl) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  getEmployees: async () => {
    if (!supabaseUrl) return [];
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  
  saveEmployee: async (employee: any) => {
    if (!supabaseUrl) return employee;
    const { data, error } = await supabase
      .from('employees')
      .upsert(employee)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteEmployee: async (id: string) => {
    if (!supabaseUrl) return;
    const { error } = await supabase
      .from('employees')
      .delete()
      .match({ id });
    if (error) throw error;
  },

  getLocations: async () => {
    if (!supabaseUrl) return [];
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('name');
    if (error) throw error;
    return data || [];
  },

  saveLocation: async (location: any) => {
    if (!supabaseUrl) return location;
    const { data, error } = await supabase
      .from('locations')
      .upsert(location)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteLocation: async (id: string) => {
    if (!supabaseUrl) return;
    const { error } = await supabase
      .from('locations')
      .delete()
      .match({ id });
    if (error) throw error;
  }
};
