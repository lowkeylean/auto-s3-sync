import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Search, UserPlus, MoreVertical, Shield, Mail, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { fetchAllProfiles, updateProfileRole, updateProfileStatus, type DbProfile } from '../../lib/services/profileService';
import staffLogo from '../../assets/staff-logo.png';

export default function UserManagement() {
    const [users, setUsers] = useState<DbProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'manager' | 'supervisor' | 'worker'>('all');
    const [showInvite, setShowInvite] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'worker' | 'supervisor' | 'manager' | 'admin'>('worker');

    useEffect(() => {
        fetchAllProfiles()
            .then(setUsers)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = users.filter(u => {
        const name = u.full_name?.toLowerCase() ?? '';
        const email = u.email?.toLowerCase() ?? '';
        const matchSearch = name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    const toggleStatus = async (id: string, current: 'active' | 'inactive') => {
        const next = current === 'active' ? 'inactive' : 'active';
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: next } : u));
        await updateProfileStatus(id, next).catch(console.error);
    };

    const changeRole = async (id: string, newRole: DbProfile['role']) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
        await updateProfileRole(id, newRole).catch(console.error);
    };

    const handleInvite = () => {
        alert(`To invite ${inviteEmail} as ${inviteRole}:\n\n1. Go to Supabase → Authentication → Users → Add User\n2. Enter their email and a temporary password\n3. Insert their profile in the SQL editor with role '${inviteRole}'`);
        setShowInvite(false);
        setInviteEmail('');
    };

    const roleBadgeColors: Record<string, string> = {
        admin: 'bg-purple-100 text-purple-700',
        manager: 'bg-blue-100 text-blue-700',
        supervisor: 'bg-orange-100 text-orange-700',
        worker: 'bg-emerald-100 text-emerald-700',
        super_admin: 'bg-gray-100 text-gray-700',
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="admin" />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage accounts, roles, and access permissions.</p>
                    </div>
                    <button onClick={() => setShowInvite(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm">
                        <UserPlus className="w-4 h-4" />
                        Invite User
                    </button>
                </div>

                {showInvite && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowInvite(false)}>
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Invite New User</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                                            placeholder="user@hotel.com"
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value as any)}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                        <option value="worker">Worker</option>
                                        <option value="supervisor">Supervisor</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowInvite(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button onClick={handleInvite} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">View Instructions</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white" />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {(['all', 'admin', 'manager', 'supervisor', 'worker'] as const).map(r => (
                            <button key={r} onClick={() => setRoleFilter(r)}
                                className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                                    roleFilter === r ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}>
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-40 text-gray-400">Loading users...</div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">User</th>
                                        <th className="px-6 py-4 font-semibold">Role</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold">Type</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(user => (
                                        <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                        {(user.full_name ?? user.email ?? '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-gray-900">{user.full_name ?? 'Unnamed'}</p>
                                                            {user.employment_type === 'staff' && (
                                                                <img src={staffLogo} alt="Staff" className="w-4 h-4 object-contain" title="Internal Staff" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select value={user.role} onChange={e => changeRole(user.id, e.target.value as DbProfile['role'])}
                                                    className={cn('text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer outline-none', roleBadgeColors[user.role])}>
                                                    <option value="worker">Worker</option>
                                                    <option value="supervisor">Supervisor</option>
                                                    <option value="manager">Manager</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => toggleStatus(user.id, user.status)} className="flex items-center gap-2 group">
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
                                            <td className="px-6 py-4 text-xs text-gray-500 capitalize">
                                                {user.employment_type ?? '—'}
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
                )}
            </main>
        </div>
    );
}
