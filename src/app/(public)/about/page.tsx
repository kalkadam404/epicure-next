"use client";

import type { Metadata } from "next";
import { useTranslation } from "react-i18next";
import phone from "@/assets/phone.svg";
import email from "@/assets/email.svg";
import location from "@/assets/location.svg";
import historyImg from "@/assets/res_history.png";
import Image from "next/image";
import insta from "@/assets/insta.svg";
import facebook from "@/assets/facebook.svg";
import twitter from "@/assets/twit.svg";
import me from "@/assets/me.jpeg";
import alzhik from "@/assets/alzhik.jpg";
import abu from "@/assets/abu.jpg";
import jony from "@/assets/jony.jpg";
import aslan from "@/assets/aslan.jpg";
import { PersonCard } from "@/components/PersonCard";

// export const metadata: Metadata = {
//   title: "Epicure-home",
//   description: "",
// };

export default function AboutPage() {
  const { t } = useTranslation();
  const persons = [
    {
      img: alzhik,
      name: "Дарибаев Әлжан",
      job: t("our_team.chef"),
      about: t("our_team.description1"),
    },
    {
      img: me,
      name: "Койшыбай Еркебұлан",
      job: t("our_team.manager"),
      about: t("our_team.description2"),
    },
    {
      img: abu,
      name: "Қуатұлы Абуханифа",
      job: t("our_team.designer"),
      about: t("our_team.description4"),
    },
    {
      img: aslan,
      name: "Аслан Мустафаев",
      job: t("our_team.waiter"),
      about: t("our_team.description3"),
    },
    {
      img: jony,
      name: "Жәнібек Мырзаханов",
      job: t("our_team.designer"),
      about: t("our_team.description4"),
    },
  ];

  return (
    <div className="flex flex-col items-center gap-5 mt-10">
      <div className="font-bold text-4xl">{t("about")}</div>
      <p className="text-gray-400 text-lg font-medium text-center w-[600px]">
        {t("aboutUs.title_mini")}
      </p>
      <main className="flex gap-5 justify-between items-stretch mt-10 mb-20 px-20">
        <div className="flex flex-col gap-4" data-aos="fade-down">
          <div className="font-bold text-5xl">{t("aboutUs.our_story")}</div>
          <div className="flex flex-col gap-1 mt-5 w-[650px]">
            <div className="text-gray-400 text-lg font-medium mb-4">
              {t("aboutUs.description1")}
            </div>
            <div className="text-gray-400 text-lg font-medium mb-4">
              {t("aboutUs.description2")}
            </div>
            <div className="text-gray-400 text-lg font-medium mb-4">
              {t("aboutUs.description3")}
            </div>
          </div>
        </div>
        <div className="   rounded-lg" data-aos="fade-up">
          <Image
            src={historyImg}
            alt=""
            width={650}
            height={400}
            className="object-cover"
          />
        </div>
      </main>
      <div className="font-bold text-4xl">{t("aboutUs.our_team")}</div>
      <div className="px-20 mt-10 space-y-10">
        <div className="grid grid-cols-3 gap-8" data-aos="fade-down">
          {persons.slice(0, 3).map((person, index) => (
            <PersonCard
              key={"row1-" + index}
              name={person.name}
              img={person.img}
              job={person.job}
              about={person.about}
            />
          ))}
        </div>

        <div className="flex justify-center gap-8" data-aos="fade-up">
          {persons.slice(3).map((person, index) => (
            <PersonCard
              key={"row2-" + index}
              name={person.name}
              img={person.img}
              job={person.job}
              about={person.about}
            />
          ))}
        </div>
      </div>
      <div className="px-20 mb-10">{/* <BonusAppPromo /> */}</div>
      <div
        className="bg-[#FAFAFA] flex items-start gap-5 w-full p-10 mt-10"
        data-aos="fade-up"
      >
        <div className="flex flex-col gap-5 w-1/2">
          <div className="font-bold text-2xl">{t("aboutUs.contact_us")}</div>
          <div className="w-[600px]">{t("aboutUs.contact_description")}</div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <Image src={phone} alt="" />
              <div>+7 (706) 123-45-67</div>
            </div>
            <div className="flex gap-2 items-center">
              <Image src={email} alt="" />
              <div>info@restobron.ru</div>
            </div>
            <div className="flex gap-2 items-center">
              <Image src={location} alt="" />
              <div>{t("aboutUs.address")}</div>
            </div>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="rounded-lg py-1.5 px-1.5 border border-[#e2e1e1] bg-white">
              <Image
                src={insta}
                alt=""
                width={24}
                height={24}
                className="object-cover"
              />
            </div>
            <div className="rounded-lg py-1.5 px-1.5 border border-[#e2e1e1] bg-white">
              <Image
                src={facebook}
                alt=""
                width={24}
                height={24}
                className="object-cover"
              />
            </div>
            <div className="rounded-lg py-1.5 px-1.5 border border-[#e2e1e1] bg-white">
              <Image
                src={twitter}
                alt=""
                width={24}
                height={24}
                className="object-cover"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 w-1/2">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-700 font-medium">
                {t("inputs.name")}
              </label>
              <input
                type="text"
                id="name"
                required
                placeholder={t("inputs.your_name")}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                {t("inputs.email")}
              </label>
              <input
                type="text"
                id="email"
                required
                placeholder={t("inputs.your_email")}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              {t("inputs.title")}
            </label>
            <input
              type="text"
              id="tema"
              required
              placeholder={t("inputs.title_placeholder")}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              {t("inputs.message")}
            </label>
            <textarea
              id="message"
              required
              placeholder={t("inputs.message_placeholder")}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <button className="py-2 px-5 bg-black text-white rounded-lg">
            {t("buttons.send_message")}
          </button>
        </div>
      </div>
    </div>
  );
}
