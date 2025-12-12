import { render, screen } from "@testing-library/react";
import { SkeletonCard } from "../SkeletonCard";

describe("SkeletonCard", () => {
  it("should render single skeleton card by default", () => {
    const { container } = render(<SkeletonCard />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons).toHaveLength(1);
  });

  it("should render multiple skeleton cards", () => {
    const { container } = render(<SkeletonCard count={3} />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons).toHaveLength(3);
  });

  it("should render restaurant variant", () => {
    const { container } = render(<SkeletonCard variant="restaurant" />);
    expect(container.querySelector(".bg-gray-200")).toBeInTheDocument();
  });

  it("should render dish variant", () => {
    const { container } = render(<SkeletonCard variant="dish" />);
    expect(container.querySelector(".bg-gray-200")).toBeInTheDocument();
  });

  it("should render offer variant", () => {
    const { container } = render(<SkeletonCard variant="offer" />);
    expect(container.querySelector(".bg-gray-200")).toBeInTheDocument();
  });
});

