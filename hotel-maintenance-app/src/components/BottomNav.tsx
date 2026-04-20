import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNavItemsForRole } from '../config/navConfig';
import { cn } from '../lib/utils';

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const { profile } = useAuth();
    const navItems = getNavItemsForRole(profile?.role || 'worker');

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 px-2 pb-[env(safe-area-inset-bottom)]">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.route || location.pathname.startsWith(item.route + '/');
                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.route)}
                            className={cn(
                                'flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors',
                                active ? 'text-blue-600' : 'text-gray-400'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
