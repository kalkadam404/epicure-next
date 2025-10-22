import { useTranslation } from "react-i18next";
import mobile from "@/assets/iPhone.svg";
import Image from "next/image";

export function BonusAppPromo() {
  const { t } = useTranslation();
  return (
    <div className=" flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-[20px] overflow-hidden relative max-sm:px-2 max-sm:py-2">
      <div className="z-10 max-w-lg px-6 py-8 max-sm:px-4">
        <p className="text-gray-700 font-medium mb-2">
          {t("bonusAppPromo.gift")}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
          {t("bonusAppPromo.title")}
        </h2>
        <p className="text-gray-700 mb-6">{t("bonusAppPromo.description")}</p>

        <div className="mt-8 md:mt-0 relative sm:hidden">
          <div className="">
            <Image
              src={mobile}
              alt="Мобильное приложение"
              className="w-full max-w-[1500px]"
              priority
            />

            <div className="absolute top-20 right-[440px] bg-white rounded-lg p-2 shadow-lg flex items-center max-sm:right-10">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-500 mr-2">
                Б
              </div>
              <span className="font-medium">+234</span>
            </div>

            <div className="absolute top-48 right-[220px] bg-white rounded-lg p-2 shadow-lg flex items-center border border-gray-200 max-sm:right-auto max-sm:top-2 max-sm:left-15">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-500 mr-2">
                Б
              </div>
              <span className="font-medium">+234</span>
            </div>

            <div className="absolute bottom-30 right-[450px] bg-white rounded-lg p-2 shadow-lg flex items-center border border-gray-200 max-sm:bottom-0 max-sm:right-20">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-500 mr-2">
                Б
              </div>
              <span className="font-medium">+234</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-10 sm:flex-row gap-4">
          <a
            href="#"
            className="flex items-center bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors max-sm:w-fit"
          >
            <svg
              className="w-6 h-6 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
            </svg>
            <div>
              <div className="text-xs">{t("bonusAppPromo.buttonApps")}</div>
              <div className="font-medium">{t("bonusAppPromo.appStore")}</div>
            </div>
          </a>

          <a
            href="#"
            className="flex items-center bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors max-sm:w-fit"
          >
            <svg
              className="w-6 h-6 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <div>
              <div className="text-xs">{t("bonusAppPromo.allowed")}</div>
              <div className="font-medium">{t("bonusAppPromo.googlePlay")}</div>
            </div>
          </a>
        </div>
      </div>

      <div className="mt-8 md:mt-0 relative max-sm:hidden">
        <div className="">
          <Image
            src={mobile}
            alt="Мобильное приложение"
            className="w-full max-w-[1500px]"
            priority
          />

          <div className="absolute top-20 right-[440px] bg-white rounded-lg p-2 shadow-lg flex items-center">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-500 mr-2">
              Б
            </div>
            <span className="font-medium">+234</span>
          </div>

          <div className="absolute top-48 right-[220px] bg-white rounded-lg p-2 shadow-lg flex items-center border border-gray-200">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-500 mr-2">
              Б
            </div>
            <span className="font-medium">+234</span>
          </div>

          <div className="absolute bottom-30 right-[450px] bg-white rounded-lg p-2 shadow-lg flex items-center border border-gray-200">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-500 mr-2">
              Б
            </div>
            <span className="font-medium">+234</span>
          </div>
        </div>
      </div>
    </div>
  );
}
