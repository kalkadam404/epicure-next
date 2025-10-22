"use client";

import Image from "next/image";
import Link from "next/link";
import logo_w from "@/assets/logo_w.svg";
import { useTranslation } from "react-i18next";
export function Footer() {
  const { t } = useTranslation();
  const links = [
    { href: "/menu", label: t("menu") },
    { href: "/booking", label: t("booking") },
    { href: "/offers", label: t("packages") },
    { href: "/about", label: t("about") },
  ];
  return (
    <div className="flex flex-col gap-16 py-8 px-20 max-sm:px-4">
      <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-8">
        <div className="flex items-center gap-3">
          <Image src={logo_w} alt="ELLE Logo" width={56} height={56} />
          <div className="text-xl text-black font-bold">Epicure</div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="" target="_blank" rel="noopener noreferrer">
            <Image src="/tiktok.svg" alt="tiktok" width={24} height={24} />
          </Link>
          <Link href="" target="_blank" rel="noopener noreferrer">
            <Image src="/youtube.svg" alt="youtube" width={25} height={25} />
          </Link>
          <Link href="" target="_blank" rel="noopener noreferrer">
            <Image src="/insta2.svg" alt="instagram" width={22} height={22} />
          </Link>
          <Link href="" target="_blank" rel="noopener noreferrer">
            <Image src="/telega.svg" alt="telegram" width={36} height={36} />
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-y-3.5  w-full font-medium">
        <div className="flex flex-col gap-3.5">
          {links.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="relative group  font-medium tracking-wide text-black transition-colors duration-300 ease-in-out "
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-3.5">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            Контакты{" "}
          </Link>
          <Link href="/" target="_blank" rel="noopener noreferrer">
            Реклама{" "}
          </Link>
          {/* <div>KZ RU EN</div> */}
        </div>
        <div className="flex flex-col gap-3.5  max-sm:col-span-2">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            О компании
          </Link>
          <Link href="/" target="_blank" rel="noopener noreferrer">
            Пользовательское соглашение
          </Link>
          <Link href="/" target="_blank" rel="noopener noreferrer">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
      <div className="border-t py-4 flex items-center justify-between text-sm font-medium text-black/60">
        <div className="">Ⓒ2025 Epicure. Все права защищены.</div>
        <div>Вернуться к началу</div>
      </div>
    </div>
  );
}
