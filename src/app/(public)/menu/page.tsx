"use client";
import { BonusAppPromo } from "@/components/BonusAppPromo";
import { DishInfo } from "@/components/DishInfo";
import type { Metadata } from "next";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import { dishAPI, menuAPI, apiClient, getImageUrl } from "@/lib/api";
import { MenuItem } from "@/components/MenuItem";

// export const metadata: Metadata = {
//   title: "Epicure-home",
//   description: "",
// };

export default function MenuPage() {
  const { t, i18n, ready } = useTranslation();
  const [dishList, setDishList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDishInfoModalOpen, setIsDishInfoModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<any>(null);

  if (!ready) {
    return (
      <div className="pt-20 px-20">
        <div className="text-center py-20">
          <div className="text-xl">Загрузка...</div>
        </div>
      </div>
    );
  }

  function getLocalized(item: { [x: string]: any }, field: string) {
    const lang = (i18n?.language || "ru").toLowerCase();
    return item[`${field}_${lang}`] || item[`${field}_ru`] || item[field];
  }

  const fetchCategories = async () => {
    try {
      const { data } = await menuAPI.getMenuTypes();
      setCategories(data.results || data);
      console.log("categories", data);
    } catch (err) {
      console.log("err categories", err);
      setError("Ошибка загрузки категорий");
    }
  };

  const fetchDishes = async () => {
    try {
      const { data } = await menuAPI.getMenuItems();
      console.log("dishes", data);
      setDishList(data.results || data);
    } catch (err) {
      console.log("err dishes", err);
      setError("Ошибка загрузки блюд");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchCategories(), fetchDishes()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const groupedDishes = useMemo(() => {
    const grouped: { [key: number]: any[] } = {};
    for (const dish of dishList) {
      const typeId = dish.menu_type_details?.id;
      if (typeId) {
        if (!grouped[typeId]) {
          grouped[typeId] = [];
        }
        grouped[typeId].push(dish);
      }
    }
    return grouped;
  }, [dishList]);

  const scrollToSection = (index: number) => {
    setActiveIndex(index);
    const element = document.getElementById(`category-${index}`);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const openDishModal = (dish: any) => {
    setSelectedDish(dish);
    setIsDishInfoModalOpen(true);
  };

  const closeDishInfoModal = () => {
    setIsDishInfoModalOpen(false);
    setSelectedDish(null);
  };

  if (loading) {
    return (
      <div className="pt-20 px-20">
        <div className="text-center py-20">
          <div className="text-xl">{t("loading") || "Загрузка меню..."}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 px-20">
        <div className="text-center py-20">
          <div className="text-xl text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 max-sm:pt-5">
      <div className="flex gap-8 px-20 max-sm:px-4">
        <div className="w-1/4 h-fit sticky top-30">
          <ul className="space-y-4">
            {categories.map((cat: any, idx: number) => (
              <li
                key={cat.id}
                onClick={() => scrollToSection(idx)}
                className={`cursor-pointer text-lg font-medium ${
                  activeIndex === idx
                    ? "text-black font-semibold"
                    : "text-gray-500"
                }`}
              >
                {getLocalized(cat, "name")}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-3/4 space-y-16">
          {categories.map((cat: any, idx: number) => (
            <div
              key={cat.id}
              id={`category-${idx}`}
              className="space-y-4 scroll-mt-[110px]"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-5">
                {getLocalized(cat, "name")}
              </h2>
              <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
                {(groupedDishes[cat.id] || []).map((dish: any) => (
                  <MenuItem
                    key={dish.id}
                    img={getImageUrl(dish.image)}
                    title={getLocalized(dish, "name")}
                    category={dish.menu_type_details?.name || ""}
                    price={dish.price}
                    onClick={() => openDishModal(dish)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-20 my-10 max-sm:px-4">
        <BonusAppPromo />
      </div>

      {/* DishInfo Modal */}
      <DishInfo
        isOpen={isDishInfoModalOpen}
        selectedDish={selectedDish}
        onClose={closeDishInfoModal}
      />
    </div>
  );
}
