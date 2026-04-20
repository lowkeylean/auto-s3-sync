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
                    created_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    role?: 'admin' | 'manager' | 'supervisor' | 'worker' | 'super_admin'
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    role?: 'admin' | 'manager' | 'supervisor' | 'worker' | 'super_admin'
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
