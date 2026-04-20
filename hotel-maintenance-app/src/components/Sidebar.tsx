import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getNavItemsForRole, type NavItem } from '../config/navConfig';
import { cn } from '../lib/utils';
import assetflowLogo from '../assets/assetflow_logo.png';

interface SidebarProps {
    role: 'admin' | 'manager' | 'supervisor' | 'worker' | 'super_admin';
}

const roleBadge: Record<string, { label: string; bg: string; text: string; border?: string }> = {
    super_admin: { label: 'Super Admin', bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30' },
    admin: { label: 'System Admin', bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30' },
    manager: { label: 'Manager', bg: 'bg-blue-100', text: 'text-blue-700' },
    supervisor: { label: 'Supervisor', bg: 'bg-purple-100', text: 'text-purple-700' },
    worker: { label: 'Technician', bg: 'bg-emerald-100', text: 'text-emerald-700' },
};

export default function Sidebar({ role }: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut } = useAuth();
    const navItems = getNavItemsForRole(role);
    const badge = roleBadge[role];
    const isAdmin = role === 'admin' || role === 'super_admin';

    const isActive = (item: NavItem) => {
        return location.pathname === item.route;
    };

    return (
        <aside
            className={cn(
                'w-64 hidden md:flex flex-col',
                isAdmin ? 'bg-slate-900 text-slate-300' : 'bg-white border-r border-gray-200'
            )}
        >
            {/* Header */}
            <div className={cn('p-5 flex flex-col gap-0.5', isAdmin ? 'border-b border-slate-800' : 'border-b border-gray-100')}>
                <div className="flex items-center gap-3 mb-1">
                    <img src={assetflowLogo} alt="AssetFlöw" className="w-8 h-8 object-contain flex-shrink-0 drop-shadow-sm" />
                    <div>
                        <h2 className={cn('text-lg font-extrabold tracking-tight leading-none', isAdmin ? 'text-white' : 'text-[#1e3a5f]')}>AssetFlöw</h2>
                        <p className={cn('text-[10px] font-semibold uppercase tracking-[0.2em]', isAdmin ? 'text-slate-500' : 'text-gray-400')}>by DASSOLS</p>
                    </div>
                </div>
                <span className={cn('text-xs px-2 py-0.5 rounded-full mt-2 inline-block w-max', badge.bg, badge.text, badge.border && `border ${badge.border}`)}>
                    {badge.label}
                </span>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);
                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.route)}
                            className={cn(
                                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left',
                                active
                                    ? isAdmin
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-blue-50 text-blue-700'
                                    : isAdmin
                                        ? 'hover:bg-slate-800'
                                        : 'text-gray-600 hover:bg-gray-50'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Sign Out */}
            <div className={cn('p-4', isAdmin ? 'border-t border-slate-800' : 'border-t border-gray-200')}>
                <button
                    onClick={signOut}
                    className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                        isAdmin
                            ? 'hover:text-red-400 hover:bg-red-400/10'
                            : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                    )}
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
