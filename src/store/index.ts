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
        serializableCheck: {
          // Игнорируем проверку сериализуемости для Firebase User объекта
          ignoredActions: [
            "auth/signup/fulfilled",
            "auth/login/fulfilled",
            "auth/initialize/fulfilled",
          ],
          ignoredPaths: ["auth.user"],
        },
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
