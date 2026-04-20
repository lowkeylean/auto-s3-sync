import { useState } from 'react';
import BottomNav from '../../components/BottomNav';
import { Search, ChevronDown, ChevronUp, CheckCircle2, Clock, Camera } from 'lucide-react';
import { cn } from '../../lib/utils';

const mockHistory = [
    { id: 'h-1', equipmentName: 'Elevator Motor B', location: 'Service Shaft', completedAt: '2026-02-22T10:30:00Z', duration: '1h 45m', remarks: 'Lubricated bearings, tightened cable tension.', onTime: true, hasPhoto: true },
    { id: 'h-2', equipmentName: 'Industrial Washer C', location: 'Laundry Room', completedAt: '2026-02-20T14:00:00Z', duration: '45m', remarks: 'Cleaned lint trap, all hoses good.', onTime: true, hasPhoto: true },
    { id: 'h-3', equipmentName: 'Commercial Oven', location: 'Kitchen', completedAt: '2026-02-18T11:30:00Z', duration: '2h 10m', remarks: 'Replaced heating element, calibrated thermostat.', onTime: false, hasPhoto: true },
    { id: 'h-4', equipmentName: 'HVAC Unit A', location: 'Roof - North', completedAt: '2026-02-10T09:00:00Z', duration: '1h 20m', remarks: 'Filter replaced, refrigerant at good level.', onTime: true, hasPhoto: true },
    { id: 'h-5', equipmentName: 'Pool Pump', location: 'Basement', completedAt: '2026-02-05T15:00:00Z', duration: '55m', remarks: 'Impeller cleaned, seals checked.', onTime: true, hasPhoto: false },
    { id: 'h-6', equipmentName: 'Boiler System', location: 'Basement', completedAt: '2026-01-28T10:00:00Z', duration: '3h', remarks: 'Full inspection, pressure valve replaced.', onTime: true, hasPhoto: true },
];

export default function TaskHistory() {
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filtered = mockHistory.filter(h =>
        h.equipmentName.toLowerCase().includes(search.toLowerCase())
    );

    const totalCompleted = mockHistory.length;
    const onTimeCount = mockHistory.filter(h => h.onTime).length;
    const onTimeRate = Math.round((onTimeCount / totalCompleted) * 100);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* App Bar */}
            <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 border-b border-gray-100">
                <h1 className="text-lg font-bold text-gray-900">Task History</h1>
                <p className="text-xs text-gray-500">Your completed maintenance tasks</p>
            </div>

            {/* Stats */}
            <div className="px-4 mt-4 grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm">
                    <p className="text-xl font-bold text-gray-900">{totalCompleted}</p>
                    <p className="text-[10px] text-gray-500 uppercase">Completed</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm">
                    <p className="text-xl font-bold text-green-600">{onTimeRate}%</p>
                    <p className="text-[10px] text-gray-500 uppercase">On Time</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm">
                    <p className="text-xl font-bold text-blue-600">1h 40m</p>
                    <p className="text-[10px] text-gray-500 uppercase">Avg Time</p>
                </div>
            </div>

            {/* Search */}
            <div className="px-4 mb-4">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by equipment..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
            </div>

            {/* History List */}
            <div className="px-4 space-y-3">
                {filtered.map(task => (
                    <div key={task.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 cursor-pointer active:scale-[0.98] transition-transform" onClick={() => setExpandedId(expandedId === task.id ? null : task.id)}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full', task.onTime ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
                                        {task.onTime ? 'On Time' : 'Late'}
                                    </span>
                                </div>
                                {expandedId === task.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </div>
                            <h3 className="text-sm font-bold text-gray-900">{task.equipmentName}</h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                <span>{task.location}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{task.duration}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                {new Date(task.completedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>

                        {expandedId === task.id && (
                            <div className="px-4 pb-4 border-t border-gray-50 pt-3">
                                <p className="text-sm text-gray-600 mb-2"><strong>Remarks:</strong> {task.remarks}</p>
                                {task.hasPhoto && (
                                    <div className="flex items-center gap-1.5 text-xs text-blue-600">
                                        <Camera className="w-3.5 h-3.5" /> After photo attached
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {filtered.length === 0 && (
                    <p className="text-center text-gray-400 py-8 text-sm">No tasks found.</p>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
