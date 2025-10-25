import ProtectedRoute from '../components/ProtectedRoute';
import OrderFailedPage from '../components/OrderFailedPage';

export default function OrderFailed() {
  return (
    <ProtectedRoute>
      <OrderFailedPage />
    </ProtectedRoute>
  );
}
