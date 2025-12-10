"use client";
import { BonusAppPromo } from "@/components/BonusAppPromo";
import { DishInfo } from "@/components/DishInfo";
import { SearchComponent } from "@/components/SearchComponent";
import type { Metadata } from "next";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import { menuService, ImageService } from "@/services";
import { MenuItem } from "@/components/MenuItem";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMenuItems,
  setSearchQuery as setMenuSearchQuery,
  setPage as setMenuPage,
} from "@/store/slices/menuSlice";

export default function MenuPage() {
  const { t, i18n, ready } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    items: dishList,
    loading,
    error,
    searchQuery,
    page: currentPage,
    pageSize,
    totalCount,
  } = useAppSelector((state) => state.menu);

  const [filteredDishList, setFilteredDishList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

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
      // Ошибка категорий не должна ломать весь экран
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCategories(), dispatch(fetchMenuItems())]);
    };
    loadData();
  }, [dispatch]);

  // Синхронизируем локальный список с данными из Redux
  useEffect(() => {
    setFilteredDishList(dishList);
  }, [dishList]);

  useEffect(() => {
    if (!categories.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -70% 0px", // блок считается активным, когда верхняя его часть в 30% экрана
        threshold: 0,
      }
    );

    categories.forEach((cat, idx) => {
      const el = document.getElementById(`category-${idx}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories, filteredDishList]);

  // Функция поиска по блюдам через backend API (debounce реализован в SearchComponent)
  const searchDishes = (query: string) => {
    dispatch(setMenuSearchQuery(query));
    dispatch(setMenuPage(1));
    dispatch(fetchMenuItems());
  };

  const clearSearch = () => {
    dispatch(setMenuSearchQuery(""));
    dispatch(setMenuPage(1));
    dispatch(fetchMenuItems());
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

  const totalPages = pageSize ? Math.ceil(totalCount / pageSize) : 1;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    dispatch(setMenuPage(page));
    dispatch(fetchMenuItems());
  };

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
    <div className="pt-10 max-sm:pt-5">
      {/* Search Section */}
      <div className="px-20 mb-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Поиск блюд
          </h2>
          <div className="flex items-center gap-4 max-sm:flex-col">
            <SearchComponent
              showRestaurants={false}
              showDishes={true}
              className="flex-1"
              initialQuery={searchQuery}
              autoSearch={false}
              showSearchButton={true}
              onSearchResults={searchDishes}
              onClear={clearSearch}
            />

            {searchQuery && (
              <button
                onClick={clearSearch}
                className="text-sm text-gray-500 hover:text-gray-700 underline whitespace-nowrap max-sm:self-end"
              >
                Очистить поиск
              </button>
            )}
          </div>
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
              </div>
              {filteredDishList.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {filteredDishList.map((dish: any) => (
                    <MenuItem
                      key={dish.id}
                      img={ImageService.getImageUrl(
                        dish.image_url || dish.image || ""
                      )}
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
                data-index={idx}
                className="space-y-4 scroll-mt-[110px]"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-5">
                  {getLocalized(cat, "name")}
                </h2>
                <div className="grid grid-cols-3 gap-x-3 gap-y-5 max-sm:grid-cols-1">
                  {(groupedDishes[cat.id] || []).map((dish: any) => (
                    <MenuItem
                      key={dish.id}
                      img={ImageService.getImageUrl(
                        dish.image_url || dish.image || ""
                      )}
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

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="px-20 mt-8 max-sm:px-4 flex items-center justify-center">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Предыдущая
            </button>
            <span className="text-sm text-gray-600">
              Страница {currentPage} из {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Следующая
            </button>
          </div>
        </div>
      )}

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
