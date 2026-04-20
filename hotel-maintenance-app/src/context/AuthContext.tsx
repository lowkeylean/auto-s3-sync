import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    signInWithEmail: (email: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    loginWithCredentials: (username: string, password: string) => { success: boolean; error?: string };
}

const CREDENTIALS: Record<string, { password: string; role: Profile['role']; fullName: string }> = {
    admin123: { password: 'admin456', role: 'admin', fullName: 'Administrator' },
    worker123: { password: 'worker456', role: 'worker', fullName: 'Worker' },
    spv123: { password: 'spv456', role: 'supervisor', fullName: 'Supervisor' },
    manager123: { password: 'manager456', role: 'manager', fullName: 'Manager' },
    spa123: { password: 'spa456', role: 'super_admin', fullName: 'Super Admin' },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored mock session
        const stored = localStorage.getItem('assetflow-mock-session');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setUser(parsed.user);
                setSession(parsed.session);
                setProfile(parsed.profile);
            } catch {
                localStorage.removeItem('assetflow-mock-session');
            }
        }

        // Check active Supabase session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) fetchProfile(session.user.id);
            }
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) fetchProfile(session.user.id);
            else if (!localStorage.getItem('assetflow-mock-session')) {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
            } else {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const signInWithEmail = async (email: string) => {
        return await supabase.auth.signInWithOtp({ email });
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('assetflow-mock-session');
        setSession(null);
        setUser(null);
        setProfile(null);
    };

    const loginWithCredentials = (username: string, password: string): { success: boolean; error?: string } => {
        const cred = CREDENTIALS[username];
        if (!cred) {
            return { success: false, error: 'Invalid username' };
        }
        if (cred.password !== password) {
            return { success: false, error: 'Invalid password' };
        }

        const mockUser = { id: `mock-${cred.role}-id`, email: `${username}@assetflow.dassols.com` } as User;
        const mockProfile: Profile = {
            id: `mock-${cred.role}-id`,
            email: `${username}@assetflow.dassols.com`,
            full_name: cred.fullName,
            role: cred.role,
            created_at: new Date().toISOString(),
        };
        const mockSession = { user: mockUser } as Session;

        setSession(mockSession);
        setUser(mockUser);
        setProfile(mockProfile);
        setLoading(false);

        localStorage.setItem('assetflow-mock-session', JSON.stringify({
            user: mockUser,
            session: mockSession,
            profile: mockProfile,
        }));

        return { success: true };
    };

    return (
        <AuthContext.Provider value={{ session, user, profile, loading, signInWithEmail, signOut, loginWithCredentials }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
