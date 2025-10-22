import Image from "next/image";
import { useState } from "react";
import closeIcon from "@/assets/close.svg";
import { useTranslation } from "react-i18next";

export function Register({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [validationErrors, setValidationErrors] = useState({});
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-full">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md backdrop-saturate-150 transition-all duration-300 ease-in-out z-10 h-full"
        onClick={onClose}
      />

      <div className="relative z-20 bg-white w-[600px] shadow-xl flex flex-col items-start rounded-lg gap-5 py-9 px-10 m-auto">
        <Image
          src={closeIcon}
          className="absolute top-4 right-4 w-8 h-8 cursor-pointer"
          alt=""
          onClick={onClose}
        />
        <div>
          <div className="text-2xl font-bold">{t("sign_up")}</div>
          <p className="text-gray-500">{t("sign_up_text")}</p>
        </div>
        <form className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-medium">
              {t("inputs.phone_number")} *
            </label>
            <input
              v-model="phone_number"
              type="text"
              id="username"
              required
              placeholder="+7 (___) ___-__-__"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p
              v-if="validationErrors.phone_number"
              className="text-red-500 text-sm mt-1"
            >
              {/* { validationErrors.phone_number[0] } */}
            </p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              {t("inputs.email")}
            </label>
            <input
              v-model="email"
              type="text"
              required
              placeholder={t("inputs.enter_your_email")}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p
              v-if="validationErrors.email"
              className="text-red-500 text-sm mt-1"
            >
              {/* { validationErrors.email[0] } */}
            </p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              {t("inputs.username")}
            </label>
            <input
              v-model="username"
              type="text"
              id="name"
              required
              placeholder={t("inputs.enter_your_username")}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p
              v-if="validationErrors.username"
              className="text-red-500 text-sm mt-1"
            >
              {/* { validationErrors.username[0] } */}
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="block text-gray-700 font-medium">
                {t("inputs.password")} *
              </label>
            </div>
            <div className="relative mt-2">
              <input
                v-model="password"
                type="password"
                id="password"
                required
                placeholder={t("inputs.your_password")}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              <p
                v-if="validationErrors.password"
                className="text-red-500 text-sm mt-1"
              >
                {/* { validationErrors.password[0] } */}
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="block text-gray-700 font-medium">
                {t("inputs.confirm")} *
              </label>
            </div>
            <div className="relative mt-2">
              <input
                v-model="password_confirm"
                type="password"
                id="password_confirm"
                required
                placeholder={t("inputs.confirm_your")}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              <p
                v-if="validationErrors.password_confirm"
                className="text-red-500 text-sm mt-1"
              >
                {/* { validationErrors.password_confirm[0] } */}
              </p>
            </div>
          </div>

          <div className="flex items-center mt-1">
            <input
              type="checkbox"
              id="rememberMe"
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <label className="ml-2 text-gray-700">{t("confirm_policy")}</label>
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-1 bg-black text-white font-semibold rounded-md hover:bg-gray-500 transition duration-200"
          >
            {t("register")}
          </button>
        </form>
        <div className="flex items-center justify-center mt-1 mx-auto">
          <span className="text-gray-500">{t("have_acc")}</span>
          <span
            // @click="emit('openLoginModal')"
            className="ml-2 text-black font-semibold cursor-pointer"
          >
            {t("login")}
          </span>
        </div>
      </div>
    </div>
  );
}
