import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import menuReducer from "./slices/menuSlice";
import favoritesReducer from "./slices/favoritesSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      menu: menuReducer,
      favorites: favoritesReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // Firebase user объект содержит несериализуемые поля,
        // отключаем проверку для корректной работы в Next окружении
        serializableCheck: false,
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
