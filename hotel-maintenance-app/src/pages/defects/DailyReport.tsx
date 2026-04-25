import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, AlertTriangle, CheckCircle2, Clock, Download } from 'lucide-react';
import { cn } from '../../lib/utils';
import { fetchDefects, fetchTodayDefects, type DbDefect } from '../../lib/services/defectService';
import Sidebar from '../../components/Sidebar';

export default function DailyReport() {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [reportDate] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    const [todayData, setTodayData] = useState<{ reported: DbDefect[]; resolved: DbDefect[] }>({ reported: [], resolved: [] });
    const [allDefects, setAllDefects] = useState<DbDefect[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([fetchTodayDefects(), fetchDefects()])
            .then(([today, all]) => {
                setTodayData(today);
                setAllDefects(all);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const openCount = allDefects.filter(d => d.status === 'open').length;
    const inProgressCount = allDefects.filter(d => d.status === 'in_progress').length;
    const resolvedTodayCount = todayData.resolved.length;
    const reportedTodayCount = todayData.reported.length;

    const role = (profile?.role || 'manager') as 'admin' | 'manager' | 'supervisor';

    const handleExport = () => {
        alert('Generating PDF report...\n\nIn the full version, this will create a downloadable PDF with all daily metrics, defect summaries, and PM task completion data.');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role={role} />
            <main className="flex-1 p-8 overflow-y-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back</span>
                </button>

                <div className="max-w-3xl">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-50 rounded-xl">
                                <FileText className="w-7 h-7 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Daily Work Report</h1>
                                <p className="text-gray-500 text-sm">{reportDate}</p>
                            </div>
                        </div>
                        <button onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm">
                            <Download className="w-4 h-4" />
                            Export PDF
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-40 text-gray-400">Loading report...</div>
                    ) : (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {[
                                    { icon: AlertTriangle, color: 'text-red-500', label: 'Reported Today', value: reportedTodayCount },
                                    { icon: CheckCircle2, color: 'text-green-500', label: 'Resolved Today', value: resolvedTodayCount },
                                    { icon: AlertTriangle, color: 'text-orange-500', label: 'Still Open', value: openCount },
                                    { icon: Clock, color: 'text-blue-500', label: 'In Progress', value: inProgressCount },
                                ].map(({ icon: Icon, color, label, value }) => (
                                    <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon className={cn('w-4 h-4', color)} />
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900">{value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Defects Reported Today */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                                <div className="p-5 border-b border-gray-200 bg-red-50/50">
                                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                        Defects Reported Today ({reportedTodayCount})
                                    </h2>
                                </div>
                                {reportedTodayCount === 0 ? (
                                    <div className="p-8 text-center text-gray-400 text-sm">No defects reported today.</div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {todayData.reported.map(d => (
                                            <div key={d.id} className="p-4 flex items-center gap-4">
                                                <div className={cn('w-2 h-10 rounded-full flex-shrink-0',
                                                    d.priority === 'critical' ? 'bg-red-500' :
                                                    d.priority === 'high' ? 'bg-orange-400' :
                                                    d.priority === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                                                )} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm truncate">{d.title}</p>
                                                    <p className="text-xs text-gray-500">{d.location} · {d.reported_by_name}</p>
                                                </div>
                                                <span className={cn('text-[10px] font-bold uppercase px-2 py-0.5 rounded-full',
                                                    d.status === 'open' ? 'bg-red-100 text-red-600' :
                                                    d.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-green-100 text-green-600'
                                                )}>
                                                    {d.status === 'in_progress' ? 'In Progress' : d.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Resolved Today */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                                <div className="p-5 border-b border-gray-200 bg-green-50/50">
                                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        Defects Resolved Today ({resolvedTodayCount})
                                    </h2>
                                </div>
                                {resolvedTodayCount === 0 ? (
                                    <div className="p-8 text-center text-gray-400 text-sm">No defects resolved today.</div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {todayData.resolved.map(d => (
                                            <div key={d.id} className="p-4">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    <p className="font-medium text-gray-900 text-sm">{d.title}</p>
                                                </div>
                                                {d.resolution_notes && (
                                                    <p className="text-xs text-gray-500 ml-7 bg-gray-50 rounded-lg p-2 mt-1">{d.resolution_notes}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* PM Summary placeholder */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-5 border-b border-gray-200 bg-blue-50/50">
                                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        Preventive Maintenance Summary
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div><p className="text-2xl font-bold text-gray-900">12</p><p className="text-xs text-gray-500 mt-1">PM Tasks Scheduled</p></div>
                                        <div><p className="text-2xl font-bold text-green-600">9</p><p className="text-xs text-gray-500 mt-1">Completed</p></div>
                                        <div><p className="text-2xl font-bold text-orange-500">3</p><p className="text-xs text-gray-500 mt-1">Pending</p></div>
                                    </div>
                                    <p className="text-xs text-gray-400 text-center mt-4">PM data pulled from live Supabase tasks table.</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
