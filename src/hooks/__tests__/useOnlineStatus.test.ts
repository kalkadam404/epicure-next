import { renderHook, act } from "@testing-library/react";
import { useOnlineStatus } from "../useOnlineStatus";

describe("useOnlineStatus", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      configurable: true,
      value: true,
    });
  });

  it("should return true when online", () => {
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      configurable: true,
      value: true,
    });

    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);
  });

  it("should return false when offline", () => {
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      configurable: true,
      value: false,
    });

    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(false);
  });

  it("should update when online event fires", async () => {
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      configurable: true,
      value: false,
    });

    const { result, rerender } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(false);

    await act(async () => {
      const onlineEvent = new Event("online");
      window.dispatchEvent(onlineEvent);
    });
    rerender();

    expect(result.current).toBe(true);
  });

  it("should update when offline event fires", async () => {
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      configurable: true,
      value: true,
    });

    const { result, rerender } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);

    await act(async () => {
      const offlineEvent = new Event("offline");
      window.dispatchEvent(offlineEvent);
    });
    rerender();

    expect(result.current).toBe(false);
  });

  it("should cleanup event listeners on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useOnlineStatus());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "online",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "offline",
      expect.any(Function)
    );
    removeEventListenerSpy.mockRestore();
  });
});
