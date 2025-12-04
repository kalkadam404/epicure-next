"use client";
import { BonusAppPromo } from "@/components/BonusAppPromo";
import { DishInfo } from "@/components/DishInfo";
import { SearchComponent } from "@/components/SearchComponent";
import type { Metadata } from "next";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import { menuService, ImageService } from "@/services";
import { MenuItem } from "@/components/MenuItem";

// export const metadata: Metadata = {
//   title: "Epicure-home",
//   description: "",
// };

export default function MenuPage() {
  const { t, i18n, ready } = useTranslation();
  const [dishList, setDishList] = useState<any[]>([]);
  const [filteredDishList, setFilteredDishList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      const data = await menuService.getMenuTypes();
      setCategories(data);
      console.log("categories", data);
    } catch (err) {
      console.log("err categories", err);
      setError("Ошибка загрузки категорий");
    }
  };

  const fetchDishes = async () => {
    try {
      const data = await menuService.getMenuItems();
      console.log("dishes", data);
      const dishes = (data as any).results || data;
      setDishList(dishes);
      setFilteredDishList(dishes);
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

  // Функция поиска по блюдам
  const searchDishes = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredDishList(dishList);
      return;
    }

    const filtered = dishList.filter((dish) => {
      const dishName = getLocalized(dish, "name").toLowerCase();
      const restaurantName = dish.restaurant_details?.name?.toLowerCase() || "";
      const categoryName = dish.menu_type_details?.name?.toLowerCase() || "";

      return (
        dishName.includes(query.toLowerCase()) ||
        restaurantName.includes(query.toLowerCase()) ||
        categoryName.includes(query.toLowerCase())
      );
    });

    setFilteredDishList(filtered);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredDishList(dishList);
  };

  const groupedDishes = useMemo(() => {
    const grouped: { [key: number]: any[] } = {};
    for (const dish of filteredDishList) {
      const typeId = dish.menu_type_details?.id;
      if (typeId) {
        if (!grouped[typeId]) {
          grouped[typeId] = [];
        }
        grouped[typeId].push(dish);
      }
    }
    return grouped;
  }, [filteredDishList]);

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
      {/* Search Section */}
      <div className="px-20 mb-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Поиск блюд
          </h2>
          <SearchComponent
            showRestaurants={false}
            showDishes={true}
            className="bg-white rounded-2xl shadow-lg border border-gray-100"
            onSearchResults={searchDishes}
            onClear={clearSearch}
          />
        </div>
      </div>

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
          {searchQuery && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Результаты поиска для "{searchQuery}"
                </h2>
                <button
                  onClick={clearSearch}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Очистить поиск
                </button>
              </div>
              {filteredDishList.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {filteredDishList.map((dish: any) => (
                    <MenuItem
                      key={dish.id}
                      img={ImageService.getImageUrl(dish.image_url || dish.image || "")}
                      title={getLocalized(dish, "name")}
                      category={dish.menu_type_details?.name || ""}
                      price={dish.price}
                      onClick={() => openDishModal(dish)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>По вашему запросу ничего не найдено</p>
                  <p className="text-sm mt-2">
                    Попробуйте изменить поисковый запрос
                  </p>
                </div>
              )}
            </div>
          )}

          {!searchQuery &&
            categories.map((cat: any, idx: number) => (
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
                      img={ImageService.getImageUrl(dish.image_url || dish.image || "")}
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
