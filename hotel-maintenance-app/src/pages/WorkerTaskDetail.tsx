import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { ChevronLeft, Camera, Check, MapPin, CalendarClock, Info, Upload } from 'lucide-react';
import { cn } from '../lib/utils';

export default function WorkerTaskDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getTaskById, completeTask } = useTasks();
    const task = id ? getTaskById(id) : undefined;

    const [remarks, setRemarks] = useState('');
    const [photoUploaded, setPhotoUploaded] = useState(false);
    const [completing, setCompleting] = useState(false);

    if (!task) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-4">Task not found</p>
                <button onClick={() => navigate('/my-tasks')} className="text-blue-600 font-medium border border-blue-600 px-4 py-2 rounded-lg">Go Back</button>
            </div>
        );
    }

    const isCompleted = task.status === 'completed';

    const handleComplete = async () => {
        if (!id) return;
        setCompleting(true);
        // Simulate API call to mark complete and upload photo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        completeTask(id, remarks, 'mock-photo-url.jpg');
        
        setCompleting(false);
        navigate('/my-tasks');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans">
            {/* Header Navigation */}
            <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex items-center gap-3">
                <button
                    onClick={() => navigate('/my-tasks')}
                    className="p-2 -ml-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold text-gray-900 flex-1 truncate">{task.equipmentName}</h1>
            </div>

            <div className="px-4 mt-6">
                {/* Status Badge */}
                <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2">
                        <CalendarClock className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Due Date</p>
                            <p className={cn("text-sm font-medium", task.status === 'overdue' ? 'text-red-600' : 'text-gray-900')}>{task.dueDate}</p>
                        </div>
                    </div>
                    <span className={cn(
                        "px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full",
                        task.status === 'overdue' ? "bg-red-100 text-red-700" :
                            task.status === 'completed' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    )}>
                        {task.status}
                    </span>
                </div>

                {/* Details Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
                    <h2 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Task Details</h2>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">{task.location}</p>
                                <p className="text-xs text-gray-500">Asset Location</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-700 leading-relaxed">{task.instructions}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Completion Flow Configuration (only show if not already completed) */}
                {!isCompleted && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Completion Requirements</h2>

                        {/* Photo Upload Mock */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">After Photo (Required)</label>
                            <button
                                onClick={() => setPhotoUploaded(true)}
                                className={cn(
                                    "w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors",
                                    photoUploaded ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                                )}
                            >
                                {photoUploaded ? (
                                    <>
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                            <Check className="w-6 h-6 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium text-green-700">Photo Uploaded</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <Camera className="w-6 h-6 text-gray-500" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">Tap to snap a photo</span>
                                        <span className="text-xs text-gray-400 mt-1">or select from gallery</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Remarks Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Remarks / Observations</label>
                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                rows={3}
                                placeholder="Any issues found or parts replaced?"
                                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed Bottom Action Bar */}
            {!isCompleted && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button
                        onClick={handleComplete}
                        disabled={!photoUploaded || completing}
                        className={cn(
                            "w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-colors",
                            !photoUploaded || completing
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                        )}
                    >
                        {completing ? (
                            <span className="flex items-center gap-2">
                                <Upload className="w-4 h-4 animate-bounce" /> Submitting...
                            </span>
                        ) : (
                            'Mark as Completed'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
