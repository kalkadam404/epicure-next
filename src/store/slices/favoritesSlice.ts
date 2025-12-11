import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import type { Dish } from "@/services";
import { getUserFavorites, saveUserFavorites } from "@/services/favoritesService";

interface FavoritesState {
  items: Dish[];
  loading: boolean;
  /**
   * Флаг, который показывает, что при входе
   * локальные избранные были объединены с аккаунтом.
   * Используется для показа баннера на странице избранного.
   */
  mergedFromLocal: boolean;
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

// Важно: не читаем localStorage в initialState, чтобы избежать расхождений
// между серверным и клиентским рендером. Гидратация из localStorage
// происходит через экшен hydrateFavorites в client-only эффекте.
const initialState: FavoritesState = {
  items: [],
  loading: false,
  mergedFromLocal: false,
};

// Синхронизация избранного при логине пользователя:
// - загружаем избранное из Firestore
// - мержим с локальными избранными
// - сохраняем объединённый список и в Firestore, и в localStorage
export const syncFavoritesOnLogin = createAsyncThunk(
  "favorites/syncOnLogin",
  async (userId: string, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const localItems: Dish[] = state?.favorites?.items ?? [];

      const serverItems = await getUserFavorites(userId);

      // Мерж по id блюда (уникальные элементы)
      const map = new Map<number, Dish>();

      for (const item of serverItems || []) {
        if (item && typeof item.id === "number") {
          map.set(item.id, item);
        }
      }

      let mergedFromLocal = false;

      for (const item of localItems || []) {
        if (!item || typeof item.id !== "number") continue;
        if (!map.has(item.id)) {
          map.set(item.id, item);
          mergedFromLocal = true;
        }
      }

      const merged = Array.from(map.values());

      // Сохраняем объединённый список и в Firestore, и локально
      await saveUserFavorites(userId, merged);
      saveFavorites(merged);

      return {
        favorites: merged,
        mergedFromLocal,
      };
    } catch (error) {
      console.error("Error syncing favorites on login:", error);
      return rejectWithValue("Failed to sync favorites");
    }
  }
);

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
    // Сбрасываем флаг показа баннера о мердже
    resetMergedFromLocal(state) {
      state.mergedFromLocal = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncFavoritesOnLogin.pending, (state) => {
        state.loading = true;
        // при новой синхронизации убираем старый баннер
        state.mergedFromLocal = false;
      })
      .addCase(syncFavoritesOnLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.favorites;
        state.mergedFromLocal = action.payload.mergedFromLocal;
      })
      .addCase(syncFavoritesOnLogin.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
  hydrateFavorites,
  resetMergedFromLocal,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
