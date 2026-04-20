import { useState } from 'react';
import { Search, MapPin, User, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import Sidebar from '../../components/Sidebar';

// Mock Data
const mockTeam = [
    { id: 'w1', name: 'John Doe', role: 'Technician', status: 'active', location: 'Roof HVAC', tasksCompleted: 4, tasksPending: 2, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80' },
    { id: 'w2', name: 'Jane Smith', role: 'Electrician', status: 'active', location: 'Basement Panels', tasksCompleted: 2, tasksPending: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
    { id: 'w3', name: 'Mike Ross', role: 'HVAC Specialist', status: 'offline', location: 'Off shift', tasksCompleted: 0, tasksPending: 0, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' },
    { id: 'w4', name: 'Sarah Connor', role: 'Plumber', status: 'active', location: 'Room 412', tasksCompleted: 6, tasksPending: 1, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80' },
];

export default function TeamOverview() {
    const [search, setSearch] = useState('');

    const filteredTeam = mockTeam.filter(w => w.name.toLowerCase().includes(search.toLowerCase()) || w.role.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="supervisor" />

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Team Overview</h1>
                        <p className="text-gray-500 mt-1">Monitor worker status, location, and daily progress.</p>
                    </div>
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search team..."
                            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm w-64 outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTeam.map(worker => (
                        <div key={worker.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4 mb-4">
                                <img src={worker.avatar} alt={worker.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        {worker.name}
                                        <div className={cn("w-2 h-2 rounded-full", worker.status === 'active' ? 'bg-green-500' : 'bg-gray-300')} />
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                        <User className="w-3.5 h-3.5" /> {worker.role}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Current Location</p>
                                <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    {worker.location}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-3">
                                <div className="flex-1 text-center">
                                    <p className="text-xl font-bold text-gray-900 flex items-center justify-center gap-1.5">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        {worker.tasksCompleted}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Completed</p>
                                </div>
                                <div className="w-px h-8 bg-gray-200" />
                                <div className="flex-1 text-center">
                                    <p className="text-xl font-bold text-gray-900 flex items-center justify-center gap-1.5">
                                        <Clock className="w-5 h-5 text-orange-500" />
                                        {worker.tasksPending}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Pending</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}
