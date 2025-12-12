import favoritesReducer, {
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
  hydrateFavorites,
  resetMergedFromLocal,
  syncFavoritesOnLogin,
} from "../favoritesSlice";
import {
  getUserFavorites,
  saveUserFavorites,
} from "@/services/favoritesService";

jest.mock("@/services/favoritesService");

const mockDish1 = { id: 1, name: "Dish 1" } as any;
const mockDish2 = { id: 2, name: "Dish 2" } as any;

describe("favoritesSlice", () => {
  const initialState = {
    items: [],
    loading: false,
    mergedFromLocal: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("reducers", () => {
    it("should return initial state", () => {
      expect(favoritesReducer(undefined, { type: "unknown" })).toEqual(
        initialState
      );
    });

    it("should handle addToFavorites", () => {
      const action = addToFavorites(mockDish1);
      const state = favoritesReducer(initialState, action);

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockDish1);
      expect(localStorage.getItem("epicure_favorites")).toBeTruthy();
    });

    it("should not add duplicate dish", () => {
      const stateWithDish = {
        ...initialState,
        items: [mockDish1],
      };
      const action = addToFavorites(mockDish1);
      const state = favoritesReducer(stateWithDish, action);

      expect(state.items).toHaveLength(1);
    });

    it("should handle removeFromFavorites", () => {
      const stateWithDishes = {
        ...initialState,
        items: [mockDish1, mockDish2],
      };
      const action = removeFromFavorites(1);
      const state = favoritesReducer(stateWithDishes, action);

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockDish2);
    });

    it("should handle toggleFavorite - add", () => {
      const action = toggleFavorite(mockDish1);
      const state = favoritesReducer(initialState, action);

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockDish1);
    });

    it("should handle toggleFavorite - remove", () => {
      const stateWithDish = {
        ...initialState,
        items: [mockDish1],
      };
      const action = toggleFavorite(mockDish1);
      const state = favoritesReducer(stateWithDish, action);

      expect(state.items).toHaveLength(0);
    });

    it("should handle clearFavorites", () => {
      const stateWithDishes = {
        ...initialState,
        items: [mockDish1, mockDish2],
      };
      const action = clearFavorites();
      const state = favoritesReducer(stateWithDishes, action);

      expect(state.items).toHaveLength(0);
    });

    it("should handle hydrateFavorites", () => {
      localStorage.setItem("epicure_favorites", JSON.stringify([mockDish1]));
      const action = hydrateFavorites();
      const state = favoritesReducer(initialState, action);

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockDish1);
    });

    it("should handle resetMergedFromLocal", () => {
      const stateWithMerged = {
        ...initialState,
        mergedFromLocal: true,
      };
      const action = resetMergedFromLocal();
      const state = favoritesReducer(stateWithMerged, action);

      expect(state.mergedFromLocal).toBe(false);
    });
  });

  describe("syncFavoritesOnLogin", () => {
    it("should handle pending", () => {
      const action = { type: syncFavoritesOnLogin.pending.type };
      const state = favoritesReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.mergedFromLocal).toBe(false);
    });

    it("should handle fulfilled", async () => {
      (getUserFavorites as jest.Mock).mockResolvedValue([mockDish1]);
      (saveUserFavorites as jest.Mock).mockResolvedValue(undefined);

      const action = {
        type: syncFavoritesOnLogin.fulfilled.type,
        payload: {
          favorites: [mockDish1, mockDish2],
          mergedFromLocal: true,
        },
      };
      const state = favoritesReducer(initialState, action);

      expect(state.items).toEqual([mockDish1, mockDish2]);
      expect(state.mergedFromLocal).toBe(true);
      expect(state.loading).toBe(false);
    });

    it("should handle rejected", () => {
      const action = { type: syncFavoritesOnLogin.rejected.type };
      const stateWithLoading = {
        ...initialState,
        loading: true,
      };
      const state = favoritesReducer(stateWithLoading, action);

      expect(state.loading).toBe(false);
    });
  });
});

