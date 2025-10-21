"use client";

import { useTranslation } from "react-i18next";
import res from "@/assets/res.svg";
import fork from "@/assets/fork.svg";
import timeIcon from "@/assets/time.svg";
import Image from "next/image";
import { getImageUrl } from "@/lib/api";

interface RestaurantCardProps {
  img: string;
  ResName: string;
  city: string;
  menuType: string;
  openingTime: string;
  closingTime: string;
  rating: number;
}

export function RestaurantCard({
  img,
  ResName,
  city,
  menuType,
  openingTime,
  closingTime,
  rating,
}: RestaurantCardProps) {
  const { t } = useTranslation();

  const formattedOpeningTime = openingTime ? openingTime.slice(0, 5) : "";
  const formattedClosingTime = closingTime ? closingTime.slice(0, 5) : "";

  return (
    <div className="w-full h-full max-w-md bg-white rounded-3xl shadow-lg p-5 space-y-4">
      <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-gray-100">
        <Image
          src={getImageUrl(img)}
          alt={ResName || "Ресторан"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            e.currentTarget.src = '/images/placeholder.svg';
          }}
        />
      </div>

      <div className="flex flex-col gap-3 ">
        <h2 className="text-xl font-bold">{ResName}</h2>
        <div className="flex items-center gap-2 mt-1 text-gray-700">
          <Image src={res} alt="" width={25} height={24} />
          <span>{city}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-gray-700">
        <Image src={fork} alt="" width={25} height={24} />
        <span>{menuType}</span>
      </div>

      <div className="flex items-center gap-2 text-gray-700">
        <Image src={timeIcon} alt="" width={25} height={24} />
        <span>
          {formattedOpeningTime} - {formattedClosingTime}
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <span className="bg-gray-200 rounded-full px-3 py-1 text-sm">
          {t("selection.wifi")}
        </span>
        <span className="bg-gray-200 rounded-full px-3 py-1 text-sm">
          {t("selection.parking")}
        </span>
        <span className="bg-gray-200 rounded-full px-3 py-1 text-sm">
          {t("selection.delivery")}
        </span>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center gap-1 text-lg font-medium">
          <svg
            className="w-5 h-5 text-black"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455 1.287 3.966c.3.921-.755 1.688-1.54 1.118L10 13.011l-3.377 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.966-3.38-2.455c-.783-.57-.38-1.81.588-1.81h4.175l1.286-3.966z" />
          </svg>
          <span>{rating}</span>
        </div>
        <button className="border px-4 py-2 rounded-xl hover:bg-gray-100 transition font-medium">
          {t("buttons.booking")}
        </button>
      </div>
    </div>
  );
}
