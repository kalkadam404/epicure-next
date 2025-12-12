import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotFound from "../not-found";

jest.mock("next/link", () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

describe("NotFound", () => {
  it("should render 404 page", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("PAGE NOT FOUND")).toBeInTheDocument();
  });

  it("should render error message", () => {
    render(<NotFound />);
    expect(
      screen.getByText("Oops! This page has gone missing")
    ).toBeInTheDocument();
  });

  it("should render navigation buttons", () => {
    render(<NotFound />);
    expect(screen.getByText("Go Home")).toBeInTheDocument();
    expect(screen.getByText("Go Back")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("should call window.history.back when Go Back is clicked", async () => {
    const backSpy = jest.spyOn(window.history, "back");
    render(<NotFound />);

    await userEvent.click(screen.getByText("Go Back"));
    expect(backSpy).toHaveBeenCalled();
    backSpy.mockRestore();
  });
});

