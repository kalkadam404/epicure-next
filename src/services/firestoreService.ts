import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import app from '@/lib/firebase';

const db = getFirestore(app);

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  avatar?: string;  // Base64 изображение напрямую в Firestore
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
 * Сохранить профиль пользователя в Firestore (включая Base64 изображение)
 */
export const saveUserProfile = async (
  userId: string, 
  profileData: Partial<UserProfile>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      // Обновление
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Создание нового
      await setDoc(userRef, {
        ...profileData,
        uid: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error saving profile to Firestore:', error);
    throw new Error('Не удалось сохранить профиль в Firestore');
  }
};

/**
 * Получить профиль из Firestore
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
    console.error('Error getting profile from Firestore:', error);
    throw new Error('Не удалось загрузить профиль из Firestore');
  }
};

/**
 * Конвертировать файл в Base64 и сжать
 */
export const fileToBase64 = (file: File, maxSizeKB: number = 500): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Проверка типа
    if (!file.type.startsWith('image/')) {
      reject(new Error('Файл должен быть изображением'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Создаем canvas для сжатия
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context не поддерживается'));
          return;
        }

        // Максимальные размеры для аватара
        const maxWidth = 400;
        const maxHeight = 400;
        
        let width = img.width;
        let height = img.height;

        // Пропорциональное уменьшение
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        
        // Рисуем изображение
        ctx.drawImage(img, 0, 0, width, height);
        
        // Конвертируем в Base64 с качеством
        let quality = 0.8;
        let base64 = canvas.toDataURL('image/jpeg', quality);
        
        // Проверяем размер и уменьшаем качество если нужно
        const sizeKB = (base64.length * 3) / 4 / 1024;
        
        if (sizeKB > maxSizeKB) {
          quality = 0.6;
          base64 = canvas.toDataURL('image/jpeg', quality);
        }
        
        const finalSizeKB = (base64.length * 3) / 4 / 1024;
        
        if (finalSizeKB > 900) {
          reject(new Error(`Изображение слишком большое: ${Math.round(finalSizeKB)} КБ. Firestore имеет лимит 1 МБ на документ.`));
          return;
        }
        
        console.log(`✅ Изображение сжато: ${Math.round(finalSizeKB)} КБ`);
        resolve(base64);
      };
      
      img.onerror = () => reject(new Error('Не удалось загрузить изображение'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsDataURL(file);
  });
};

/**
 * Сохранить изображение профиля напрямую в Firestore (как Base64)
 */
export const updateProfileAvatar = async (
  userId: string,
  file: File
): Promise<string> => {
  try {
    // Конвертируем в Base64 и сжимаем
    const base64 = await fileToBase64(file);
    
    // Сохраняем в Firestore
    await saveUserProfile(userId, { avatar: base64 });
    
    return base64;
  } catch (error: any) {
    console.error('Error updating avatar:', error);
    throw error;
  }
};

/**
 * Инициализация профиля для нового пользователя
 */
export const initializeUserProfile = async (
  userId: string,
  email: string,
  displayName?: string,
  city?: string
): Promise<void> => {
  const defaultProfile: Partial<UserProfile> = {
    uid: userId,
    email,
    fullName: displayName || 'No Name',
    phone: '',
    city: city || '', 
    bio: '',
    avatar: '', 
    preferences: {
      language: 'ru',
      notifications: true,
      promos: true,
      darkMode: false,
    },
  };

  await saveUserProfile(userId, defaultProfile);
};

