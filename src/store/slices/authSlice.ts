import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { type User } from "firebase/auth";
import { signup, login, logout } from "@/services/authService";
import type { SignupData, LoginData } from "@/services/authService";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { initializeUserProfile } from "@/services/firestoreService";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  initialized: false,
};

// Async Thunks
export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (data: SignupData, { rejectWithValue }) => {
    try {
      const user = await signup(data);

      // Создаем профиль в Firestore сразу после регистрации
      try {
        await initializeUserProfile(
          user.uid,
          user.email || data.email,
          data.name || user.displayName || undefined,
          data.city || undefined // Передаем город
        );
        console.log("✅ Профиль создан в Firestore");
      } catch (firestoreError) {
        console.error(
          "⚠️ Ошибка создания профиля в Firestore:",
          firestoreError
        );
        // Не прерываем регистрацию, если Firestore не сработал
      }

      return user.toJSON() as User;
    } catch (error: any) {
      return rejectWithValue(error.message || "Ошибка при регистрации");
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const user = await login(data);
      return user.toJSON() as User;
    } catch (error: any) {
      return rejectWithValue(error.message || "Ошибка при входе");
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logout();
    } catch (error: any) {
      return rejectWithValue(error.message || "Ошибка при выходе");
    }
  }
);

// Thunk для инициализации состояния аутентификации
export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { dispatch }) => {
    // Сначала проверяем текущего пользователя синхронно
    const currentUser = auth.currentUser;

    if (currentUser) {
      // Если пользователь уже есть, возвращаем его сериализованную версию
      return currentUser.toJSON() as User;
    }

    // Если нет, ждем onAuthStateChanged
    return new Promise<User | null>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        // Сериализуем пользователя перед возвратом
        resolve(user ? (user.toJSON() as User) : null);
      });
    });
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Initialize
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
