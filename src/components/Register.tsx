'use client';

import Image from "next/image";
import { useState } from "react";
import closeIcon from "@/assets/close.svg";
import eyeIcon from "@/assets/eye.svg";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/store/hooks";
import { signupThunk } from "@/store/slices/authSlice";
import { getPasswordValidationErrors } from "@/services/authService";

export function Register({
  isOpen,
  onClose,
  onSwitchToLogin,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    city: "", // Добавляем город для Firestore
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Неверный формат email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else {
      const passwordErrors = getPasswordValidationErrors(formData.password);
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors[0]; // Show first error
      }
    }

    // Repeat password validation
    if (!formData.repeatPassword) {
      newErrors.repeatPassword = "Повторите пароль";
    } else if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = "Пароли не совпадают";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await dispatch(signupThunk({
        email: formData.email,
        password: formData.password,
        repeatPassword: formData.repeatPassword,
        name: formData.name,
      })).unwrap();
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ name: "", email: "", password: "", repeatPassword: "", city: "" });
      }, 2000);
    } catch (error: any) {
      setErrors({ general: error || "Ошибка при регистрации" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-full">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md backdrop-saturate-150 transition-all duration-300 ease-in-out z-10 h-full"
        onClick={onClose}
      />

      <div className="relative z-20 bg-white w-[600px] max-w-[95vw] max-h-[95vh] overflow-y-auto shadow-xl flex flex-col items-start rounded-lg gap-5 py-9 px-10 m-auto">
        <Image
          src={closeIcon}
          className="absolute top-4 right-4 w-8 h-8 cursor-pointer"
          alt="Close"
          onClick={onClose}
        />
        <div>
          <div className="text-2xl font-bold">{t("sign_up")}</div>
          <p className="text-gray-500">{t("sign_up_text")}</p>
        </div>

        {success && (
          <div className="w-full p-3 bg-green-100 text-green-700 rounded-md">
            Регистрация успешна! Добро пожаловать!
          </div>
        )}

        {errors.general && (
          <div className="w-full p-3 bg-red-100 text-red-700 rounded-md">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-medium">
              {t("inputs.username")}
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("inputs.enter_your_username")}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              {t("inputs.email")} *
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={t("inputs.enter_your_email")}
              className={`w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-black"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Город (опционально)
            </label>
            <input
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="Алматы, Астана..."
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-xs text-gray-500 mt-1">
              Будет сохранено в профиле Firestore
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              {t("inputs.password")} *
            </label>
            <div className="relative mt-2">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder={t("inputs.your_password")}
                className={`w-full p-3 pr-12 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-black"
                }`}
              />
              <Image
                src={eyeIcon}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                alt="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Минимум 8 символов, 1 цифра, 1 спецсимвол
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              {t("inputs.confirm")} *
            </label>
            <div className="relative mt-2">
              <input
                name="repeatPassword"
                type={showRepeatPassword ? "text" : "password"}
                value={formData.repeatPassword}
                onChange={handleChange}
                required
                placeholder={t("inputs.confirm_your")}
                className={`w-full p-3 pr-12 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.repeatPassword ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-black"
                }`}
              />
              <Image
                src={eyeIcon}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                alt="Toggle password visibility"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              />
            </div>
            {errors.repeatPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.repeatPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-1 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Регистрация..." : t("register")}
          </button>
        </form>

        <div className="flex items-center justify-center mt-1 mx-auto">
          <span className="text-gray-500">{t("have_acc")}</span>
          <span
            onClick={onSwitchToLogin}
            className="ml-2 text-black font-semibold cursor-pointer hover:underline"
          >
            {t("login")}
          </span>
        </div>
      </div>
    </div>
  );
}
