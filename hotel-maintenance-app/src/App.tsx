import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import RoomMatrixDashboard from './pages/RoomMatrixDashboard';
import PublicAreaMatrix from './pages/PublicAreaMatrix';
import AdminHome from './pages/AdminHome';
import WorkerHome from './pages/WorkerHome';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';

import WorkerTaskDetail from './pages/WorkerTaskDetail';
import SupervisorSchedule from './pages/SupervisorSchedule';
import ManagerReports from './pages/ManagerReports';

import SupervisorHome from './pages/SupervisorHome';
import TeamOverview from './pages/supervisor/TeamOverview';
import InspectionLog from './pages/supervisor/InspectionLog';
import ManagerHome from './pages/ManagerHome';

// Admin pages
import UserManagement from './pages/admin/UserManagement';
import SystemSettings from './pages/admin/SystemSettings';
import EquipmentRegistry from './pages/admin/EquipmentRegistry';
import AuditLog from './pages/admin/AuditLog';
import ButtonCustomizer from './pages/admin/ButtonCustomizer';

// Manager pages
import WorkerManagement from './pages/manager/WorkerManagement';
import EquipmentOverview from './pages/manager/EquipmentOverview';
import NotificationsCenter from './pages/manager/NotificationsCenter';

// Worker pages
import TaskHistory from './pages/worker/TaskHistory';
import WorkerProfile from './pages/worker/WorkerProfile';
import EquipmentQuickRef from './pages/worker/EquipmentQuickRef';

// Super Admin
import SuperAdminHome from './pages/SuperAdminHome';

// Defect pages
import ReportDefect from './pages/defects/ReportDefect';
import DefectQueue from './pages/defects/DefectQueue';
import DefectDetail from './pages/defects/DefectDetail';
import DailyReport from './pages/defects/DailyReport';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<RoleBasedRedirect />} />

            <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
              <Route path="/super-admin" element={<SuperAdminHome />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['manager', 'supervisor', 'admin']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/room-matrix" element={<RoomMatrixDashboard />} />
              <Route path="/public-area-matrix" element={<PublicAreaMatrix />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['manager', 'admin']} />}>
              <Route path="/manager" element={<ManagerHome />} />
              <Route path="/reports" element={<ManagerReports />} />
              <Route path="/workers" element={<WorkerManagement />} />
              <Route path="/equipment" element={<EquipmentOverview />} />
              <Route path="/notifications" element={<NotificationsCenter />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['supervisor', 'admin']} />}>
              <Route path="/supervisor" element={<SupervisorHome />} />
              <Route path="/supervisor/team" element={<TeamOverview />} />
              <Route path="/supervisor/schedule" element={<SupervisorSchedule />} />
              <Route path="/supervisor/inspections" element={<InspectionLog />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/settings" element={<SystemSettings />} />
              <Route path="/admin/equipment" element={<EquipmentRegistry />} />
              <Route path="/admin/audit" element={<AuditLog />} />
              <Route path="/admin/customize" element={<ButtonCustomizer />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['worker', 'admin', 'manager', 'supervisor']} />}>
              <Route path="/my-tasks" element={<WorkerHome />} />
              <Route path="/task/:id" element={<WorkerTaskDetail />} />
              <Route path="/history" element={<TaskHistory />} />
              <Route path="/profile" element={<WorkerProfile />} />
              <Route path="/my-equipment" element={<EquipmentQuickRef />} />
            </Route>

            {/* Defect Reporting — Admin, Manager, Supervisor only */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'manager', 'supervisor']} />}>
              <Route path="/defects/report" element={<ReportDefect />} />
              <Route path="/defects/daily-report" element={<DailyReport />} />
            </Route>

            {/* Defect Queue — All roles can view, Workers resolve */}
            <Route element={<ProtectedRoute allowedRoles={['worker', 'admin', 'manager', 'supervisor']} />}>
              <Route path="/defects" element={<DefectQueue />} />
              <Route path="/defects/:id" element={<DefectDetail />} />
            </Route>

          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
