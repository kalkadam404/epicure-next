import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuItem } from "../MenuItem";

describe("MenuItem", () => {
  it("should render menu item with all information", () => {
    render(
      <MenuItem
        img="/test.jpg"
        title="Test Dish"
        category="Main Course"
        price={1000}
      />
    );

    expect(screen.getByText("Test Dish")).toBeInTheDocument();
    expect(screen.getByText("Main Course")).toBeInTheDocument();
    expect(screen.getByText("1000 ₸")).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const handleClick = jest.fn();
    render(
      <MenuItem
        img="/test.jpg"
        title="Test Dish"
        category="Main Course"
        price={1000}
        onClick={handleClick}
      />
    );

    await userEvent.click(screen.getByText("Test Dish").closest("div")!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should render image with correct src", () => {
    render(
      <MenuItem
        img="/test.jpg"
        title="Test Dish"
        category="Main Course"
        price={1000}
      />
    );

    const img = screen.getByAltText("dish");
    expect(img).toHaveAttribute("src", "/test.jpg");
  });
});

