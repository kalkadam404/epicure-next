import Image from "next/image";
import Link from "next/link";
import logoW from "@/assets/logo_w.svg";

export function Footer() {
  return (
    <footer className="sticky top-0 z-50 w-full backdrop-blur bg-white/80 px-20 max-sm:px-4">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          <Image src={logoW} width={24} height={24} alt="logo" />
          <span className="text-xl font-semibold text-gray-800">Epicure</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-gray-700">
          <Link
            href="#"
            className="hover:text-black transition-all duration-200 text-sm font-medium"
          >
            Условия использования
          </Link>
          <Link
            href="#"
            className="hover:text-black transition-all duration-200 text-sm font-medium"
          >
            Политика конфиденциальности
          </Link>
          <Link
            href="#"
            className="hover:text-black transition-all duration-200 text-sm font-medium"
          >
            Контакты
          </Link>
        </nav>
        <div className="hover:text-black transition-all duration-200 text-[12px] font-medium text-gray-700">
          © 2025 Epicure. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
