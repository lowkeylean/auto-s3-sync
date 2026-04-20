import type { Defect } from '../types/defect';

// Shared mutable store so reporting and resolving persist within the session
let _defects: Defect[] = [
    {
        id: 'def-001',
        title: 'Leaking pipe in Room 304 bathroom',
        description: 'Guest reported water pooling near the sink area. Appears to be a joint leak under the basin.',
        location: 'Room 304 - Bathroom',
        priority: 'high',
        status: 'open',
        reportedBy: 'Sarah Chen (Manager)',
        reportedByRole: 'manager',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    },
    {
        id: 'def-002',
        title: 'Broken AC thermostat in Lobby',
        description: 'The main lobby thermostat is unresponsive. Temperature reads 18°C but unit is set to 24°C.',
        location: 'Main Lobby',
        priority: 'critical',
        status: 'open',
        reportedBy: 'David Park (Supervisor)',
        reportedByRole: 'supervisor',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30min ago
    },
    {
        id: 'def-003',
        title: 'Flickering lights in Corridor B',
        description: 'Multiple fluorescent tubes flickering on the 2nd floor east corridor. May need ballast replacement.',
        location: '2nd Floor - Corridor B',
        priority: 'medium',
        status: 'in_progress',
        reportedBy: 'Admin User',
        reportedByRole: 'admin',
        assignedWorkerId: 'w-2',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5h ago
    },
    {
        id: 'def-004',
        title: 'Elevator B making grinding noise',
        description: 'Unusual grinding sound when elevator moves between floors 3 and 4. Needs immediate inspection.',
        location: 'Elevator B - Shaft',
        priority: 'critical',
        status: 'open',
        reportedBy: 'Sarah Chen (Manager)',
        reportedByRole: 'manager',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15min ago
    },
    {
        id: 'def-005',
        title: 'Stained carpet in Conference Room A',
        description: 'Large coffee stain near the projector area. Deep cleaning required before tomorrow\'s event.',
        location: 'Conference Room A',
        priority: 'low',
        status: 'resolved',
        reportedBy: 'David Park (Supervisor)',
        reportedByRole: 'supervisor',
        assignedWorkerId: 'w-1',
        resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        resolutionNotes: 'Deep cleaned with industrial carpet cleaner. Stain fully removed.',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8h ago
    },
];

export function getDefects(): Defect[] {
    return [..._defects];
}

export function getDefectById(id: string): Defect | undefined {
    return _defects.find(d => d.id === id);
}

export function addDefect(defect: Defect): void {
    _defects = [defect, ..._defects];
}

export function updateDefect(id: string, updates: Partial<Defect>): void {
    _defects = _defects.map(d => d.id === id ? { ...d, ...updates } : d);
}

export function getTodayDefects(): { reported: Defect[]; resolved: Defect[] } {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const reported = _defects.filter(d => new Date(d.createdAt) >= todayStart);
    const resolved = _defects.filter(d => d.resolvedAt && new Date(d.resolvedAt) >= todayStart);

    return { reported, resolved };
}
