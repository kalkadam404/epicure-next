import authReducer, {
  signupThunk,
  loginThunk,
  logoutThunk,
  initializeAuth,
  setUser,
  clearError,
} from "../authSlice";
import { signup, login, logout } from "@/services/authService";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

jest.mock("@/services/authService");
jest.mock("@/lib/firebase", () => ({
  auth: {},
}));
jest.mock("firebase/auth");
jest.mock("@/services/firestoreService", () => ({
  initializeUserProfile: jest.fn(),
}));

describe("authSlice", () => {
  const initialState = {
    user: null,
    loading: true,
    error: null,
    initialized: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("reducers", () => {
    it("should return initial state", () => {
      expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
    });

    it("should handle setUser", () => {
      const user = { uid: "123", email: "test@example.com" } as any;
      const action = setUser(user);
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(user);
      expect(state.loading).toBe(false);
    });

    it("should handle clearError", () => {
      const stateWithError = { ...initialState, error: "Some error" };
      const action = clearError();
      const state = authReducer(stateWithError, action);

      expect(state.error).toBe(null);
    });
  });

  describe("signupThunk", () => {
    it("should handle pending", () => {
      const action = { type: signupThunk.pending.type };
      const state = authReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle fulfilled", () => {
      const user = {
        uid: "123",
        email: "test@example.com",
        stsTokenManager: { accessToken: "token" },
      } as any;
      const action = {
        type: signupThunk.fulfilled.type,
        payload: user,
      };
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(user);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    it("should handle rejected", () => {
      const action = {
        type: signupThunk.rejected.type,
        payload: "Registration failed",
      };
      const state = authReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Registration failed");
    });
  });

  describe("loginThunk", () => {
    it("should handle pending", () => {
      const action = { type: loginThunk.pending.type };
      const state = authReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle fulfilled", () => {
      const user = {
        uid: "123",
        email: "test@example.com",
        stsTokenManager: { accessToken: "token" },
      } as any;
      const action = {
        type: loginThunk.fulfilled.type,
        payload: user,
      };
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(user);
      expect(state.loading).toBe(false);
    });

    it("should handle rejected", () => {
      const action = {
        type: loginThunk.rejected.type,
        payload: "Login failed",
      };
      const state = authReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Login failed");
    });
  });

  describe("logoutThunk", () => {
    it("should handle fulfilled", () => {
      const stateWithUser = { ...initialState, user: { uid: "123" } as any };
      const action = { type: logoutThunk.fulfilled.type };
      const state = authReducer(stateWithUser, action);

      expect(state.user).toBe(null);
      expect(state.loading).toBe(false);
    });
  });

  describe("initializeAuth", () => {
    it("should handle fulfilled", () => {
      const user = {
        uid: "123",
        email: "test@example.com",
        stsTokenManager: { accessToken: "token" },
      } as any;
      const action = {
        type: initializeAuth.fulfilled.type,
        payload: user,
      };
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(user);
      expect(state.loading).toBe(false);
      expect(state.initialized).toBe(true);
    });

    it("should handle rejected", () => {
      const action = { type: initializeAuth.rejected.type };
      const state = authReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.initialized).toBe(true);
    });
  });
});

