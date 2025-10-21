"use client";

import { useTranslation } from "react-i18next";

interface Dish {
  id: number;
  name: string;
  name_ru: string;
  name_en: string;
  name_kz: string;
  description: string;
  description_ru: string;
  description_en: string;
  description_kz: string;
  price: number;
  calories: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
  restaurant_details: {
    name: string;
  };
}

interface DishInfoProps {
  isOpen: boolean;
  selectedDish: Dish | null;
  onClose: () => void;
}

export function DishInfo({ isOpen, selectedDish, onClose }: DishInfoProps) {
  const { t, i18n } = useTranslation();

  function getLocalized(item: any, field: string) {
    const lang = (i18n?.language || "ru").toLowerCase();
    return item[`${field}_${lang}`] || item[`${field}_ru`];
  }

  if (!isOpen || !selectedDish) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md backdrop-saturate-150 transition-all duration-300 ease-in-out z-40"
        onClick={onClose}
      />

      <div className="relative bg-white w-[550px] shadow-xl flex flex-col items-start rounded-lg gap-5 py-9 px-10 m-auto z-50 max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div>
          <div className="text-2xl font-bold">{t("DishInfo.info")}</div>
        </div>

        <div className="flex flex-col gap-4 w-full border-t border-b border-[#afafaf] pt-5 pb-5">
          <div className="font-bold text-xl">
            {getLocalized(selectedDish, "name")}
          </div>
          <div className="text-base">
            {getLocalized(selectedDish, "description")}
          </div>
          <div className="font-bold text-lg">{selectedDish.price} ₸</div>
        </div>

        <div className="flex flex-col gap-4 w-full border-b border-[#afafaf] pb-5">
          <div className="font-bold text-xl">{t("DishInfo.dish_value")}</div>
          <div className="flex gap-4 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="font-bold">
                {selectedDish.calories} {t("DishInfo.kcal")}
              </div>
              <span>{t("DishInfo.calories")}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="font-bold">
                {selectedDish.proteins} {t("DishInfo.grams")}
              </div>
              <span>{t("DishInfo.protein")}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="font-bold">
                {selectedDish.fats} {t("DishInfo.grams")}
              </div>
              <span>{t("DishInfo.fat")}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="font-bold">
                {selectedDish.carbohydrates} {t("DishInfo.grams")}
              </div>
              <span>{t("DishInfo.carbohydrates")}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full border-b border-[#afafaf] pb-5">
          <div className="font-bold text-xl">{t("restaurant")}</div>
          <span className="text-[#9D9D9D]">
            {selectedDish.restaurant_details?.name}
          </span>
        </div>
      </div>
    </div>
  );
}
