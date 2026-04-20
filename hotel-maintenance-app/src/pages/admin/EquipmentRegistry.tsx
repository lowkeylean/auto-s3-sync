import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Search, Plus, Pencil, Trash2, Download, MapPin, Clock, X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const initialEquipment = [
    { id: 'eq-1', name: 'HVAC Unit A', location: 'Roof - North', type: 'HVAC', interval: 30, lastServiced: '2026-02-10', status: 'Operational' },
    { id: 'eq-2', name: 'HVAC Unit B', location: 'Roof - South', type: 'HVAC', interval: 30, lastServiced: '2026-01-20', status: 'Needs Service' },
    { id: 'eq-3', name: 'Walk-in Freezer 1', location: 'Main Kitchen', type: 'Refrigeration', interval: 14, lastServiced: '2026-02-15', status: 'Operational' },
    { id: 'eq-4', name: 'Pool Pump', location: 'Basement', type: 'Plumbing', interval: 60, lastServiced: '2026-01-15', status: 'Needs Service' },
    { id: 'eq-5', name: 'Commercial Oven', location: 'Kitchen', type: 'Kitchen', interval: 21, lastServiced: '2026-02-01', status: 'Operational' },
    { id: 'eq-6', name: 'Elevator Motor A', location: 'Service Shaft', type: 'Elevator', interval: 90, lastServiced: '2025-12-01', status: 'Under Maintenance' },
    { id: 'eq-7', name: 'Elevator Motor B', location: 'Service Shaft', type: 'Elevator', interval: 90, lastServiced: '2026-01-05', status: 'Operational' },
    { id: 'eq-8', name: 'Industrial Washer A', location: 'Laundry Room', type: 'Laundry', interval: 14, lastServiced: '2026-02-20', status: 'Operational' },
    { id: 'eq-9', name: 'Industrial Washer B', location: 'Laundry Room', type: 'Laundry', interval: 14, lastServiced: '2026-02-18', status: 'Operational' },
    { id: 'eq-10', name: 'Industrial Washer C', location: 'Laundry Room', type: 'Laundry', interval: 14, lastServiced: '2026-02-22', status: 'Operational' },
    { id: 'eq-11', name: 'Boiler System', location: 'Basement', type: 'Plumbing', interval: 60, lastServiced: '2026-01-10', status: 'Needs Service' },
    { id: 'eq-12', name: 'Generator A', location: 'Utility Room', type: 'Electrical', interval: 30, lastServiced: '2026-02-05', status: 'Operational' },
];

const types = ['All', 'HVAC', 'Refrigeration', 'Plumbing', 'Kitchen', 'Elevator', 'Laundry', 'Electrical'];

export default function EquipmentRegistry() {
    const [equipment, setEquipment] = useState(initialEquipment);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [showAdd, setShowAdd] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [newEq, setNewEq] = useState({ name: '', location: '', type: 'HVAC', interval: 30 });

    const filtered = equipment.filter(e => {
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === 'All' || e.type === typeFilter;
        return matchSearch && matchType;
    });

    const handleAdd = () => {
        if (!newEq.name) return;
        setEquipment(prev => [...prev, {
            id: `eq-${Date.now()}`,
            ...newEq,
            lastServiced: 'Never',
            status: 'Operational',
        }]);
        setNewEq({ name: '', location: '', type: 'HVAC', interval: 30 });
        setShowAdd(false);
    };

    const handleDelete = (id: string) => {
        setEquipment(prev => prev.filter(e => e.id !== id));
        setDeleteConfirm(null);
    };

    const statusColors: Record<string, string> = {
        'Operational': 'bg-green-100 text-green-700',
        'Needs Service': 'bg-orange-100 text-orange-700',
        'Under Maintenance': 'bg-blue-100 text-blue-700',
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="admin" />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Equipment Registry</h1>
                        <p className="text-gray-500 text-sm mt-1">Browse, add, edit, and manage all hotel equipment.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm">
                            <Plus className="w-4 h-4" /> Add Equipment
                        </button>
                    </div>
                </div>

                {/* Add Modal */}
                {showAdd && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowAdd(false)}>
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Add Equipment</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input value={newEq.name} onChange={e => setNewEq(p => ({ ...p, name: e.target.value }))} placeholder="e.g. HVAC Unit C" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input value={newEq.location} onChange={e => setNewEq(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Roof - East" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                        <select value={newEq.type} onChange={e => setNewEq(p => ({ ...p, type: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
                                            {types.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Interval (days)</label>
                                        <input type="number" value={newEq.interval} onChange={e => setNewEq(p => ({ ...p, interval: Number(e.target.value) }))} min={1} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                                <button onClick={handleAdd} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">Add Equipment</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search equipment..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white" />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {types.map(t => (
                            <button key={t} onClick={() => setTypeFilter(t)} className={cn('px-3 py-2 rounded-lg text-xs font-medium transition-colors', typeFilter === t ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Equipment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(eq => (
                        <div key={eq.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow relative">
                            {/* Delete Confirm */}
                            {deleteConfirm === eq.id && (
                                <div className="absolute inset-0 bg-white/95 rounded-2xl z-10 flex flex-col items-center justify-center p-4">
                                    <p className="text-sm font-medium text-gray-900 mb-3 text-center">Delete <strong>{eq.name}</strong>?</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"><X className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(eq.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700"><Check className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-3">
                                <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full', statusColors[eq.status] || 'bg-gray-100 text-gray-600')}>
                                    {eq.status}
                                </span>
                                <div className="flex gap-1">
                                    <button onClick={() => setEditId(editId === eq.id ? null : eq.id)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors">
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => setDeleteConfirm(eq.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-base font-bold text-gray-900 mb-1">{eq.name}</h3>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                                <MapPin className="w-3 h-3" /> {eq.location}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                                <Clock className="w-3 h-3" /> Every {eq.interval} days
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{eq.type}</span>
                                <span className="text-xs text-gray-500">Last: {eq.lastServiced}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-center text-xs text-gray-400">
                    Showing {filtered.length} of {equipment.length} items
                </div>
            </main>
        </div>
    );
}
