'use client';

import { useTranslation } from "react-i18next";
import closeIcon from "@/assets/close.svg";
import Image from "next/image";
import eyeIcon from "@/assets/eye.svg";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { loginThunk } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export function Login({
  isOpen,
  onClose,
  onSwitchToRegister,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

    if (!formData.email) {
      newErrors.email = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Неверный формат email";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
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
      await dispatch(loginThunk({
        email: formData.email,
        password: formData.password,
      })).unwrap();
      
      // Redirect to profile or home after successful login
      router.push('/profile');
      onClose();
      setFormData({ email: "", password: "" });
    } catch (error: any) {
      setErrors({ general: error || "Ошибка при входе" });
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

      <div className="relative bg-white w-[600px] max-w-[95vw] max-h-[95vh] overflow-y-auto shadow-xl flex flex-col items-start rounded-lg gap-5 py-9 px-10 m-auto z-20">
        <Image
          src={closeIcon}
          className="absolute top-4 right-4 w-8 h-8 cursor-pointer"
          alt="Close"
          onClick={onClose}
        />
        <div>
          <div className="text-2xl font-bold">{t("sign_in")}</div>
          <p className="text-gray-500">{t("sign_in_mini")}</p>
        </div>

        {errors.general && (
          <div className="w-full p-3 bg-red-100 text-red-700 rounded-md">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-medium">
              {t("inputs.email")}
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
            <div className="flex justify-between items-center">
              <label className="block text-gray-700 font-medium">
                {t("inputs.password")}
              </label>
              <span className="text-sm text-gray-500 cursor-pointer hover:text-black">
                {t("forgot_pass")}
              </span>
            </div>
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
          </div>

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <label htmlFor="rememberMe" className="ml-2 text-gray-700">
              {t("remember_me")}
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Вход..." : t("login")}
          </button>
        </form>

        <div className="flex items-center justify-center mt-4 mx-auto">
          <span className="text-gray-500">{t("no_acc")}</span>
          <span
            onClick={onSwitchToRegister}
            className="ml-2 text-black font-semibold cursor-pointer hover:underline"
          >
            {t("register2")}
          </span>
        </div>
      </div>
    </div>
  );
}
