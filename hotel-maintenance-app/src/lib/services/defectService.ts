import { supabase } from '../supabase';
import type { Database } from '../../types/supabase';

export type DbDefect = Database['public']['Tables']['defects']['Row'];

export async function fetchDefects(): Promise<DbDefect[]> {
  const { data, error } = await supabase
    .from('defects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchDefectById(id: string): Promise<DbDefect | null> {
  const { data, error } = await supabase
    .from('defects')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchTodayDefects(): Promise<{ reported: DbDefect[]; resolved: DbDefect[] }> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('defects')
    .select('*')
    .gte('created_at', todayStart.toISOString());
  if (error) throw error;
  const all = data ?? [];

  const reported = all;
  const resolved = all.filter(d => d.resolved_at && new Date(d.resolved_at) >= todayStart);
  return { reported, resolved };
}

export async function insertDefect(
  defect: Database['public']['Tables']['defects']['Insert']
): Promise<DbDefect> {
  const { data, error } = await supabase
    .from('defects')
    .insert(defect)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDefectById(
  id: string,
  updates: Database['public']['Tables']['defects']['Update']
): Promise<void> {
  const { error } = await supabase
    .from('defects')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}
