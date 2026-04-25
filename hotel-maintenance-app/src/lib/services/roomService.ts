import { supabase } from '../supabase';
import type { Database } from '../../types/supabase';

export type DbRoom = Database['public']['Tables']['rooms']['Row'];

export async function fetchRooms(): Promise<DbRoom[]> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('floor', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function updateRoomMaintained(roomId: string, date: string): Promise<void> {
  const { error } = await supabase
    .from('rooms')
    .update({ last_maintained: date })
    .eq('id', roomId);
  if (error) throw error;
}

export function getRoomStatus(lastMaintained: string | null): 'green' | 'yellow' | 'red' {
  if (!lastMaintained) return 'red';
  const diffDays = Math.ceil(
    (Date.now() - new Date(lastMaintained).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays < 70) return 'green';
  if (diffDays <= 91) return 'yellow';
  return 'red';
}
