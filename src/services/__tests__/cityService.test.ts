import { cityService } from "../cityService";
import { apiService } from "../apiService";

jest.mock("../apiService");

describe("CityService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCities", () => {
    it("should fetch cities", async () => {
      const mockResponse = {
        data: {
          results: [
            { id: 1, name: "Almaty" },
            { id: 2, name: "Astana" },
          ],
        },
      };

      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await cityService.getCities();

      expect(result).toEqual(mockResponse.data.results);
      expect(apiService.get).toHaveBeenCalledWith("/cities");
    });

    it("should return empty array when no results", async () => {
      const mockResponse = { data: {} };
      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await cityService.getCities();
      expect(result).toEqual([]);
    });
  });

  describe("getCity", () => {
    it("should fetch single city", async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: "Almaty",
        },
      };

      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await cityService.getCity(1);

      expect(result).toEqual(mockResponse.data);
      expect(apiService.get).toHaveBeenCalledWith("/cities/1/");
    });
  });
});

