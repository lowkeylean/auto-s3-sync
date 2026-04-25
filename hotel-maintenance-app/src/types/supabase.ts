export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          role: 'admin' | 'manager' | 'supervisor' | 'worker' | 'super_admin'
          employment_type: 'staff' | 'contractor' | null
          sub_category: string | null
          tags: string[]
          status: 'active' | 'inactive'
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          role?: 'admin' | 'manager' | 'supervisor' | 'worker' | 'super_admin'
          employment_type?: 'staff' | 'contractor' | null
          sub_category?: string | null
          tags?: string[]
          status?: 'active' | 'inactive'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          role?: 'admin' | 'manager' | 'supervisor' | 'worker' | 'super_admin'
          employment_type?: 'staff' | 'contractor' | null
          sub_category?: string | null
          tags?: string[]
          status?: 'active' | 'inactive'
          created_at?: string
        }
      }
      defects: {
        Row: {
          id: string
          title: string
          description: string | null
          location: string
          priority: 'low' | 'medium' | 'high' | 'critical'
          status: 'open' | 'in_progress' | 'resolved' | 'closed'
          reported_by_id: string | null
          reported_by_name: string | null
          reported_by_role: string | null
          assigned_worker_id: string | null
          resolved_at: string | null
          resolution_notes: string | null
          photo_url: string | null
          resolution_photo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          location: string
          priority?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          reported_by_id?: string | null
          reported_by_name?: string | null
          reported_by_role?: string | null
          assigned_worker_id?: string | null
          resolved_at?: string | null
          resolution_notes?: string | null
          photo_url?: string | null
          resolution_photo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          location?: string
          priority?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          reported_by_id?: string | null
          reported_by_name?: string | null
          reported_by_role?: string | null
          assigned_worker_id?: string | null
          resolved_at?: string | null
          resolution_notes?: string | null
          photo_url?: string | null
          resolution_photo_url?: string | null
          created_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          room_number: string
          floor: number
          last_maintained: string | null
          created_at: string
        }
        Insert: {
          id?: string
          room_number: string
          floor: number
          last_maintained?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          room_number?: string
          floor?: number
          last_maintained?: string | null
          created_at?: string
        }
      }
      equipment: {
        Row: {
          id: string
          name: string
          location: string | null
          type: string | null
          maintenance_interval_days: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          location?: string | null
          type?: string | null
          maintenance_interval_days?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string | null
          type?: string | null
          maintenance_interval_days?: number
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          equipment_id: string
          assigned_worker_id: string | null
          due_date: string
          status: 'pending' | 'completed' | 'missed' | 'overdue'
          completed_at: string | null
          remarks: string | null
          created_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          assigned_worker_id?: string | null
          due_date: string
          status?: 'pending' | 'completed' | 'missed' | 'overdue'
          completed_at?: string | null
          remarks?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          assigned_worker_id?: string | null
          due_date?: string
          status?: 'pending' | 'completed' | 'missed' | 'overdue'
          completed_at?: string | null
          remarks?: string | null
          created_at?: string
        }
      }
    }
  }
}
