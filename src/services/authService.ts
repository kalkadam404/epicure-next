import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type UserCredential,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface SignupData {
  email: string;
  password: string;
  repeatPassword: string;
  name?: string;
  city?: string; // Для сохранения в Firestore
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates email syntax
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const validatePassword = (password: string): boolean => {
  const hasMinLength = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return hasMinLength && hasSpecialChar && hasNumber;
};


export const getPasswordValidationErrors = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Пароль должен содержать минимум 8 символов');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Пароль должен содержать минимум один специальный символ');
  }
  if (!/\d/.test(password)) {
    errors.push('Пароль должен содержать минимум одну цифру');
  }
  
  return errors;
};


export const validateSignupData = (data: SignupData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Email validation
  if (!data.email) {
    errors.push({ field: 'email', message: 'Email обязателен' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Неверный формат email' });
  }

  // Password validation
  if (!data.password) {
    errors.push({ field: 'password', message: 'Пароль обязателен' });
  } else if (!validatePassword(data.password)) {
    const passwordErrors = getPasswordValidationErrors(data.password);
    errors.push({ field: 'password', message: passwordErrors.join(', ') });
  }

  // Repeat password validation
  if (!data.repeatPassword) {
    errors.push({ field: 'repeatPassword', message: 'Повторите пароль' });
  } else if (data.password !== data.repeatPassword) {
    errors.push({ field: 'repeatPassword', message: 'Пароли не совпадают' });
  }

  return errors;
};

/**
 * Validates login data
 */
export const validateLoginData = (data: LoginData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.email) {
    errors.push({ field: 'email', message: 'Email обязателен' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Неверный формат email' });
  }

  if (!data.password) {
    errors.push({ field: 'password', message: 'Пароль обязателен' });
  }

  return errors;
};

/**
 * Sign up a new user with email and password
 */
export const signup = async (data: SignupData): Promise<User> => {
  // Validate data
  const errors = validateSignupData(data);
  if (errors.length > 0) {
    throw new Error(errors.map(e => e.message).join(', '));
  }

  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Update profile with name if provided
    if (data.name && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: data.name,
      });
    }

    return userCredential.user;
  } catch (error: any) {
    // Handle Firebase errors
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('Этот email уже используется');
      case 'auth/weak-password':
        throw new Error('Пароль слишком простой');
      case 'auth/invalid-email':
        throw new Error('Неверный формат email');
      default:
        throw new Error(error.message || 'Ошибка при регистрации');
    }
  }
};

/**
 * Sign in a user with email and password
 */
export const login = async (data: LoginData): Promise<User> => {
  // Validate data
  const errors = validateLoginData(data);
  if (errors.length > 0) {
    throw new Error(errors.map(e => e.message).join(', '));
  }

  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    return userCredential.user;
  } catch (error: any) {
    // Handle Firebase errors
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error('Пользователь не найден');
      case 'auth/wrong-password':
        throw new Error('Неверный пароль');
      case 'auth/invalid-email':
        throw new Error('Неверный формат email');
      case 'auth/user-disabled':
        throw new Error('Аккаунт заблокирован');
      case 'auth/too-many-requests':
        throw new Error('Слишком много попыток. Попробуйте позже');
      default:
        throw new Error(error.message || 'Ошибка при входе');
    }
  }
};

/**
 * Sign out the current user
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Ошибка при выходе');
  }
};

/**
 * Get the current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

