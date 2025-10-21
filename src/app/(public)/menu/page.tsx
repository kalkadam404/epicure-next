"use client";
import { BonusAppPromo } from "@/components/BonusAppPromo";
import type { Metadata } from "next";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useState } from "react";

// export const metadata: Metadata = {
//   title: "Epicure-home",
//   description: "",
// };

export default function MenuPage() {
  const { t } = useTranslation();
  const [dishList, setDishList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sectionRefs, setSectionRefs] = useState([]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `localhost:8000/api/v1/products/menu-types/`
      );
      setCategories(data.results);
      console.log("categories", data);
    } catch (err) {
      console.log("err", err);
    }
  };
  const fetchDishes = async () => {
    try {
      const { data } = await axios.get(
        `localhost:8000/api/v1/products/menu-items/`
      );
      console.log("dishes", data);
      setDishList(data.results);
      // console.log(dishList.value);
    } catch (err) {
      console.log("err", err);
    }
  };

  // const groupedDishes = computed(() => {
  //   const grouped = {};
  //   for (const dish of dishList.value) {
  //     const typeId = dish.menu_type_details.id;
  //     if (!grouped[typeId]) {
  //       grouped[typeId] = [];
  //     }
  //     grouped[typeId].push(dish);
  //   }
  //   return grouped;
  // });

  // const scrollToSection = (index) => {
  //   setSectionRefs(index)?.scrollIntoView({
  //     behavior: "smooth",
  //     block: "start",
  //   });
  // };

  return (
    <div className="pt-20">
      <div className="flex gap-8 px-20">
        <div className="w-1/4 h-fit sticky top-30">
          <ul className="space-y-4">
            {/* <li
            v-for="(cat, idx) in categories"
            :key="cat"
            @click="scrollToSection(idx)"
            :className="[
              'cursor-pointer text-lg font-medium',
              activeIndex === idx
                ? 'text-black font-semibold '
                : 'text-gray-500',
            ]"
          >
            { cat.name }
          </li> */}
          </ul>
        </div>

        <div className="w-3/4 space-y-16">
          {/* <div
          v-for="(cat, idx) in categories"
          :key="cat"
          :ref="(el) => (sectionRefs[idx] = el)"
          className="space-y-4 scroll-mt-[110px]"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-5">{ cat.name }</h2>
          <div className="grid grid-cols-3 gap-3">
            <MenuItem
              v-for="(dish, index) in groupedDishes[cat.id]"
              :key="dish.id"
              :img="dish.image"
              :title="getLocalized(dish, 'name')"
              :category="dish.menu_type_details.name"
              :price="dish.price"
              @click="openDishModal(dish)"
            />
          </div>
        </div> */}
        </div>
      </div>
      <div className="px-20 mb-10">
        <BonusAppPromo />
      </div>
    </div>
  );
}
