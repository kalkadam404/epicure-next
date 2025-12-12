import { menuService } from "../menuService";
import { apiService } from "../apiService";

jest.mock("../apiService");

describe("MenuService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getMenuTypes", () => {
    it("should fetch menu types", async () => {
      const mockResponse = {
        data: {
          results: [
            { id: 1, name: "Appetizers" },
            { id: 2, name: "Main Courses" },
          ],
        },
      };

      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await menuService.getMenuTypes();

      expect(result).toEqual(mockResponse.data.results);
      expect(apiService.get).toHaveBeenCalledWith("/products/menu-types");
    });

    it("should return empty array when no results", async () => {
      const mockResponse = { data: {} };
      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await menuService.getMenuTypes();
      expect(result).toEqual([]);
    });
  });

  describe("getMenuItems", () => {
    it("should fetch menu items with params", async () => {
      const mockResponse = {
        data: {
          count: 10,
          results: [{ id: 1, name: "Dish 1" }],
        },
      };

      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await menuService.getMenuItems({ page: 1, page_size: 10 });

      expect(result).toEqual(mockResponse.data);
      expect(apiService.get).toHaveBeenCalledWith("/products/menu-items", {
        params: { page: 1, page_size: 10 },
      });
    });

    it("should fetch menu items without params", async () => {
      const mockResponse = {
        data: {
          count: 10,
          results: [],
        },
      };

      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      await menuService.getMenuItems();

      expect(apiService.get).toHaveBeenCalledWith("/products/menu-items", {
        params: undefined,
      });
    });
  });

  describe("getMenuItemsByType", () => {
    it("should fetch menu items by type", async () => {
      const mockResponse = {
        data: {
          count: 5,
          results: [{ id: 1, name: "Dish 1" }],
        },
      };

      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await menuService.getMenuItemsByType(1);

      expect(result).toEqual(mockResponse.data);
      expect(apiService.get).toHaveBeenCalledWith("/products/menu-items", {
        params: { menu_type: 1 },
      });
    });
  });

  describe("getPopularItems", () => {
    it("should fetch popular items", async () => {
      const mockResponse = {
        data: [{ id: 1, name: "Popular Dish" }],
      };

      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await menuService.getPopularItems();

      expect(result).toEqual(mockResponse.data);
      expect(apiService.get).toHaveBeenCalledWith(
        "/products/menu-items/popular/"
      );
    });
  });

  describe("searchDishes", () => {
    it("should search dishes", async () => {
      const mockResponse = {
        data: {
          count: 2,
          results: [{ id: 1, name: "Searched Dish" }],
        },
      };

      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await menuService.searchDishes("pasta", 1);

      expect(result).toEqual(mockResponse.data);
      expect(apiService.get).toHaveBeenCalledWith("/products/menu-items", {
        params: { search: "pasta", page: 1 },
      });
    });
  });
});

