import menuReducer, {
  setSearchQuery,
  setPage,
  setPageSize,
  resetMenuState,
  fetchMenuItems,
} from "../menuSlice";
import { menuService } from "@/services";

jest.mock("@/services", () => ({
  menuService: {
    getMenuItems: jest.fn(),
  },
}));

describe("menuSlice", () => {
  const initialState = {
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
    searchQuery: "",
    loading: false,
    error: null,
    currentRequestId: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("reducers", () => {
    it("should return initial state", () => {
      expect(menuReducer(undefined, { type: "unknown" })).toEqual(initialState);
    });

    it("should handle setSearchQuery", () => {
      const action = setSearchQuery("pasta");
      const state = menuReducer(initialState, action);

      expect(state.searchQuery).toBe("pasta");
      expect(state.page).toBe(1);
    });

    it("should handle setPage", () => {
      const action = setPage(2);
      const state = menuReducer(initialState, action);

      expect(state.page).toBe(2);
    });

    it("should handle setPageSize", () => {
      const action = setPageSize(20);
      const state = menuReducer(initialState, action);

      expect(state.pageSize).toBe(20);
      expect(state.page).toBe(1);
    });

    it("should handle resetMenuState", () => {
      const stateWithData = {
        ...initialState,
        items: [{ id: 1 }] as any,
        page: 3,
        searchQuery: "test",
      };
      const action = resetMenuState();
      const state = menuReducer(stateWithData, action);

      expect(state).toEqual(initialState);
    });
  });

  describe("fetchMenuItems", () => {
    it("should handle pending", () => {
      const action = {
        type: fetchMenuItems.pending.type,
        meta: { requestId: "test-request" },
      };
      const state = menuReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
      expect(state.currentRequestId).toBe("test-request");
    });

    it("should handle fulfilled", () => {
      const mockData = {
        results: [{ id: 1, name: "Dish 1" }],
        count: 1,
      };
      const action = {
        type: fetchMenuItems.fulfilled.type,
        payload: mockData,
        meta: { requestId: "test-request" },
      };
      const stateWithRequest = {
        ...initialState,
        currentRequestId: "test-request",
        loading: true,
      };
      const state = menuReducer(stateWithRequest, action);

      expect(state.items).toEqual(mockData.results);
      expect(state.totalCount).toBe(1);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    it("should ignore outdated requests", () => {
      const mockData = {
        results: [{ id: 1 }],
        count: 1,
      };
      const action = {
        type: fetchMenuItems.fulfilled.type,
        payload: mockData,
        meta: { requestId: "new-request" },
      };
      const stateWithOldRequest = {
        ...initialState,
        currentRequestId: "old-request",
        loading: true,
      };
      const state = menuReducer(stateWithOldRequest, action);

      expect(state.items).toEqual([]);
      expect(state.loading).toBe(true);
    });

    it("should handle rejected", () => {
      const action = {
        type: fetchMenuItems.rejected.type,
        error: { message: "Network error" },
        meta: { requestId: "test-request" },
      };
      const stateWithRequest = {
        ...initialState,
        currentRequestId: "test-request",
        loading: true,
      };
      const state = menuReducer(stateWithRequest, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Network error");
    });
  });
});

