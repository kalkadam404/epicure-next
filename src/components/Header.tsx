import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo_w.svg";
import { useState } from "react";
import { SideBar } from "./SideBar";

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <header className="fixed top-0 z-50 w-full shadow-sm bg-white/95 backdrop-blur-md">
        <div className="container mx-auto px-6 py-3 max-sm:px-4">
          <div className="flex items-center justify-between max-sm:flex-row-reverse">
            <Link
              href={"/"}
              className="flex items-center gap-3 group max-sm:flex-row-reverse"
            >
              <Image
                src={logo}
                className="w-14 h-14 group-hover:scale-105 transition-transform max-sm:w-12 max-sm:h-12"
                alt="logo"
              />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-black">
                Epicure
              </span>
            </Link>
            <Image
              src="/burger_menu.svg"
              alt="menu"
              width={40}
              height={40}
              onClick={() => setIsSidebarOpen(true)}
              className="sm:hidden block"
            />
            <nav className="hidden md:flex items-center gap-10 text-gray-700">
              <Link
                href={"/menu"}
                className="nav-link relative font-medium text-lg hover:text-black transition-all"
              >
                Меню
              </Link>
              <div className="nav-link relative font-medium text-lg hover:text-black transition-all cursor-pointer">
                Бронирование
              </div>
              <Link
                href={"/offers"}
                className="nav-link relative font-medium text-lg hover:text-black transition-all"
              >
                Пакеты
              </Link>
              <Link
                href={"/about"}
                className="nav-link relative font-medium text-lg hover:text-black transition-all"
              >
                О нас
              </Link>
            </nav>
            <div className="flex items-center gap-5 max-sm:hidden">
              <div className="relative mr-2 ">
                {/* <button
              @click="toggleLanguageMenu"
              class="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 hover:bg-gray-100 transition-all text-gray-700"
            >
              <span class="font-medium">{{
                currentLanguage.toUpperCase()
              }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-gray-500 transition-transform"
                :class="{ 'rotate-180': isLanguageMenuOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button> */}
              </div>

              <button className="text-gray-800 hover:text-black text-base font-medium max-sm:hidden">
                Регистрация
              </button>
              <button className="bg-black text-white font-medium rounded-full px-6 py-2 max-sm:hidden">
                Вход
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
