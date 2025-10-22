import type { Metadata } from "next";
import Home from "./Home";

export const metadata: Metadata = {
  title: "Epicure 2025",
  description: "",
};

export default function HomePage() {
  return <Home />;
}
