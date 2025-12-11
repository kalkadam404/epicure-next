"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import type { Dish } from "@/services";
import { cn } from "@/lib/utils";

interface Props {
  img: string;
  title: string;
  restaurant: string;
  category: string;
  price: number;
  dishId: number;
  dish?: Dish;
}

export function DishCard({
  img,
  title,
  restaurant,
  category,
  price,
  dishId,
  dish,
}: Props) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id === dishId);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dish) {
      dispatch(toggleFavorite(dish));
    }
  };

  return (
    <div className="bg-white rounded-[30px] shadow-md overflow-hidden max-w-sm cursor-pointer flex flex-col h-full relative">
      <div className="relative">
        <Image
          src={img}
          alt="dish"
          width={400}
          height={240}
          className="w-full h-60 object-cover"
        />
        {dish && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "absolute top-3 right-3 rounded-full p-2 h-10 w-10 bg-white/90 hover:bg-white shadow-md transition-all",
              isFavorite && "bg-red-50 hover:bg-red-100"
            )}
            onClick={handleFavoriteClick}
            aria-label={
              isFavorite ? "Удалить из избранного" : "Добавить в избранное"
            }
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
              )}
            />
          </Button>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1 max-sm:text-xl">{title}</h2>
          <p className="text-lg font-mono max-sm:text-base">{restaurant}</p>
          <p className="text-gray-400 text-sm">{category}</p>
        </div>

        <div className="pt-4">
          <p className="text-2xl font-semibold max-sm:text-xl">{price} ₸</p>
        </div>
      </div>
    </div>
  );
}
