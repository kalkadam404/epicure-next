"use client";

import { BonusAppPromo } from "@/components/BonusAppPromo";
import SliderComponent from "@/components/SliderComponent";
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

  const handleDishClick = (dish: any) => {
    setSelectedDish(dish);
    setIsDishModalOpen(true);
  };

  const closeDishModal = () => {
    setIsDishModalOpen(false);
    setSelectedDish(null);
  };

  return (
    <div className="flex  flex-col px-20 mb-20 w-full max-sm:px-4">
      <SliderComponent
        height="21/9"
        imageSrc={[banner1, banner2, banner3, banner2, banner3]}
        title="Потрясающее предложение"
        description="Откройте для себя наши новые продукты и специальные предложения"
      />
      <RestaurantList />
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
