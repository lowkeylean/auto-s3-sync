export interface RoomMaintenanceHistory {
    id: string;
    date: string;
    action: string;
    technician: string;
    notes?: string;
    images?: string[];
}

export interface RoomData {
    id: string;
    roomNumber: string;
    floor: number;
    lastMaintained: string; // ISO Date string
    history: RoomMaintenanceHistory[];
}

// Generate 311 rooms based on specific floor counts
const generateRooms = (): RoomData[] => {
    const rooms: RoomData[] = [];
    
    const floorConfig = [
        { floor: 7, count: 15 },
        { floor: 8, count: 19 },
        { floor: 9, count: 22 },
        { floor: 10, count: 22 },
        { floor: 11, count: 22 },
        { floor: 12, count: 22 },
        { floor: 15, count: 22 },
        { floor: 16, count: 21 },
        { floor: 17, count: 21 },
        { floor: 18, count: 21 },
        { floor: 19, count: 21 },
        { floor: 20, count: 21 },
        { floor: 21, count: 22 },
        { floor: 23, count: 18 },
        { floor: 25, count: 10 },
        { floor: 26, count: 12 }
    ];

    // Pre-generate exactly 240 green (< 70 days), 53 yellow (70-91 days), and 18 red (> 91 days)
    const exactDaysList: number[] = [];
    for (let i = 0; i < 240; i++) exactDaysList.push(Math.floor(Math.random() * 70));
    for (let i = 0; i < 53; i++) exactDaysList.push(Math.floor(Math.random() * 22) + 70);
    for (let i = 0; i < 18; i++) exactDaysList.push(Math.floor(Math.random() * 30) + 92);
    
    // Shuffle the list to distribute them randomly across floors
    for (let i = exactDaysList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [exactDaysList[i], exactDaysList[j]] = [exactDaysList[j], exactDaysList[i]];
    }

    const today = new Date();
    let globalIndex = 0;

    for (const { floor, count } of floorConfig) {
        for (let roomNum = 1; roomNum <= count; roomNum++) {
            // Format room number correctly (e.g. 701, 1005)
            const roomNumberStr = `${floor}${roomNum.toString().padStart(2, '0')}`;
            
            // Get the exact pre-generated days ago to guarantee the specific room ratios
            const daysAgo = exactDaysList[globalIndex];
            const lastMaintainedDate = new Date(today);
            lastMaintainedDate.setDate(today.getDate() - daysAgo);

            // Random history records
            const history: RoomMaintenanceHistory[] = [
                {
                    id: `H_${globalIndex}_1`,
                    date: lastMaintainedDate.toISOString(),
                    action: 'Quarterly Maintenance (PM)',
                    technician: ['John Doe', 'Alice Smith', 'Bob Johnson'][Math.floor(Math.random() * 3)],
                    notes: 'Checked AC, replaced air filters, visually inspected plumbing for leaks.',
                    images: [
                        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
                        'https://images.unsplash.com/photo-1585435421671-0c16764628ce?auto=format&fit=crop&q=80&w=400'
                    ]
                }
            ];

            // Sometimes add an older history entry
            if (Math.random() > 0.5) {
                const olderDate = new Date(lastMaintainedDate);
                olderDate.setDate(olderDate.getDate() - 95); // ~3 months before
                history.push({
                    id: `H_${globalIndex}_2`,
                    date: olderDate.toISOString(),
                    action: 'Quarterly Maintenance (PM)',
                    technician: 'Mike Davis',
                    notes: 'Routine PM check.',
                });
            }

            rooms.push({
                id: `RM_${roomNumberStr}`,
                roomNumber: roomNumberStr,
                floor,
                lastMaintained: lastMaintainedDate.toISOString(),
                history
            });

            globalIndex++;
        }
    }

    return rooms;
}

export const mockRooms = generateRooms();

// Utility function to get room status
export const getRoomStatus = (lastMaintained: string): 'green' | 'yellow' | 'red' => {
    const today = new Date();
    const maintainedDate = new Date(lastMaintained);
    const diffTime = Math.abs(today.getTime() - maintainedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 70) return 'green';    // < 10 weeks
    if (diffDays <= 91) return 'yellow';  // 10 - 13 weeks
    return 'red';                         // > 13 weeks
};
