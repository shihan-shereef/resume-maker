import { supabase } from './supabase';

/**
 * Auth utilities for Dashboard and Admin
 */

export const getSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
};

export const getUserRole = async (userId) => {
    // In a real app, you'd fetch this from a 'profiles' or 'users' table
    // For this implementation, we'll check if the email is an admin email 
    // or simulate a role check.
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
    
    if (error) {
        // Fallback or handle error (e.g., default to 'user')
        console.error('Error fetching role:', error);
        return 'user';
    }
    
    return profile?.role || 'user';
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const isAdmin = async () => {
    const session = await getSession();
    if (!session) return false;
    
    const role = await getUserRole(session.user.id);
    return role === 'admin';
};
