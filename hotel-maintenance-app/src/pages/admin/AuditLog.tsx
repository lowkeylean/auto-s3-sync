import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { RefreshCw, Download, Filter, User, Database, Settings, CheckCircle2, LogIn, Upload, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

type LogType = 'all' | 'login' | 'import' | 'task' | 'settings';

interface AuditEntry {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
    type: LogType;
    icon: typeof User;
    color: string;
}

const mockLogs: AuditEntry[] = [
    { id: 'a-1', timestamp: '2026-02-26T12:30:00Z', user: 'Admin User', action: 'System Settings Updated', details: 'Changed default maintenance interval from 30 to 21 days.', type: 'settings', icon: Settings, color: 'text-purple-500 bg-purple-50' },
    { id: 'a-2', timestamp: '2026-02-26T11:45:00Z', user: 'Sarah Connor', action: 'Task Assigned', details: 'Assigned HVAC Unit B to John Doe, due 2026-02-28.', type: 'task', icon: CheckCircle2, color: 'text-blue-500 bg-blue-50' },
    { id: 'a-3', timestamp: '2026-02-26T10:30:00Z', user: 'John Doe', action: 'Login', details: 'Logged in from 192.168.1.45 (Chrome, macOS).', type: 'login', icon: LogIn, color: 'text-green-500 bg-green-50' },
    { id: 'a-4', timestamp: '2026-02-26T09:15:00Z', user: 'Admin User', action: 'CSV Import', details: 'Imported 15 equipment records.', type: 'import', icon: Upload, color: 'text-amber-500 bg-amber-50' },
    { id: 'a-5', timestamp: '2026-02-26T08:00:00Z', user: 'Mike Ross', action: 'Task Completed', details: 'Completed Commercial Oven maintenance.', type: 'task', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50' },
    { id: 'a-6', timestamp: '2026-02-25T17:00:00Z', user: 'Jane Smith', action: 'Login', details: 'Logged in from Safari, iOS.', type: 'login', icon: LogIn, color: 'text-green-500 bg-green-50' },
    { id: 'a-7', timestamp: '2026-02-25T16:30:00Z', user: 'Sarah Connor', action: 'Report Generated', details: 'Generated monthly PDF for Jan 2026.', type: 'task', icon: Database, color: 'text-indigo-500 bg-indigo-50' },
    { id: 'a-8', timestamp: '2026-02-25T14:00:00Z', user: 'Admin User', action: 'User Role Changed', details: 'Changed Tom Hardy from Manager to Worker.', type: 'settings', icon: Shield, color: 'text-purple-500 bg-purple-50' },
];

const filterChips: { label: string; value: LogType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Logins', value: 'login' },
    { label: 'Imports', value: 'import' },
    { label: 'Tasks', value: 'task' },
    { label: 'Settings', value: 'settings' },
];

export default function AuditLog() {
    const [typeFilter, setTypeFilter] = useState<LogType>('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const filtered = mockLogs.filter(log => {
        const matchType = typeFilter === 'all' || log.type === typeFilter;
        const matchFrom = !dateFrom || new Date(log.timestamp) >= new Date(dateFrom);
        const matchTo = !dateTo || new Date(log.timestamp) <= new Date(dateTo + 'T23:59:59Z');
        return matchType && matchFrom && matchTo;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="admin" />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
                        <p className="text-gray-500 text-sm mt-1">Track all system activity.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4" /> Export Log
                        </button>
                        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                            <RefreshCw className="w-4 h-4" /> Refresh
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex gap-2 flex-wrap">
                        {filterChips.map(chip => (
                            <button key={chip.value} onClick={() => setTypeFilter(chip.value)} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', typeFilter === chip.value ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}>
                                {chip.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                        <span className="text-gray-400 text-sm">to</span>
                        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-50">
                        {filtered.map((log) => {
                            const Icon = log.icon;
                            return (
                                <div key={log.id} className="p-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                                    <div className={cn('p-2.5 rounded-xl flex-shrink-0', log.color)}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <span className="font-semibold text-gray-900 text-sm">{log.action}</span>
                                                <span className="text-gray-400 text-xs ml-2">by {log.user}</span>
                                            </div>
                                            <span className="text-xs text-gray-400 flex-shrink-0 ml-4">
                                                {new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}{' '}
                                                {new Date(log.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">{log.details}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {filtered.length === 0 && (
                        <div className="py-12 text-center text-gray-400"><p className="font-medium">No entries match your filters.</p></div>
                    )}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                        Showing {filtered.length} of {mockLogs.length} entries
                    </div>
                </div>
            </main>
        </div>
    );
}
