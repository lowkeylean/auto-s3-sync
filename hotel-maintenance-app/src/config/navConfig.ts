import {
    Database,
    Users,
    Settings,
    Shield,
    LayoutDashboard,
    Calendar,
    FileBarChart,
    UserCog,
    Server,
    Bell,
    ClipboardList,
    User,
    BookOpen,
    Palette,
    AlertTriangle,
    FileText,
    LayoutGrid,
    Building2,
    type LucideIcon,
} from 'lucide-react';

export interface NavItem {
    id: string;
    label: string;
    icon: LucideIcon;
    route: string;
    defaultVisible: boolean;
    order: number;
}

export interface NavConfig {
    admin: NavItem[];
    manager: NavItem[];
    supervisor: NavItem[];
    worker: NavItem[];
}

export const defaultNavConfig: NavConfig = {
    admin: [
        { id: 'admin-equipment-import', label: 'Equipment Import', icon: Database, route: '/admin', defaultVisible: true, order: 0 },
        { id: 'admin-equipment-registry', label: 'Equipment Registry', icon: Server, route: '/admin/equipment', defaultVisible: true, order: 1 },
        { id: 'admin-user-management', label: 'User Management', icon: Users, route: '/admin/users', defaultVisible: true, order: 2 },
        { id: 'admin-system-settings', label: 'System Settings', icon: Settings, route: '/admin/settings', defaultVisible: true, order: 3 },
        { id: 'admin-audit-log', label: 'Audit Log', icon: Shield, route: '/admin/audit', defaultVisible: true, order: 4 },
        { id: 'admin-button-customizer', label: 'Customize Navigation', icon: Palette, route: '/admin/customize', defaultVisible: true, order: 5 },
        { id: 'admin-report-defect', label: 'Report Defect', icon: AlertTriangle, route: '/defects/report', defaultVisible: true, order: 6 },
        { id: 'admin-daily-report', label: 'Daily Report', icon: FileText, route: '/defects/daily-report', defaultVisible: true, order: 7 },
        { id: 'admin-room-matrix', label: 'Room Matrix', icon: LayoutGrid, route: '/room-matrix', defaultVisible: true, order: 8 },
        { id: 'admin-public-area-matrix', label: 'Public Area Matrix', icon: Building2, route: '/public-area-matrix', defaultVisible: true, order: 9 },
    ],
    manager: [
        { id: 'mgr-dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/manager', defaultVisible: true, order: 0 },
        { id: 'mgr-reports', label: 'Reports & Data', icon: FileBarChart, route: '/reports', defaultVisible: true, order: 2 },
        { id: 'mgr-workers', label: 'Worker Management', icon: UserCog, route: '/workers', defaultVisible: true, order: 3 },
        { id: 'mgr-equipment', label: 'Equipment Overview', icon: Server, route: '/equipment', defaultVisible: true, order: 4 },
        { id: 'mgr-notifications', label: 'Notifications', icon: Bell, route: '/notifications', defaultVisible: true, order: 5 },
        { id: 'mgr-report-defect', label: 'Report Defect', icon: AlertTriangle, route: '/defects/report', defaultVisible: true, order: 6 },
        { id: 'mgr-daily-report', label: 'Daily Report', icon: FileText, route: '/defects/daily-report', defaultVisible: true, order: 7 },
        { id: 'mgr-room-matrix', label: 'Room Matrix', icon: LayoutGrid, route: '/room-matrix', defaultVisible: true, order: 8 },
        { id: 'mgr-public-area-matrix', label: 'Public Area Matrix', icon: Building2, route: '/public-area-matrix', defaultVisible: true, order: 9 },
    ],
    supervisor: [
        { id: 'sup-dashboard', label: 'Overview', icon: LayoutDashboard, route: '/supervisor', defaultVisible: true, order: 0 },
        { id: 'sup-team', label: 'Team Overview', icon: Users, route: '/supervisor/team', defaultVisible: true, order: 1 },
        { id: 'sup-schedule', label: 'Delegate Tasks', icon: Calendar, route: '/supervisor/schedule', defaultVisible: true, order: 2 },
        { id: 'sup-inspections', label: 'Inspections', icon: ClipboardList, route: '/supervisor/inspections', defaultVisible: true, order: 3 },
        { id: 'sup-report-defect', label: 'Report Defect', icon: AlertTriangle, route: '/defects/report', defaultVisible: true, order: 4 },
        { id: 'sup-daily-report', label: 'Daily Report', icon: FileText, route: '/defects/daily-report', defaultVisible: true, order: 5 },
        { id: 'sup-room-matrix', label: 'Room Matrix', icon: LayoutGrid, route: '/room-matrix', defaultVisible: true, order: 6 },
        { id: 'sup-public-area-matrix', label: 'Public Area Matrix', icon: Building2, route: '/public-area-matrix', defaultVisible: true, order: 7 },
    ],
    worker: [
        { id: 'wkr-tasks', label: 'My Tasks', icon: ClipboardList, route: '/my-tasks', defaultVisible: true, order: 0 },
        { id: 'wkr-history', label: 'History', icon: Calendar, route: '/history', defaultVisible: true, order: 1 },
        { id: 'wkr-equipment', label: 'Equipment', icon: BookOpen, route: '/my-equipment', defaultVisible: true, order: 2 },
        { id: 'wkr-profile', label: 'Profile', icon: User, route: '/profile', defaultVisible: true, order: 3 },
        { id: 'wkr-defect-queue', label: 'Defect Queue', icon: AlertTriangle, route: '/defects', defaultVisible: true, order: 4 },
    ],
};

// ── LocalStorage persistence for customization ──

const STORAGE_KEY = 'hotel-maint-nav-customization';

export interface NavCustomization {
    [itemId: string]: {
        label?: string;
        iconName?: string;
        visible?: boolean;
        order?: number;
    };
}

export function loadCustomizations(): NavCustomization {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

export function saveCustomizations(customizations: NavCustomization): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customizations));
}

export function clearCustomizations(): void {
    localStorage.removeItem(STORAGE_KEY);
}

// Icon name → LucideIcon mapping for the customizer icon picker
export const iconMap: Record<string, LucideIcon> = {
    Database, Users, Settings, Shield, LayoutDashboard, Calendar,
    FileBarChart, UserCog, Server, Bell, ClipboardList, User, BookOpen, Palette,
    AlertTriangle, FileText, LayoutGrid, Building2,
};

export function getNavItemsForRole(
    role: 'admin' | 'manager' | 'supervisor' | 'worker' | 'super_admin',
    customizations?: NavCustomization
): NavItem[] {
    const defaults = defaultNavConfig[role === 'super_admin' ? 'admin' : role] || [];
    const customs = customizations || loadCustomizations();

    return defaults
        .map((item) => {
            const c = customs[item.id];
            if (!c) return item;
            return {
                ...item,
                label: c.label ?? item.label,
                icon: c.iconName && iconMap[c.iconName] ? iconMap[c.iconName] : item.icon,
                defaultVisible: c.visible ?? item.defaultVisible,
                order: c.order ?? item.order,
            };
        })
        .filter((item) => item.defaultVisible)
        .sort((a, b) => a.order - b.order);
}
