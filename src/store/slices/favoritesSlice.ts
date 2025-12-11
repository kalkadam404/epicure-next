import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Dish } from "@/services";

interface FavoritesState {
  items: Dish[];
}

const FAVORITES_STORAGE_KEY = "epicure_favorites";

// Функция для загрузки избранного из localStorage
const loadFavorites = (): Dish[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading favorites from localStorage:", error);
  }
  return [];
};

// Функция для сохранения избранного в localStorage
const saveFavorites = (items: Dish[]) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving favorites to localStorage:", error);
  }
};

const initialState: FavoritesState = {
  items: loadFavorites(),
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites(state, action: PayloadAction<Dish>) {
      const dish = action.payload;
      const exists = state.items.some((item) => item.id === dish.id);
      if (!exists) {
        state.items.push(dish);
        saveFavorites(state.items);
      }
    },
    removeFromFavorites(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveFavorites(state.items);
    },
    toggleFavorite(state, action: PayloadAction<Dish>) {
      const dish = action.payload;
      const exists = state.items.some((item) => item.id === dish.id);
      if (exists) {
        state.items = state.items.filter((item) => item.id !== dish.id);
      } else {
        state.items.push(dish);
      }
      saveFavorites(state.items);
    },
    clearFavorites(state) {
      state.items = [];
      saveFavorites(state.items);
    },
    hydrateFavorites(state) {
      state.items = loadFavorites();
    },
  },
});

export const {
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
  hydrateFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
