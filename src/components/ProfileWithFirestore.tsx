'use client';

import { useEffect, useState, useRef, type ChangeEvent } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CheckCircle2, Loader2, Upload } from 'lucide-react';

export default function ProfileWithFirestore() {
  const { profile, loading, saving, error, updateProfile, uploadPhoto } = useProfile();
  
  // Локальное состояние формы
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    bio: '',
  });
  
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        city: profile.city || '',
        bio: profile.bio || '',
      });
      setAvatarPreview(profile.photoURL || '');
    }
  }, [profile]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Сохранение профиля в Firestore
  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    }
  };

  // Загрузка фото в Firebase Storage
  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Показываем превью локально
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Загружаем в Firebase Storage и Firestore
      const photoURL = await uploadPhoto(file);
      console.log('✅ Фото загружено в Storage:', photoURL);
      
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Ошибка загрузки фото');
      // Если ошибка, возвращаем старое фото
      setAvatarPreview(profile?.photoURL || '');
    }
  };

  // Получаем инициалы для аватара
  const getInitials = () => {
    return formData.fullName
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка данных профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Профиль</h1>
          <p className="text-gray-600 mt-2">
            Данные вашего профиля синхронизируются между устройствами
          </p>
        </div>

        {/* Сообщение об успехе */}
        {uploadSuccess && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>Данные профиля успешно сохранены!</span>
          </div>
        )}

        {/* Сообщение об ошибке */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Карточка с фото профиля */}
          <Card>
            <CardHeader>
              <CardTitle>Фото профиля</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                
                {/* Аватар */}
                <div className="relative">
                  <Avatar
                    src={avatarPreview}
                    alt={formData.fullName}
                    fallback={getInitials() || 'U'}
                    className="h-32 w-32"
                  />
                  
                  {/* Кнопка камеры */}
                  <button
                    type="button"
                    className="absolute bottom-2 right-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-lg hover:bg-gray-800"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving}
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                {/* Информация о загрузке */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Фотография загружается в облачное хранилище
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Максимум 5 МБ, форматы: JPG, PNG, WebP
                  </p>
                </div>

                {/* Кнопка загрузки */}
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Выбрать файл
                    </>
                  )}
                </Button>

                {/* Скрытый input для файла */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={saving}
                />

                {/* Отображение текущего URL */}
                {profile?.photoURL && (
                  <div className="w-full p-2 bg-gray-50 rounded text-xs break-all">
                    <p className="font-semibold mb-1">URL в Storage:</p>
                    <p className="text-gray-600">{profile.photoURL}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Карточка с данными профиля */}
          <Card>
            <CardHeader>
              <CardTitle>Личные данные</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Email (только для чтения) */}
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={profile?.email || ''}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              {/* Полное имя */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Полное имя</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Имя Фамилия"
                  disabled={saving}
                />
              </div>

              {/* Телефон */}
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+7 (___) ___-__-__"
                  disabled={saving}
                />
              </div>

              {/* Город */}
              <div className="space-y-2">
                <Label htmlFor="city">Город</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Алматы"
                  disabled={saving}
                />
              </div>

              {/* Кнопка сохранения */}
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Сохранение в Firestore...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Сохранить в Firestore
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Карточка с био */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>О себе</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Расскажите о себе, любимых кухнях и предпочтениях..."
                disabled={saving}
              />
            </CardContent>
          </Card>

          {/* Информация о хранении данных */}
          <Card className="md:col-span-2 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    🔥 Данные вашего профиля надежно хранятся и синхронизируются
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Данные аккаунта и настроек профиля</li>
                    <li>• Фотографии профиля в защищённом хранилище</li>
                    <li>• Синхронизация профиля на всех ваших устройствах</li>
                    <li>• Автоматическое резервное копирование</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

          {/* Отладочная информация (можно убрать в продакшене) */}
        {process.env.NODE_ENV === 'development' && profile && (
          <Card className="mt-6 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-sm">Debug: Данные профиля</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto bg-white p-3 rounded">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}

