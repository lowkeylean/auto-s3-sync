import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Check, CheckCheck, Settings, AlertTriangle, Clock, Bell, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Notification {
    id: string;
    type: 'overdue' | 'deadline' | 'completion' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
    urgency: 'urgent' | 'today' | 'week';
}

const mockNotifications: Notification[] = [
    { id: 'n-1', type: 'overdue', title: 'Task Overdue', message: 'Walk-in Freezer 1 maintenance was due Feb 24 — still incomplete.', time: '2026-02-26T12:00:00Z', read: false, urgency: 'urgent' },
    { id: 'n-2', type: 'overdue', title: 'Task Overdue', message: 'Pool Pump maintenance was due Feb 25 — no worker assigned.', time: '2026-02-26T11:30:00Z', read: false, urgency: 'urgent' },
    { id: 'n-3', type: 'deadline', title: 'Approaching Deadline', message: 'HVAC Unit A service due in 2 days (Feb 28).', time: '2026-02-26T10:00:00Z', read: false, urgency: 'today' },
    { id: 'n-4', type: 'completion', title: 'Task Completed', message: 'John Doe completed Commercial Oven maintenance. Photo uploaded.', time: '2026-02-26T08:30:00Z', read: false, urgency: 'today' },
    { id: 'n-5', type: 'completion', title: 'Task Completed', message: 'Mike Ross completed Elevator Motor B maintenance.', time: '2026-02-25T16:00:00Z', read: true, urgency: 'today' },
    { id: 'n-6', type: 'system', title: 'System Update', message: 'Default maintenance interval changed to 21 days by Admin.', time: '2026-02-25T14:00:00Z', read: true, urgency: 'week' },
    { id: 'n-7', type: 'deadline', title: 'Upcoming Maintenance', message: '3 pieces of equipment need service next week.', time: '2026-02-24T09:00:00Z', read: true, urgency: 'week' },
    { id: 'n-8', type: 'completion', title: 'Task Completed', message: 'Jane Smith completed Industrial Washer A maintenance.', time: '2026-02-23T15:00:00Z', read: true, urgency: 'week' },
];

const typeConfig: Record<string, { icon: typeof Bell; color: string }> = {
    overdue: { icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
    deadline: { icon: Clock, color: 'text-amber-500 bg-amber-50' },
    completion: { icon: CheckCircle2, color: 'text-green-500 bg-green-50' },
    system: { icon: Settings, color: 'text-blue-500 bg-blue-50' },
};

export default function NotificationsCenter() {
    const [notifications, setNotifications] = useState(mockNotifications);

    const markRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const dismiss = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    const groups = {
        urgent: notifications.filter(n => n.urgency === 'urgent'),
        today: notifications.filter(n => n.urgency === 'today'),
        week: notifications.filter(n => n.urgency === 'week'),
    };

    const renderGroup = (title: string, items: Notification[], accent?: string) => {
        if (items.length === 0) return null;
        return (
            <div className="mb-6">
                <h3 className={cn('text-xs font-bold uppercase tracking-wider mb-3', accent || 'text-gray-400')}>{title}</h3>
                <div className="space-y-2">
                    {items.map(n => {
                        const cfg = typeConfig[n.type];
                        const Icon = cfg.icon;
                        return (
                            <div key={n.id} className={cn('bg-white rounded-xl border p-4 flex items-start gap-3 transition-all', n.read ? 'border-gray-100 opacity-70' : 'border-gray-200 shadow-sm')}>
                                <div className={cn('p-2 rounded-lg flex-shrink-0', cfg.color)}><Icon className="w-4 h-4" /></div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className={cn('text-sm font-medium', n.read ? 'text-gray-500' : 'text-gray-900')}>{n.title}</p>
                                        <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                                            {new Date(n.time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                    {!n.read && (
                                        <button onClick={() => markRead(n.id)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors" title="Mark read">
                                            <Check className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                    <button onClick={() => dismiss(n.id)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors text-[10px] font-bold" title="Dismiss">✕</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="manager" />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                        <p className="text-gray-500 text-sm mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={markAllRead} className="flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                            <CheckCheck className="w-4 h-4" /> Mark All Read
                        </button>
                        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
                            <Settings className="w-4 h-4" /> Configure Alerts
                        </button>
                    </div>
                </div>

                <div className="max-w-3xl">
                    {renderGroup('🚨 Urgent', groups.urgent, 'text-red-500')}
                    {renderGroup('Today', groups.today, 'text-blue-600')}
                    {renderGroup('This Week', groups.week)}
                    {notifications.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">All caught up!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
