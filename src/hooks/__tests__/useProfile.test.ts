import { act, renderHook, waitFor } from "@testing-library/react";
import { useProfile } from "../useProfile";
import { createTestWrapper } from "@/store/__tests__/test-utils";
import {
  getUserProfile,
  saveUserProfile,
  updateProfileImage,
} from "@/services/profileService";

jest.mock("@/services/profileService");

describe("useProfile", () => {
  const mockUser = {
    uid: "123",
    email: "test@example.com",
    displayName: "Test User",
    phoneNumber: "+1234567890",
    photoURL: "/avatar.jpg",
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load profile when user is authenticated", async () => {
    const mockProfile = {
      uid: "123",
      email: "test@example.com",
      fullName: "Test User",
      phone: "+1234567890",
      city: "Almaty",
      bio: "Test bio",
      photoURL: "/avatar.jpg",
      preferences: {
        language: "ru",
        notifications: true,
        promos: true,
        darkMode: false,
      },
    };

    (getUserProfile as jest.Mock).mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useProfile(), {
      wrapper: createTestWrapper({
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          initialized: true,
        },
      }),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profile).toEqual(mockProfile);
  });

  it("should create default profile when profile does not exist", async () => {
    (getUserProfile as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useProfile(), {
      wrapper: createTestWrapper({
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          initialized: true,
        },
      }),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profile).toBeTruthy();
    expect(result.current.profile?.email).toBe("test@example.com");
  });

  it("should update profile", async () => {
    const mockProfile = {
      uid: "123",
      email: "test@example.com",
      fullName: "Test User",
    };

    (getUserProfile as jest.Mock).mockResolvedValue(mockProfile);
    (saveUserProfile as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useProfile(), {
      wrapper: createTestWrapper({
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          initialized: true,
        },
      }),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.updateProfile({ city: "Astana" });
    });

    expect(saveUserProfile).toHaveBeenCalledWith("123", { city: "Astana" });
    await waitFor(() => {
      expect(result.current.profile?.city).toBe("Astana");
    });
  });

  it("should handle errors", async () => {
    (getUserProfile as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useProfile(), {
      wrapper: createTestWrapper({
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          initialized: true,
        },
      }),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
  });
});

