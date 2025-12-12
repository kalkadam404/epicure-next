import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "../switch";

describe("Switch", () => {
  it("should render switch", () => {
    render(<Switch checked={false} />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("should show checked state", () => {
    render(<Switch checked={true} />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAttribute("aria-checked", "true");
    expect(switchElement).toHaveClass("bg-black");
  });

  it("should show unchecked state", () => {
    render(<Switch checked={false} />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAttribute("aria-checked", "false");
    expect(switchElement).toHaveClass("bg-gray-200");
  });

  it("should call onCheckedChange when clicked", async () => {
    const handleChange = jest.fn();
    render(<Switch checked={false} onCheckedChange={handleChange} />);

    await userEvent.click(screen.getByRole("switch"));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("should toggle from checked to unchecked", async () => {
    const handleChange = jest.fn();
    render(<Switch checked={true} onCheckedChange={handleChange} />);

    await userEvent.click(screen.getByRole("switch"));
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it("should apply custom className", () => {
    render(<Switch checked={false} className="custom-class" />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveClass("custom-class");
  });
});

