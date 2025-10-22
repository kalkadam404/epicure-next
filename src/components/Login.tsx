import { useTranslation } from "react-i18next";
import closeIcon from "@/assets/close.svg";
import Image from "next/image";
import eyeIcon from "@/assets/eye.svg";
import googleIcon from "@/assets/google_icon.svg";
import facebookIcon from "@/assets/face.svg";
import appleIcon from "@/assets/apple.svg";

export function Login({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-full">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md backdrop-saturate-150 transition-all duration-300 ease-in-out z-10 h-full"
        onClick={onClose}
      />

      <div className="relative bg-white w-[600px] shadow-xl flex flex-col items-start rounded-lg gap-5 py-9 px-10 m-auto z-20">
        <Image
          src={closeIcon}
          className="absolute top-4 right-4 w-8 h-8 cursor-pointer"
          alt=""
          onClick={onClose}
        />
        <div>
          <div className="text-2xl font-bold">{t("sign_in")}</div>
          <p className="text-gray-500">{t("sign_in_mini")}</p>
        </div>
        <form className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-medium">
              {t("inputs.phone_number")}
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
            <div className="flex justify-between items-center">
              <label className="block text-gray-700 font-medium">
                {t("inputs.password")}
              </label>
              <div>{t("forgot_pass")}</div>
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
              <Image
                src={eyeIcon}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                alt=""
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="rememberMe"
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <label className="ml-2 text-gray-700">{t("remember_me")}</label>
          </div>
          <div className="flex flex-col gap-[22px]">
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-black text-white font-semibold rounded-md hover:bg-gray-500 transition duration-200"
            >
              {t("login")}
            </button>
            <span className="text-[#ABABAB] text-center text-lg">
              {t("or")}
            </span>
            <div className="flex items-center mx-auto gap-3">
              <div
                className="flex gap-5 items-center bg-black rounded-[9px] py-3 px-10"
                // @click="openGoogleAuth"
              >
                <Image src={googleIcon} alt="" />
                <div className="text-white">{t("login_google")}</div>
              </div>
              <div className="bg-[#F6F6F6] rounded-[9px] py-3 px-3">
                <Image src={facebookIcon} alt="" />
              </div>
              <div className="bg-[#F6F6F6] rounded-[9px] py-3 px-3">
                <Image src={appleIcon} alt="" />
              </div>
            </div>
          </div>
        </form>
        <div className="flex items-center justify-center mt-4 mx-auto">
          <span className="text-gray-500">{t("no_acc")}</span>
          <span
            className="ml-2 text-black font-semibold cursor-pointer"
            // @click="emit('toggleToRegister')"
          >
            {t("register2")}
          </span>
        </div>
      </div>
    </div>
  );
}
