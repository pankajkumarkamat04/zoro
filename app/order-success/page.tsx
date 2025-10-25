import ProtectedRoute from '../components/ProtectedRoute';
import OrderSuccessPage from '../components/OrderSuccessPage';

export default function OrderSuccess() {
  return (
    <ProtectedRoute>
      <OrderSuccessPage />
    </ProtectedRoute>
  );
}
