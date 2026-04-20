import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Search, Calendar, History, Flag, QrCode, MapPin, Clock, ChevronDown, ChevronUp, Wind, Utensils, Shirt } from 'lucide-react';
import { cn } from '../../lib/utils';

type Section = 'HVAC' | 'Kitchen' | 'Laundry';

interface Equipment {
    id: string;
    name: string;
    location: string;
    status: string;
    interval: number;
    lastServiced: string;
    nextDue: string;
    history: { date: string; worker: string; notes: string }[];
}

const mockEquipment: Record<Section, Equipment[]> = {
    HVAC: [
        {
            id: 'eq-h1', name: 'HVAC Unit A', location: 'Roof - North', status: 'Operational', interval: 30, lastServiced: '2026-02-10', nextDue: '2026-03-12',
            history: [
                { date: '2026-02-10', worker: 'John Doe', notes: 'Filter replaced, refrigerant topped.' },
                { date: '2026-01-11', worker: 'Mike Ross', notes: 'Belt inspected, no issues.' },
            ]
        },
        {
            id: 'eq-h2', name: 'HVAC Unit B', location: 'Roof - South', status: 'Needs Service', interval: 30, lastServiced: '2026-01-20', nextDue: '2026-02-19',
            history: [
                { date: '2026-01-20', worker: 'Mike Ross', notes: 'Routine check, all normal.' },
            ]
        },
        {
            id: 'eq-h3', name: 'AHU-01', location: 'Basement Level 1', status: 'Operational', interval: 60, lastServiced: '2026-02-01', nextDue: '2026-04-02',
            history: [
                { date: '2026-02-01', worker: 'John Doe', notes: 'Coil cleaned, airflow balanced.' },
                { date: '2025-12-03', worker: 'Mike Ross', notes: 'Filters replaced, drain pan cleared.' },
            ]
        },
        {
            id: 'eq-h4', name: 'FCU Block A (Floors 7–12)', location: 'Electrical Riser A', status: 'Operational', interval: 90, lastServiced: '2026-01-15', nextDue: '2026-04-15',
            history: [
                { date: '2026-01-15', worker: 'Lisa Chen', notes: 'All 24 units inspected. 2 units had blocked drip trays — cleared.' },
                { date: '2025-10-17', worker: 'John Doe', notes: 'Quarterly check. No issues.' },
            ]
        },
    ],
    Kitchen: [
        {
            id: 'eq-k1', name: 'Walk-in Freezer 1', location: 'Main Kitchen', status: 'Operational', interval: 14, lastServiced: '2026-02-15', nextDue: '2026-03-01',
            history: [
                { date: '2026-02-15', worker: 'Jane Smith', notes: 'Defrosted coils, door seal OK.' },
                { date: '2026-02-01', worker: 'Jane Smith', notes: 'Temp logged at -18°C.' },
            ]
        },
        {
            id: 'eq-k2', name: 'Walk-in Chiller', location: 'Main Kitchen', status: 'Needs Service', interval: 14, lastServiced: '2026-01-28', nextDue: '2026-02-11',
            history: [
                { date: '2026-01-28', worker: 'Jane Smith', notes: 'Condensate drain partially blocked — cleared. Temperature stable at 4°C.' },
            ]
        },
        {
            id: 'eq-k3', name: 'Commercial Dishwasher', location: 'Main Kitchen', status: 'Operational', interval: 30, lastServiced: '2026-02-20', nextDue: '2026-03-22',
            history: [
                { date: '2026-02-20', worker: 'Mike Ross', notes: 'Descaled wash arms, water pressure nominal.' },
                { date: '2026-01-21', worker: 'Mike Ross', notes: 'Routine service. Rinse aid refilled.' },
            ]
        },
        {
            id: 'eq-k4', name: 'Gas Range Unit A', location: 'Main Kitchen', status: 'Under Maintenance', interval: 30, lastServiced: '2026-01-10', nextDue: '2026-02-09',
            history: [
                { date: '2026-01-10', worker: 'Lisa Chen', notes: 'Burner 3 flame uneven — parts ordered, taken out of service.' },
                { date: '2025-12-11', worker: 'Lisa Chen', notes: 'Full clean and calibration. All burners normal.' },
            ]
        },
    ],
    Laundry: [
        {
            id: 'eq-l1', name: 'Industrial Washer 1', location: 'Laundry Room', status: 'Operational', interval: 30, lastServiced: '2026-02-18', nextDue: '2026-03-20',
            history: [
                { date: '2026-02-18', worker: 'Tom Grant', notes: 'Drum bearings lubricated, door gasket checked.' },
                { date: '2026-01-19', worker: 'Tom Grant', notes: 'Routine PM. Lint filter cleaned.' },
            ]
        },
        {
            id: 'eq-l2', name: 'Industrial Washer 2', location: 'Laundry Room', status: 'Needs Service', interval: 30, lastServiced: '2026-01-25', nextDue: '2026-02-24',
            history: [
                { date: '2026-01-25', worker: 'Tom Grant', notes: 'Vibration detected during spin cycle — balance checked but persists. Monitoring.' },
            ]
        },
        {
            id: 'eq-l3', name: 'Tumble Dryer 1', location: 'Laundry Room', status: 'Operational', interval: 30, lastServiced: '2026-02-10', nextDue: '2026-03-12',
            history: [
                { date: '2026-02-10', worker: 'Tom Grant', notes: 'Exhaust duct cleaned, heating element checked.' },
                { date: '2026-01-11', worker: 'Lisa Chen', notes: 'Lint trap cleared. Motor OK.' },
            ]
        },
        {
            id: 'eq-l4', name: 'Commercial Flatwork Ironer', location: 'Laundry Room', status: 'Operational', interval: 60, lastServiced: '2026-02-05', nextDue: '2026-04-06',
            history: [
                { date: '2026-02-05', worker: 'Tom Grant', notes: 'Roll tension adjusted, heating chest inspected. No issues.' },
                { date: '2025-12-07', worker: 'Tom Grant', notes: 'Full service. Replaced worn wax roll.' },
            ]
        },
    ],
};

