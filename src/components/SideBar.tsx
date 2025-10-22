import Image from "next/image";
import Link from "next/link";
import logo_w from "@/assets/logo_w.svg";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideBar({ isOpen, onClose }: SidebarProps) {
  const links = [
    { name: "Главная", href: "/" },
    { name: "Меню", href: "/menu" },
    { name: "Бронирование", href: "/" },
    { name: "Пакеты", href: "/offers" },
    { name: "О Нас", href: "/about" },
  ];
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* <motion.div
            className="fixed inset-0 bg-black/40 z-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          /> */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            className="fixed left-0 top-0 h-full z-9999 pt-3 pb-7 px-4 backdrop-blur-2xl bg-[#4A4A4A99]/10 flex flex-col items-start justify-between w-full"
          >
            <div className="flex items-center justify-between w-full ">
              <Image src={logo_w} alt="logo" width={56} height={56} />
              <button
                className="rounded-[300px] p-2.5 text-black text-sm font-medium bg-white"
                onClick={onClose}
              >
                Закрыть
              </button>
            </div>
            <div className="flex flex-col  w-full">
              {links.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-end justify-between tracking-wide py-2.5 border-b border-[#FFFFFF4D]/30 "
                >
                  <div className="text-white  font-medium   text-4xl">
                    {link.name}
                  </div>
                  <div className="text-white  font-medium  text-xs">
                    0{i + 1}
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex self-center justify-center gap-6 text-white font-semibold text-2xl">
              <div className="border-b-2 border-white">KZ</div>
              <div>RU</div>
            </div>
            <div
              className="text-white py-2  font-medium  text-4xl border-b border-[#FFFFFF4D]/30 w-full"
              onClick={onClose}
            >
              Выйти
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
