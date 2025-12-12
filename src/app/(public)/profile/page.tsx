"use client";
export const dynamic = "force-static";

import { type ChangeEvent, useMemo, useRef, useState, useEffect } from "react";
import {
  Building2,
  Camera,
  CheckCircle2,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Shield,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutThunk } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useFirestoreProfile } from "@/hooks/useFirestoreProfile";

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  language: string;
  notifications: boolean;
  promos: boolean;
  darkMode: boolean;
  avatar?: string;
};

const defaultProfile: ProfileData = {
  fullName: "No Name",
  email: "abonti@gmail.com",
  phone: "+7 (700) 777-77-77",
  city: "Алматы",
  bio: "Добавьте пару строк о себе, любимых кухнях и предпочтениях.",
  language: "ru",
  notifications: true,
  promos: true,
  darkMode: false,
  avatar: "",
};

function ProfilePageContent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  const {
    profile: firestoreProfile,
    loading: firestoreLoading,
    saving: firestoreSaving,
    updateProfile: updateFirestoreProfile,
    uploadAvatar,
    error: firestoreError,
  } = useFirestoreProfile();

  // Локальное состояние для формы
  const [formData, setFormData] = useState<ProfileData>(defaultProfile);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firestoreProfile) {
      setFormData({
        fullName: firestoreProfile.fullName || "",
        email: firestoreProfile.email || "",
        phone: firestoreProfile.phone || "",
        city: firestoreProfile.city || "",
        bio: firestoreProfile.bio || "",
        language: firestoreProfile.preferences?.language || "ru",
        notifications: firestoreProfile.preferences?.notifications ?? true,
        promos: firestoreProfile.preferences?.promos ?? true,
        darkMode: firestoreProfile.preferences?.darkMode ?? false,
        avatar: firestoreProfile.avatar || "",
      });
      setAvatarPreview(firestoreProfile.avatar || "");
    }
  }, [firestoreProfile]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const initials = useMemo(() => {
    return formData.fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [formData.fullName]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Показываем превью локально
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : "";
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);

      const base64 = await uploadAvatar(file);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error: any) {
      alert(error.message || "Ошибка загрузки фото");
      setAvatarPreview(firestoreProfile?.avatar || "");
    }
  };

  const removeAvatar = async () => {
    try {
      await updateFirestoreProfile({ avatar: "" });
      setAvatarPreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error removing avatar:", error);
    }
  };

  const updateField = <K extends keyof ProfileData>(
    field: K,
    value: ProfileData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateFirestoreProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        city: formData.city,
        bio: formData.bio,
        preferences: {
          language: formData.language,
          notifications: formData.notifications,
          promos: formData.promos,
          darkMode: formData.darkMode,
        },
      });
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error: any) {
      alert(error.message || "Ошибка сохранения");
    }
  };

  // Показываем загрузку
  if (firestoreLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className=" text-muted-foreground">Профиль</p>
            <h1 className="text-2xl font-bold tracking-tight">Личные данные</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="shadow-md"
              onClick={handleSaveProfile}
              disabled={firestoreSaving}
            >
              {firestoreSaving ? "⏳ Сохранение..." : "Сохранить"}
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Выход
            </Button>
          </div>
        </div>

        {firestoreError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {firestoreError}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="lg:col-span-1">
            <CardHeader className="flex-row items-center gap-4">
              <Avatar
                src={avatarPreview}
                alt={formData.fullName}
                fallback={initials}
              />
              <div className="flex-1">
                <CardTitle className="text-2xl">{formData.fullName}</CardTitle>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge>Премиум доступ</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3 rounded-xl bg-gray-50/80 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <p className="text-base font-medium">
                  {formData.email || "Не указан"}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  Телефон
                </div>
                <p className="text-base font-medium">
                  {formData.phone || "Не указан"}
                </p>
              </div>
              <div className="space-y-4 rounded-xl border border-dashed border-border/70 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Город
                  </div>
                  <Badge variant="secondary">
                    {formData.city || "Выберите"}
                  </Badge>
                </div>
                <div className="rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-3 text-white shadow-inner">
                  <p className="text-xs uppercase tracking-wide text-white/70">
                    Следующее бронирование
                  </p>
                  <p className="text-lg font-semibold">
                    18:30 — Ресторан Epicure
                  </p>
                  <p className="text-sm text-white/80">У окна, 2 гостя</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Настройки и уведомления</CardTitle>
              <CardDescription>
                Управляйте языком, темой и уведомлениями.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-xl border border-border/70 px-4 py-3">
                <div>
                  <p className="font-medium">Темная тема</p>
                  <p className="text-sm text-muted-foreground">
                    Переключите, если любите мягкий ночной режим.
                  </p>
                </div>
                <Switch
                  checked={formData.darkMode}
                  onCheckedChange={(checked) =>
                    updateField("darkMode", checked)
                  }
                  aria-label="Темная тема"
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/70 px-4 py-3">
                <div>
                  <p className="font-medium">Уведомления о бронированиях</p>
                  <p className="text-sm text-muted-foreground">
                    Получать push и email обновления.
                  </p>
                </div>
                <Switch
                  checked={formData.notifications}
                  onCheckedChange={(checked) =>
                    updateField("notifications", checked)
                  }
                  aria-label="Уведомления"
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/70 px-4 py-3">
                <div>
                  <p className="font-medium">Акции и бонусы</p>
                  <p className="text-sm text-muted-foreground">
                    Узнавайте первыми о скидках и специальных меню.
                  </p>
                </div>
                <Switch
                  checked={formData.promos}
                  onCheckedChange={(checked) => updateField("promos", checked)}
                  aria-label="Промо"
                />
              </div>
              <div className="rounded-xl border border-dashed border-border/80 bg-white/60 p-4">
                <p className="text-sm font-semibold">Язык интерфейса</p>
                <div className="mt-3 flex gap-2">
                  {["ru", "en", "kz"].map((lang) => (
                    <Button
                      key={lang}
                      variant={
                        formData.language === lang ? "default" : "secondary"
                      }
                      size="sm"
                      onClick={() => updateField("language", lang)}
                    >
                      {lang.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Личная информация</CardTitle>
              <CardDescription>
                Заполните поля, чтобы бронировать быстрее.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Полное имя</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Имя и фамилия"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="you@example.com"
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Город</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="Алматы"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">О себе</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  placeholder="Поделитесь любимыми кухнями и предпочтениями."
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormData(defaultProfile)}
                >
                  Сбросить
                </Button>
                <Button
                  type="button"
                  className="shadow-md"
                  onClick={handleSaveProfile}
                  disabled={firestoreSaving}
                >
                  {firestoreSaving ? (
                    <>⏳ Сохранение...</>
                  ) : uploadSuccess ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Данные сохранены
                    </>
                  ) : (
                    <>💾 Сохранить</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Фотография профиля</CardTitle>
              <CardDescription>
                Загрузите новую фотографию или обновите текущую.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border/70 bg-white/60 p-6 text-center">
                <div className="relative">
                  <Avatar
                    src={avatarPreview}
                    alt={formData.fullName}
                    fallback={initials || "A"}
                    className="h-32 w-32"
                  />
                  <button
                    type="button"
                    className="absolute bottom-2 right-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-lg"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">Обновите своё фото</p>
                  <p className="text-sm text-muted-foreground">
                    Мы принимаем JPEG, PNG или WEBP до 5 МБ. Прямо сейчас все
                    изменения сохраняются локально.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <UploadCloud className="h-4 w-4" />
                    Выбрать файл
                  </Button>
                  <Button variant="outline" onClick={removeAvatar}>
                    <X className="h-4 w-4" />
                    Удалить
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-muted-foreground">
                Фотография хранится только в вашем браузере. При выходе с
                устройства обновите её повторно.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}
