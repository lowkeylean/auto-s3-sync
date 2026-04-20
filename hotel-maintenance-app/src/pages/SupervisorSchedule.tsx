import { useState } from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import Sidebar from '../components/Sidebar';

// Mock Data
const mockEquipmentNeedingService = [
    { id: 'eq-1', name: 'HVAC Unit B', location: 'Roof - South', lastServiced: '2026-01-20', recommendedDueDate: '2026-02-28' },
    { id: 'eq-2', name: 'Pool Pump', location: 'Basement', lastServiced: '2026-01-15', recommendedDueDate: '2026-02-25' },
    { id: 'eq-3', name: 'Commercial Oven', location: 'Kitchen', lastServiced: '2026-01-25', recommendedDueDate: '2026-03-05' },
];

import { mockUsers } from '../data/mockUsers';

const mockWorkers = mockUsers.filter(u => u.role === 'worker').map(w => ({
    id: w.id,
    name: `${w.name} ${w.employmentType === 'staff' ? '[Staff] ' : ''}(${w.subCategory || 'General'})`
}));

export default function SupervisorSchedule() {
    const [assignments, setAssignments] = useState<Record<string, { workerId: string, date: string }>>({});

    const handleAssignmentChange = (eqId: string, field: 'workerId' | 'date', value: string) => {
        setAssignments(prev => ({
            ...prev,
            [eqId]: {
                ...prev[eqId],
                [field]: value
            }
        }));
    };

    const handleAssignTask = (eqId: string) => {
        const assignment = assignments[eqId];
        if (assignment?.workerId && assignment?.date) {
            alert(`Task assigned to Worker ${assignment.workerId} on ${assignment.date}`);
            // In real implementation, we would call the DB and remove from this list or mark assigned
        } else {
            alert("Please select both a worker and a date.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="supervisor" />

            {/* Main Content */}
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
                        {mockEquipmentNeedingService.map((eq) => (
                            <div key={eq.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors">

                                {/* Equipment Info */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{eq.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{eq.location}</p>
                                    <div className="text-xs text-gray-400 flex items-center gap-4">
                                        <span>Last Serviced: {eq.lastServiced}</span>
                                        <span className="text-orange-600 font-medium">Rec. Due: {eq.recommendedDueDate}</span>
                                    </div>
                                </div>

                                {/* Assignment Controls */}
                                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">

                                    <div className="w-full sm:w-auto">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Assign To</label>
                                        <select
                                            className="w-full sm:w-48 border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                            value={assignments[eq.id]?.workerId || ''}
                                            onChange={(e) => handleAssignmentChange(eq.id, 'workerId', e.target.value)}
                                        >
                                            <option value="" disabled>Select Worker</option>
                                            {mockWorkers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="w-full sm:w-auto">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label>
                                        <input
                                            type="date"
                                            className="w-full sm:w-40 border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                                            value={assignments[eq.id]?.date || ''}
                                            onChange={(e) => handleAssignmentChange(eq.id, 'date', e.target.value)}
                                        />
                                    </div>

                                    <button
                                        onClick={() => handleAssignTask(eq.id)}
                                        className={cn(
                                            "w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors mt-5 sm:mt-0 flex items-center justify-center gap-2",
                                            assignments[eq.id]?.workerId && assignments[eq.id]?.date
                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        )}
                                        disabled={!assignments[eq.id]?.workerId || !assignments[eq.id]?.date}
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Assign Task
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
