import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/BottomNav';
import { User, Pencil, Bell, BellOff, BarChart3, LogOut, Check, Zap, Award, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function WorkerProfile() {
    const { profile, signOut } = useAuth();
    const [editingName, setEditingName] = useState(false);
    const [name, setName] = useState(profile?.full_name || 'Worker');
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);

    const handleSaveName = () => {
        setEditingName(false);
        // In real app, save to Supabase
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-4 pt-8 pb-16 text-white">
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-3 border-2 border-white/40">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    {editingName ? (
                        <div className="flex items-center gap-2 mb-1">
                            <input value={name} onChange={e => setName(e.target.value)} className="bg-white/20 border border-white/30 rounded-lg px-3 py-1 text-white text-center text-lg font-bold placeholder:text-white/50 outline-none" autoFocus />
                            <button onClick={handleSaveName} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30"><Check className="w-4 h-4" /></button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-bold">{name}</h1>
                            <button onClick={() => setEditingName(true)} className="p-1 hover:bg-white/20 rounded-lg"><Pencil className="w-3.5 h-3.5 text-white/70" /></button>
                        </div>
                    )}
                    <p className="text-sm text-white/70">{profile?.email || 'worker@hotel.com'}</p>
                </div>
            </div>

            {/* Stats Cards — overlapping header */}
            <div className="px-4 -mt-8 grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 text-center">
                    <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">12</p>
                    <p className="text-[10px] text-gray-500 uppercase">This Week</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 text-center">
                    <Award className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">7 days</p>
                    <p className="text-[10px] text-gray-500 uppercase">Streak</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 text-center">
                    <BarChart3 className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">92%</p>
                    <p className="text-[10px] text-gray-500 uppercase">On-Time</p>
                </div>
            </div>

            <div className="px-4 space-y-4">
                {/* Shift Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> Shift Schedule</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-0.5">Current Shift</p>
                            <p className="text-sm font-semibold text-gray-900">Morning (6AM–2PM)</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-0.5">Days Off</p>
                            <p className="text-sm font-semibold text-gray-900">Sat, Sun</p>
                        </div>
                    </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Bell className="w-4 h-4 text-gray-400" /> Notification Preferences</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                                <p className="text-xs text-gray-500">Real-time task alerts</p>
                            </div>
                            <button onClick={() => setPushEnabled(!pushEnabled)} className={cn('p-2 rounded-lg transition-colors', pushEnabled ? 'text-blue-600 bg-blue-50' : 'text-gray-300 bg-gray-50')}>
                                {pushEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                                <p className="text-xs text-gray-500">Daily task summary</p>
                            </div>
                            <button onClick={() => setEmailEnabled(!emailEnabled)} className={cn('p-2 rounded-lg transition-colors', emailEnabled ? 'text-blue-600 bg-blue-50' : 'text-gray-300 bg-gray-50')}>
                                {emailEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                    <button className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors active:scale-[0.98]">
                        <BarChart3 className="w-5 h-5 text-indigo-500" />
                        <span className="text-sm font-medium">View My Performance Stats</span>
                    </button>
                    <button onClick={signOut} className="w-full bg-white rounded-xl shadow-sm border border-red-100 p-4 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors active:scale-[0.98]">
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
