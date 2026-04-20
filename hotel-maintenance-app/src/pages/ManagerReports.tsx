import { useState } from 'react';
import { FileSpreadsheet, FileBarChart, Download, Archive, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import Sidebar from '../components/Sidebar';

// Mock Data
const mockPhotos = [
    { id: 'p-1', eq: 'HVAC Unit A', date: '2026-02-22', url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80', type: 'after' },
    { id: 'p-2', eq: 'Walk-in Freezer', date: '2026-02-21', url: 'https://images.unsplash.com/photo-1544208006-25803fe7e1e6?w=400&q=80', type: 'before' },
    { id: 'p-3', eq: 'Walk-in Freezer', date: '2026-02-21', url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80', type: 'after' },
    { id: 'p-4', eq: 'Elevator Motor B', date: '2026-02-18', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', type: 'after' },
];

export default function ManagerReports() {
    const [activeTab, setActiveTab] = useState<'export' | 'photos' | 'monthly'>('monthly');

    const handleExportSheets = () => {
        alert("Exporting data to Google Sheets... (This will trigger the OAuth flow and append rows to the designated spreadsheet in the full version)");
    };

    const handleGenerateMonthly = () => {
        alert("Generating comprehensive PDF report... This includes metric summaries and Before/After photo comparisons.");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="manager" />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Reporting & Data Exports</h1>
                    <p className="text-gray-500 text-sm mt-1">Export records, view photo archives, and generate monthly maintenance summaries.</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-6 space-x-8">
                    <button
                        onClick={() => setActiveTab('monthly')}
                        className={cn("pb-4 font-medium text-sm transition-colors border-b-2", activeTab === 'monthly' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700")}
                    >
                        Monthly Report
                    </button>
                    <button
                        onClick={() => setActiveTab('photos')}
                        className={cn("pb-4 font-medium text-sm transition-colors border-b-2", activeTab === 'photos' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700")}
                    >
                        Photo Archive
                    </button>
                    <button
                        onClick={() => setActiveTab('export')}
                        className={cn("pb-4 font-medium text-sm transition-colors border-b-2", activeTab === 'export' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700")}
                    >
                        Data Export Integration
                    </button>
                </div>

                {/* Tab Content */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">

                    {/* Monthly Report View */}
                    {activeTab === 'monthly' && (
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <FileBarChart className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Generate Monthly Summary</h2>
                                    <p className="text-gray-500 text-sm">Creates a comprehensive PDF covering KPIs, completed tasks, and visual records.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="p-4 border border-gray-200 rounded-xl">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Included Sections:</p>
                                    <ul className="text-sm text-gray-500 space-y-2 list-disc list-inside">
                                        <li>Executive Summary & Metrics</li>
                                        <li>Equipment Downtime Analysis</li>
                                        <li>Worker Performance Stats</li>
                                        <li>Before/After Photo Gallery Comparison</li>
                                    </ul>
                                </div>
                                <div className="p-4 border border-gray-200 rounded-xl flex flex-col justify-center">
                                    <label className="text-sm font-semibold text-gray-700 mb-2">Select Month</label>
                                    <input type="month" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue="2026-02" />
                                </div>
                            </div>

                            <button onClick={handleGenerateMonthly} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-colors">
                                <Download className="w-5 h-5" />
                                Download PDF Report
                            </button>
                        </div>
                    )}

                    {/* Photo Archive View */}
                    {activeTab === 'photos' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Service Photo Archive</h2>
                                    <p className="text-gray-500 text-sm">Browse all before and after images captured by workers.</p>
                                </div>
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" placeholder="Search equipment..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {mockPhotos.map((photo) => (
                                    <div key={photo.id} className="group relative rounded-xl overflow-hidden border border-gray-200">
                                        <img src={photo.url} alt={photo.eq} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4">
                                            <p className="text-white font-medium text-sm truncate">{photo.eq}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-gray-300 text-xs">{photo.date}</span>
                                                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider", photo.type === 'after' ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300')}>
                                                    {photo.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Export View */}
                    {activeTab === 'export' && (
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                    <FileSpreadsheet className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Google Sheets Integration</h2>
                                    <p className="text-gray-500 text-sm">Automate your record keeping by appending completed tasks to a Google Sheet.</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Connection Status</h3>
                                <div className="flex items-center gap-2 text-sm text-green-600 font-medium mb-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    Connected to "Hotel Maintenance Master Log 2026"
                                </div>
                                <p className="text-sm text-gray-600 mb-4">Tasks are automatically appended upon completion. You can also manually trigger a full data sync below.</p>

                                <button onClick={handleExportSheets} className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                                    <Archive className="w-4 h-4" />
                                    Sync All Historical Data
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
