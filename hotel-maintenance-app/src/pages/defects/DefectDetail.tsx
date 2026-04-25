import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, MapPin, Clock, User, AlertTriangle, CheckCircle2, PlayCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { fetchDefectById, updateDefectById, type DbDefect } from '../../lib/services/defectService';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

type DefectPriority = 'low' | 'medium' | 'high' | 'critical';

const priorityColors: Record<DefectPriority, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
};

export default function DefectDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [defect, setDefect] = useState<DbDefect | null>(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (id) {
            fetchDefectById(id)
                .then(data => { if (data) setDefect(data); })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleStartWork = async () => {
        if (!defect) return;
        setSaving(true);
        await updateDefectById(defect.id, {
            status: 'in_progress',
            assigned_worker_id: user?.id ?? null,
        });
        setDefect({ ...defect, status: 'in_progress', assigned_worker_id: user?.id ?? null });
        setSaving(false);
    };

    const handleResolve = async () => {
        if (!defect || !notes.trim()) return;
        setSaving(true);
        const resolvedAt = new Date().toISOString();
        await updateDefectById(defect.id, {
            status: 'resolved',
            resolution_notes: notes.trim(),
            resolved_at: resolvedAt,
        });
        setDefect({ ...defect, status: 'resolved', resolution_notes: notes.trim(), resolved_at: resolvedAt });
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex font-sans">
                <Sidebar role="worker" />
                <main className="flex-1 p-8 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
                </main>
            </div>
        );
    }

    if (!defect) {
        return (
            <div className="min-h-screen bg-gray-50 flex font-sans">
                <Sidebar role="worker" />
                <main className="flex-1 p-8 flex items-center justify-center">
                    <p className="text-gray-500">Defect not found.</p>
                </main>
            </div>
        );
    }

    const isResolved = defect.status === 'resolved' || defect.status === 'closed';

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="worker" />
            <main className="flex-1 p-8 overflow-y-auto">
                <button onClick={() => navigate('/defects')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Queue</span>
                </button>

                <div className="max-w-2xl space-y-6">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className={cn('w-3 h-3 rounded-full mt-2 flex-shrink-0', priorityColors[defect.priority])} />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{defect.title}</h1>
                                <span className={cn(
                                    'inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
                                    defect.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                    defect.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                    defect.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-blue-100 text-blue-700'
                                )}>
                                    {defect.priority} priority
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{defect.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{new Date(defect.created_at).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <User className="w-4 h-4 text-gray-400" />
                                <span>Reported by {defect.reported_by_name ?? 'Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    'text-xs font-semibold px-2 py-0.5 rounded-full',
                                    defect.status === 'open' ? 'bg-red-50 text-red-600' :
                                    defect.status === 'in_progress' ? 'bg-blue-50 text-blue-600' :
                                    'bg-green-50 text-green-600'
                                )}>
                                    {defect.status === 'in_progress' ? 'In Progress' : defect.status.charAt(0).toUpperCase() + defect.status.slice(1)}
                                </div>
                            </div>
                        </div>

                        {defect.description && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-700 leading-relaxed">{defect.description}</p>
                            </div>
                        )}

                        {defect.photo_url && (
                            <div className="mt-4">
                                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Reported Photo</p>
                                <img src={defect.photo_url} alt="Defect" className="rounded-xl border border-gray-200 max-h-48 object-cover" />
                            </div>
                        )}
                    </div>

                    {/* Action Area */}
                    {!isResolved && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            {defect.status === 'open' ? (
                                <div className="text-center">
                                    <AlertTriangle className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                                    <h3 className="font-bold text-gray-900 mb-1">This defect needs attention</h3>
                                    <p className="text-sm text-gray-500 mb-4">Click below to start working on this issue.</p>
                                    <button onClick={handleStartWork} disabled={saving}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
                                        <PlayCircle className="w-5 h-5" />
                                        {saving ? 'Starting...' : 'Start Working'}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h3 className="font-bold text-gray-900 mb-4">Resolution Form</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Resolution Notes <span className="text-red-500">*</span>
                                            </label>
                                            <textarea value={notes} onChange={e => setNotes(e.target.value)}
                                                placeholder="Describe what was done to fix the issue..."
                                                rows={4}
                                                className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Resolution Photo (optional)</label>
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl cursor-pointer transition-colors">
                                                <Camera className="w-6 h-6 mb-1 text-gray-400" />
                                                <span className="text-xs text-gray-400">Photo upload coming soon</span>
                                            </label>
                                        </div>
                                        <button onClick={handleResolve} disabled={saving || !notes.trim()}
                                            className={cn(
                                                'w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2',
                                                saving || !notes.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
                                            )}>
                                            <CheckCircle2 className="w-4 h-4" />
                                            {saving ? 'Saving...' : 'Mark as Resolved'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Resolution Summary */}
                    {isResolved && (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                                <h3 className="font-bold text-green-800 text-lg">Resolved</h3>
                            </div>
                            {defect.resolved_at && (
                                <p className="text-sm text-green-700 mb-2">Resolved at {new Date(defect.resolved_at).toLocaleString()}</p>
                            )}
                            {defect.resolution_notes && (
                                <p className="text-sm text-green-800 bg-green-100/60 rounded-xl p-3">{defect.resolution_notes}</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
