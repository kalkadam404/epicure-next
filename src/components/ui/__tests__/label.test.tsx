import { render, screen } from "@testing-library/react";
import { Label } from "../label";

describe("Label", () => {
  it("should render label with text", () => {
    render(<Label>Label text</Label>);
    expect(screen.getByText("Label text")).toBeInTheDocument();
  });

  it("should apply htmlFor attribute", () => {
    render(<Label htmlFor="input-id">Label</Label>);
    const label = screen.getByText("Label");
    expect(label).toHaveAttribute("for", "input-id");
  });

  it("should apply custom className", () => {
    render(<Label className="custom-class">Label</Label>);
    const label = screen.getByText("Label");
    expect(label).toHaveClass("custom-class");
  });
});

