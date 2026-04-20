import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Info, Clock, X, Wrench, FileText, UserPlus } from 'lucide-react';
import { mockRooms, getRoomStatus, type RoomData } from '../data/mockRooms';
import { useTasks } from '../context/TaskContext';

import { mockUsers } from '../data/mockUsers';

// Mock list of workers for assignment prototyping
const mockWorkersList = mockUsers.filter(u => u.role === 'worker').map(w => ({
    id: w.id,
    name: `${w.name} ${w.employmentType === 'staff' ? '[Staff] ' : ''}(${w.subCategory || 'General'})`
}));

const statusConfig = {
    green: { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', text: 'text-emerald-500', label: 'Maintained (< 10 Weeks)' },
    yellow: { bg: 'bg-yellow-400', hover: 'hover:bg-yellow-500', text: 'text-yellow-600', label: 'Upcoming (10 - 13 Weeks)' },
    red: { bg: 'bg-red-500', hover: 'hover:bg-red-600', text: 'text-red-500', label: 'Overdue (> 13 Weeks)' },
};

function formatDate(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function RoomMatrixDashboard() {
    const { profile } = useAuth();
    const role = profile?.role || 'manager';
    const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
    const { addTask } = useTasks();

    // Assignment States
    const [assignWorkerId, setAssignWorkerId] = useState('');
    const [assignDate, setAssignDate] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    // Filter states
    const [filterStatus, setFilterStatus] = useState<'all' | 'green' | 'yellow' | 'red'>('all');
    const [filterFloor, setFilterFloor] = useState<number | 'all'>('all');

    const floors = useMemo(() => {
        const floorSet = new Set(mockRooms.map(r => r.floor));
        return Array.from(floorSet).sort((a, b) => a - b);
    }, []);

    const filteredRooms = useMemo(() => {
        return mockRooms.filter(room => {
            const status = getRoomStatus(room.lastMaintained);
            const matchesStatus = filterStatus === 'all' || status === filterStatus;
            const matchesFloor = filterFloor === 'all' || room.floor === filterFloor;
            return matchesStatus && matchesFloor;
        });
    }, [filterStatus, filterFloor]);

    const stats = useMemo(() => {
        let green = 0, yellow = 0, red = 0;
        mockRooms.forEach(r => {
            const status = getRoomStatus(r.lastMaintained);
            if (status === 'green') green++;
            else if (status === 'yellow') yellow++;
            else if (status === 'red') red++;
        });
        return { green, yellow, red, total: mockRooms.length };
    }, []);

    const handleAssignTask = () => {
        if (!selectedRoom || !assignWorkerId || !assignDate) return;
        
        setIsAssigning(true);
        
        addTask({
            equipmentName: `Room ${selectedRoom.roomNumber} Maintenance`,
            location: `Floor ${selectedRoom.floor}, Room ${selectedRoom.roomNumber}`,
            dueDate: assignDate,
            priority: getRoomStatus(selectedRoom.lastMaintained) === 'red' ? 'high' : 'normal',
            instructions: 'Perform standard quarterly PM: Check AC, filters, plumbing, and general wear & tear.',
            assignedToWorkerId: assignWorkerId
        });

        setTimeout(() => {
            setIsAssigning(false);
            setAssignWorkerId('');
            setAssignDate('');
            alert(`Task assigned successfully to worker!`);
        }, 500);
    };

    // Only Admin/Manager/Supervisor can assign tasks
    const canAssign = ['admin', 'manager', 'supervisor'].includes(role);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role={role as any} />

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Room Maintenance Matrix</h1>
                        <p className="text-gray-500">Quarterly Maintenance Overview (13 Weeks Schedule)</p>
                    </div>
                    
                    {/* Stats & Legend */}
                    <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-2 gap-2 text-sm">
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
                            Good ({stats.green} - {((stats.green / stats.total) * 100).toFixed(1)}%)
                        </button>
                        <button 
                            onClick={() => setFilterStatus('yellow')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'yellow' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-500 hover:bg-yellow-50'}`}
                        >
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            Upcoming ({stats.yellow} - {((stats.yellow / stats.total) * 100).toFixed(1)}%)
                        </button>
                        <button 
                            onClick={() => setFilterStatus('red')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'red' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:bg-red-50'}`}
                        >
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            Overdue ({stats.red} - {((stats.red / stats.total) * 100).toFixed(1)}%)
                        </button>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                        <label className="text-sm text-gray-500 font-medium">Floor:</label>
                        <select 
                            className="bg-transparent text-sm font-medium text-gray-800 outline-none"
                            value={filterFloor}
                            onChange={(e) => setFilterFloor(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                        >
                            <option value="all">All Floors</option>
                            {floors.map(f => (
                                <option key={f} value={f}>Floor {f}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* The Grid Component */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 min-h-[500px]">
                    {filteredRooms.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
                            <Info className="w-12 h-12 mb-4 text-gray-300" />
                            <p className="text-lg font-medium">No rooms match the selected filters.</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {/* Group rooms by floor */}
                            {Array.from(new Set(filteredRooms.map(r => r.floor)))
                                .sort((a, b) => a - b)
                                .map(floorNum => {
                                    const roomsOnFloor = filteredRooms.filter(r => r.floor === floorNum);
                                    
                                    let fGreen = 0, fYellow = 0, fRed = 0;
                                    roomsOnFloor.forEach(r => {
                                        const st = getRoomStatus(r.lastMaintained);
                                        if (st === 'green') fGreen++;
                                        else if (st === 'yellow') fYellow++;
                                        else if (st === 'red') fRed++;
                                    });
                                    const fTotal = roomsOnFloor.length;

                                    return (
                                        <div key={floorNum} className="space-y-4">
                                            {/* Floor Header */}
                                            <div className="flex items-center gap-4">
                                                <h3 className="text-lg font-bold text-gray-800 shrink-0">Floor {floorNum}</h3>
                                                <div className="h-px w-full bg-gray-200"></div>
                                                <div className="flex items-center gap-3 text-xs font-semibold shrink-0">
                                                    <span className="text-gray-500 px-2 py-1 bg-gray-100 rounded-md">{fTotal} rooms</span>
                                                    {fGreen > 0 && <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">Good: {fGreen} ({((fGreen / fTotal) * 100).toFixed(0)}%)</span>}
                                                    {fYellow > 0 && <span className="text-yellow-700 bg-yellow-50 px-2 py-1 rounded-md">Upcoming: {fYellow} ({((fYellow / fTotal) * 100).toFixed(0)}%)</span>}
                                                    {fRed > 0 && <span className="text-red-700 bg-red-50 px-2 py-1 rounded-md">Overdue: {fRed} ({((fRed / fTotal) * 100).toFixed(0)}%)</span>}
                                                </div>
                                            </div>
                                            
                                            {/* Floor Grid */}
                                            <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-3">
                                                {roomsOnFloor.map((room) => {
                                                    const status = getRoomStatus(room.lastMaintained);
                                                    const config = statusConfig[status];
                                                    
                                                    return (
                                                        <button
                                                            key={room.id}
                                                            onClick={() => setSelectedRoom(room)}
                                                            className={`${config.bg} ${config.hover} text-white font-semibold text-sm rounded-lg py-3 flex items-center justify-center shadow-sm transition-transform hover:scale-105 active:scale-95`}
                                                            title={`Room ${room.roomNumber} - ${config.label}`}
                                                        >
                                                            {room.roomNumber}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    )}
                </div>
            </main>

            {/* Room Details Modal */}
            {selectedRoom && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xl font-bold text-gray-900">Room {selectedRoom.roomNumber}</h3>
                                {(() => {
                                    const status = getRoomStatus(selectedRoom.lastMaintained);
                                    const c = statusConfig[status];
                                    return (
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${c.bg} text-white`}>
                                            {status === 'green' ? 'Maintained' : status === 'yellow' ? 'Upcoming' : 'Overdue'}
                                        </div>
                                    )
                                })()}
                            </div>
                            <button 
                                onClick={() => setSelectedRoom(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto">
                            {/* Summary Card */}
                            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 mb-8 flex items-start gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Last Maintenance Date</h4>
                                    <p className="text-2xl font-bold text-blue-700">{formatDate(selectedRoom.lastMaintained)}</p>
                                    <p className="text-sm text-blue-600 mt-1">Floor {selectedRoom.floor}</p>
                                </div>
                            </div>

                            {/* History Timeline */}
                            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-400" />
                                Maintenance History
                            </h4>
                            
                            <div className="space-y-6">
                                {selectedRoom.history.map((record) => (
                                    <div key={record.id} className="relative pl-6 border-l-2 border-gray-200 last:border-0 pb-2">
                                        {/* Timeline Dot */}
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
                                                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                                    {record.notes}
                                                </p>
                                            )}

                                            {record.images && record.images.length > 0 && (
                                                <div className="flex gap-3 overflow-x-auto pb-2">
                                                    {record.images.map((img, i) => (
                                                        <img 
                                                            key={i} 
                                                            src={img} 
                                                            alt={`Maintenance Record ${i+1}`} 
                                                            className="w-24 h-24 object-cover rounded-lg border border-gray-200 shrink-0"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Footer & Assignment Controls */}
                        <div className="border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center p-6 gap-4">
                            
                            {canAssign ? (
                                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full sm:w-auto bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="w-full sm:w-auto">
                                        <select 
                                            className="w-full sm:w-48 border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                            value={assignWorkerId}
                                            onChange={(e) => setAssignWorkerId(e.target.value)}
                                        >
                                            <option value="" disabled>Assign to Worker...</option>
                                            {mockWorkersList.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="w-full sm:w-auto">
                                        <input 
                                            type="date" 
                                            className="w-full sm:w-36 border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
                                            value={assignDate}
                                            onChange={(e) => setAssignDate(e.target.value)}
                                        />
                                    </div>
                                    <button 
                                        onClick={handleAssignTask}
                                        disabled={!assignWorkerId || !assignDate || isAssigning}
                                        className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 ${(!assignWorkerId || !assignDate || isAssigning) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        {isAssigning ? 'Assigning...' : 'Assign'}
                                    </button>
                                </div>
                            ) : (
                                <div>{/* Spacer for non-assigners */}</div>
                            )}

                            <button 
                                onClick={() => setSelectedRoom(null)}
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
