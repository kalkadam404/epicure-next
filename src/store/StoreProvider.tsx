"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "./index";
import { initializeAuth } from "./slices/authSlice";
import { hydrateFavorites } from "./slices/favoritesSlice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // Инициализируем состояние аутентификации и локальные избранные при монтировании
  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.dispatch(initializeAuth());
      storeRef.current.dispatch(hydrateFavorites());
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
