import { restaurantService } from "../restaurantService";
import { apiService } from "../apiService";

jest.mock("../apiService");

describe("RestaurantService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getRestaurants", () => {
    it("should fetch restaurants without params", async () => {
      const mockResponse = {
        data: {
          count: 10,
          results: [{ id: 1, name: "Restaurant 1" }],
        },
      };

      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await restaurantService.getRestaurants();

      expect(result).toEqual(mockResponse.data);
      expect(apiService.get).toHaveBeenCalledWith("/restaurants", {
        params: {},
      });
    });

    it("should fetch restaurants with city ID", async () => {
      const mockResponse = {
        data: {
          count: 5,
          results: [],
        },
      };

      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      await restaurantService.getRestaurants(1);

      expect(apiService.get).toHaveBeenCalledWith("/restaurants", {
        params: { city: 1 },
      });
    });

    it("should fetch restaurants with params object", async () => {
      const mockResponse = {
        data: {
          count: 3,
          results: [],
        },
      };

      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      await restaurantService.getRestaurants({
        city: 1,
        search: "pizza",
        page: 1,
      });

      expect(apiService.get).toHaveBeenCalledWith("/restaurants", {
        params: { city: 1, search: "pizza", page: 1 },
      });
    });
  });

  describe("getRestaurant", () => {
    it("should fetch single restaurant", async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: "Restaurant 1",
          city: { id: 1, name: "City 1" },
        },
      };

      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await restaurantService.getRestaurant(1);

      expect(result).toEqual(mockResponse.data);
      expect(apiService.get).toHaveBeenCalledWith("/restaurants/1/");
    });
  });

  describe("getRestaurantMenu", () => {
    it("should fetch restaurant menu", async () => {
      const mockResponse = {
        data: {
          items: [{ id: 1, name: "Dish 1" }],
        },
      };

      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await restaurantService.getRestaurantMenu(1);

      expect(result).toEqual(mockResponse.data);
      expect(apiService.get).toHaveBeenCalledWith("/restaurants/1/menu/");
    });
  });
});

