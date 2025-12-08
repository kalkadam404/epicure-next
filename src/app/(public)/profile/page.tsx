"use client";

export const ssr = false;

import { type ChangeEvent, useMemo, useRef, useState } from "react";
import {
  Building2,
  Camera,
  CheckCircle2,
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

export default function ProfilePage() {
  const [profile, setProfile] = useLocalStorage<ProfileData>(
    "epicure-profile",
    defaultProfile
  );
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = useMemo(() => {
    return profile.fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [profile.fullName]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setAvatarPreview(result);
      setProfile((prev) => ({ ...prev, avatar: result }));
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatarPreview("");
    setProfile((prev) => ({ ...prev, avatar: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateField = <K extends keyof ProfileData>(
    field: K,
    value: ProfileData[K]
  ) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Профиль</p>
            <h1 className="text-3xl font-bold tracking-tight">Личные данные</h1>
            <p className="text-sm text-muted-foreground">
              Обновите информацию, чтобы бронирования проходили быстрее.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="h-4 w-4" />
              Обновить аватар
            </Button>
            <Button className="shadow-md">
              <CheckCircle2 className="h-4 w-4" />
              Сохранено локально
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="lg:col-span-1">
            <CardHeader className="flex-row items-center gap-4">
              <Avatar
                src={avatarPreview}
                alt={profile.fullName}
                fallback={initials}
              />
              <div className="flex-1">
                <CardTitle className="text-2xl">{profile.fullName}</CardTitle>

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
                  {profile.email || "Не указан"}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  Телефон
                </div>
                <p className="text-base font-medium">
                  {profile.phone || "Не указан"}
                </p>
              </div>
              <div className="space-y-4 rounded-xl border border-dashed border-border/70 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Город
                  </div>
                  <Badge variant="secondary">
                    {profile.city || "Выберите"}
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
                  checked={profile.darkMode}
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
                  checked={profile.notifications}
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
                  checked={profile.promos}
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
                        profile.language === lang ? "default" : "secondary"
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
                    value={profile.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Имя и фамилия"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Город</Label>
                  <Input
                    id="city"
                    value={profile.city}
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
                  value={profile.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  placeholder="Поделитесь любимыми кухнями и предпочтениями."
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setProfile(defaultProfile)}
                >
                  Сбросить
                </Button>
                <Button type="button" className="shadow-md">
                  <CheckCircle2 className="h-4 w-4" />
                  Данные сохранены
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
                    alt={profile.fullName}
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
