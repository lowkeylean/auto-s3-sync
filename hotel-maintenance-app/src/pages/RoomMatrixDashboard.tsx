import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Clock, X, Wrench, FileText, UserPlus } from 'lucide-react';
import { fetchRooms, getRoomStatus, type DbRoom } from '../lib/services/roomService';
import { fetchWorkers, type DbProfile } from '../lib/services/profileService';
import { useTasks } from '../context/TaskContext';

const statusConfig = {
    green: { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', text: 'text-emerald-500', label: 'Maintained (< 10 Weeks)' },
    yellow: { bg: 'bg-yellow-400', hover: 'hover:bg-yellow-500', text: 'text-yellow-600', label: 'Upcoming (10 - 13 Weeks)' },
    red: { bg: 'bg-red-500', hover: 'hover:bg-red-600', text: 'text-red-500', label: 'Overdue (> 13 Weeks)' },
};

function formatDate(isoString: string | null) {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function RoomMatrixDashboard() {
    const { profile } = useAuth();
    const role = profile?.role || 'manager';
    const [rooms, setRooms] = useState<DbRoom[]>([]);
    const [workers, setWorkers] = useState<DbProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<DbRoom | null>(null);
    const { addTask } = useTasks();

    const [assignWorkerId, setAssignWorkerId] = useState('');
    const [assignDate, setAssignDate] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    const [filterStatus, setFilterStatus] = useState<'all' | 'green' | 'yellow' | 'red'>('all');
    const [filterFloor, setFilterFloor] = useState<number | 'all'>('all');

    useEffect(() => {
        Promise.all([fetchRooms(), fetchWorkers()])
            .then(([r, w]) => { setRooms(r); setWorkers(w); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const workersList = workers.map(w => ({
        id: w.id,
        name: `${w.full_name ?? 'Unknown'}${w.employment_type === 'staff' ? ' [Staff]' : ''} (${w.sub_category ?? 'General'})`
    }));

    const floors = useMemo(() => {
        const floorSet = new Set(rooms.map(r => r.floor));
        return Array.from(floorSet).sort((a, b) => a - b);
    }, [rooms]);

    const filteredRooms = useMemo(() => {
        return rooms.filter(room => {
            const status = getRoomStatus(room.last_maintained);
            const matchesStatus = filterStatus === 'all' || status === filterStatus;
            const matchesFloor = filterFloor === 'all' || room.floor === filterFloor;
            return matchesStatus && matchesFloor;
        });
    }, [rooms, filterStatus, filterFloor]);

    const stats = useMemo(() => {
        let green = 0, yellow = 0, red = 0;
        rooms.forEach(r => {
            const status = getRoomStatus(r.last_maintained);
            if (status === 'green') green++;
            else if (status === 'yellow') yellow++;
            else red++;
        });
        return { green, yellow, red };
    }, [rooms]);

    const floorGroups = useMemo(() => {
        const groups: Record<number, DbRoom[]> = {};
        filteredRooms.forEach(r => {
            if (!groups[r.floor]) groups[r.floor] = [];
            groups[r.floor].push(r);
        });
        return groups;
    }, [filteredRooms]);

    const handleAssignTask = () => {
        if (!selectedRoom || !assignWorkerId || !assignDate) return;
        setIsAssigning(true);
        addTask({
            equipmentName: `Room ${selectedRoom.room_number} Maintenance`,
            location: `Floor ${selectedRoom.floor}, Room ${selectedRoom.room_number}`,
            dueDate: assignDate,
            priority: getRoomStatus(selectedRoom.last_maintained) === 'red' ? 'high' : 'normal',
            instructions: 'Perform standard quarterly PM: Check AC, filters, plumbing, and general wear & tear.',
            assignedToWorkerId: assignWorkerId,
        });
        setTimeout(() => {
            setIsAssigning(false);
            setAssignWorkerId('');
            setAssignDate('');
            alert(`Task assigned for Room ${selectedRoom.room_number} on ${assignDate}`);
        }, 800);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex font-sans">
                <Sidebar role={role as any} />
                <main className="flex-1 p-8 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role={role as any} />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Room Maintenance Matrix</h1>
                    <p className="text-gray-500 text-sm mt-1">Live status of all {rooms.length} rooms across {floors.length} floors.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        { color: 'bg-emerald-500', label: 'Maintained', count: stats.green },
                        { color: 'bg-yellow-400', label: 'Upcoming', count: stats.yellow },
                        { color: 'bg-red-500', label: 'Overdue', count: stats.red },
                    ].map(({ color, label, count }) => (
                        <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${color}`} />
                            <div>
                                <p className="text-xl font-bold text-gray-900">{count}</p>
                                <p className="text-xs text-gray-500">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex gap-2">
                        {(['all', 'green', 'yellow', 'red'] as const).map(s => (
                            <button key={s} onClick={() => setFilterStatus(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${filterStatus === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>
                    <select value={filterFloor} onChange={e => setFilterFloor(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all">All Floors</option>
                        {floors.map(f => <option key={f} value={f}>Floor {f}</option>)}
                    </select>
                </div>

                {/* Room Grid by Floor */}
                <div className="space-y-6">
                    {Object.entries(floorGroups).map(([floor, floorRooms]) => (
                        <div key={floor} className="bg-white rounded-2xl border border-gray-200 p-5">
                            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Floor {floor}</h3>
                            <div className="flex flex-wrap gap-2">
                                {floorRooms.map(room => {
                                    const status = getRoomStatus(room.last_maintained);
                                    const cfg = statusConfig[status];
                                    return (
                                        <button key={room.id} onClick={() => setSelectedRoom(room)}
                                            className={`w-12 h-12 rounded-lg ${cfg.bg} ${cfg.hover} text-white text-[10px] font-bold transition-all hover:scale-105 hover:shadow-md`}
                                            title={`Room ${room.room_number} — Last: ${formatDate(room.last_maintained)}`}>
                                            {room.room_number.slice(-2)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Room Detail Panel */}
            {selectedRoom && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedRoom(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Room {selectedRoom.room_number}</h2>
                                <p className="text-sm text-gray-500">Floor {selectedRoom.floor}</p>
                            </div>
                            <button onClick={() => setSelectedRoom(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 mb-5">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>Last maintained: <strong>{formatDate(selectedRoom.last_maintained)}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className={`w-2.5 h-2.5 rounded-full ${statusConfig[getRoomStatus(selectedRoom.last_maintained)].bg}`} />
                                <span className={`font-medium text-sm ${statusConfig[getRoomStatus(selectedRoom.last_maintained)].text}`}>
                                    {statusConfig[getRoomStatus(selectedRoom.last_maintained)].label}
                                </span>
                            </div>
                        </div>

                        {(role === 'manager' || role === 'supervisor' || role === 'admin') && (
                            <div className="border-t border-gray-100 pt-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <UserPlus className="w-4 h-4" /> Assign Maintenance Task
                                </h3>
                                <div className="space-y-3">
                                    <select value={assignWorkerId} onChange={e => setAssignWorkerId(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="" disabled>Select worker...</option>
                                        {workersList.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                    </select>
                                    <input type="date" value={assignDate} onChange={e => setAssignDate(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                    <button onClick={handleAssignTask} disabled={!assignWorkerId || !assignDate || isAssigning}
                                        className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                        <Wrench className="w-4 h-4" />
                                        {isAssigning ? 'Assigning...' : 'Assign Task'}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <button className="w-full py-2.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                                <FileText className="w-4 h-4" /> View Maintenance History
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
