import DashboardPage from '../components/DashboardPage';
import ProtectedRoute from '../components/ProtectedRoute';

export default function MobileDashboard() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}
