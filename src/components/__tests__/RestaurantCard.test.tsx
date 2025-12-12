import { render, screen } from "@testing-library/react";
import { RestaurantCard } from "../RestaurantCard";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    const { fill, ...rest } = props;
    return <img {...rest} />;
  },
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "selection.wifi": "WiFi",
        "selection.parking": "Parking",
        "selection.delivery": "Delivery",
        "buttons.booking": "Book",
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock("@/services", () => ({
  ImageService: {
    getImageUrl: (url: string) => url || "/images/placeholder.svg",
  },
}));

describe("RestaurantCard", () => {
  const defaultProps = {
    img: "/test.jpg",
    ResName: "Test Restaurant",
    city: "Almaty",
    menuType: "Italian, Pizza",
    openingTime: "09:00:00",
    closingTime: "22:00:00",
    rating: 4.5,
  };

  it("should render restaurant card with all information", () => {
    render(<RestaurantCard {...defaultProps} />);

    expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
    expect(screen.getByText("Almaty")).toBeInTheDocument();
    expect(screen.getByText("Italian, Pizza")).toBeInTheDocument();
    expect(screen.getByText("09:00 - 22:00")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("should format time correctly", () => {
    render(
      <RestaurantCard
        {...defaultProps}
        openingTime="09:30:00"
        closingTime="23:45:00"
      />
    );

    expect(screen.getByText("09:30 - 23:45")).toBeInTheDocument();
  });

  it("should render amenities", () => {
    render(<RestaurantCard {...defaultProps} />);

    expect(screen.getByText("WiFi")).toBeInTheDocument();
    expect(screen.getByText("Parking")).toBeInTheDocument();
    expect(screen.getByText("Delivery")).toBeInTheDocument();
  });

  it("should render booking button", () => {
    render(<RestaurantCard {...defaultProps} />);

    expect(screen.getByText("Book")).toBeInTheDocument();
  });
});
