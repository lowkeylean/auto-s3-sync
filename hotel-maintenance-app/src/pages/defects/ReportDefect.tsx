import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Camera, Send, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { addDefect } from '../../data/mockDefects';
import type { DefectPriority } from '../../types/defect';
import Sidebar from '../../components/Sidebar';

const locationOptions = [
    'Main Lobby', 'Room 101', 'Room 102', 'Room 201', 'Room 202', 'Room 303', 'Room 304',
    'Kitchen', 'Laundry Room', 'Conference Room A', 'Conference Room B',
    'Pool Area', 'Gym', 'Parking Garage', 'Roof - North', 'Roof - South',
    '1st Floor - Corridor A', '2nd Floor - Corridor B', 'Elevator A - Shaft', 'Elevator B - Shaft',
    'Basement', 'Garden Area', 'Restaurant', 'Bar Area', 'Staff Room',
];

export default function ReportDefect() {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [priority, setPriority] = useState<DefectPriority>('medium');
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !location) return;

        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1000)); // Simulate API

        addDefect({
            id: `def-${Date.now()}`,
            title: title.trim(),
            description: description.trim(),
            location,
            priority,
            status: 'open',
            reportedBy: profile?.full_name || 'Unknown',
            reportedByRole: profile?.role || 'manager',
            photoUrl: photoPreview || undefined,
            createdAt: new Date().toISOString(),
        });

        setSubmitting(false);
        setSubmitted(true);
    };

    const role = (profile?.role || 'manager') as 'admin' | 'manager' | 'supervisor';

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex font-sans">
                <Sidebar role={role} />
                <main className="flex-1 p-8 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-md">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Send className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Defect Reported!</h2>
                        <p className="text-gray-500 mb-6">Your complaint has been filed and will appear in the worker queue immediately.</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => { setSubmitted(false); setTitle(''); setDescription(''); setLocation(''); setPriority('medium'); setPhotoPreview(null); }}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Report Another
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role={role} />

            <main className="flex-1 p-8 overflow-y-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back</span>
                </button>

                <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-red-50 rounded-xl">
                            <AlertTriangle className="w-7 h-7 text-red-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Report a Defect</h1>
                            <p className="text-gray-500 text-sm">File a complaint for an issue that needs immediate attention.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Issue Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Leaking pipe in Room 304"
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location <span className="text-red-500">*</span></label>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                required
                            >
                                <option value="" disabled>Select location...</option>
                                {locationOptions.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Priority Level</label>
                            <div className="grid grid-cols-4 gap-2">
                                {(['low', 'medium', 'high', 'critical'] as DefectPriority[]).map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPriority(p)}
                                        className={cn(
                                            "py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border",
                                            priority === p
                                                ? p === 'critical' ? 'bg-red-600 text-white border-red-600'
                                                    : p === 'high' ? 'bg-orange-500 text-white border-orange-500'
                                                        : p === 'medium' ? 'bg-yellow-500 text-white border-yellow-500'
                                                            : 'bg-blue-500 text-white border-blue-500'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Provide details about the issue..."
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            />
                        </div>

                        {/* Photo Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Attach Photo (optional)</label>
                            <label className={cn(
                                "flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
                                photoPreview ? "border-green-400 bg-green-50/50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
                            )}>
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Preview" className="h-full object-contain rounded-lg p-1" />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <Camera className="w-8 h-8 mb-2" />
                                        <span className="text-xs font-medium">Click to take or upload a photo</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoChange} />
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting || !title.trim() || !location}
                            className={cn(
                                "w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                                submitting ? "bg-gray-300 text-gray-500 cursor-wait" : "bg-red-600 text-white hover:bg-red-700 shadow-sm"
                            )}
                        >
                            <AlertTriangle className="w-4 h-4" />
                            {submitting ? 'Submitting...' : 'Submit Defect Report'}
                        </button>

                    </form>
                </div>
            </main>
        </div>
    );
}
