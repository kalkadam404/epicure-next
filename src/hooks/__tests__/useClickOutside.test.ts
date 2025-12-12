import { renderHook } from "@testing-library/react";
import { useRef } from "react";
import { useClickOutside } from "../useClickOutside";

describe("useClickOutside", () => {
  let container: HTMLDivElement;
  let handler: jest.Mock;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    handler = jest.fn();
  });

  afterEach(() => {
    document.body.removeChild(container);
    jest.clearAllMocks();
  });

  it("should call handler when clicking outside element", () => {
    const ref = { current: container };
    renderHook(() => useClickOutside(ref, handler));

    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);

    const event = new MouseEvent("mousedown", { bubbles: true });
    outsideElement.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
    document.body.removeChild(outsideElement);
  });

  it("should not call handler when clicking inside element", () => {
    const ref = { current: container };
    renderHook(() => useClickOutside(ref, handler));

    const event = new MouseEvent("mousedown", { bubbles: true });
    container.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it("should handle touch events", () => {
    const ref = { current: container };
    renderHook(() => useClickOutside(ref, handler));

    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);

    const event = new TouchEvent("touchstart", { bubbles: true });
    outsideElement.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
    document.body.removeChild(outsideElement);
  });

  it("should cleanup event listeners on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(document, "removeEventListener");
    const ref = { current: container };
    const { unmount } = renderHook(() => useClickOutside(ref, handler));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalled();
    removeEventListenerSpy.mockRestore();
  });

  it("should handle null ref gracefully", () => {
    const ref = { current: null };
    renderHook(() => useClickOutside(ref, handler));

    const event = new MouseEvent("mousedown", { bubbles: true });
    document.body.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });
});

