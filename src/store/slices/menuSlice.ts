import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { menuService } from '@/services';
import type { Dish, DishListResponse } from '@/services';
import type { RootState } from '..';

export interface MenuSearchState {
  items: Dish[];
  totalCount: number;
  page: number;
  pageSize: number;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  // Для switch‑логики: идентификатор актуального запроса
  currentRequestId?: string;
}

const initialState: MenuSearchState = {
  items: [],
  totalCount: 0,
  page: 1,
  // Должно совпадать с дефолтным page_size на бэкенде (по ТЗ — 10)
  pageSize: 10,
  searchQuery: '',
  loading: false,
  error: null,
  currentRequestId: undefined,
};

// Async thunk, который всегда берёт актуальные параметры из состояния
export const fetchMenuItems = createAsyncThunk<
  DishListResponse,
  void,
  { state: RootState }
>('menu/fetchMenuItems', async (_: void, { getState }) => {
  const state = getState().menu;
  const params: { search?: string; page?: number; page_size?: number } = {
    page: state.page,
    page_size: state.pageSize,
  };

  const trimmedSearch = state.searchQuery.trim();
  if (trimmedSearch) {
    params.search = trimmedSearch;
  }

  const data = await menuService.getMenuItems(params);
  return data;
});

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.page = 1; // при смене поиска возвращаемся на первую страницу
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 1;
    },
    resetMenuState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        // switch‑логика: обрабатываем только последний запрос
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }
        const data = action.payload;
        state.items = data.results || [];
        state.totalCount = data.count || state.items.length || 0;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }
        state.loading = false;
        state.error = (action.error && action.error.message) || 'Ошибка загрузки меню';
      });
  },
});

export const { setSearchQuery, setPage, setPageSize, resetMenuState } = menuSlice.actions;
export default menuSlice.reducer;


