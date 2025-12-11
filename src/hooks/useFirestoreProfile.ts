import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import {
  getUserProfile,
  saveUserProfile,
  updateProfileAvatar,
  type UserProfile,
} from '@/services/firestoreService';

/**
 * Хук для работы с профилем в Firestore Database
 * Изображения хранятся как Base64 напрямую в документе
 */
export const useFirestoreProfile = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Загрузка профиля из Firestore
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔥 Загрузка профиля из хранилища...');
        const userProfile = await getUserProfile(user.uid);

        // Базовые данные из Auth — используем как дефолт,
        // чтобы даже при пустом документе были email/имя.
        const baseProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          fullName: user.displayName || 'No Name',
          phone: user.phoneNumber || '',
          city: '',
          bio: '',
          avatar: '',
          preferences: {
            language: 'ru',
            notifications: true,
            promos: true,
            darkMode: false,
          },
        };

        if (userProfile) {
          console.log('✅ Профиль загружен, объединяем с данными аккаунта');
          // Мержим, чтобы не потерять уже сохранённые поля,
          // но при отсутствии значений используем данные из Auth.
          const merged: UserProfile = {
            ...baseProfile,
            ...userProfile,
            preferences: {
              ...baseProfile.preferences,
              ...(userProfile.preferences || {}),
            },
          };
          setProfile(merged);
        } else {
          console.log('📝 Профиль ещё не создан, используем данные аккаунта');
          setProfile(baseProfile);
        }
      } catch (err: any) {
        console.error('❌ Ошибка загрузки профиля:', err);
        setError(err.message || 'Ошибка загрузки профиля');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Сохранение профиля в Firestore
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user?.uid) {
      throw new Error('Пользователь не авторизован');
    }

    try {
      setSaving(true);
      setError(null);

      console.log('💾 Сохранение профиля в Firestore...');
      await saveUserProfile(user.uid, data);
      console.log('✅ Профиль сохранен в Firestore');
      
      // Обновляем локальное состояние
      setProfile((prev) => (prev ? { ...prev, ...data } : null));
    } catch (err: any) {
      console.error('❌ Ошибка сохранения:', err);
      setError(err.message || 'Ошибка сохранения профиля');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Загрузка аватара в Firestore (как Base64)
  const uploadAvatar = async (file: File) => {
    if (!user?.uid) {
      throw new Error('Пользователь не авторизован');
    }

    try {
      setSaving(true);
      setError(null);

      console.log('🖼️ Сжатие и сохранение изображения в Firestore...');
      const base64 = await updateProfileAvatar(user.uid, file);
      console.log('✅ Изображение сохранено в Firestore');

      // Обновляем локальное состояние
      setProfile((prev) => (prev ? { ...prev, avatar: base64 } : null));

      return base64;
    } catch (err: any) {
      console.error('❌ Ошибка загрузки аватара:', err);
      setError(err.message || 'Ошибка загрузки аватара');
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
    uploadAvatar,
  };
};

