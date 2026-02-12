
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.48.1';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SupabaseService = {
  // Authentication
  signIn: async (email: string) => {
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
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Employees Data
  getEmployees: async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  
  saveEmployee: async (employee: any) => {
    const { data, error } = await supabase
      .from('employees')
      .upsert(employee)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteEmployee: async (id: string) => {
    const { error } = await supabase
      .from('employees')
      .delete()
      .match({ id });
    if (error) throw error;
  },

  // Locations Data
  getLocations: async () => {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('name');
    if (error) throw error;
    return data || [];
  },

  saveLocation: async (location: any) => {
    const { data, error } = await supabase
      .from('locations')
      .upsert(location)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteLocation: async (id: string) => {
    const { error } = await supabase
      .from('locations')
      .delete()
      .match({ id });
    if (error) throw error;
  }
};
