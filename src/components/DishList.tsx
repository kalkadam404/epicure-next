"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DishCard } from "./DishCard";
import Image from "next/image";
import arrow_left from "@/assets/arrow_left.svg";
import arrow_right from "@/assets/arrow_right.svg";
import { menuAPI, getImageUrl } from "@/lib/api";

interface Dish {
  id: number;
  name: string;
  name_ru: string;
  name_en: string;
  name_kz: string;
  image_url?: string;
  image?: string;
  price: number;
  restaurant_details?: {
    name: string;
  };
  menu_type_details?: {
    name: string;
  };
}

interface DishListProps {
  onDishClick?: (dish: Dish) => void;
}

export function DishList({ onDishClick }: DishListProps = {}) {
  const { t, i18n } = useTranslation();
  const [dishList, setDishList] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function getLocalized(item: Dish, field: string) {
    const lang = (i18n?.language || "ru").toLowerCase();
    return (item as any)[`${field}_${lang}`] || (item as any)[`${field}_ru`];
  }

  const fetchDishes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await menuAPI.getPopularItems();
      const data = response.data;

      setDishList(Array.isArray(data) ? data : data.results || []);

      console.log("Fetched popular dishes:", data);
    } catch (err) {
      console.error("Error fetching popular dishes:", err);
      setError("Не удалось загрузить популярные блюда");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDishClick = (dish: Dish) => {
    if (onDishClick) {
      onDishClick(dish);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  return (
    <div className="flex flex-col mt-12" data-aos="fade-up">
      <div className="flex w-full items-center justify-between">
        <div className="font-bold text-3xl">{t("popularDishes")}</div>
        <div className="flex items-center gap-4">
          <div className="rounded-full border-2 border-[#E6E8EC] cursor-pointer hover:bg-gray-100">
            <Image
              src={arrow_left}
              alt="Предыдущая страница"
              width={30}
              height={30}
            />
          </div>
          <div className="rounded-full border-2 border-[#E6E8EC] cursor-pointer hover:bg-gray-100">
            <Image
              src={arrow_right}
              alt="Следующая страница"
              width={30}
              height={30}
            />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="mt-10 text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">{t("loading") || "Загрузка..."}</p>
        </div>
      )}

      {error && (
        <div className="mt-10 text-center text-red-500 py-8">{error}</div>
      )}

      {dishList.length === 0 && !isLoading && !error && (
        <div className="mt-10 text-center py-8 text-gray-500">
          {t("general.no_popular_dishes") || "Нет популярных блюд"}
        </div>
      )}

      {!isLoading && !error && dishList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
          {dishList.map((dish) => (
            <div key={dish.id} onClick={() => handleDishClick(dish)}>
              <DishCard
                img={getImageUrl(dish.image_url || dish.image || "")}
                title={getLocalized(dish, "name")}
                restaurant={dish.restaurant_details?.name || ""}
                category={dish.menu_type_details?.name || ""}
                price={dish.price}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
