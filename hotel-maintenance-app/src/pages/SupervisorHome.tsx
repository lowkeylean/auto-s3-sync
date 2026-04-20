import { Users, CheckCircle2, AlertCircle, ClipboardList } from 'lucide-react';
import { cn } from '../lib/utils';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

// Mock Data for Dashboard
const stats = [
    { label: 'Active Workers', value: '12', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Tasks Pending Today', value: '8', icon: ClipboardList, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Tasks Completed', value: '24', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Inspections Needed', value: '5', icon: AlertCircle, color: 'text-purple-600', bg: 'bg-purple-100' },
];

export default function SupervisorHome() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="supervisor" />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Supervisor Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of today's maintenance operations and team performance.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className={cn('p-4 rounded-xl', stat.bg, stat.color)}>
                                    <Icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-gray-500 font-medium text-sm">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => navigate('/supervisor/team')}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-md transition-all text-left flex flex-col gap-3 group"
                    >
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg w-max group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Team Overview</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">View active workers, current locations, and daily assignments.</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/supervisor/schedule')}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-orange-400 hover:shadow-md transition-all text-left flex flex-col gap-3 group"
                    >
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg w-max group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Delegate Tasks</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">Assign new preventative and reactive maintenance tasks.</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/supervisor/inspections')}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-400 hover:shadow-md transition-all text-left flex flex-col gap-3 group"
                    >
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg w-max group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Quality Inspections</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">Review completed tasks, check photos, and approve work.</p>
                        </div>
                    </button>
                </div>

            </main>
        </div>
    );
}
