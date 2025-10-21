"use client";

import { BonusAppPromo } from "@/components/BonusAppPromo";
import { OfferCard } from "@/components/OfferCard";
import axios from "axios";
import type { Metadata } from "next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// export const metadata: Metadata = {
//   title: "Epicure-home",
//   description: "",
// };

export default function OffersPage() {
  const { t } = useTranslation();
  const [offers, setOffers] = useState([]);
  const tokenJWT = localStorage.getItem("token");

  const fetchOffers = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/offers/offers/`,
        {
          headers: {
            Authorization: `Bearer ${tokenJWT}`,
          },
        }
      );
      setOffers(data.results);
      console.log("fetched offers", offers);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
          {t("offers_section.title")}
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          {t("offers_section.description")}
        </p>
        <div className="w-20 h-1 bg-black mx-auto mt-6"></div>
      </div>

      <div className="px-20 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* {offers.map((offer, index) => (
            <OfferCard
              key={index}
              title={offer.title}
              image={offer.image}
              oldPrice={offer.old_price}
              newPrice={offer.new_price}
              description={offer.items}
              badge={offer.badge}
              peopleCount={offer.people_count}
              perPerson={offer.per_person}
            />
          ))} */}
        </div>
      </div>

      <div className="px-20 mb-5">
        <BonusAppPromo />
      </div>

      <div className="mx-auto mt-16 px-20">
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-black mb-4">
            {t("offers_section.for_subscribers")}
          </h3>
          <p className="text-gray-700 mb-6">
            {t("offers_section.for_subscribers_description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t("inputs.your_email")}
              className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              {t("buttons.subscribe")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
