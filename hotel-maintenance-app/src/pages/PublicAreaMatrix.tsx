import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Info, Clock, X, Wrench, FileText, UserPlus, Building2, Warehouse } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { mockUsers } from '../data/mockUsers';

const mockWorkersList = mockUsers.filter(u => u.role === 'worker').map(w => ({
    id: w.id,
    name: `${w.name} ${w.employmentType === 'staff' ? '[Staff] ' : ''}(${w.subCategory || 'General'})`
}));

export interface PublicAreaData {
    id: string;
    name: string;
    section: 'front' | 'back';
    areaGroup: string;
    lastMaintained: string;
    history: {
        id: string;
        date: string;
        action: string;
        technician: string;
        notes?: string;
    }[];
}

const mockPublicAreas: PublicAreaData[] = [
    // ── Front of House ──
    {
        id: 'pa-f1', name: 'Main Lobby', section: 'front', areaGroup: 'Entrance & Reception', lastMaintained: '2026-02-14',
        history: [
            { id: 'h1', date: '2026-02-14', action: 'Quarterly PM', technician: 'John Doe', notes: 'Marble floor polished, chandelier cleaned, HVAC grilles wiped.' },
            { id: 'h2', date: '2025-11-15', action: 'Quarterly PM', technician: 'Mike Ross', notes: 'All systems checked. Touch-up paint on pillars.' },
        ]
    },
    {
        id: 'pa-f2', name: 'Concierge Desk', section: 'front', areaGroup: 'Entrance & Reception', lastMaintained: '2026-02-08',
        history: [
            { id: 'h1', date: '2026-02-08', action: 'Routine Check', technician: 'John Doe', notes: 'Lighting inspected, electrical outlets tested.' },
        ]
    },
    {
        id: 'pa-f3', name: 'Grand Ballroom', section: 'front', areaGroup: 'Events Wing', lastMaintained: '2026-01-20',
        history: [
            { id: 'h1', date: '2026-01-20', action: 'Quarterly PM', technician: 'Lisa Chen', notes: 'Stage lighting rigged, AV system tested, carpet steam-cleaned.' },
            { id: 'h2', date: '2025-10-22', action: 'Quarterly PM', technician: 'John Doe', notes: 'Ceiling drapes inspected, fire sprinklers tested.' },
        ]
    },
    {
        id: 'pa-f4', name: 'Meeting Room A', section: 'front', areaGroup: 'Events Wing', lastMaintained: '2026-02-10',
        history: [
            { id: 'h1', date: '2026-02-10', action: 'Routine Check', technician: 'Mike Ross', notes: 'Projector bulb replaced, AV cables secured.' },
        ]
    },
    {
        id: 'pa-f5', name: 'Meeting Room B', section: 'front', areaGroup: 'Events Wing', lastMaintained: '2026-01-10',
        history: [
            { id: 'h1', date: '2026-01-10', action: 'Quarterly PM', technician: 'Lisa Chen', notes: 'FCU cleaned, lighting checked. Carpet stain noted — reported.' },
        ]
    },
    {
        id: 'pa-f6', name: 'Meeting Room C', section: 'front', areaGroup: 'Events Wing', lastMaintained: '2026-02-20',
        history: [
            { id: 'h1', date: '2026-02-20', action: 'Routine Check', technician: 'John Doe', notes: 'All OK. Whiteboard replaced.' },
        ]
    },
    {
        id: 'pa-f7', name: 'Meeting Room D', section: 'front', areaGroup: 'Events Wing', lastMaintained: '2026-02-05',
        history: [
            { id: 'h1', date: '2026-02-05', action: 'Routine Check', technician: 'Mike Ross', notes: 'Blinds repaired, AC filter cleaned.' },
        ]
    },
    {
        id: 'pa-f8', name: 'Main Restaurant', section: 'front', areaGroup: 'Food & Beverage', lastMaintained: '2026-02-18',
        history: [
            { id: 'h1', date: '2026-02-18', action: 'Quarterly PM', technician: 'Jane Smith', notes: 'Exhaust hood serviced, grease traps cleaned, flooring sealed.' },
            { id: 'h2', date: '2025-11-20', action: 'Quarterly PM', technician: 'Jane Smith', notes: 'Pest control check. Lighting replaced over buffet counter.' },
        ]
    },
    {
        id: 'pa-f9', name: 'Bar & Lounge', section: 'front', areaGroup: 'Food & Beverage', lastMaintained: '2026-01-15',
        history: [
            { id: 'h1', date: '2026-01-15', action: 'Quarterly PM', technician: 'Tom Grant', notes: 'Bar refrigeration serviced, CO₂ lines inspected.' },
        ]
    },
    {
        id: 'pa-f10', name: 'Pool Area', section: 'front', areaGroup: 'Recreation', lastMaintained: '2026-02-01',
        history: [
            { id: 'h1', date: '2026-02-01', action: 'Quarterly PM', technician: 'Lisa Chen', notes: 'Pool pump and filter serviced. Chemical dosing system calibrated.' },
            { id: 'h2', date: '2025-11-03', action: 'Quarterly PM', technician: 'Tom Grant', notes: 'Deck drains cleared. Pool lights replaced.' },
        ]
    },
    {
        id: 'pa-f11', name: 'Spa & Wellness', section: 'front', areaGroup: 'Recreation', lastMaintained: '2026-01-05',
        history: [
            { id: 'h1', date: '2026-01-05', action: 'Quarterly PM', technician: 'Jane Smith', notes: 'Steam generator serviced. Sauna heater calibrated. Plumbing inspected.' },
        ]
    },
    {
        id: 'pa-f12', name: 'Fitness Center', section: 'front', areaGroup: 'Recreation', lastMaintained: '2026-02-22',
        history: [
            { id: 'h1', date: '2026-02-22', action: 'Routine Check', technician: 'Mike Ross', notes: 'Treadmill belts lubricated, equipment bolts tightened.' },
        ]
    },
    {
        id: 'pa-f13', name: 'Business Center', section: 'front', areaGroup: 'Amenities', lastMaintained: '2026-02-12',
        history: [
            { id: 'h1', date: '2026-02-12', action: 'Routine Check', technician: 'John Doe', notes: 'Printers serviced, UPS batteries checked.' },
        ]
    },
    {
        id: 'pa-f14', name: 'Gift Shop', section: 'front', areaGroup: 'Amenities', lastMaintained: '2026-01-28',
        history: [
            { id: 'h1', date: '2026-01-28', action: 'Routine Check', technician: 'Tom Grant', notes: 'Display lighting replaced, AC filter cleaned.' },
        ]
    },

    // ── Back of House ──
    {
        id: 'pa-b1', name: 'General Manager Office', section: 'back', areaGroup: 'Administration', lastMaintained: '2026-02-01',
        history: [
            { id: 'h1', date: '2026-02-01', action: 'Routine Check', technician: 'John Doe', notes: 'AC serviced, lighting checked, electrical sockets tested.' },
        ]
    },
    {
        id: 'pa-b2', name: 'Finance Office', section: 'back', areaGroup: 'Administration', lastMaintained: '2026-01-20',
        history: [
            { id: 'h1', date: '2026-01-20', action: 'Routine Check', technician: 'Mike Ross', notes: 'UPS checked, ceiling tiles inspected.' },
        ]
    },
    {
        id: 'pa-b3', name: 'HR Office', section: 'back', areaGroup: 'Administration', lastMaintained: '2026-02-15',
        history: [
            { id: 'h1', date: '2026-02-15', action: 'Routine Check', technician: 'John Doe', notes: 'AC filter cleaned, lighting OK.' },
        ]
    },
    {
        id: 'pa-b4', name: 'Security Office', section: 'back', areaGroup: 'Administration', lastMaintained: '2026-02-10',
        history: [
            { id: 'h1', date: '2026-02-10', action: 'Routine Check', technician: 'Lisa Chen', notes: 'CCTV power supply checked, UPS battery replaced.' },
        ]
    },
    {
        id: 'pa-b5', name: 'Staff Cafeteria', section: 'back', areaGroup: 'Staff Facilities', lastMaintained: '2026-01-25',
        history: [
            { id: 'h1', date: '2026-01-25', action: 'Quarterly PM', technician: 'Jane Smith', notes: 'Exhaust fan cleaned, refrigerator coils serviced.' },
        ]
    },
    {
        id: 'pa-b6', name: 'Staff Locker Rooms', section: 'back', areaGroup: 'Staff Facilities', lastMaintained: '2026-01-10',
        history: [
            { id: 'h1', date: '2026-01-10', action: 'Quarterly PM', technician: 'Tom Grant', notes: 'Plumbing inspected, exhaust fans cleaned. Several locker doors repaired.' },
        ]
    },
    {
        id: 'pa-b7', name: 'Housekeeping Dept', section: 'back', areaGroup: 'Operations', lastMaintained: '2026-01-08',
        history: [
            { id: 'h1', date: '2026-01-08', action: 'Quarterly PM', technician: 'Tom Grant', notes: 'Chemical storage ventilation checked. Shelving inspected.' },
        ]
    },
    {
        id: 'pa-b8', name: 'Laundry Room', section: 'back', areaGroup: 'Operations', lastMaintained: '2026-02-18',
        history: [
            { id: 'h1', date: '2026-02-18', action: 'Quarterly PM', technician: 'Tom Grant', notes: 'Dryer exhaust ducts cleaned. Floor drain cleared.' },
            { id: 'h2', date: '2025-11-20', action: 'Quarterly PM', technician: 'Lisa Chen', notes: 'Full inspection. Steam pipe insulation checked.' },
        ]
    },
    {
        id: 'pa-b9', name: 'Engineering Workshop', section: 'back', areaGroup: 'Operations', lastMaintained: '2026-02-05',
        history: [
            { id: 'h1', date: '2026-02-05', action: 'Routine Check', technician: 'John Doe', notes: 'Tool inventory updated. Electrical panel inspected.' },
        ]
    },
    {
        id: 'pa-b10', name: 'Storage Room A', section: 'back', areaGroup: 'Storage & Logistics', lastMaintained: '2026-01-08',
        history: [
            { id: 'h1', date: '2026-01-08', action: 'Quarterly PM', technician: 'Mike Ross', notes: 'Pest control check. Shelving brackets tightened.' },
        ]
    },
    {
        id: 'pa-b11', name: 'Storage Room B', section: 'back', areaGroup: 'Storage & Logistics', lastMaintained: '2026-01-15',
        history: [
            { id: 'h1', date: '2026-01-15', action: 'Quarterly PM', technician: 'Mike Ross', notes: 'Humidity levels checked. Fire extinguisher inspected.' },
        ]
    },
    {
        id: 'pa-b12', name: 'Loading Dock', section: 'back', areaGroup: 'Storage & Logistics', lastMaintained: '2026-02-12',
        history: [
            { id: 'h1', date: '2026-02-12', action: 'Routine Check', technician: 'Tom Grant', notes: 'Dock leveler serviced. Roller doors lubricated.' },
        ]
    },
    {
        id: 'pa-b13', name: 'Waste Management Area', section: 'back', areaGroup: 'Storage & Logistics', lastMaintained: '2026-01-30',
        history: [
            { id: 'h1', date: '2026-01-30', action: 'Routine Check', technician: 'Tom Grant', notes: 'Baler serviced. Drainage cleared. Pest control OK.' },
        ]
    },
];

