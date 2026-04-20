import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, CheckCircle2, ChevronRight, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getDefects } from '../../data/mockDefects';
import type { Defect, DefectPriority, DefectStatus } from '../../types/defect';
import Sidebar from '../../components/Sidebar';

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
    const [defects, setDefects] = useState<Defect[]>([]);
    const [filterStatus, setFilterStatus] = useState<DefectStatus | 'all'>('all');
    const [filterPriority, setFilterPriority] = useState<DefectPriority | 'all'>('all');

    useEffect(() => {
        setDefects(getDefects());
    }, []);

    const filtered = defects
        .filter(d => filterStatus === 'all' || d.status === filterStatus)
        .filter(d => filterPriority === 'all' || d.priority === filterPriority)
        .sort((a, b) => {
            // Sort by priority weight then by newest
            const pw: Record<DefectPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
            const diff = pw[a.priority] - pw[b.priority];
            if (diff !== 0) return diff;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
                <div className="flex flex-wrap gap-3 mb-6 items-center">
                    <Filter className="w-4 h-4 text-gray-400" />

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as DefectStatus | 'all')}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>

                    <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value as DefectPriority | 'all')}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Priorities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>

                    <span className="ml-auto text-sm text-gray-500 font-medium">{filtered.length} defect{filtered.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Defect List */}
                <div className="space-y-3">
                    {filtered.length === 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No defects matching your filters.</p>
                        </div>
                    )}

                    {filtered.map(defect => {
                        const pCfg = priorityConfig[defect.priority];
                        const sCfg = statusConfig[defect.status];
                        const StatusIcon = sCfg.icon;

                        return (
                            <button
                                key={defect.id}
                                onClick={() => navigate(`/defects/${defect.id}`)}
                                className="w-full bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all text-left flex items-center gap-4 group"
                            >
                                {/* Priority Indicator */}
                                <div className={cn("w-2 h-14 rounded-full flex-shrink-0",
                                    defect.priority === 'critical' ? 'bg-red-500' :
                                        defect.priority === 'high' ? 'bg-orange-400' :
                                            defect.priority === 'medium' ? 'bg-yellow-400' :
                                                'bg-blue-400'
                                )} />

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", pCfg.bg, pCfg.color)}>{pCfg.label}</span>
                                        <span className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1", sCfg.bg, sCfg.color)}>
                                            <StatusIcon className="w-3 h-3" />
                                            {sCfg.label}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 truncate">{defect.title}</h3>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        <span>{defect.location}</span>
                                        <span>·</span>
                                        <span>{timeAgo(defect.createdAt)}</span>
                                        <span>·</span>
                                        <span>by {defect.reportedBy}</span>
                                    </div>
                                </div>

                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                            </button>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
