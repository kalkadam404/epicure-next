import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should return initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  it("should return stored value from localStorage", () => {
    localStorage.setItem("test-key", JSON.stringify("stored-value"));
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    expect(result.current[0]).toBe("stored-value");
  });

  it("should update localStorage when value changes", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("updated-value");
    });

    expect(result.current[0]).toBe("updated-value");
    expect(localStorage.getItem("test-key")).toBe(
      JSON.stringify("updated-value")
    );
  });

  it("should handle function updater", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it("should remove value from localStorage", () => {
    localStorage.setItem("test-key", JSON.stringify("stored-value"));
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe("initial");
    expect(localStorage.getItem("test-key")).toBeNull();
  });

  it("should handle complex objects", () => {
    const initialValue = { name: "John", age: 30 };
    const { result } = renderHook(() =>
      useLocalStorage("test-key", initialValue)
    );

    act(() => {
      result.current[1]({ name: "Jane", age: 25 });
    });

    expect(result.current[0]).toEqual({ name: "Jane", age: 25 });
    expect(JSON.parse(localStorage.getItem("test-key")!)).toEqual({
      name: "Jane",
      age: 25,
    });
  });

  it("should handle arrays", () => {
    const initialValue: number[] = [];
    const { result } = renderHook(() =>
      useLocalStorage("test-key", initialValue)
    );

    act(() => {
      result.current[1]([1, 2, 3]);
    });

    expect(result.current[0]).toEqual([1, 2, 3]);
  });

  it("should handle localStorage errors gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const getItemSpy = jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("Storage error");
      });

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    expect(result.current[0]).toBe("initial");

    getItemSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});