function getAreaStatus(lastMaintained: string): 'green' | 'yellow' | 'red' {
    const days = Math.floor((Date.now() - new Date(lastMaintained).getTime()) / 86400000);
    if (days < 70) return 'green';
    if (days <= 91) return 'yellow';
    return 'red';
}

const statusConfig = {
    green: { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', label: 'Maintained (< 10 Weeks)' },
    yellow: { bg: 'bg-yellow-400', hover: 'hover:bg-yellow-500', label: 'Upcoming (10–13 Weeks)' },
    red: { bg: 'bg-red-500', hover: 'hover:bg-red-600', label: 'Overdue (> 13 Weeks)' },
};

function formatDate(isoString: string) {
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PublicAreaMatrix() {
    const { profile } = useAuth();
    const role = profile?.role || 'manager';
    const { addTask } = useTasks();

    const [selectedArea, setSelectedArea] = useState<PublicAreaData | null>(null);
    const [filterSection, setFilterSection] = useState<'all' | 'front' | 'back'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'green' | 'yellow' | 'red'>('all');

    const [assignWorkerId, setAssignWorkerId] = useState('');
    const [assignDate, setAssignDate] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    const canAssign = ['admin', 'manager', 'supervisor'].includes(role);

    const stats = useMemo(() => {
        let green = 0, yellow = 0, red = 0;
        mockPublicAreas.forEach(a => {
            const s = getAreaStatus(a.lastMaintained);
            if (s === 'green') green++;
            else if (s === 'yellow') yellow++;
            else red++;
        });
        return { green, yellow, red, total: mockPublicAreas.length };
    }, []);

    const filteredAreas = useMemo(() => {
        return mockPublicAreas.filter(a => {
            const status = getAreaStatus(a.lastMaintained);
            const matchesSection = filterSection === 'all' || a.section === filterSection;
            const matchesStatus = filterStatus === 'all' || status === filterStatus;
            return matchesSection && matchesStatus;
        });
    }, [filterSection, filterStatus]);

    const frontAreas = filteredAreas.filter(a => a.section === 'front');
    const backAreas = filteredAreas.filter(a => a.section === 'back');

    function groupByArea(areas: PublicAreaData[]) {
        const map = new Map<string, PublicAreaData[]>();
        areas.forEach(a => {
            if (!map.has(a.areaGroup)) map.set(a.areaGroup, []);
            map.get(a.areaGroup)!.push(a);
        });
        return map;
    }

    const handleAssignTask = () => {
        if (!selectedArea || !assignWorkerId || !assignDate) return;
        setIsAssigning(true);
        addTask({
            equipmentName: `${selectedArea.name} Maintenance`,
            location: `${selectedArea.section === 'front' ? 'Front of House' : 'Back of House'} — ${selectedArea.areaGroup}`,
            dueDate: assignDate,
            priority: getAreaStatus(selectedArea.lastMaintained) === 'red' ? 'high' : 'normal',
            instructions: 'Perform scheduled preventive maintenance for this public area.',
            assignedToWorkerId: assignWorkerId
        });
        setTimeout(() => {
            setIsAssigning(false);
            setAssignWorkerId('');
            setAssignDate('');
            alert('Task assigned successfully!');
        }, 500);
    };

    function SectionGrid({ areas, label, icon: Icon, color }: {
        areas: PublicAreaData[];
        label: string;
        icon: typeof Building2;
        color: string;
    }) {
        if (areas.length === 0) return null;
        const groups = groupByArea(areas);
        let gGreen = 0, gYellow = 0, gRed = 0;
        areas.forEach(a => {
            const s = getAreaStatus(a.lastMaintained);
            if (s === 'green') gGreen++;
            else if (s === 'yellow') gYellow++;
            else gRed++;
        });

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                {/* Section Header */}
                <div className={`flex items-center gap-4 px-6 py-4 border-b border-gray-100 ${color}`}>
                    <Icon className="w-5 h-5" />
                    <h2 className="text-base font-bold flex-1">{label}</h2>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                        <span className="bg-white/30 px-2 py-1 rounded-md">{areas.length} areas</span>
                        {gGreen > 0 && <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">Good: {gGreen}</span>}
                        {gYellow > 0 && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md">Upcoming: {gYellow}</span>}
                        {gRed > 0 && <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md">Overdue: {gRed}</span>}
                    </div>
                </div>

                {/* Area Groups */}
                <div className="p-6 space-y-8">
                    {Array.from(groups.entries()).map(([group, groupAreas]) => (
                        <div key={group}>
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{group}</h3>
                                <div className="h-px flex-1 bg-gray-100" />
                            </div>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
                                {groupAreas.map(area => {
                                    const status = getAreaStatus(area.lastMaintained);
                                    const cfg = statusConfig[status];
                                    return (
                                        <button
                                            key={area.id}
                                            onClick={() => setSelectedArea(area)}
                                            className={`${cfg.bg} ${cfg.hover} text-white font-semibold text-xs rounded-xl px-3 py-4 flex flex-col items-center justify-center gap-1 shadow-sm transition-transform hover:scale-105 active:scale-95 text-center`}
                                            title={`${area.name} — ${cfg.label}`}
                                        >
                                            <span className="leading-tight">{area.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role={role as any} />

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Public Area Matrix</h1>
                        <p className="text-gray-500">Quarterly Maintenance Overview — Front & Back of House</p>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-2 gap-2 text-sm flex-wrap">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'all' ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            All ({stats.total})
                        </button>
                        <button
                            onClick={() => setFilterStatus('green')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'green' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-emerald-50'}`}
                        >
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            Good ({stats.green})
                        </button>
                        <button
                            onClick={() => setFilterStatus('yellow')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'yellow' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-500 hover:bg-yellow-50'}`}
                        >
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            Upcoming ({stats.yellow})
                        </button>
                        <button
                            onClick={() => setFilterStatus('red')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'red' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:bg-red-50'}`}
                        >
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            Overdue ({stats.red})
                        </button>
                    </div>
                </div>

                {/* Section Filter */}
                <div className="mb-6 flex items-center gap-3">
                    {(['all', 'front', 'back'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterSection(s)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${filterSection === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                        >
                            {s === 'front' && <Building2 className="w-4 h-4" />}
                            {s === 'back' && <Warehouse className="w-4 h-4" />}
                            {s === 'all' ? 'All Areas' : s === 'front' ? 'Front of House' : 'Back of House'}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {filteredAreas.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center py-24 text-gray-400">
                        <Info className="w-12 h-12 mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No areas match the selected filters.</p>
                    </div>
                ) : (
                    <>
                        {(filterSection === 'all' || filterSection === 'front') && (
                            <SectionGrid
                                areas={frontAreas}
                                label="Front of House"
                                icon={Building2}
                                color="bg-blue-50 text-blue-800"
                            />
                        )}
                        {(filterSection === 'all' || filterSection === 'back') && (
                            <SectionGrid
                                areas={backAreas}
                                label="Back of House"
                                icon={Warehouse}
                                color="bg-slate-100 text-slate-700"
                            />
                        )}
                    </>
                )}
            </main>

            {/* Area Details Modal */}
            {selectedArea && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedArea.name}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {selectedArea.section === 'front' ? 'Front of House' : 'Back of House'} · {selectedArea.areaGroup}
                                    </p>
                                </div>
                                {(() => {
                                    const status = getAreaStatus(selectedArea.lastMaintained);
                                    const cfg = statusConfig[status];
                                    return (
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${cfg.bg} text-white`}>
                                            {status === 'green' ? 'Maintained' : status === 'yellow' ? 'Upcoming' : 'Overdue'}
                                        </div>
                                    );
                                })()}
                            </div>
                            <button onClick={() => setSelectedArea(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto">
                            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 mb-8 flex items-start gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Last Maintenance Date</h4>
                                    <p className="text-2xl font-bold text-blue-700">{formatDate(selectedArea.lastMaintained)}</p>
                                    <p className="text-sm text-blue-600 mt-1">{selectedArea.areaGroup}</p>
                                </div>
                            </div>

                            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-400" />
                                Maintenance History
                            </h4>

                            <div className="space-y-6">
                                {selectedArea.history.map(record => (
                                    <div key={record.id} className="relative pl-6 border-l-2 border-gray-200 last:border-0 pb-2">
                                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-indigo-500" />
                                        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h5 className="font-bold text-gray-900">{record.action}</h5>
                                                    <p className="text-sm text-gray-500 mt-1">{formatDate(record.date)}</p>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                    <Wrench className="w-3.5 h-3.5" />
                                                    {record.technician}
                                                </div>
                                            </div>
                                            {record.notes && (
                                                <p className="text-sm text-gray-700 leading-relaxed">{record.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center p-6 gap-4">
                            {canAssign ? (
                                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full sm:w-auto bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                    <select
                                        className="w-full sm:w-48 border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                        value={assignWorkerId}
                                        onChange={e => setAssignWorkerId(e.target.value)}
                                    >
                                        <option value="" disabled>Assign to Worker...</option>
                                        {mockWorkersList.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                    </select>
                                    <input
                                        type="date"
                                        className="w-full sm:w-36 border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
                                        value={assignDate}
                                        onChange={e => setAssignDate(e.target.value)}
                                    />
                                    <button
                                        onClick={handleAssignTask}
                                        disabled={!assignWorkerId || !assignDate || isAssigning}
                                        className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 ${(!assignWorkerId || !assignDate || isAssigning) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        {isAssigning ? 'Assigning...' : 'Assign'}
                                    </button>
                                </div>
                            ) : <div />}

                            <button
                                onClick={() => setSelectedArea(null)}
                                className="px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm w-full sm:w-auto shrink-0"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
