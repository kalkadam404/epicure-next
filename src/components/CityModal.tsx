"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cityAPI } from "@/lib/api";

interface City {
  id: number;
  name: string;
  name_ru: string;
  name_en: string;
  name_kz: string;
}

interface CityModalProps {
  isOpen: boolean;
  currentCityId?: number | null;
  onClose: () => void;
  onCitySelected: (city: City) => void;
}

export function CityModal({ isOpen, currentCityId, onClose, onCitySelected }: CityModalProps) {
  const { t, i18n } = useTranslation();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocalizedCityName = (city: City) => {
    const lang = (i18n?.language || "ru").toLowerCase();
    return city[`name_${lang}` as keyof City] || city.name_ru || city.name;
  };

  useEffect(() => {
    if (isOpen) {
      fetchCities();
      setSelectedCityId(currentCityId || null);
    }
  }, [isOpen, currentCityId]);

  const fetchCities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await cityAPI.getCities();
      setCities(data.results || data);
    } catch (err) {
      console.error("Ошибка загрузки городов:", err);
      setError("Не удалось загрузить список городов");
    } finally {
      setIsLoading(false);
    }
  };

  const selectCity = (city: City) => {
    setSelectedCityId(city.id);
  };

  const confirmSelection = () => {
    if (selectedCityId) {
      const selectedCity = cities.find(city => city.id === selectedCityId);
      if (selectedCity) {
        onCitySelected(selectedCity);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md backdrop-saturate-150 transition-all duration-300 ease-in-out z-40"
        onClick={onClose}
      />
      <div className="relative bg-white w-[550px] shadow-xl flex flex-col items-start rounded-lg py-9 px-10 m-auto z-50 max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="mb-6">
          <div className="text-2xl font-bold text-gray-800">
            {t("buttons.select_city")}
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full border-t border-gray-200 pt-6">
          {cities.map((city) => (
            <div
              key={city.id}
              onClick={() => selectCity(city)}
              className={`flex items-center gap-4 rounded-lg border py-4 px-5 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                selectedCityId === city.id ? "border-black border-2 bg-gray-100" : "border-gray-300"
              }`}
            >
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <svg
                  className={`w-5 h-5 ${selectedCityId === city.id ? "text-black" : "text-gray-400"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className={`font-medium ${selectedCityId === city.id ? "text-black" : "text-gray-700"}`}>
                {getLocalizedCityName(city)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="py-4 px-5 text-center text-gray-500 italic">
              {t("loading") || "Загрузка..."}
            </div>
          )}
          {error && (
            <div className="py-3 px-4 text-red-500 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}
        </div>
        <div className="mt-8 w-full">
          <button
            onClick={confirmSelection}
            disabled={!selectedCityId}
            className="flex items-center justify-center gap-2 bg-black text-white rounded-lg py-3.5 px-6 w-full font-medium transition-colors hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {t("buttons.select") || "Выбрать"}
          </button>
        </div>
      </div>
    </div>
  );
}
