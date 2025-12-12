import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import {
  getUserProfile,
  saveUserProfile,
  updateProfileImage,
  type UserProfile,
} from "@/services/profileService";

export const useProfile = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Загрузка профиля при монтировании
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userProfile = await getUserProfile(user.uid);

        if (userProfile) {
          setProfile(userProfile);
        } else {
          // Если профиля нет, создаем базовый из данных Auth
          const defaultProfile: UserProfile = {
            uid: user.uid,
            email: user.email || "",
            fullName: user.displayName || "No Name",
            phone: user.phoneNumber || "",
            city: "",
            bio: "",
            photoURL: user.photoURL || undefined,
            preferences: {
              language: "ru",
              notifications: true,
              promos: true,
              darkMode: false,
            },
          };
          setProfile(defaultProfile);
        }
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки профиля");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Сохранение профиля
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user?.uid) {
      throw new Error("Пользователь не авторизован");
    }

    try {
      setSaving(true);
      setError(null);

      await saveUserProfile(user.uid, data);

      // Обновляем локальное состояние
      setProfile((prev) => (prev ? { ...prev, ...data } : null));
    } catch (err: any) {
      setError(err.message || "Ошибка сохранения профиля");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Загрузка фото профиля
  const uploadPhoto = async (file: File) => {
    if (!user?.uid) {
      throw new Error("Пользователь не авторизован");
    }

    try {
      setSaving(true);
      setError(null);

      const photoURL = await updateProfileImage(
        user.uid,
        file,
        profile?.photoURL
      );

      // Обновляем локальное состояние
      setProfile((prev) => (prev ? { ...prev, photoURL } : null));

      return photoURL;
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки фото");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    error,
    saving,
    updateProfile,
    uploadPhoto,
  };
};
