import { render, screen } from "@testing-library/react";
import OfflinePage from "../../offline/page";

jest.mock("@/hooks/useOnlineStatus", () => ({
  useOnlineStatus: () => false,
}));

jest.mock("next/link", () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

describe("OfflinePage", () => {
  it("should render offline message when offline", () => {
    render(<OfflinePage />);
    expect(screen.getByText("Нет подключения к интернету")).toBeInTheDocument();
    expect(
      screen.getByText(/Проверьте подключение к интернету/i)
    ).toBeInTheDocument();
  });

  it("should not render when online", () => {
    jest
      .spyOn(require("@/hooks/useOnlineStatus"), "useOnlineStatus")
      .mockReturnValue(true);
    const { container } = render(<OfflinePage />);
    expect(container.firstChild).toBeNull();
  });
});

