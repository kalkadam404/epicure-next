import React, { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import authReducer from "../slices/authSlice";
import menuReducer from "../slices/menuSlice";
import favoritesReducer from "../slices/favoritesSlice";

export function createTestStore(initialState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      menu: menuReducer,
      favorites: favoritesReducer,
    },
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: any;
  store?: ReturnType<typeof createTestStore>;
}

export function renderWithProviders(
  ui: React.ReactNode,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
export function createTestWrapper(preloadedState = {}) {
  const store = createTestStore(preloadedState);

  return function TestWrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
}

export * from "@testing-library/react";

// Lightweight sanity check so Jest doesn't fail this helper file
describe("test-utils helpers", () => {
  it("should be available", () => {
    expect(typeof createTestStore).toBe("function");
    expect(typeof renderWithProviders).toBe("function");
  });
});
