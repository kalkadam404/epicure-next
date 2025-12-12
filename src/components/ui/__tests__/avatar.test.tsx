import { render, screen } from "@testing-library/react";
import { Avatar } from "../avatar";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    const { fill, ...rest } = props;
    return <img {...rest} />;
  },
}));

describe("Avatar", () => {
  it("should render avatar with image", () => {
    render(<Avatar src="/test.jpg" alt="Test avatar" />);
    const img = screen.getByAltText("Test avatar");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test.jpg");
  });

  it("should render fallback when no src", () => {
    render(<Avatar fallback="JD" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("should render default fallback when no src or fallback", () => {
    render(<Avatar />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    render(<Avatar className="custom-class" />);
    const avatar = screen.getByText("?").parentElement;
    expect(avatar).toHaveClass("custom-class");
  });
});
