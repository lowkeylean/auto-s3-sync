import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { LogOut, Clock, AlertCircle, CheckCircle2, ChevronRight, Wrench } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function WorkerHome() {
    const { profile, signOut } = useAuth();
    const { getTasksForWorker } = useTasks();
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'pending' | 'completed'>('pending');

    // Sort tasks newest to oldest based on created_at, then filter
    const displayedTasks = useMemo(() => {
        // We pass the worker ID so they only see tasks assigned to them (or globally unassigned tasks)
        const myTasks = getTasksForWorker(profile?.id);
        
        return [...myTasks]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .filter(t => {
                if (filter === 'pending') return t.status === 'pending' || t.status === 'overdue';
                return t.status === 'completed';
            });
    }, [filter]);

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'overdue': return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            default: return <Clock className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* App Bar */}
            <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">My Tasks</h1>
                        <p className="text-xs text-gray-500">{profile?.full_name || 'Worker'}</p>
                    </div>
                </div>
                <button
                    onClick={signOut}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                    aria-label="Sign out"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>

            {/* Filters */}
            <div className="px-4 mt-6 mb-4">
                <div className="flex p-1 bg-gray-200/50 rounded-xl">
                    <button
                        onClick={() => setFilter('pending')}
                        className={cn(
                            "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
                            filter === 'pending' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                        )}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={cn(
                            "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
                            filter === 'completed' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                        )}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {/* Task List */}
            <div className="px-4 space-y-3">
                {displayedTasks.length === 0 ? (
                    <div className="py-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No {filter} tasks found.</p>
                    </div>
                ) : (
                    displayedTasks.map(task => (
                        <div
                            key={task.id}
                            onClick={() => navigate(`/task/${task.id}`)}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <StatusIcon status={task.status} />
                                    <span className={cn(
                                        "text-xs font-semibold uppercase tracking-wider",
                                        task.status === 'overdue' ? "text-red-500" :
                                            task.status === 'completed' ? "text-green-500" : "text-blue-500"
                                    )}>
                                        {task.status}
                                    </span>
                                    {task.priority === 'high' && (
                                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-bold">
                                            URGENT
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            </div>

                            <h3 className="text-base font-bold text-gray-900 mb-1">{task.equipmentName}</h3>
                            <p className="text-sm text-gray-500 mb-3">{task.location}</p>

                            <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                                <div className="text-xs text-gray-500">
                                    Due: <span className={cn("font-medium", task.status === 'overdue' ? 'text-red-600' : 'text-gray-700')}>
                                        {task.dueDate}
                                    </span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                            </div>
                        </div>
                    ))
                )}
            </div>

            <BottomNav />
        </div>
    );
}
