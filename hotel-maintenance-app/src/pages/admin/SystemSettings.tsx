import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Save, RotateCcw, Download, Clock, Bell, Database, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SettingToggle {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
}

export default function SystemSettings() {
    const [defaultInterval, setDefaultInterval] = useState(30);
    const [dataRetention, setDataRetention] = useState(365);
    const [saved, setSaved] = useState(false);

    const [toggles, setToggles] = useState<SettingToggle[]>([
        { id: 'auto-schedule', label: 'Auto-Schedule Tasks', description: 'Automatically create tasks when equipment reaches its maintenance interval.', enabled: true },
        { id: 'email-overdue', label: 'Overdue Email Alerts', description: 'Send email notifications when tasks become overdue.', enabled: true },
        { id: 'email-complete', label: 'Completion Notifications', description: 'Email managers when workers complete tasks.', enabled: false },
        { id: 'push-notif', label: 'Push Notifications', description: 'Enable browser push notifications for real-time alerts.', enabled: true },
        { id: 'photo-required', label: 'Require After Photo', description: 'Workers must upload a photo before marking tasks complete.', enabled: true },
        { id: 'auto-export', label: 'Auto-Export to Sheets', description: 'Automatically send completed task data to Google Sheets.', enabled: false },
    ]);

    const toggleSetting = (id: string) => {
        setToggles(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        setDefaultInterval(30);
        setDataRetention(365);
        setToggles(prev => prev.map(t => ({ ...t, enabled: ['auto-schedule', 'email-overdue', 'push-notif', 'photo-required'].includes(t.id) })));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="admin" />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                        <p className="text-gray-500 text-sm mt-1">Configure maintenance defaults, notifications, and data policies.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleReset} className="flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                            <RotateCcw className="w-4 h-4" /> Reset Defaults
                        </button>
                        <button onClick={handleSave} className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm",
                            saved ? "bg-green-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
                        )}>
                            <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                <div className="max-w-4xl space-y-6">
                    {/* Maintenance Defaults */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Clock className="w-6 h-6" /></div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Maintenance Defaults</h2>
                                <p className="text-sm text-gray-500">Set default intervals for new equipment</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Default Maintenance Interval</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        value={defaultInterval}
                                        onChange={e => setDefaultInterval(Number(e.target.value))}
                                        className="w-24 border border-gray-300 rounded-lg p-2.5 text-sm text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        min={1}
                                    />
                                    <span className="text-sm text-gray-500">days</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention Period</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        value={dataRetention}
                                        onChange={e => setDataRetention(Number(e.target.value))}
                                        className="w-24 border border-gray-300 rounded-lg p-2.5 text-sm text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        min={30}
                                    />
                                    <span className="text-sm text-gray-500">days</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><Bell className="w-6 h-6" /></div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Notifications & Automation</h2>
                                <p className="text-sm text-gray-500">Control alerts and automated behaviors</p>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {toggles.map(toggle => (
                                <div key={toggle.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                                    <div className="flex-1 pr-4">
                                        <p className="text-sm font-medium text-gray-900">{toggle.label}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{toggle.description}</p>
                                    </div>
                                    <button onClick={() => toggleSetting(toggle.id)} className="flex-shrink-0">
                                        {toggle.enabled ? (
                                            <ToggleRight className="w-8 h-8 text-indigo-600 hover:text-indigo-700 transition-colors" />
                                        ) : (
                                            <ToggleLeft className="w-8 h-8 text-gray-300 hover:text-gray-400 transition-colors" />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Data & Security */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-green-50 text-green-600 rounded-xl"><Database className="w-6 h-6" /></div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Data & Security</h2>
                                <p className="text-sm text-gray-500">Export configuration and manage data</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                                <Download className="w-4 h-4" /> Export Config as JSON
                            </button>
                            <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                                <Database className="w-4 h-4" /> Export Full Database
                            </button>
                            <button className="flex items-center gap-2 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
                                <Shield className="w-4 h-4" /> Purge Old Records
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
