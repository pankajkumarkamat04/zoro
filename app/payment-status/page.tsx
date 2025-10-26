import PaymentStatusPage from '../components/PaymentStatusPage';
import ProtectedRoute from '../components/ProtectedRoute';

export default function PaymentStatus() {
  return (
    <ProtectedRoute>
      <PaymentStatusPage />
    </ProtectedRoute>
  );
}

