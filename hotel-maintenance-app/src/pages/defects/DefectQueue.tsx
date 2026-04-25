import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, CheckCircle2, ChevronRight, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import { fetchDefects, type DbDefect } from '../../lib/services/defectService';
import Sidebar from '../../components/Sidebar';

type DefectPriority = 'low' | 'medium' | 'high' | 'critical';
type DefectStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

const priorityConfig: Record<DefectPriority, { color: string; bg: string; label: string }> = {
    critical: { color: 'text-red-700', bg: 'bg-red-100', label: 'Critical' },
    high: { color: 'text-orange-700', bg: 'bg-orange-100', label: 'High' },
    medium: { color: 'text-yellow-700', bg: 'bg-yellow-100', label: 'Medium' },
    low: { color: 'text-blue-700', bg: 'bg-blue-100', label: 'Low' },
};

const statusConfig: Record<DefectStatus, { color: string; bg: string; icon: typeof AlertCircle; label: string }> = {
    open: { color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle, label: 'Open' },
    in_progress: { color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock, label: 'In Progress' },
    resolved: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2, label: 'Resolved' },
    closed: { color: 'text-gray-600', bg: 'bg-gray-100', icon: CheckCircle2, label: 'Closed' },
};

export default function DefectQueue() {
    const navigate = useNavigate();
    const [defects, setDefects] = useState<DbDefect[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<DefectStatus | 'all'>('all');
    const [filterPriority, setFilterPriority] = useState<DefectPriority | 'all'>('all');

    useEffect(() => {
        fetchDefects()
            .then(setDefects)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = defects
        .filter(d => filterStatus === 'all' || d.status === filterStatus)
        .filter(d => filterPriority === 'all' || d.priority === filterPriority)
        .sort((a, b) => {
            const pw: Record<DefectPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
            const diff = pw[a.priority] - pw[b.priority];
            if (diff !== 0) return diff;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="worker" />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Defect Queue</h1>
                    <p className="text-gray-500 text-sm mt-1">Reported issues to resolve. Sorted by priority.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Filter className="w-4 h-4" /> Status:
                    </div>
                    {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)}
                            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize',
                                filterStatus === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}>
                            {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                    <div className="flex items-center gap-2 text-sm text-gray-500 ml-4">Priority:</div>
                    {(['all', 'critical', 'high', 'medium', 'low'] as const).map(p => (
                        <button key={p} onClick={() => setFilterPriority(p)}
                            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize',
                                filterPriority === p ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-40 text-gray-400">Loading defects...</div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                        <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                        <p className="font-semibold text-gray-700">No defects found</p>
                        <p className="text-sm text-gray-400 mt-1">All clear for the selected filters.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(defect => {
                            const pCfg = priorityConfig[defect.priority];
                            const sCfg = statusConfig[defect.status];
                            const StatusIcon = sCfg.icon;
                            return (
                                <div key={defect.id}
                                    onClick={() => navigate(`/defects/${defect.id}`)}
                                    className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all">
                                    <div className={cn('px-2.5 py-1 rounded-lg text-xs font-bold uppercase', pCfg.bg, pCfg.color)}>
                                        {pCfg.label}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{defect.title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{defect.location} · {timeAgo(defect.created_at)}</p>
                                    </div>
                                    <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold', sCfg.bg, sCfg.color)}>
                                        <StatusIcon className="w-3.5 h-3.5" />
                                        {sCfg.label}
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
