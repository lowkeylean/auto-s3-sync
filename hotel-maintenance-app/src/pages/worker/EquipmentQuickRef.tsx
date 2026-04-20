import { useState } from 'react';
import BottomNav from '../../components/BottomNav';
import { Search, MapPin, Clock, FileText, History, AlertTriangle, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const mockEquipment = [
    { id: 'eq-1', name: 'HVAC Unit A', location: 'Roof - North', type: 'HVAC', interval: 30, lastServiced: '2026-02-10', instructions: 'Check refrigerant levels, replace primary air filter, inspect blower motor belt for wear.', lastNotes: 'Filter replaced, refrigerant topped off.' },
    { id: 'eq-2', name: 'Walk-in Freezer 1', location: 'Main Kitchen', type: 'Refrigeration', interval: 14, lastServiced: '2026-02-15', instructions: 'Defrost coils, check door seal integrity, log current holding temperature.', lastNotes: 'Defrosted, door seal OK, temp -18°C.' },
    { id: 'eq-3', name: 'Industrial Washer C', location: 'Laundry Room', type: 'Laundry', interval: 14, lastServiced: '2026-02-22', instructions: 'Clean lint trap, inspect water inlet hoses for leaks, run self-cleaning cycle.', lastNotes: 'All hoses good, lint trap cleaned.' },
    { id: 'eq-4', name: 'Elevator Motor B', location: 'Service Shaft', type: 'Elevator', interval: 90, lastServiced: '2026-02-20', instructions: 'Lubricate bearings, check cable tension, test manual override.', lastNotes: 'Bearings lubricated, cables tensioned.' },
    { id: 'eq-5', name: 'Commercial Oven', location: 'Kitchen', type: 'Kitchen', interval: 21, lastServiced: '2026-02-18', instructions: 'Clean burner ports, check gas connections, inspect door hinges.', lastNotes: 'Replaced heating element.' },
];

export default function EquipmentQuickRef() {
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filtered = mockEquipment.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase()) ||
        e.type.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* App Bar */}
            <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 border-b border-gray-100">
                <h1 className="text-lg font-bold text-gray-900">Equipment Reference</h1>
                <p className="text-xs text-gray-500">Quick lookup for equipment you service</p>
            </div>

            {/* Search */}
            <div className="px-4 mt-4 mb-4">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, location, or type..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
            </div>

            {/* Equipment Cards */}
            <div className="px-4 space-y-3">
                {filtered.map(eq => (
                    <div key={eq.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 cursor-pointer active:scale-[0.98] transition-transform" onClick={() => setExpandedId(expandedId === eq.id ? null : eq.id)}>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{eq.type}</span>
                                <ChevronRight className={cn('w-4 h-4 text-gray-400 transition-transform', expandedId === eq.id && 'rotate-90')} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1">{eq.name}</h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{eq.location}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Every {eq.interval}d</span>
                            </div>
                        </div>

                        {expandedId === eq.id && (
                            <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-3">
                                {/* Instructions */}
                                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 mb-1">
                                        <FileText className="w-3.5 h-3.5" /> Maintenance Instructions
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">{eq.instructions}</p>
                                </div>

                                {/* Last Service Notes */}
                                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1">
                                        <History className="w-3.5 h-3.5" /> Last Service ({eq.lastServiced})
                                    </div>
                                    <p className="text-sm text-gray-600">{eq.lastNotes}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                                        <FileText className="w-3.5 h-3.5" /> View Manual
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium hover:bg-orange-100 transition-colors">
                                        <AlertTriangle className="w-3.5 h-3.5" /> Report Issue
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {filtered.length === 0 && (
                    <p className="text-center text-gray-400 py-8 text-sm">No equipment found.</p>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
