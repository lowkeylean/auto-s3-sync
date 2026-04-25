import { supabase } from '../supabase';
import type { Database } from '../../types/supabase';

export type DbProfile = Database['public']['Tables']['profiles']['Row'];

export async function fetchAllProfiles(): Promise<DbProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchWorkers(): Promise<DbProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'worker')
    .eq('status', 'active')
    .order('full_name', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function updateProfileRole(id: string, role: DbProfile['role']): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', id);
  if (error) throw error;
}

export async function updateProfileStatus(id: string, status: 'active' | 'inactive'): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}
