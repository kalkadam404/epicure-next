"use client";

import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { DishCard } from "@/components/DishCard";
import { ImageService } from "@/services";
import { Heart, ChefHat } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const favorites = useAppSelector((state) => state.favorites.items);

  function getLocalized(item: any, field: string) {
    const lang = (i18n?.language || "ru").toLowerCase();
    return item[`${field}_${lang}`] || item[`${field}_ru`] || item[field] || "";
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-4xl font-bold max-sm:text-2xl">
              {t("favorites.title") || "Избранное"}
            </h1>
          </div>

          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6">
              <div className="rounded-full bg-red-50 p-6 mb-6">
                <Heart className="h-16 w-16 text-red-200" />
              </div>
              <CardTitle className="text-2xl mb-2 text-center">
                {t("favorites.empty") || "Ваш список избранного пуст"}
              </CardTitle>
              <CardDescription className="text-lg mb-8 text-center max-w-md">
                {t("favorites.description") ||
                  "Начните добавлять блюда в избранное, нажимая на иконку сердца на карточках блюд"}
              </CardDescription>
              <Button
                onClick={() => router.push("/menu")}
                className="gap-2"
                size="lg"
              >
                <ChefHat className="h-5 w-5" />
                {t("favorites.browse") || "Перейти к меню"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            <div>
              <h1 className="text-4xl font-bold max-sm:text-2xl">
                {t("favorites.title") || "Избранное"}
              </h1>
              <p className="text-gray-500 mt-1">
                {favorites.length}{" "}
                {favorites.length === 1
                  ? t("favorites.item") || "блюдо"
                  : favorites.length < 5
                  ? t("favorites.items_2_4") || "блюда"
                  : t("favorites.items") || "блюд"}
              </p>
            </div>
          </div>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((dish) => (
            <DishCard
              key={dish.id}
              img={ImageService.getImageUrl(dish.image_url || dish.image || "")}
              title={getLocalized(dish, "name")}
              restaurant={dish.restaurant_details?.name || ""}
              category={dish.menu_type_details?.name || ""}
              price={dish.price}
              dishId={dish.id}
              dish={dish}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
