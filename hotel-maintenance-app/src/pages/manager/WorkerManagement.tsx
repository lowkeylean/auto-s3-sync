import Sidebar from '../../components/Sidebar';
import { UserPlus, TrendingUp, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

import { mockUsers as dbUsers } from '../../data/mockUsers';
import staffLogo from '../../assets/staff-logo.png';

const getHash = (str: string) => str.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);

const mockWorkers = dbUsers.filter(u => u.role === 'worker').map(w => {
    const hash = Math.abs(getHash(w.id));
    const completed = 20 + (hash % 30);
    const overdue = hash % 5;
    const onTime = Math.max(0, completed - overdue - (hash % 3));
    
    return {
        id: w.id,
        name: w.name,
        employmentType: w.employmentType,
        specialty: w.subCategory || 'General Maintenance',
        avatar: w.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        activeTasks: hash % 4,
        completed,
        onTime,
        overdue,
        available: hash % 4 !== 0,
    };
});

export default function WorkerManagement() {
    const navigate = useNavigate();
    const completionRate = (w: typeof mockWorkers[0]) => w.completed > 0 ? Math.round((w.onTime / w.completed) * 100) : 0;

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="manager" />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Worker Management</h1>
                        <p className="text-gray-500 text-sm mt-1">Monitor performance, availability, and task assignments.</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <p className="text-sm text-gray-500 mb-1">Total Workers</p>
                        <p className="text-2xl font-bold text-gray-900">{mockWorkers.length}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <p className="text-sm text-gray-500 mb-1">Available Now</p>
                        <p className="text-2xl font-bold text-green-600">{mockWorkers.filter(w => w.available).length}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <p className="text-sm text-gray-500 mb-1">Active Tasks</p>
                        <p className="text-2xl font-bold text-blue-600">{mockWorkers.reduce((s, w) => s + w.activeTasks, 0)}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <p className="text-sm text-gray-500 mb-1">Avg On-Time Rate</p>
                        <p className="text-2xl font-bold text-indigo-600">{Math.round(mockWorkers.reduce((s, w) => s + completionRate(w), 0) / mockWorkers.length)}%</p>
                    </div>
                </div>

                {/* Worker Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {mockWorkers.map(w => (
                        <div key={w.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                                        {w.avatar}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-900">{w.name}</h3>
                                            {w.employmentType === 'staff' && (
                                                <img 
                                                    src={staffLogo} 
                                                    alt="Internal Staff" 
                                                    className="w-4 h-4 object-contain"
                                                    title="Internal Staff"
                                                />
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500">{w.specialty}</p>
                                    </div>
                                </div>
                                <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full', w.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                                    {w.available ? 'Available' : 'Unavailable'}
                                </span>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                    <p className="text-lg font-bold text-blue-600">{w.activeTasks}</p>
                                    <p className="text-[10px] text-gray-500 uppercase">Active</p>
                                </div>
                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                    <p className="text-lg font-bold text-gray-900">{w.completed}</p>
                                    <p className="text-[10px] text-gray-500 uppercase">Done</p>
                                </div>
                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                    <p className={cn('text-lg font-bold', completionRate(w) >= 90 ? 'text-green-600' : completionRate(w) >= 70 ? 'text-amber-600' : 'text-red-600')}>{completionRate(w)}%</p>
                                    <p className="text-[10px] text-gray-500 uppercase">On-Time</p>
                                </div>
                            </div>

                            {/* Performance Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-500">On-time completion</span>
                                    <span className="font-medium text-gray-700">{w.onTime}/{w.completed}</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={cn('h-full rounded-full', completionRate(w) >= 90 ? 'bg-green-500' : completionRate(w) >= 70 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${completionRate(w)}%` }} />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-3 border-t border-gray-100">
                                <button onClick={() => navigate('/schedule')} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                                    <UserPlus className="w-3.5 h-3.5" /> Assign Task
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors">
                                    <TrendingUp className="w-3.5 h-3.5" /> Performance
                                </button>
                                <button className="flex items-center justify-center p-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
