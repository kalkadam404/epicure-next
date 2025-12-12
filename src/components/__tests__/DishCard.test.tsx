import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DishCard } from "../DishCard";
import { renderWithProviders } from "@/store/__tests__/test-utils";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const mockDish = {
  id: 1,
  name: "Test Dish",
  price: 1000,
  image: "/test.jpg",
};

describe("DishCard", () => {
  it("should render dish card with all information", () => {
    renderWithProviders(
      <DishCard
        img="/test.jpg"
        title="Test Dish"
        restaurant="Test Restaurant"
        category="Main Course"
        price={1000}
        dishId={1}
        dish={mockDish as any}
      />,
      {
        preloadedState: {
          favorites: {
            items: [],
            loading: false,
            mergedFromLocal: false,
          },
        },
      }
    );

    expect(screen.getByText("Test Dish")).toBeInTheDocument();
    expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
    expect(screen.getByText("Main Course")).toBeInTheDocument();
    expect(screen.getByText("1000 ₸")).toBeInTheDocument();
  });

  it("should show favorite button when dish is provided", () => {
    renderWithProviders(
      <DishCard
        img="/test.jpg"
        title="Test Dish"
        restaurant="Test Restaurant"
        category="Main Course"
        price={1000}
        dishId={1}
        dish={mockDish as any}
      />,
      {
        preloadedState: {
          favorites: {
            items: [],
            loading: false,
            mergedFromLocal: false,
          },
        },
      }
    );

    expect(screen.getByLabelText("Добавить в избранное")).toBeInTheDocument();
  });

  it("should toggle favorite when heart button is clicked", async () => {
    const { store } = renderWithProviders(
      <DishCard
        img="/test.jpg"
        title="Test Dish"
        restaurant="Test Restaurant"
        category="Main Course"
        price={1000}
        dishId={1}
        dish={mockDish as any}
      />,
      {
        preloadedState: {
          favorites: {
            items: [],
            loading: false,
            mergedFromLocal: false,
          },
        },
      }
    );

    const favoriteButton = screen.getByLabelText("Добавить в избранное");
    await userEvent.click(favoriteButton);

    const state = store.getState();
    expect(state.favorites.items).toHaveLength(1);
  });

  it("should show filled heart when dish is in favorites", () => {
    renderWithProviders(
      <DishCard
        img="/test.jpg"
        title="Test Dish"
        restaurant="Test Restaurant"
        category="Main Course"
        price={1000}
        dishId={1}
        dish={mockDish as any}
      />,
      {
        preloadedState: {
          favorites: {
            items: [mockDish as any],
            loading: false,
            mergedFromLocal: false,
          },
        },
      }
    );

    expect(screen.getByLabelText("Удалить из избранного")).toBeInTheDocument();
  });
});

