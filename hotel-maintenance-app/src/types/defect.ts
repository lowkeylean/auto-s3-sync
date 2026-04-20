export type DefectPriority = 'low' | 'medium' | 'high' | 'critical';
export type DefectStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Defect {
    id: string;
    title: string;
    description: string;
    location: string;
    priority: DefectPriority;
    status: DefectStatus;
    reportedBy: string;       // user name or ID
    reportedByRole: string;   // admin | manager | supervisor
    assignedWorkerId?: string;
    resolvedAt?: string;
    resolutionNotes?: string;
    photoUrl?: string;        // photo taken when reporting
    resolutionPhotoUrl?: string;
    createdAt: string;
}
