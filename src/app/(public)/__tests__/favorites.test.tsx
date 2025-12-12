import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FavoritesPage from "../favorites/page";
import { renderWithProviders } from "@/store/__tests__/test-utils";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

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
        "favorites.title": "Избранное",
        "favorites.empty": "Ваш список избранного пуст",
        "favorites.description": "Начните добавлять блюда",
        "favorites.browse": "Перейти к меню",
        "favorites.item": "блюдо",
        "favorites.items": "блюд",
        "favorites.merged_message": "Ваши локальные избранные были объединены",
        "buttons.done": "Готово",
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

const mockDish = {
  id: 1,
  name: "Test Dish",
  name_ru: "Тестовое блюдо",
  price: 1000,
  image: "/test.jpg",
  restaurant_details: { id: 1, name: "Test Restaurant" },
  menu_type_details: { id: 1, name: "Main Course" },
};

describe("FavoritesPage", () => {
  it("should render empty state when no favorites", () => {
    renderWithProviders(<FavoritesPage />, {
      preloadedState: {
        favorites: {
          items: [],
          loading: false,
          mergedFromLocal: false,
        },
      },
    });

    expect(screen.getByText("Избранное")).toBeInTheDocument();
    expect(screen.getByText("Ваш список избранного пуст")).toBeInTheDocument();
  });

  it("should render favorites list", () => {
    renderWithProviders(<FavoritesPage />, {
      preloadedState: {
        favorites: {
          items: [mockDish as any],
          loading: false,
          mergedFromLocal: false,
        },
      },
    });

    expect(screen.getByText("Тестовое блюдо")).toBeInTheDocument();
    expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
  });

  it("should show merged message when mergedFromLocal is true", () => {
    renderWithProviders(<FavoritesPage />, {
      preloadedState: {
        favorites: {
          items: [],
          loading: false,
          mergedFromLocal: true,
        },
      },
    });

    expect(
      screen.getByText("Ваши локальные избранные были объединены")
    ).toBeInTheDocument();
  });

  it("should dismiss merged message when done button is clicked", async () => {
    const { store } = renderWithProviders(<FavoritesPage />, {
      preloadedState: {
        favorites: {
          items: [],
          loading: false,
          mergedFromLocal: true,
        },
      },
    });

    const doneButton = screen.getByText("Готово");
    await userEvent.click(doneButton);

    const state = store.getState();
    expect(state.favorites.mergedFromLocal).toBe(false);
  });
});

