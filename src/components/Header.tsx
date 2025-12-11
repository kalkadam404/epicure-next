import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo_w.svg";
import { useEffect, useRef, useState } from "react";
import { SideBar } from "./SideBar";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import { Login } from "./Login";
import { Register } from "./Register";
import BookingModal from "./BookModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutThunk } from "@/store/slices/authSlice";
import {
  resetMergedFromLocal,
  syncFavoritesOnLogin,
} from "@/store/slices/favoritesSlice";
import { saveUserFavorites } from "@/services/favoritesService";

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const { i18n, t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const favorites = useAppSelector((state) => state.favorites.items);
  const mergedFromLocal = useAppSelector(
    (state) => state.favorites.mergedFromLocal
  );
  const locales = [
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
    { code: "kz", name: "Қазақша" },
  ];
  const isActive = (path: string) => pathname === path;
  const currentLanguage = i18n.language || "ru";
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  const menuRef = useRef<HTMLDivElement>(null);
  const lastSyncedUserIdRef = useRef<string | null>(null);
  const mergeNotificationShownRef = useRef<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // При входе пользователя мержим локальные избранные с теми, что в Firestore
  useEffect(() => {
    if (!user?.uid) {
      lastSyncedUserIdRef.current = null;
      return;
    }

    if (lastSyncedUserIdRef.current === user.uid) {
      return;
    }

    lastSyncedUserIdRef.current = user.uid;
    dispatch(syncFavoritesOnLogin(user.uid));
  }, [user, dispatch]);

  // При изменении избранного и наличии авторизованного пользователя
  // сохраняем актуальный список в Firestore
  useEffect(() => {
    if (!user?.uid) return;

    const run = async () => {
      try {
        await saveUserFavorites(user.uid, favorites);
      } catch (e) {
        // Молча игнорируем ошибку, локальное состояние и так актуально
        console.error("Error auto-saving favorites to Firestore:", e);
      }
    };

    void run();
  }, [favorites, user?.uid]);

  // Показываем нативное уведомление браузера один раз,
  // когда пользователь залогинен (и уже дал разрешение на уведомления).
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!user?.uid) {
      mergeNotificationShownRef.current = false;
      return;
    }

    if (mergeNotificationShownRef.current) return;

    if (!("Notification" in window)) return;

    const showNotification = () => {
      try {
        new Notification("Epicure", {
          body: "Your local favorites were merged with your account.",
        });
        mergeNotificationShownRef.current = true;
      } catch {
        // Игнорируем ошибки, если браузер запретил создание уведомления
      }
    };

    if (Notification.permission === "granted") {
      showNotification();
    } else if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          showNotification();
        }
      });
    }
  }, [user?.uid, favorites.length]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };
  return (
    <>
      {isBookModalOpen && (
        <BookingModal onClose={() => setIsBookModalOpen(false)} />
      )}
      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={switchToRegister}
      />
      <Register
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={switchToLogin}
      />
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {/* Глобальный toast-баннер о мердже избранного */}
      {mergedFromLocal && (
        <div className="fixed bottom-4 right-4 z-40 max-w-sm rounded-xl bg-gray-900 text-white shadow-lg px-4 py-3 flex items-start gap-3 animate-slide-up">
          <div className="mt-0.5 text-sm leading-snug flex-1">
            {t("favorites.merged_message") ||
              "Your local favorites were merged with your account."}
          </div>
          <button
            type="button"
            onClick={() => dispatch(resetMergedFromLocal())}
            className="ml-2 text-sm text-gray-300 hover:text-white"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      <header className="fixed top-0 z-30 w-full shadow-sm bg-white/95 backdrop-blur-md">
        <div className="container mx-auto px-6 py-3 max-sm:px-4">
          <div className="flex items-center justify-between max-sm:flex-row-reverse">
            <Link
              href={"/"}
              className="flex items-center gap-3 group max-sm:flex-row-reverse"
            >
              <Image
                src={logo}
                className="w-14 h-14 group-hover:scale-105 transition-transform max-sm:w-8 max-sm:h-8"
                alt="logo"
              />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-black">
                Epicure
              </span>
            </Link>
            <Image
              src="/burger_menu.svg"
              alt="menu"
              width={30}
              height={30}
              onClick={() => setIsSidebarOpen(true)}
              className="sm:hidden block"
            />
            <nav className="hidden md:flex items-center gap-10 text-gray-700">
              <Link
                href={"/menu"}
                className={`relative group font-medium tracking-wide text-lg transition-all duration-300 ease-in-out ${
                  isActive("/menu")
                    ? "text-black"
                    : "text-gray-800 hover:text-black/70"
                }`}
              >
                {t("menu")}
                <span
                  className={`absolute left-1/2 -bottom-[2px] h-[2px] bg-black transition-all duration-300 ease-out transform -translate-x-1/2 ${
                    isActive("/menu") ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
              <button
                onClick={() => setIsBookModalOpen(true)}
                className={`relative group font-medium tracking-wide text-lg transition-all duration-300 ease-in-out ${
                  isActive("/booking")
                    ? "text-black"
                    : "text-gray-800 hover:text-black/70"
                }`}
              >
                {t("booking")}
                <span
                  className={`absolute left-1/2 -bottom-[2px] h-[2px] bg-black transition-all duration-300 ease-out transform -translate-x-1/2 ${
                    isActive("/booking") ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>
              <Link
                href={"/offers"}
                className={`relative group font-medium tracking-wide text-lg transition-all duration-300 ease-in-out ${
                  isActive("/offers")
                    ? "text-black"
                    : "text-gray-800 hover:text-black/70"
                }`}
              >
                {t("packages")}
                <span
                  className={`absolute left-1/2 -bottom-[2px] h-[2px] bg-black transition-all duration-300 ease-out transform -translate-x-1/2 ${
                    isActive("/offers") ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
              <Link
                href={"/favorites"}
                className={`relative group font-medium tracking-wide text-lg transition-all duration-300 ease-in-out ${
                  isActive("/favorites")
                    ? "text-black"
                    : "text-gray-800 hover:text-black/70"
                }`}
              >
                {t("favorites.title")}
                <span
                  className={`absolute left-1/2 -bottom-[2px] h-[2px] bg-black transition-all duration-300 ease-out transform -translate-x-1/2 ${
                    isActive("/about") ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
              <Link
                href={"/about"}
                className={`relative group font-medium tracking-wide text-lg transition-all duration-300 ease-in-out ${
                  isActive("/about")
                    ? "text-black"
                    : "text-gray-800 hover:text-black/70"
                }`}
              >
                {t("about")}
                <span
                  className={`absolute left-1/2 -bottom-[2px] h-[2px] bg-black transition-all duration-300 ease-out transform -translate-x-1/2 ${
                    isActive("/about") ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>

              {/* {user && (
                <Link
                  href={"/profile"}
                  className={`relative group font-medium tracking-wide text-lg transition-all duration-300 ease-in-out ${
                    isActive("/profile")
                      ? "text-black"
                      : "text-gray-800 hover:text-black/70"
                  }`}
                >
                  {t("myProfile")}
                  <span
                    className={`absolute left-1/2 -bottom-[2px] h-[2px] bg-black transition-all duration-300 ease-out transform -translate-x-1/2 ${
                      isActive("/profile") ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              )} */}
            </nav>

            <div
              className="flex items-center gap-5 max-sm:hidden"
              ref={menuRef}
            >
              <div className="relative">
                {/* Кнопка открытия */}
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
                >
                  {currentLanguage.toUpperCase()}
                </button>

                {/* Выпадающее меню */}
                <div
                  className={`absolute right-0 mt-2 w-24 bg-white rounded-lg shadow-lg py-1 z-50 origin-top-right transform transition-all duration-150 ${
                    isLanguageMenuOpen
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-0 pointer-events-none"
                  }`}
                >
                  {locales.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        changeLanguage(item.code);
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors ${
                        currentLanguage === item.code ? "font-bold" : ""
                      }`}
                    >
                      {item.code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin max-sm:hidden" />
              ) : user ? (
                <>
                  <Link href={"/profile"}>
                    <span className="text-gray-800 font-medium max-sm:hidden">
                      {user.displayName || user.email}
                    </span>
                  </Link>
                  <button
                    className="text-red-600 hover:text-red-700 text-base font-medium max-sm:hidden"
                    onClick={handleLogout}
                  >
                    {t("logout") || "Выход"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="text-gray-800 hover:text-black text-base font-medium max-sm:hidden"
                    onClick={() => setIsLoginOpen(true)}
                  >
                    {t("login")}
                  </button>
                  <button
                    className="bg-black text-white font-medium rounded-full px-6 py-2 max-sm:hidden"
                    onClick={() => setIsRegisterOpen(true)}
                  >
                    {t("register")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
