"use client";

import { useTranslation } from "react-i18next";
import { RestaurantCard } from "./RestaurantCard";
import { CityModal } from "./CityModal";
import { useEffect, useState } from "react";
import locationIcon from "@/assets/location.svg";
import { restaurantAPI } from "@/lib/api";
import Image from "next/image";

interface RestaurantListProps {
  searchQuery?: string;
}

export function RestaurantList({ searchQuery = "" }: RestaurantListProps) {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  const { i18n, t, ready } = useTranslation();

  const locale = { value: i18n?.language || "ru" };
  function getLocalized(item: { [x: string]: any }, field: string) {
    const lang = locale.value.toLowerCase();
    return item[`${field}_${lang}`] || item[`${field}_ru`];
  }

  const fetchRestaurants = async (cityId = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await restaurantAPI.getRestaurants(cityId || undefined);
      const restaurantData = Array.isArray(data) ? data : data.results || [];
      setRestaurants(restaurantData);
      setFilteredRestaurants(restaurantData);
      console.log("Fetched restaurants:", restaurantData);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Ошибка при загрузке ресторанов");
    } finally {
      setIsLoading(false);
    }
  };

  // Функция фильтрации ресторанов по поисковому запросу
  const filterRestaurants = (query: string) => {
    console.log("Filtering restaurants with query:", query);
    console.log("Available restaurants:", restaurants);
    
    if (!query.trim()) {
      console.log("Empty query, showing all restaurants");
      setFilteredRestaurants(restaurants);
      return;
    }

    const filtered = restaurants.filter((restaurant: any) => {
      const name = restaurant.name?.toLowerCase() || "";
      const description = getLocalized(restaurant, "description")?.toLowerCase() || "";
      const city = restaurant.city?.name?.toLowerCase() || "";
      
      const matches = (
        name.includes(query.toLowerCase()) ||
        description.includes(query.toLowerCase()) ||
        city.includes(query.toLowerCase())
      );
      
      console.log(`Restaurant ${name}: matches=${matches}`);
      return matches;
    });
    
    console.log("Filtered results:", filtered);
    setFilteredRestaurants(filtered);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Эффект для фильтрации при изменении поискового запроса или ресторанов
  useEffect(() => {
    if (restaurants.length > 0) {
      console.log("Filtering restaurants with query:", searchQuery);
      filterRestaurants(searchQuery);
    }
  }, [searchQuery, restaurants]);

  const handleCitySelection = (city: any) => {
    setSelectedCity(city);
    fetchRestaurants(city.id);
  };

  const showCityModal = () => {
    setIsCityModalOpen(true);
  };

  const closeCityModal = () => {
    setIsCityModalOpen(false);
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
        <div className="mt-10 text-center">{t("loading") || "Загрузка..."}</div>
      )}

      {error && <div className="mt-10 text-center text-red-500">{error}</div>}

      {searchQuery && filteredRestaurants.length === 0 && !isLoading && (
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
        {(searchQuery ? filteredRestaurants : restaurants).map((res: any) => (
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
