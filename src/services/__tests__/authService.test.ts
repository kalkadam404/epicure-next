import {
  validateEmail,
  validatePassword,
  getPasswordValidationErrors,
  validateSignupData,
  validateLoginData,
  signup,
  login,
  logout,
  getCurrentUser,
} from "../authService";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

jest.mock("firebase/auth");
jest.mock("@/lib/firebase", () => ({
  auth: {},
}));

describe("authService", () => {
  describe("validateEmail", () => {
    it("should return true for valid email", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name@domain.co.uk")).toBe(true);
    });

    it("should return false for invalid email", () => {
      expect(validateEmail("invalid")).toBe(false);
      expect(validateEmail("invalid@")).toBe(false);
      expect(validateEmail("@domain.com")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("should return true for valid password", () => {
      expect(validatePassword("Password123!")).toBe(true);
      expect(validatePassword("Test@1234")).toBe(true);
    });

    it("should return false for invalid password", () => {
      expect(validatePassword("short")).toBe(false);
      expect(validatePassword("nospecial123")).toBe(false); // нет спец. символов
      expect(validatePassword("NoNumbers!")).toBe(false); // нет цифр
      expect(validatePassword("nouppercase123!")).toBe(false); // нет заглавных
      expect(validatePassword("NOLOWERCASE123!")).toBe(false); // нет строчных
      expect(validatePassword("12345678!")).toBe(false); // нет букв вообще
    });
  });

  describe("getPasswordValidationErrors", () => {
    it("should return empty array for valid password", () => {
      expect(getPasswordValidationErrors("Password123!")).toEqual([]);
    });

    it("should return errors for invalid password", () => {
      const errors = getPasswordValidationErrors("short");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("validateSignupData", () => {
    it("should return no errors for valid data", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        repeatPassword: "Password123!",
      };
      expect(validateSignupData(data)).toEqual([]);
    });

    it("should return errors for invalid email", () => {
      const data = {
        email: "invalid",
        password: "Password123!",
        repeatPassword: "Password123!",
      };
      const errors = validateSignupData(data);
      expect(errors.some((e) => e.field === "email")).toBe(true);
    });

    it("should return errors for mismatched passwords", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        repeatPassword: "Different123!",
      };
      const errors = validateSignupData(data);
      expect(errors.some((e) => e.field === "repeatPassword")).toBe(true);
    });
  });

  describe("validateLoginData", () => {
    it("should return no errors for valid data", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
      };
      expect(validateLoginData(data)).toEqual([]);
    });

    it("should return errors for missing fields", () => {
      const data = {
        email: "",
        password: "",
      };
      const errors = validateLoginData(data);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("signup", () => {
    it("should create user successfully", async () => {
      const mockUser = {
        uid: "123",
        email: "test@example.com",
        displayName: null,
        toJSON: () => ({}),
      };
      const mockUserCredential = { user: mockUser };

      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(
        mockUserCredential
      );

      const result = await signup({
        email: "test@example.com",
        password: "Password123!",
        repeatPassword: "Password123!",
      });

      expect(result).toBe(mockUser);
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "test@example.com",
        "Password123!"
      );
    });

    it("should throw error for invalid data", async () => {
      await expect(
        signup({
          email: "invalid",
          password: "short",
          repeatPassword: "short",
        })
      ).rejects.toThrow();
    });
  });

  describe("login", () => {
    it("should login user successfully", async () => {
      const mockUser = {
        uid: "123",
        email: "test@example.com",
        toJSON: () => ({}),
      };
      const mockUserCredential = { user: mockUser };

      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(
        mockUserCredential
      );

      const result = await login({
        email: "test@example.com",
        password: "Password123!",
      });

      expect(result).toBe(mockUser);
    });

    it("should throw error for invalid credentials", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: "auth/user-not-found",
      });

      await expect(
        login({
          email: "test@example.com",
          password: "wrong",
        })
      ).rejects.toThrow("Пользователь не найден");
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      (signOut as jest.Mock).mockResolvedValue(undefined);
      await logout();
      expect(signOut).toHaveBeenCalledWith(auth);
    });
  });

  describe("getCurrentUser", () => {
    it("should return current user", () => {
      const mockUser = { uid: "123" };
      (auth as any).currentUser = mockUser;
      expect(getCurrentUser()).toBe(mockUser);
    });
  });
});

