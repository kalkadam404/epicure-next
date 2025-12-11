"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import searchIcon from "@/assets/search_icon.svg";
import closeIcon from "@/assets/close.svg";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchComponentProps {
  showRestaurants?: boolean;
  showDishes?: boolean;
  className?: string;
  onSearchResults?: (query: string) => void;
  onClear?: () => void;
  initialQuery?: string;
  autoSearch?: boolean;
  showSearchButton?: boolean;
}

export function SearchComponent({
  showRestaurants = true,
  showDishes = true,
  className = "",
  onSearchResults,
  onClear,
  initialQuery,
  autoSearch = true,
  showSearchButton = false,
}: SearchComponentProps) {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(initialQuery || "");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mounted, setMounted] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 300);
  const lastEmittedQueryRef = useRef<string | undefined>(undefined);

  // Синхронизируем значение инпута с внешним значением (например, из Redux),
  // чтобы при возврате на страницу в поле оставалось последнее слово поиска.
  useEffect(() => {
    if (initialQuery !== undefined && initialQuery !== searchQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setShowResults(false);
        if (onClear) onClear();
        return;
      }

      setIsSearching(true);
      setShowResults(true);

      try {
        const results = await performSearch(query);
        setSearchResults(results);
        if (onSearchResults) onSearchResults(query);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [onSearchResults, onClear]
  );

  const performSearch = async (query: string) => {
    return [];
  };

  useEffect(() => {
    if (!autoSearch) return;
    if (debouncedQuery === undefined) return;

    const trimmed = debouncedQuery.trim();

    // Первый рендер с пустой строкой — не дергаем поиск вообще,
    // меню уже подгружается отдельно
    if (!trimmed && lastEmittedQueryRef.current === undefined) {
      lastEmittedQueryRef.current = debouncedQuery;
      return;
    }

    // distinctUntilChanged: не вызывать поиск, если значение не изменилось
    if (lastEmittedQueryRef.current === debouncedQuery) {
      return;
    }

    lastEmittedQueryRef.current = debouncedQuery;

    console.log(
      "SearchComponent: calling onSearchResults with:",
      debouncedQuery
    );

    if (onSearchResults) {
      onSearchResults(debouncedQuery);
    } else {
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearchResults, handleSearch, autoSearch]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
    },
    []
  );

  const handleClear = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    if (onClear) onClear();
    if (onSearchResults) onSearchResults("");
  }, [onClear, onSearchResults]);

  // Ручной запуск поиска (по кнопке или Enter в режиме manual)
  const triggerSearch = useCallback(() => {
    const query = searchQuery.trim();

    if (!query) {
      // Пустой запрос — просто очищаем
      if (onClear) onClear();
      if (onSearchResults) onSearchResults("");
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    console.log("SearchComponent manual search:", query);

    if (onSearchResults) {
      onSearchResults(query);
    } else {
      void handleSearch(query);
    }
  }, [searchQuery, onSearchResults, onClear, handleSearch]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;

      if (!autoSearch) {
        // Ручной режим — ищем только по Enter/кнопке
        triggerSearch();
      } else if (!onSearchResults) {
        // Старый режим без внешнего обработчика — ищем по Enter сразу
        void handleSearch(searchQuery);
      }
    },
    [autoSearch, triggerSearch, handleSearch, searchQuery, onSearchResults]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Текст кнопки поиска с fallback, если перевод не задан
  const searchLabel = t("search.button");
  const searchButtonText =
    !searchLabel || searchLabel === "search.button" ? "Найти" : searchLabel;

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Image
              src={searchIcon}
              alt="Search"
              width={20}
              height={20}
              className="text-gray-400"
            />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={
              showDishes && showRestaurants
                ? t("search.placeholder.both") || "Поиск ресторанов и блюд..."
                : showDishes
                ? t("search.placeholder.dishes") || "Поиск блюд..."
                : t("search.placeholder.restaurants") || "Поиск ресторанов..."
            }
            className="w-full pl-12 pr-12 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent transition-all"
          />

          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-2xl transition-colors"
            >
              <Image
                src={closeIcon}
                alt="Clear"
                width={20}
                height={20}
                className="text-gray-400 hover:text-gray-600"
              />
            </button>
          )}
        </div>

        {showSearchButton && (
          <button
            type="button"
            onClick={triggerSearch}
            className="px-5 py-4 rounded-2xl border border-gray-300 bg-white text-gray-800 text-base font-medium hover:bg-gray-50 transition-colors max-sm:px-3"
          >
            {searchButtonText}
          </button>
        )}
      </div>

      {/* Результаты поиска */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center">
              <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">
                {t("search.searching") || "Поиск..."}
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Image
                        src={searchIcon}
                        alt="Result"
                        width={16}
                        height={16}
                        className="text-gray-400"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{result.name}</p>
                      <p className="text-sm text-gray-500">{result.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            searchQuery && (
              <div className="p-4 text-center text-gray-500">
                <p>{t("search.no_results") || "Ничего не найдено"}</p>
                <p className="text-sm mt-1">
                  {t("search.try_different") || "Попробуйте другой запрос"}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
