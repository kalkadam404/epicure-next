import React, { useState, useEffect, useMemo } from "react";
import {
  restaurantService,
  cityService,
  menuService,
  ImageService,
  type City,
  type Restaurant,
  type Dish,
} from "@/services";
import { bookingAPI } from "@/lib/api";

interface CalendarDay {
  number: number;
  date: Date;
  isToday?: boolean;
  disabled?: boolean;
}

interface BookingModalProps {
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<number>(1);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedTime, setSelectedTime] = useState<string>("12:00");
  const [guestCount, setGuestCount] = useState<number>(1);
  const [selectedDishes, setSelectedDishes] = useState<Dish[]>([]);

  // API Data
  const [cities, setCities] = useState<City[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const availableTimes: string[] = [
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
  ];

  const stepTitles: string[] = [
    "Выбор ресторана",
    "Выбор даты",
    "Выбор времени и количества гостей",
    "Выбор блюд",
    "Подтверждение бронирования",
  ];

  const weekDays: string[] = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const monthNames: string[] = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const cities = await cityService.getCities();
        setCities(cities);
        if (cities.length > 0) {
          setSelectedCity(cities[0]);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
        setError("Не удалось загрузить города");
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  // Fetch restaurants when city changes
  useEffect(() => {
    if (!selectedCity) return;

    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await restaurantService.getRestaurants(selectedCity.id);
        setRestaurants((data as any).results || data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Не удалось загрузить рестораны");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [selectedCity]);

  // Fetch menu items when restaurant is selected and user reaches step 4
  useEffect(() => {
    if (!selectedRestaurant || step !== 4) return;

    const fetchMenu = async () => {
      try {
        const fallbackData = await menuService.getMenuItems();
        setDishes((fallbackData as any).results || fallbackData);
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError("Не удалось загрузить меню");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [selectedRestaurant, step]);

  const filteredRestaurants = useMemo(() => {
    if (!selectedCity) return restaurants;
    return restaurants.filter((r) => {
      const cityId = typeof r.city === "object" ? r.city?.id : r.city;
      return cityId === selectedCity.id;
    });
  }, [restaurants, selectedCity]);

  const calendarDays = useMemo((): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const firstDay = new Date(currentYear, currentMonth, 1);
    let firstDayOfWeek = firstDay.getDay() || 7;
    firstDayOfWeek = firstDayOfWeek === 0 ? 7 : firstDayOfWeek;

    const lastDayPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    for (let i = firstDayOfWeek - 1; i > 0; i--) {
      const day = lastDayPrevMonth - i + 1;
      days.push({
        number: day,
        date: new Date(currentYear, currentMonth - 1, day),
        disabled: true,
      });
    }

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isToday = date.getTime() === today.getTime();
      const disabled = date < today;

      days.push({ number: i, date, isToday, disabled });
    }

    const nextMonthDays = 42 - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        number: i,
        date: new Date(currentYear, currentMonth + 1, i),
        disabled: true,
      });
    }

    return days;
  }, [currentMonth, currentYear]);

  const isSelectedDate = (date: Date): boolean => {
    if (!selectedDate || !date) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const totalPrice = useMemo(() => {
    return selectedDishes.reduce(
      (sum, dish) => sum + Number(dish.price || 0),
      0
    );
  }, [selectedDishes]);

  const formatDate = (date: Date): string => {
    if (!date) return "";
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("ru-RU", options);
  };

  const getGuestWord = (count: number): string => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    if (lastDigit === 1 && lastTwoDigits !== 11) return "гость";
    if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits))
      return "гостя";
    return "гостей";
  };

  const toggleDish = (dish: Dish) => {
    setSelectedDishes((prev) => {
      const index = prev.findIndex((d) => d.id === dish.id);
      if (index === -1) return [...prev, dish];
      return prev.filter((_, i) => i !== index);
    });
  };

  const getLocalized = (item: any, field: string): string => {
    if (!item) return "";
    return item[`${field}_ru`] || item[field] || "";
  };

  const handleCreateReservation = async () => {
    try {
      setLoading(true);

      const formattedDate = selectedDate.toISOString().split("T")[0];
      const [hours, minutes] = selectedTime.split(":");
      const endHours = (parseInt(hours) + 1).toString().padStart(2, "0");
      const endTime = `${endHours}:${minutes}:00`;

      const bookingData = {
        restaurant: selectedRestaurant!.id,
        reservation_date: formattedDate,
        start_time: `${selectedTime}:00`,
        end_time: endTime,
        guest_count: guestCount,
        menu_items: selectedDishes.map((dish) => ({
          menu_item: dish.id,
          quantity: 1,
        })),
      };

      const response = await bookingAPI.createBooking(bookingData);
      console.log("Booking created:", response.data);

      alert("Бронирование успешно создано! ID: " + response.data.id);
      onClose();
    } catch (err) {
      console.error("Error creating booking:", err);
      setError("Не удалось создать бронирование. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 1) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">Бронирование</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <React.Fragment key={i}>
                <div
                  className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium ${
                    step >= i ? "bg-black text-white" : "bg-gray-200"
                  }`}
                >
                  {i}
                </div>
                {i < 5 && (
                  <div
                    className={`h-1 w-12 mx-1 ${
                      step > i ? "bg-black" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <h3 className="text-lg font-medium text-gray-600">
            {stepTitles[step - 1]}
          </h3>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Step 1: Restaurant Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Выберите город</label>
              <select
                value={selectedCity?.id || ""}
                onChange={(e) => {
                  const city = cities.find(
                    (c) => c.id === parseInt(e.target.value)
                  );
                  setSelectedCity(city || null);
                  setSelectedRestaurant(null);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="block mb-2 font-medium">
                Выберите ресторан
              </label>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                </div>
              ) : filteredRestaurants.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Нет доступных ресторанов
                </p>
              ) : (
                filteredRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className={`flex items-center border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedRestaurant?.id === restaurant.id
                        ? "border-black bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedRestaurant(restaurant)}
                  >
                    <div className="w-20 h-20 mr-4 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                      <img
                        src={restaurant.photo}
                        alt={getLocalized(restaurant, "name")}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=300&fit=crop";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">
                        {getLocalized(restaurant, "name")}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {restaurant.address}
                      </p>
                      <div className="flex items-center mt-1">
                        {restaurant.rating && (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-yellow-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm">
                              {restaurant.rating}
                            </span>
                            <span className="mx-2 text-gray-300">•</span>
                          </>
                        )}
                        <span className="text-sm text-gray-500">
                          {getLocalized(restaurant, "description")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                Отмена
              </button>
              <button
                disabled={!selectedRestaurant}
                onClick={() => setStep(2)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedRestaurant
                    ? "bg-gray-900 text-white hover:bg-gray-950"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Далее
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Выберите дату</label>
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={() => {
                      if (currentMonth === 0) {
                        setCurrentMonth(11);
                        setCurrentYear(currentYear - 1);
                      } else {
                        setCurrentMonth(currentMonth - 1);
                      }
                    }}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <div className="font-medium">
                    {monthNames[currentMonth]} {currentYear}
                  </div>
                  <button
                    onClick={() => {
                      if (currentMonth === 11) {
                        setCurrentMonth(0);
                        setCurrentYear(currentYear + 1);
                      } else {
                        setCurrentMonth(currentMonth + 1);
                      }
                    }}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-1">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-500"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`aspect-square flex items-center justify-center rounded-full text-sm cursor-pointer
                        ${
                          day.disabled ? "text-gray-300 cursor-not-allowed" : ""
                        }
                        ${
                          isSelectedDate(day.date)
                            ? "bg-black text-white"
                            : day.isToday
                            ? "border border-black"
                            : "hover:bg-gray-100"
                        }`}
                      onClick={() => !day.disabled && setSelectedDate(day.date)}
                    >
                      {day.number}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setStep(1)}
                className="text-gray-500 hover:text-gray-700"
              >
                Назад
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-lg font-medium bg-gray-900 text-white hover:bg-gray-950"
              >
                Далее
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Time and Guests */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Выберите время</label>
              <div className="grid grid-cols-4 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    className={`py-2 px-3 border rounded text-sm font-medium ${
                      selectedTime === time
                        ? "bg-black text-white border-black"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Количество гостей
              </label>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    guestCount > 1 && setGuestCount(guestCount - 1)
                  }
                  disabled={guestCount <= 1}
                  className={`p-3 ${
                    guestCount <= 1
                      ? "text-gray-300"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <div className="flex-1 text-center text-lg font-medium">
                  {guestCount}
                </div>
                <button
                  onClick={() =>
                    guestCount < 10 && setGuestCount(guestCount + 1)
                  }
                  disabled={guestCount >= 10}
                  className={`p-3 ${
                    guestCount >= 10
                      ? "text-gray-300"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Максимум 10 гостей</p>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setStep(2)}
                className="text-gray-500 hover:text-gray-700"
              >
                Назад
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-4 py-2 rounded-lg font-medium bg-gray-900 text-white hover:bg-gray-950"
              >
                Далее
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Dishes Selection */}
        {step === 4 && (
          <div className="space-y-4">
            <label className="block mb-2 font-medium text-lg">
              Выберите блюда
            </label>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {dishes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Нет доступных блюд
                  </p>
                ) : (
                  dishes.map((dish) => (
                    <div
                      key={dish.id}
                      className={`flex justify-between items-center border rounded-lg p-4 transition-colors ${
                        selectedDishes.some((d) => d.id === dish.id)
                          ? "border-black bg-gray-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                          <img
                            src={ImageService.getImageUrl(
                              dish.image_url || dish.image || ""
                            )}
                            alt={getLocalized(dish, "name")}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">
                            {getLocalized(dish, "name")}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {getLocalized(dish, "description") ||
                              "Нет описания"}
                          </p>
                          <div className="text-lg font-medium text-gray-800 mt-2">
                            {dish.price || 0} ₸
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleDish(dish)}
                        className={`ml-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedDishes.some((d) => d.id === dish.id)
                            ? "bg-black text-white hover:bg-gray-900"
                            : "border border-black text-black hover:bg-gray-100"
                        }`}
                      >
                        {selectedDishes.some((d) => d.id === dish.id)
                          ? "Удалить"
                          : "Добавить"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setStep(3)}
                className="text-gray-500 hover:text-gray-700"
              >
                Назад
              </button>
              <button
                disabled={selectedDishes.length === 0}
                onClick={() => setStep(5)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedDishes.length > 0
                    ? "bg-black text-white hover:bg-gray-900"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Далее
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                Детали бронирования
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="min-w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Ресторан</div>
                    <div className="text-gray-600">
                      {getLocalized(selectedRestaurant, "name") || "—"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getLocalized(selectedRestaurant?.city, "name") || "—"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="min-w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Дата и время</div>
                    <div className="text-gray-600">
                      {formatDate(selectedDate)} {selectedTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="min-w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Количество гостей</div>
                    <div className="text-gray-600">
                      {guestCount} {getGuestWord(guestCount)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="min-w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Выбранные блюда</div>
                    <ul className="text-gray-600 mt-1">
                      {selectedDishes.map((dish) => (
                        <li key={dish.id} className="flex items-center">
                          <span className="mr-2">•</span>
                          {getLocalized(dish, "name")}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Предварительная сумма</span>
                <span className="font-medium">{totalPrice} ₸</span>
              </div>
              <p className="text-sm text-gray-500">
                Полная стоимость будет рассчитана в ресторане
              </p>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setStep(4)}
                className="text-gray-500 hover:text-gray-700"
              >
                Назад
              </button>
              <button
                onClick={handleCreateReservation}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Создание...
                  </>
                ) : (
                  "Перейти к оплате"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
