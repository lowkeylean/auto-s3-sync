import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Search, UserPlus, MoreVertical, Shield, Mail, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '../../lib/utils';

import { mockUsers as dbUsers } from '../../data/mockUsers';
import staffLogo from '../../assets/staff-logo.png';

const initialUsers = dbUsers.map(u => ({
    ...u,
    email: `${u.name.toLowerCase().replace(/\s+/g, '.')}@hotel.com`,
    lastActive: new Date().toISOString(),
    specialty: u.subCategory || 'General Maintenance'
}));

export default function UserManagement() {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'manager' | 'supervisor' | 'worker'>('all');
    const [showInvite, setShowInvite] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'worker' | 'supervisor' | 'manager' | 'admin'>('worker');
    const [users, setUsers] = useState(initialUsers);

    const filtered = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    const toggleStatus = (id: string) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
    };

    const changeRole = (id: string, newRole: 'admin' | 'manager' | 'supervisor' | 'worker') => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    };

    const handleInvite = () => {
        if (!inviteEmail) return;
        const newUser = {
            id: `u-${Date.now()}`,
            name: inviteEmail.split('@')[0],
            email: inviteEmail,
            role: inviteRole,
            employmentType: 'staff' as const,
            tags: [],
            status: 'active' as const,
            lastActive: new Date().toISOString(),
            subCategory: 'General',
            specialty: 'New User',
        };
        setUsers(prev => [...prev, newUser]);
        setInviteEmail('');
        setShowInvite(false);
    };

    const roleBadgeColors: Record<string, string> = {
        admin: 'bg-purple-100 text-purple-700',
        manager: 'bg-blue-100 text-blue-700',
        supervisor: 'bg-orange-100 text-orange-700',
        worker: 'bg-emerald-100 text-emerald-700',
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="admin" />
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage accounts, roles, and access permissions.</p>
                    </div>
                    <button
                        onClick={() => setShowInvite(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <UserPlus className="w-4 h-4" />
                        Invite User
                    </button>
                </div>

                {/* Invite Modal */}
                {showInvite && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowInvite(false)}>
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Invite New User</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            value={inviteEmail}
                                            onChange={e => setInviteEmail(e.target.value)}
                                            placeholder="user@hotel.com"
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        value={inviteRole}
                                        onChange={e => setInviteRole(e.target.value as any)}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                                    >
                                        <option value="worker">Worker</option>
                                        <option value="supervisor">Supervisor</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowInvite(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                                <button onClick={handleInvite} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">Send Invite</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                        />
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'admin', 'manager', 'supervisor', 'worker'] as const).map(r => (
                            <button
                                key={r}
                                onClick={() => setRoleFilter(r)}
                                className={cn(
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                                    roleFilter === r ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                )}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {/* User Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">User</th>
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Last Active</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(user => (
                                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-gray-900">{user.name}</p>
                                                        {user.employmentType === 'staff' && (
                                                            <img 
                                                                src={staffLogo} 
                                                                alt="Internal Staff" 
                                                                className="w-4 h-4 object-contain"
                                                                title="Internal Staff"
                                                            />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={e => changeRole(user.id, e.target.value as any)}
                                                className={cn('text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer outline-none', roleBadgeColors[user.role])}
                                            >
                                                <option value="worker">Worker</option>
                                                <option value="supervisor">Supervisor</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => toggleStatus(user.id)} className="flex items-center gap-2 group">
                                                {user.status === 'active' ? (
                                                    <ToggleRight className="w-6 h-6 text-green-500 group-hover:text-green-600" />
                                                ) : (
                                                    <ToggleLeft className="w-6 h-6 text-gray-300 group-hover:text-gray-400" />
                                                )}
                                                <span className={cn('text-xs font-medium capitalize', user.status === 'active' ? 'text-green-600' : 'text-gray-400')}>
                                                    {user.status}
                                                </span>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {new Date(user.lastActive).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors" title="Reset Password">
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors" title="More options">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                        Showing {filtered.length} of {users.length} users
                    </div>
                </div>
            </main>
        </div>
    );
}
