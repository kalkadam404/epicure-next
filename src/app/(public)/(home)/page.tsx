"use client";

import { BonusAppPromo } from "@/components/BonusAppPromo";
import SliderComponent from "@/components/SliderComponent";
import type { Metadata } from "next";
import banner1 from "@/assets/banner1.png";
import banner2 from "@/assets/banner2.png";
import banner3 from "@/assets/banner3.png";
import { RestaurantList } from "@/components/RestaurantList";

// export const metadata: Metadata = {
//   title: "Epicure-home",
//   description: "",
// };

export default function HomePage() {
  return (
    <div className="flex  flex-col px-20 mb-20 w-full">
      <SliderComponent
        height="21/9"
        imageSrc={[banner1, banner2, banner3, banner2, banner3]}
        title="Потрясающее предложение"
        description="Откройте для себя наши новые продукты и специальные предложения"
      />
      <RestaurantList />
      {/* <DishList /> */}
      <BonusAppPromo />
    </div>
  );
}
