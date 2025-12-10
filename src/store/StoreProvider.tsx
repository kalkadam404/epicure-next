'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, type AppStore } from './index';
import { initializeAuth } from './slices/authSlice';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(makeStore());
  
  if (!storeRef.current) {
    storeRef.current = makeStore();
    // Инициализируем состояние аутентификации при создании store
    storeRef.current.dispatch(initializeAuth());
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}


