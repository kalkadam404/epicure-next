import { offerService } from "../offerService";
import { apiService } from "../apiService";

jest.mock("../apiService");

describe("OfferService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getOffers", () => {
    it("should fetch offers", async () => {
      const mockResponse = {
        data: {
          results: [
            {
              id: 1,
              title: "Special Offer",
              new_price: 100,
            },
          ],
        },
      };

      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await offerService.getOffers();

      expect(result).toEqual(mockResponse.data.results);
      expect(apiService.get).toHaveBeenCalledWith("/offers/offers");
    });

    it("should return empty array when no results", async () => {
      const mockResponse = { data: {} };
      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await offerService.getOffers();
      expect(result).toEqual([]);
    });
  });

  describe("getOffer", () => {
    it("should fetch single offer", async () => {
      const mockResponse = {
        data: {
          id: 1,
          title: "Special Offer",
          new_price: 100,
        },
      };

      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await offerService.getOffer(1);

      expect(result).toEqual(mockResponse.data);
      expect(apiService.get).toHaveBeenCalledWith("/offers/offers/1/");
    });
  });
});

