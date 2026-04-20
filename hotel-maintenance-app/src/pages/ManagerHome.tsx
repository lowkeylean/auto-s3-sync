import Dashboard from '../components/Dashboard';

export default function ManagerHome() {
    // The Dashboard component already serves as a very good Manager overview.
    // We are wrapping it here to make it explicitly the Manager Home page.
    return (
        <Dashboard />
    );
}
