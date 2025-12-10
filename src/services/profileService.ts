import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp,
  type DocumentData 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';
import app from '@/lib/firebase';

const db = getFirestore(app);
const storage = getStorage(app);

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  photoURL?: string;
  preferences: {
    language: string;
    notifications: boolean;
    promos: boolean;
    darkMode: boolean;
  };
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Создать или обновить профиль пользователя в Firestore
 */
export const saveUserProfile = async (
  userId: string, 
  profileData: Partial<UserProfile>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      // Обновление существующего профиля
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Создание нового профиля
      await setDoc(userRef, {
        ...profileData,
        uid: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw new Error('Не удалось сохранить профиль');
  }
};

/**
 * Получить профиль пользователя из Firestore
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('Не удалось загрузить профиль');
  }
};

/**
 * Загрузить изображение профиля в Firebase Storage
 * @param userId - ID пользователя
 * @param file - Файл изображения
 * @returns URL загруженного изображения
 */
export const uploadProfileImage = async (
  userId: string, 
  file: File
): Promise<string> => {
  try {
    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      throw new Error('Файл должен быть изображением');
    }

    // Проверка размера файла (макс 5 МБ)
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      throw new Error('Размер файла не должен превышать 5 МБ');
    }

    // Создание уникального имени файла
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile_${userId}_${timestamp}.${fileExtension}`;

    // Загрузка в Storage
    const storageRef = ref(storage, `profile-images/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);

    // Получение URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw new Error(error.message || 'Не удалось загрузить изображение');
  }
};

/**
 * Удалить изображение профиля из Storage
 */
export const deleteProfileImage = async (imageUrl: string): Promise<void> => {
  try {
    // Извлечь путь к файлу из URL
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Не выбрасываем ошибку, так как файл может уже не существовать
  }
};

/**
 * Обновить фото профиля пользователя
 * @param userId - ID пользователя
 * @param file - Новый файл изображения
 * @param oldPhotoURL - URL старого изображения (для удаления)
 * @returns URL нового изображения
 */
export const updateProfileImage = async (
  userId: string,
  file: File,
  oldPhotoURL?: string
): Promise<string> => {
  try {
    // Загрузить новое изображение
    const newPhotoURL = await uploadProfileImage(userId, file);

    // Обновить профиль в Firestore
    await saveUserProfile(userId, { photoURL: newPhotoURL });

    // Удалить старое изображение (если было)
    if (oldPhotoURL && oldPhotoURL.includes('firebase')) {
      await deleteProfileImage(oldPhotoURL);
    }

    return newPhotoURL;
  } catch (error: any) {
    console.error('Error updating profile image:', error);
    throw new Error(error.message || 'Не удалось обновить фото профиля');
  }
};

/**
 * Инициализировать профиль для нового пользователя
 */
export const initializeUserProfile = async (
  userId: string,
  email: string,
  displayName?: string
): Promise<void> => {
  const defaultProfile: Partial<UserProfile> = {
    uid: userId,
    email,
    fullName: displayName || 'No Name',
    phone: '',
    city: '',
    bio: '',
    preferences: {
      language: 'ru',
      notifications: true,
      promos: true,
      darkMode: false,
    },
  };

  await saveUserProfile(userId, defaultProfile);
};


