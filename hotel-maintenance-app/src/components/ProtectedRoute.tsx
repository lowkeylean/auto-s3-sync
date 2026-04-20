import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    allowedRoles?: ('admin' | 'manager' | 'supervisor' | 'worker' | 'super_admin')[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Super admin has access to everything
    if (allowedRoles && profile && profile.role !== 'super_admin' && !allowedRoles.includes(profile.role)) {
        // Optionally redirect to unauthorized page or dashboard
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
