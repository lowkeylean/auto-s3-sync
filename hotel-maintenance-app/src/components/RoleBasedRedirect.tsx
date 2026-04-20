import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleBasedRedirect() {
    const { profile, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!profile) return <Navigate to="/login" />;

    switch (profile.role) {
        case 'super_admin':
            return <Navigate to="/super-admin" />;
        case 'admin':
            return <Navigate to="/admin" />;
        case 'manager':
            return <Navigate to="/dashboard" />;
        case 'supervisor':
            return <Navigate to="/supervisor" />;
        case 'worker':
            return <Navigate to="/my-tasks" />;
        default:
            // Fallback
            return <Navigate to="/login" />;
    }
}
