import { useState } from "react";
import { useTranslation } from "react-i18next";

interface CityProps {
  id: number;
}

export function CityModal({ id }: CityProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [cities, setCities] = useState([]);
  const { t } = useTranslation();
  return (
    <div className="relative bg-white w-[550px] shadow-xl flex flex-col items-start rounded-lg py-9 px-10 m-auto">
      <img
        src="../assets/close.svg"
        className="absolute top-4 right-4 w-8 h-8 cursor-pointer hover:opacity-70 transition-opacity"
        alt="Close"
        //   @click="emit('closeCityModal')"
      />
      <div className="mb-6">
        <div className="text-2xl font-bold text-gray-800">
          {t("buttons.select_city")}
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full border-t border-gray-200 pt-6">
        {cities.map((city) => (
          <div
            key={city.id}
            // @click="selectCity(city)"
            className={`flex items-center gap-4 rounded-lg border py-4 px-5 cursor-pointer transition-all duration-200 hover:bg-gray-50  ${
              selectedCityId === city.id
                ? "border-black border-2 bg-gray-100"
                : "border-gray-300"
            }`}
          >
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              <svg
                v-if="selectedCityId === city.id"
                className="w-5 h-5 text-black"
                viewBox="0 0 20 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div
              className={`font-medium ${
                selectedCityId === city.id ? "text-black" : "text-gray-700"
              }`}
            >
              {city.name}
            </div>
          </div>
        ))}

        <div
          v-if="isLoading"
          className="py-4 px-5 text-center text-gray-500 italic"
        >
          {t("loading") || "Загрузка..."}
        </div>

        <div
          v-if="error"
          className="py-3 px-4 text-red-500 bg-red-50 rounded-lg border border-red-200"
        >
          {error}
        </div>
      </div>

      <div className="mt-8 w-full">
        <button
          // @click="confirmSelection"
          className="flex items-center justify-center gap-2 bg-black text-white rounded-lg py-3.5 px-6 w-full font-medium transition-colors hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={isLoading || selectedCityId === null}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          {t("buttons.select")}
        </button>
      </div>
    </div>
  );
}
