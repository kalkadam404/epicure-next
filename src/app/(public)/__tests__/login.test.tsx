import { render, screen } from "@testing-library/react";
import LoginPage from "../login/page";
import { renderWithProviders } from "@/store/__tests__/test-utils";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/components/Login", () => ({
  Login: ({ isOpen, onClose, onSwitchToRegister }: any) => (
    <div data-testid="login-component">
      {isOpen && <div>Login Component</div>}
      <button onClick={onSwitchToRegister}>Switch to Register</button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

jest.mock("@/components/Register", () => ({
  Register: ({ isOpen, onClose, onSwitchToLogin }: any) => (
    <div data-testid="register-component">
      {isOpen && <div>Register Component</div>}
      <button onClick={onSwitchToLogin}>Switch to Login</button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe("LoginPage", () => {
  it("should render login component by default", () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: {
        auth: {
          user: null,
          loading: false,
          error: null,
          initialized: true,
        },
      },
    });

    expect(screen.getByTestId("login-component")).toBeInTheDocument();
  });

  it("should show loading state", () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: {
        auth: {
          user: null,
          loading: true,
          error: null,
          initialized: false,
        },
      },
    });

    expect(screen.queryByTestId("login-component")).not.toBeInTheDocument();
  });
});

