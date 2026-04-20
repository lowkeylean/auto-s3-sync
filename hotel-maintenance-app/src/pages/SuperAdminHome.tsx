import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Wrench, ClipboardCheck, Users, LogOut, Crown } from 'lucide-react';
import { cn } from '../lib/utils';
import assetflowLogo from '../assets/assetflow_logo.png';

const roleCards = [
    {
        role: 'admin',
        label: 'Administrator',
        description: 'System configuration & user management',
        icon: ShieldCheck,
        route: '/admin',
        borderColor: 'hover:border-[#1e3a5f]',
        hoverBg: 'hover:bg-[#f0f5ff]',
        iconBg: 'bg-[#e8eef6]',
        iconText: 'text-[#1e3a5f]',
        iconHoverBg: 'group-hover:bg-[#1e3a5f]',
        iconHoverText: 'group-hover:text-white',
    },
    {
        role: 'worker',
        label: 'Worker',
        description: 'View tasks, complete work & upload photos',
        icon: Wrench,
        route: '/my-tasks',
        borderColor: 'hover:border-emerald-500',
        hoverBg: 'hover:bg-emerald-50',
        iconBg: 'bg-emerald-50',
        iconText: 'text-emerald-700',
        iconHoverBg: 'group-hover:bg-emerald-700',
        iconHoverText: 'group-hover:text-white',
    },
    {
        role: 'supervisor',
        label: 'Supervisor',
        description: 'Task delegation & quality inspection',
        icon: ClipboardCheck,
        route: '/supervisor',
        borderColor: 'hover:border-purple-500',
        hoverBg: 'hover:bg-purple-50',
        iconBg: 'bg-purple-50',
        iconText: 'text-purple-700',
        iconHoverBg: 'group-hover:bg-purple-700',
        iconHoverText: 'group-hover:text-white',
    },
    {
        role: 'manager',
        label: 'Manager',
        description: 'Analytics, reports & high-level overview',
        icon: Users,
        route: '/manager',
        borderColor: 'hover:border-[#2d5a8e]',
        hoverBg: 'hover:bg-[#f0f7ff]',
        iconBg: 'bg-blue-50',
        iconText: 'text-blue-700',
        iconHoverBg: 'group-hover:bg-blue-700',
        iconHoverText: 'group-hover:text-white',
    },
];

export default function SuperAdminHome() {
    const navigate = useNavigate();
    const { signOut } = useAuth();

    return (
        <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #e8f0fb 0%, #e4f2ee 50%, #e2f5ea 100%)' }}>

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
                {/* Brand Mark — logo blends naturally on the light background */}
                <div className="flex flex-col items-center">
                    <img
                        src={assetflowLogo}
                        alt="AssetFlöw Logo"
                        className="w-24 h-24 object-contain mb-4"
                    />
                    <h1 className="text-3xl font-extrabold text-[#1e3a5f] tracking-tight">
                        AssetFlöw
                    </h1>
                    <p className="mt-1 text-xs font-semibold text-gray-400 uppercase tracking-[0.25em]">
                        by DASSOLS
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-semibold">
                        <Crown className="w-3.5 h-3.5" />
                        Super Admin
                    </span>
                </div>
            </div>

            <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white/70 backdrop-blur-xl py-8 px-6 shadow-2xl shadow-blue-900/5 rounded-2xl border border-white/60">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
                        Select a role to view
                    </label>

                    <div className="space-y-3">
                        {roleCards.map(({ role, label, description, icon: Icon, route, borderColor, hoverBg, iconBg, iconText, iconHoverBg, iconHoverText }) => (
                            <button
                                key={role}
                                onClick={() => navigate(route)}
                                className={cn(
                                    "w-full flex items-center p-4 border border-gray-200 rounded-xl transition-all group",
                                    borderColor, hoverBg,
                                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e3a5f]"
                                )}
                            >
                                <div className={cn("p-2.5 rounded-xl transition-colors", iconBg, iconText, iconHoverBg, iconHoverText)}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="ml-4 text-left">
                                    <p className="text-sm font-semibold text-gray-900">{label}</p>
                                    <p className="text-xs text-gray-500">{description}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Sign Out */}
                    <div className="mt-6 pt-5 border-t border-gray-100">
                        <button
                            onClick={signOut}
                            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    © {new Date().getFullYear()} DASSOLS. All rights reserved.
                </p>
            </div>
        </div>
    );
}
