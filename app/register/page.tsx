import RegisterPage from '../components/RegisterPage';
import PublicRoute from '../components/PublicRoute';

export default function Register() {
  return (
    <PublicRoute>
      <RegisterPage />
    </PublicRoute>
  );
}
