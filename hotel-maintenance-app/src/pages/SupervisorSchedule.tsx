import { useState, useEffect } from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import Sidebar from '../components/Sidebar';
import { fetchWorkers, type DbProfile } from '../lib/services/profileService';

const mockEquipmentNeedingService = [
    { id: 'eq-1', name: 'HVAC Unit B', location: 'Roof - South', lastServiced: '2026-01-20', recommendedDueDate: '2026-02-28' },
    { id: 'eq-2', name: 'Pool Pump', location: 'Basement', lastServiced: '2026-01-15', recommendedDueDate: '2026-02-25' },
    { id: 'eq-3', name: 'Commercial Oven', location: 'Kitchen', lastServiced: '2026-01-25', recommendedDueDate: '2026-03-05' },
];

export default function SupervisorSchedule() {
    const [workers, setWorkers] = useState<DbProfile[]>([]);
    const [assignments, setAssignments] = useState<Record<string, { workerId: string; date: string }>>({});

    useEffect(() => {
        fetchWorkers().then(setWorkers).catch(console.error);
    }, []);

    const handleAssignmentChange = (eqId: string, field: 'workerId' | 'date', value: string) => {
        setAssignments(prev => ({ ...prev, [eqId]: { ...prev[eqId], [field]: value } }));
    };

    const handleAssignTask = (eqId: string) => {
        const assignment = assignments[eqId];
        if (assignment?.workerId && assignment?.date) {
            const worker = workers.find(w => w.id === assignment.workerId);
            alert(`Task assigned to ${worker?.full_name ?? 'worker'} on ${assignment.date}`);
        } else {
            alert('Please select both a worker and a date.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="supervisor" />
            <main className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Weekly Schedule</h1>
                        <p className="text-gray-500">Create maintenance assignments for the upcoming week.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-500" />
                            Equipment Needing Service
                        </h2>
                        <span className="px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-gray-600 font-medium">
                            {mockEquipmentNeedingService.length} Items pending
                        </span>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {mockEquipmentNeedingService.map(eq => (
                            <div key={eq.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{eq.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{eq.location}</p>
                                    <div className="text-xs text-gray-400 flex items-center gap-4">
                                        <span>Last Serviced: {eq.lastServiced}</span>
                                        <span className="text-orange-600 font-medium">Rec. Due: {eq.recommendedDueDate}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
                                    <select
                                        value={assignments[eq.id]?.workerId ?? ''}
                                        onChange={e => handleAssignmentChange(eq.id, 'workerId', e.target.value)}
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none min-w-[200px]">
                                        <option value="" disabled>Select worker...</option>
                                        {workers.map(w => (
                                            <option key={w.id} value={w.id}>
                                                {w.full_name}{w.employment_type === 'staff' ? ' [Staff]' : ''}{w.sub_category ? ` (${w.sub_category})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <input type="date"
                                        value={assignments[eq.id]?.date ?? ''}
                                        onChange={e => handleAssignmentChange(eq.id, 'date', e.target.value)}
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                    <button onClick={() => handleAssignTask(eq.id)}
                                        className={cn(
                                            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                                            assignments[eq.id]?.workerId && assignments[eq.id]?.date
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        )}>
                                        <UserPlus className="w-4 h-4" />
                                        Assign
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
