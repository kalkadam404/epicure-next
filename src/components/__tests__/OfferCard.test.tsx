import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OfferCard } from "../OfferCard";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "buttons.book_table": "Book Table",
      };
      return translations[key] || key;
    },
    i18n: {
      language: "ru",
    },
  }),
}));

jest.mock("@/services", () => ({
  ImageService: {
    getImageUrl: (url: string) => url || "/images/placeholder.svg",
  },
}));

const mockDescription = [
  { description: "Item 1", description_ru: "Элемент 1" },
  { description: "Item 2", description_ru: "Элемент 2" },
];

describe("OfferCard", () => {
  it("should render offer card with all information", () => {
    render(
      <OfferCard
        title="Special Offer"
        image="/test.jpg"
        newPrice={5000}
        description={mockDescription as any}
      />
    );

    expect(screen.getByText("Special Offer")).toBeInTheDocument();
    expect(screen.getByText("5000 ₸")).toBeInTheDocument();
    expect(screen.getByText("Элемент 1")).toBeInTheDocument();
    expect(screen.getByText("Элемент 2")).toBeInTheDocument();
  });

  it("should show old price when provided", () => {
    render(
      <OfferCard
        title="Special Offer"
        image="/test.jpg"
        oldPrice={7000}
        newPrice={5000}
        description={mockDescription as any}
      />
    );

    expect(screen.getByText("7000 ₸")).toBeInTheDocument();
  });

  it("should show badge when provided", () => {
    render(
      <OfferCard
        title="Special Offer"
        image="/test.jpg"
        newPrice={5000}
        description={mockDescription as any}
        badge="New"
      />
    );

    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("should call onClick when card is clicked", async () => {
    const handleClick = jest.fn();
    const mockOffer = { id: 1 };
    render(
      <OfferCard
        title="Special Offer"
        image="/test.jpg"
        newPrice={5000}
        description={mockDescription as any}
        onClick={handleClick}
        offer={mockOffer}
      />
    );

    await userEvent.click(screen.getByText("Special Offer").closest("div")!);
    expect(handleClick).toHaveBeenCalledWith(mockOffer);
  });

  it("should show restaurant name when provided", () => {
    render(
      <OfferCard
        title="Special Offer"
        image="/test.jpg"
        newPrice={5000}
        description={mockDescription as any}
        restaurant="Test Restaurant"
      />
    );

    expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
  });
});

