import type { Metadata } from "next";
import Home from "./Home";

export const metadata: Metadata = {
  title: "Epicure 2025 — Бронирование ресторанов",
  description:
    "Идеальный способ забронировать столик в лучших ресторанах вашего города. Простое бронирование, удобный интерфейс и мгновенные подтверждения.",
};

export default function HomePage() {
  return <Home />;
}
