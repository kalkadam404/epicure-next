"use client";

import { useTranslation } from "react-i18next";
import { RestaurantCard } from "./RestaurantCard";
import { CityModal } from "./CityModal";
import { SkeletonCard } from "./SkeletonCard";
import { useEffect, useState } from "react";
import locationIcon from "@/assets/location.svg";
import { restaurantService } from "@/services";
import Image from "next/image";

interface RestaurantListProps {
  searchQuery?: string;
}

export function RestaurantList({ searchQuery = "" }: RestaurantListProps) {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { i18n, t, ready } = useTranslation();

  const locale = { value: i18n?.language || "ru" };
  function getLocalized(item: { [x: string]: any }, field: string) {
    const lang = locale.value.toLowerCase();
    return item[`${field}_${lang}`] || item[`${field}_ru`];
  }

  const fetchRestaurants = async (options?: {
    cityId?: number | null;
    page?: number;
    query?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const page = options?.page ?? 1;
      const cityId = options?.cityId ?? selectedCity?.id ?? null;
      const rawQuery = options?.query ?? searchQuery;
      const trimmedQuery = rawQuery.trim();

      const params: any = {
        page,
        page_size: 10,
      };

      if (cityId) {
        params.city = cityId;
      }

      if (trimmedQuery) {
        params.search = trimmedQuery;
      }

      const data = await restaurantService.getRestaurants(params);
      const restaurantData = Array.isArray(data)
        ? data
        : (data as any).results || [];

      setRestaurants(restaurantData as any);
      setCurrentPage(page);
      setTotalCount((data as any).count || restaurantData.length || 0);
      setPageSize((prev) => prev || restaurantData.length || 10);

      console.log("Fetched restaurants from API:", { params, restaurantData });
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Ошибка при загрузке ресторанов");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Поиск по ресторанам через backend API при изменении поискового запроса
  useEffect(() => {
    // При первом рендере, когда список ещё не загружен, ничего не делаем —
    // стартовая загрузка уже выполнится в другом эффекте.
    if (!restaurants.length && !searchQuery.trim()) return;

    fetchRestaurants({
      page: 1,
      query: searchQuery,
      cityId: selectedCity?.id ?? null,
    });
  }, [searchQuery]);

  const handleCitySelection = (city: any) => {
    setSelectedCity(city);
    fetchRestaurants({ cityId: city.id, page: 1 });
  };

  const showCityModal = () => {
    setIsCityModalOpen(true);
  };

  const closeCityModal = () => {
    setIsCityModalOpen(false);
  };

  const totalPages = pageSize ? Math.ceil(totalCount / pageSize) : 1;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    fetchRestaurants({
      page,
      cityId: selectedCity?.id ?? null,
      query: searchQuery,
    });
  };

  return (
    <div className="flex flex-col mt-10" data-aos="fade-up">
      <div className="flex w-full items-center justify-between">
        <div className="font-bold text-3xl max-sm:text-xl">
          {searchQuery
            ? `Результаты поиска для "${searchQuery}"`
            : selectedCity
            ? t("restaurantInCity", {
                city: getLocalized(selectedCity, "name"),
              })
            : t("allRestaurants")}
        </div>
        <div
          className="flex items-center gap-1 bg-[#EDEDED] rounded-[20px] px-5 py-2 cursor-pointer"
          onClick={showCityModal}
        >
          <Image
            src={locationIcon}
            width={24}
            height={24}
            alt=""
            className="max-sm:w-5 max-sm:h-5"
          />
          <div className="font-medium text-lg max-sm:text-base">
            {selectedCity
              ? getLocalized(selectedCity, "name")
              : t("buttons.select_city")}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-3 gap-8 mt-10 max-sm:grid-cols-1">
          <SkeletonCard variant="restaurant" count={6} />
        </div>
      )}

      {error && <div className="mt-10 text-center text-red-500">{error}</div>}

      {searchQuery && restaurants.length === 0 && !isLoading && (
        <div className="mt-10 text-center text-gray-500">
          <p>По вашему запросу "{searchQuery}" ничего не найдено</p>
          <p className="text-sm mt-2">Попробуйте изменить поисковый запрос</p>
        </div>
      )}

      {!searchQuery && restaurants.length === 0 && !isLoading && (
        <div className="mt-10 text-center">
          {selectedCity
            ? t("noRestaurantsInCity") ||
              `В городе {selectedCity.name} пока нет ресторанов`
            : t("noRestaurants") || "Нет доступных ресторанов"}
        </div>
      )}

      <div className="grid grid-cols-3 gap-8 mt-10 max-sm:grid-cols-1">
        {!isLoading &&
          restaurants.map((res: any) => (
            <RestaurantCard
              key={res.id}
              img={res.photo}
              ResName={res.name}
              city={res.city.name}
              menuType={getLocalized(res, "description")}
              openingTime={res.opening_time}
              closingTime={res.closing_time}
              rating={res.rating}
            />
          ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
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
      )}

      {/* City Modal */}
      <CityModal
        isOpen={isCityModalOpen}
        currentCityId={selectedCity?.id}
        onClose={closeCityModal}
        onCitySelected={handleCitySelection}
      />
    </div>
  );
}
