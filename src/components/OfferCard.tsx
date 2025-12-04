"use client";

import { useTranslation } from "react-i18next";
import { ImageService } from "@/services";
import Image from "next/image";

interface OfferItem {
  description: string;
  description_ru: string;
  description_en: string;
  description_kz: string;
}

interface Props {
  title: string;
  image: string;
  oldPrice?: number;
  newPrice: number;
  description: OfferItem[];
  badge?: string;
  peopleCount?: number;
  perPerson?: boolean;
  dataAos?: string;
  restaurant?: string;
  offer?: any;
  onClick?: (offer?: any) => void;
}

export function OfferCard({
  title,
  image,
  oldPrice,
  newPrice,
  description,
  badge,
  peopleCount = 1,
  perPerson = false,
  dataAos = "fade-up",
  restaurant,
  offer,
  onClick,
}: Props) {
  const { t, i18n } = useTranslation();

  function getLocalized(item: OfferItem, field: string) {
    const lang = (i18n?.language || "ru").toLowerCase();
    return item[`${field}_${lang}` as keyof OfferItem] || item[`${field}_ru` as keyof OfferItem];
  }

  function pluralize(count: number) {
    if (count === 1) return "персону";
    if ([2, 3, 4].includes(count)) return "персоны";
    return "персон";
  }

  const handleClick = () => {
    if (onClick) {
      onClick(offer);
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      data-aos={dataAos}
      onClick={handleClick}
    >
      <div className="relative">
        <Image
          src={image}
          alt={title}
          width={400}
          height={224}
          className="w-full h-56 object-cover"
        />
        {badge && (
          <div className="absolute top-4 right-4 bg-black text-white text-sm font-medium px-3 py-1 rounded-full">
            {badge}
          </div>
        )}
      </div>

      <div className="p-6">
        {restaurant && (
          <div className="text-sm text-gray-500 mb-2">
            {restaurant}
          </div>
        )}
        <h3 className="text-xl font-bold mb-4">{title}</h3>

        <div className="flex items-center space-x-2 mb-4">
          {oldPrice && oldPrice > newPrice && (
            <span className="text-gray-500 line-through">
              {oldPrice} ₸
            </span>
          )}
          <span className="text-black font-bold text-xl">{newPrice} ₸</span>
          <span className="text-gray-700 text-sm">
            /
            {perPerson
              ? "на персону"
              : `на ${peopleCount} ${pluralize(peopleCount)}`}
          </span>
        </div>

        <ul className="space-y-2 mb-6">
          {description.map((item, index) => (
            <li key={index} className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-700">
                {getLocalized(item, "description")}
              </span>
            </li>
          ))}
        </ul>

        <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
          {t("buttons.book_table")}
        </button>
      </div>
    </div>
  );
}
