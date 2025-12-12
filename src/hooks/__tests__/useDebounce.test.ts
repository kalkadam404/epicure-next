import { renderHook, waitFor, act } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("test", 500));
    expect(result.current).toBe("test");
  });

  it("should debounce value changes", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated", delay: 500 });
    expect(result.current).toBe("initial");

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => {
      expect(result.current).toBe("updated");
    });
  });

  it("should use custom delay", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 1000 },
      }
    );

    rerender({ value: "updated", delay: 1000 });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("initial");

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => {
      expect(result.current).toBe("updated");
    });
  });

  it("should cancel previous timeout on rapid changes", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    rerender({ value: "first", delay: 500 });
    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    rerender({ value: "second", delay: 500 });
    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    rerender({ value: "third", delay: 500 });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current).toBe("third");
    });
  });

  it("should handle number values", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 0, delay: 500 },
      }
    );

    rerender({ value: 42, delay: 500 });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current).toBe(42);
    });
  });
});
