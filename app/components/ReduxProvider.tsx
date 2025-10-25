'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { useEffect } from 'react';
import { initializeAuth } from '@/lib/store/authSlice';

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize auth state from localStorage on app start
    store.dispatch(initializeAuth());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
