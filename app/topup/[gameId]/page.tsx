'use client';

import TopUpPage from '@/app/components/TopUpPage';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function TopUpGamePage() {
  return (
    <ProtectedRoute>
      <TopUpPage />
    </ProtectedRoute>
  );
}
