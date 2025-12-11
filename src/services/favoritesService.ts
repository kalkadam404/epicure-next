import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import app from "@/lib/firebase";
import type { Dish } from "./menuService";

const db = getFirestore(app);

/**
 * Получить список избранных блюд пользователя из Firestore.
 * Хранится в документе `users/{uid}` в поле `favorites`.
 */
export const getUserFavorites = async (userId: string): Promise<Dish[]> => {
  if (!userId) return [];

  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      return [];
    }

    const data = snap.data() as { favorites?: Dish[] } | undefined;
    if (data && Array.isArray(data.favorites)) {
      return data.favorites;
    }

    return [];
  } catch (error) {
    console.error("Error getting favorites from Firestore:", error);
    // Не ломаем UX — в случае ошибки просто возвращаем локальные данные
    return [];
  }
};

/**
 * Сохранить список избранных блюд пользователя в Firestore.
 * Данные мержатся в документе пользователя.
 */
export const saveUserFavorites = async (
  userId: string,
  favorites: Dish[]
): Promise<void> => {
  if (!userId) return;

  try {
    const userRef = doc(db, "users", userId);

    await setDoc(
      userRef,
      {
        favorites,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error saving favorites to Firestore:", error);
    throw error;
  }
};