const statusColors: Record<string, string> = {
    'Operational': 'bg-green-100 text-green-700',
    'Needs Service': 'bg-orange-100 text-orange-700',
    'Under Maintenance': 'bg-blue-100 text-blue-700',
};

const sectionConfig: Record<Section, { icon: typeof Wind; color: string; bg: string; border: string }> = {
    HVAC: { icon: Wind, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
    Kitchen: { icon: Utensils, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    Laundry: { icon: Shirt, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
};

const SECTIONS: Section[] = ['HVAC', 'Kitchen', 'Laundry'];

function getSectionStats(items: Equipment[]) {
    let operational = 0, needsService = 0, underMaintenance = 0;
    items.forEach(e => {
        if (e.status === 'Operational') operational++;
        else if (e.status === 'Needs Service') needsService++;
        else if (e.status === 'Under Maintenance') underMaintenance++;
    });
    return { operational, needsService, underMaintenance };
}

export default function EquipmentOverview() {
    const [activeSection, setActiveSection] = useState<Section>('HVAC');
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const sectionItems = mockEquipment[activeSection];
    const filtered = sectionItems.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase())
    );

    const cfg = sectionConfig[activeSection];
    const SectionIcon = cfg.icon;

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="manager" />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Equipment Overview</h1>
                        <p className="text-gray-500 text-sm mt-1">View status, service history, and upcoming maintenance.</p>
                    </div>
                </div>

                {/* Section Tabs */}
                <div className="flex gap-3 mb-6 flex-wrap">
                    {SECTIONS.map(section => {
                        const s = sectionConfig[section];
                        const Icon = s.icon;
                        const stats = getSectionStats(mockEquipment[section]);
                        const isActive = activeSection === section;
                        return (
                            <button
                                key={section}
                                onClick={() => { setActiveSection(section); setSearch(''); setExpandedId(null); }}
                                className={cn(
                                    'flex items-center gap-3 px-5 py-3 rounded-xl border transition-all font-medium text-sm shadow-sm',
                                    isActive
                                        ? `${s.bg} ${s.border} ${s.color} shadow-md`
                                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                )}
                            >
                                <Icon className={cn('w-4 h-4', isActive ? s.color : 'text-gray-400')} />
                                <span>{section}</span>
                                <div className="flex items-center gap-1.5 ml-1">
                                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{stats.operational}</span>
                                    {stats.needsService > 0 && <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">{stats.needsService}</span>}
                                    {stats.underMaintenance > 0 && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">{stats.underMaintenance}</span>}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Section Header */}
                <div className={cn('flex items-center gap-3 p-4 rounded-xl border mb-5', cfg.bg, cfg.border)}>
                    <div className={cn('p-2 rounded-lg bg-white/70')}>
                        <SectionIcon className={cn('w-5 h-5', cfg.color)} />
                    </div>
                    <div>
                        <h2 className={cn('font-bold text-base', cfg.color)}>{activeSection} Equipment</h2>
                        <p className="text-xs text-gray-500 mt-0.5">{sectionItems.length} units tracked</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative max-w-md mb-6">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={`Search ${activeSection} equipment...`}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                </div>

                {/* Equipment List */}
                <div className="space-y-4">
                    {filtered.length === 0 ? (
                        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200">
                            No equipment found matching "{search}".
                        </div>
                    ) : filtered.map(eq => (
                        <div key={eq.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">{eq.name}</h3>
                                        <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full', statusColors[eq.status])}>{eq.status}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{eq.location}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Every {eq.interval} days</span>
                                        <span>Last: {eq.lastServiced}</span>
                                        <span className={cn('font-medium', new Date(eq.nextDue) < new Date() ? 'text-red-600' : 'text-gray-700')}>Next: {eq.nextDue}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                                        <Calendar className="w-3.5 h-3.5" /> Schedule Service
                                    </button>
                                    <button
                                        onClick={() => setExpandedId(expandedId === eq.id ? null : eq.id)}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
                                    >
                                        <History className="w-3.5 h-3.5" /> History
                                        {expandedId === eq.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    </button>
                                    <button className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium hover:bg-orange-100 transition-colors">
                                        <Flag className="w-3.5 h-3.5" /> Flag
                                    </button>
                                    <button className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors">
                                        <QrCode className="w-3.5 h-3.5" /> QR Label
                                    </button>
                                </div>
                            </div>

                            {expandedId === eq.id && (
                                <div className="border-t border-gray-100 bg-gray-50/50 p-5">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Service History</h4>
                                    <div className="space-y-3">
                                        {eq.history.map((h, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                                                <div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span className="font-medium text-gray-700">{h.date}</span>
                                                        <span>•</span>
                                                        <span>{h.worker}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-0.5">{h.notes}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
