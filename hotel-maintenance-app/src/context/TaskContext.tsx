import React, { createContext, useContext, useState } from 'react';

export type TaskStatus = 'pending' | 'completed' | 'overdue';
export type TaskPriority = 'low' | 'normal' | 'high';

export interface Task {
    id: string;
    equipmentName: string; // Used for "Room 101" or an equipment name
    location: string;
    dueDate: string;
    status: TaskStatus;
    createdAt: string;
    completedAt?: string;
    priority: TaskPriority;
    instructions: string;
    assignedToWorkerId?: string; // Links task to a worker
}

interface TaskContextType {
    tasks: Task[];
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
    completeTask: (taskId: string, remarks?: string, photoUrl?: string) => void;
    getTasksForWorker: (workerId?: string) => Task[];
    getTaskById: (taskId: string) => Task | undefined;
}

const initialMockTasks: Task[] = [
    {
        id: 't-1',
        equipmentName: 'HVAC Unit A',
        location: 'Roof - North',
        dueDate: '2026-02-26',
        status: 'pending',
        createdAt: '2026-02-24T14:30:00Z',
        priority: 'normal',
        instructions: 'Check refrigerant levels, replace primary air filter, and inspect blower motor belt for wear.',
    },
    {
        id: 't-2',
        equipmentName: 'Walk-in Freezer 1',
        location: 'Main Kitchen',
        dueDate: '2026-02-24',
        status: 'overdue',
        createdAt: '2026-02-20T09:00:00Z',
        priority: 'high',
        instructions: 'Defrost coils, check door seal integrity, log current holding temperature.',
    },
    {
        id: 't-3',
        equipmentName: 'Industrial Washer C',
        location: 'Laundry Room',
        dueDate: '2026-02-25',
        status: 'pending',
        createdAt: '2026-02-24T11:15:00Z',
        priority: 'normal',
        instructions: 'Clean lint trap, inspect water inlet hoses for leaks, run self-cleaning cycle.',
    },
    {
        id: 't-4',
        equipmentName: 'Elevator Motor B',
        location: 'Service Shaft',
        dueDate: '2026-02-22',
        status: 'completed',
        createdAt: '2026-02-21T08:00:00Z',
        completedAt: '2026-02-22T10:30:00Z',
        priority: 'normal',
        instructions: 'Lubricate bearings, check cable tension, test manual override.',
    }
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>(initialMockTasks);

    const addTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
        const newTask: Task = {
            ...newTaskData,
            id: `t-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'pending',
        };
        setTasks(prev => [...prev, newTask]);
    };

    const completeTask = (taskId: string, remarks?: string, photoUrl?: string) => {
        setTasks(prev => prev.map(t => 
            t.id === taskId 
                ? { ...t, status: 'completed', completedAt: new Date().toISOString(), remarks, photoUrl } 
                : t
        ));
    };

    // If no workerId is passed, just return all tasks (used for the initial prototype demo before real workers are linked)
    const getTasksForWorker = (workerId?: string) => {
        if (!workerId) return tasks; 
        return tasks.filter(t => t.assignedToWorkerId === workerId || !t.assignedToWorkerId);
    };

    const getTaskById = (taskId: string) => {
        return tasks.find(t => t.id === taskId);
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, completeTask, getTasksForWorker, getTaskById }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
}
