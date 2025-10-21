"use client";

import { BonusAppPromo } from "@/components/BonusAppPromo";
import { OfferCard } from "@/components/OfferCard";
import { offerAPI } from "@/lib/api";
import type { Metadata } from "next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface OfferItem {
  description: string;
  description_ru: string;
  description_en: string;
  description_kz: string;
}

interface Offer {
  id: number;
  title: string;
  title_ru: string;
  title_en: string;
  title_kz: string;
  image: string;
  old_price: string;
  new_price: string;
  items: OfferItem[];
  badge?: string;
  people_count: number;
  per_person: boolean;
}

export default function OffersPage() {
  const { t, i18n } = useTranslation();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  function getLocalized(item: Offer, field: string) {
    const lang = (i18n?.language || "ru").toLowerCase();
    return (item as any)[`${field}_${lang}`] || (item as any)[`${field}_ru`];
  }

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await offerAPI.getOffers();
      setOffers(response.data.results || []);
      console.log("fetched offers", response.data.results);
    } catch (err) {
      console.log("Error fetching offers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!email) return;
    
    try {
      console.log("Subscribe email:", email);
      setEmail("");
    } catch (err) {
      console.log("Error subscribing:", err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Загружаем предложения...</p>
        </div>
      </div>
    );
  }

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
          {offers.map((offer, index) => (
            <OfferCard
              key={offer.id}
              title={getLocalized(offer, "title")}
              image={offer.image}
              oldPrice={Number(offer.old_price)}
              newPrice={Number(offer.new_price)}
              description={offer.items}
              badge={offer.badge}
              peopleCount={offer.people_count}
              perPerson={offer.per_person}
              dataAos={index % 2 === 0 ? "fade-up" : "fade-down"}
              offer={offer}
              onClick={(selectedOffer) => {
                console.log("Offer clicked:", selectedOffer);
              }}
            />
          ))}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubscribe()}
              className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={handleSubscribe}
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              disabled={!email}
            >
              {t("buttons.subscribe")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
