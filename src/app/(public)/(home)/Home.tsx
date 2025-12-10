"use client";

import { BonusAppPromo } from "@/components/BonusAppPromo";
import SliderComponent from "@/components/SliderComponent";
import { SearchComponent } from "@/components/SearchComponent";
import banner1 from "@/assets/banner1.png";
import banner2 from "@/assets/banner2.png";
import banner3 from "@/assets/banner3.png";
import { RestaurantList } from "@/components/RestaurantList";
import { DishList } from "@/components/DishList";
import { DishInfo } from "@/components/DishInfo";
import { useState } from "react";

export default function Home() {
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDishClick = (dish: any) => {
    setSelectedDish(dish);
    setIsDishModalOpen(true);
  };

  const closeDishModal = () => {
    setIsDishModalOpen(false);
    setSelectedDish(null);
  };

  const handleSearch = (query: string) => {
    console.log("Home: handleSearch called with:", query);
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex  flex-col px-20 mb-20 w-full max-sm:px-4">
      <div className="-mx-4">
        <SliderComponent
          imageSrc={[banner1, banner2, banner3, banner2, banner3]}
          title="Потрясающее предложение"
          description="Откройте для себя наши новые продукты и специальные предложения"
        />
      </div>

      {/* Search Section */}
      <div className="my-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Найдите идеальный ресторан
          </h2>
          <SearchComponent
            showRestaurants={true}
            showDishes={false}
            className="w-full"
            autoSearch={false}
            showSearchButton={true}
            initialQuery={searchQuery}
            onSearchResults={handleSearch}
            onClear={handleClearSearch}
          />
        </div>
      </div>

      <RestaurantList searchQuery={searchQuery} />
      <DishList onDishClick={handleDishClick} />
      <div className="mt-20 max-sm:mt-10">
        <BonusAppPromo />
      </div>

      {isDishModalOpen && selectedDish && (
        <DishInfo
          selectedDish={selectedDish}
          isOpen={isDishModalOpen}
          onClose={closeDishModal}
        />
      )}
    </div>
  );
}
