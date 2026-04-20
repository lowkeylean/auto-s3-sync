import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
    AlertCircle,
    Wrench,
    CheckSquare,
    MoreVertical,
    Calendar
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { cn } from '../lib/utils';
import Sidebar from './Sidebar';

// Mock Data
const trendData = [
    { time: '00:00', faults: 80 },
    { time: '02:00', faults: 120 },
    { time: '04:00', faults: 70 },
    { time: '06:00', faults: 60 },
    { time: '08:00', faults: 80 },
    { time: '10:00', faults: 50 },
    { time: '12:00', faults: 70 },
    { time: '14:00', faults: 140 },
];

const statusData = [
    { name: 'Resolved', value: 12, color: '#FCD34D' }, // Yellow-400
    { name: 'Pending', value: 6, color: '#F87171' },  // Red-400
    { name: 'Observation', value: 2, color: '#34D399' }, // Emerald-400
];

const activityData = [
    { name: 'Preventive', value: 30, color: '#3B82F6' }, // Blue
    { name: 'Breakdown', value: 20, color: '#34D399' }, // Emerald
    { name: 'Opportunity', value: 15, color: '#F472B6' }, // Pink
    { name: 'Spare', value: 10, color: '#F97316' }, // Orange
];

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("bg-white p-6 rounded-2xl shadow-sm border border-gray-100", className)}>
        {children}
    </div>
);

const IconButton = ({ icon: Icon }: { icon: any }) => (
    <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400">
        <Icon className="w-5 h-5" />
    </button>
);

export default function Dashboard() {

    const { profile } = useAuth();
    const role = profile?.role || 'manager';

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role={role as any} />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-500">Maintenance Monitoring and Fault Analysis Dashboard</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                            Corporate Admin
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm">
                            <span>Yesterday</span>
                            <Calendar className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Faults */}
                    <Card className="flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 font-medium">Total Faults Reported</p>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-gray-900">12</span>
                                    <span className="text-gray-400">Faults</span>
                                </div>
                                <div className="mt-2 inline-flex items-center px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full">
                                    + 6 faults from yesterday
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <IconButton icon={MoreVertical} />
                                <div className="p-3 bg-red-100 rounded-full text-red-500">
                                    <AlertCircle className="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Avg Repair Time */}
                    <Card className="flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 font-medium">Average Repair Time</p>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-gray-900">2.5</span>
                                    <span className="text-gray-400">hours</span>
                                </div>
                                <div className="mt-2 inline-flex items-center px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">
                                    - 0.5 hours from yesterday
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <IconButton icon={MoreVertical} />
                                <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                                    <Wrench className="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Resolved Faults */}
                    <Card className="flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 font-medium">Resolved Faults</p>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-gray-900">67%</span>
                                    <span className="text-gray-400">Faults</span>
                                </div>
                                <div className="mt-2 inline-flex items-center px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full">
                                    + 0.4% from yesterday
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <IconButton icon={MoreVertical} />
                                <div className="p-3 bg-green-100 rounded-full text-green-600">
                                    <CheckSquare className="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Main Chart */}
                    <Card className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-gray-600 font-medium">Overall Machine Fault Trends</h3>
                            <IconButton icon={MoreVertical} />
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="faults"
                                        stroke="#8B5CF6"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                        fill="url(#colorFaults)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Status Donut */}
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-gray-600 font-medium">Maintenance Status</h3>
                            <IconButton icon={MoreVertical} />
                        </div>
                        <div className="h-48 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Content could go here absolutely positioned */}
                        </div>
                        <div className="mt-4 space-y-3">
                            {statusData.map((item) => (
                                <div key={item.name} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                                        <span className="text-gray-500">{item.name}</span>
                                    </div>
                                    <span className="font-medium text-gray-700">{item.value} Faults</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Bottom Content Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Maintenance Time List */}
                    <Card>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-gray-600 font-medium">Maintenance Time</h3>
                            <IconButton icon={MoreVertical} />
                        </div>
                        <div className="space-y-6">
                            {[
                                { id: 'ATW_4_U_A', time: '01:43:06', progress: 80, color: 'bg-purple-300' },
                                { id: 'ATW_4_U_A', time: '01:13:06', progress: 60, color: 'bg-purple-300' },
                                { id: 'ATW_4_U_A', time: '00:53:06', progress: 40, color: 'bg-purple-300' },
                                { id: 'ATW_4_U_A', time: '00:53:06', progress: 30, color: 'bg-purple-300' },
                            ].map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500 font-medium">{item.id}</span>
                                        <span className="font-bold text-gray-700">{item.time}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color}`}
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Total Faults List */}
                    <Card>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-gray-600 font-medium">Total Faults Reported</h3>
                            <IconButton icon={MoreVertical} />
                        </div>
                        <div className="space-y-6">
                            {[
                                { id: 'ATW_STR_4_U_A', count: 42, progress: 90, color: 'bg-indigo-400' },
                                { id: 'ATW_STR_4_U_B', count: 32, progress: 70, color: 'bg-indigo-400' },
                                { id: 'BACK_EVA_CUT_1', count: 22, progress: 50, color: 'bg-indigo-400' },
                                { id: 'BACK_EVA_CUT_2', count: 12, progress: 30, color: 'bg-indigo-400' },
                            ].map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500 font-medium">{item.id}</span>
                                        <span className="font-bold text-gray-700">{item.count} Faults</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color}`}
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Maintenance Activity Type Donut */}
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-gray-600 font-medium">Maintenance Activity Type</h3>
                            <IconButton icon={MoreVertical} />
                        </div>
                        <div className="flex items-center">
                            <div className="h-40 w-40 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={activityData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={70}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {activityData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex-1 ml-4 space-y-3">
                                {activityData.map((item) => (
                                    <div key={item.name} className="flex items-center gap-2 text-xs">
                                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                                        <span className="text-gray-500 uppercase font-semibold">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
