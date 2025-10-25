import AddCoinPage from '../components/AddCoinPage';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AddCoin() {
  return (
    <ProtectedRoute>
      <AddCoinPage />
    </ProtectedRoute>
  );
}