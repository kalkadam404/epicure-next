import { render, screen } from "@testing-library/react";
import { ProtectedRoute } from "../ProtectedRoute";
import { renderWithProviders } from "@/store/__tests__/test-utils";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("ProtectedRoute", () => {
  it("should show loading when auth is loading", () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            user: null,
            loading: true,
            error: null,
            initialized: false,
          },
        },
      }
    );

    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("should render children when user is authenticated", () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            user: { uid: "123", email: "test@example.com" } as any,
            loading: false,
            error: null,
            initialized: true,
          },
        },
      }
    );

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("should not render children when user is not authenticated", () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            user: null,
            loading: false,
            error: null,
            initialized: true,
          },
        },
      }
    );

    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });
});

