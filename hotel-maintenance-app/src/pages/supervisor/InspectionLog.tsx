import { useState } from 'react';
import { CheckCircle2, XCircle, Camera } from 'lucide-react';
import { cn } from '../../lib/utils';
import Sidebar from '../../components/Sidebar';

// Mock Data
const mockCompletedTasks = [
    {
        id: 'c1',
        equipment: 'HVAC Unit A',
        worker: 'John Doe',
        completedAt: 'Just now',
        status: 'pending_review',
        photo: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80'
    },
    {
        id: 'c2',
        equipment: 'Pool Pump Motor',
        worker: 'Sarah Connor',
        completedAt: '2 hours ago',
        status: 'pending_review',
        photo: 'https://images.unsplash.com/photo-1544208006-25803fe7e1e6?w=400&q=80'
    },
    {
        id: 'c3',
        equipment: 'Kitchen Oven',
        worker: 'Mike Ross',
        completedAt: 'Yesterday',
        status: 'approved',
        photo: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80'
    }
];

export default function InspectionLog() {
    const [tasks, setTasks] = useState(mockCompletedTasks);

    const handleAction = (id: string, newStatus: 'approved' | 'rejected') => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="supervisor" />

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quality Inspections</h1>
                        <p className="text-gray-500 mt-1">Review completed tasks and approve work quality.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map(task => (
                        <div key={task.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                            {/* Photo Header */}
                            <div className="relative h-48 bg-gray-200 group">
                                <img src={task.photo} alt={task.equipment} className="w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4 opacity-100 flex justify-between items-end">
                                    <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                                        <Camera className="w-4 h-4" />
                                        Completion Photo
                                    </div>
                                    <span className="text-white/70 text-xs">{task.completedAt}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{task.equipment}</h3>
                                <p className="text-sm text-gray-500 mb-4">Completed by <span className="font-semibold text-gray-700">{task.worker}</span></p>

                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    {task.status === 'pending_review' ? (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleAction(task.id, 'rejected')}
                                                className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <XCircle className="w-4 h-4" /> Not Approved
                                            </button>
                                            <button
                                                onClick={() => handleAction(task.id, 'approved')}
                                                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                <CheckCircle2 className="w-4 h-4" /> Approve
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            "flex justify-center items-center py-2.5 rounded-xl font-bold text-sm",
                                            task.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                                        )}>
                                            {task.status === 'approved' ? (
                                                <><CheckCircle2 className="w-5 h-5 mr-2" /> Task Approved</>
                                            ) : (
                                                <><XCircle className="w-5 h-5 mr-2" /> Needs Rework</>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}
