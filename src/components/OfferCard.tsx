import { useTranslation } from "react-i18next";

interface Props {
  image: string;
  title: string;
  restaurant?: string;
  badge?: string;
  oldPrice?: number;
  newPrice: number;
  perPerson: boolean;
  peopleCount?: number;
  description: [];
}

export function OfferCard({
  image,
  title,
  restaurant,
  badge,
  oldPrice,
  newPrice,
  perPerson,
  peopleCount = 1,
  description,
}: Props) {
  const { t } = useTranslation();
  function pluralize(count: number) {
    if (count === 1) return "персону";
    if ([2, 3, 4].includes(count)) return "персоны";
    return "персон";
  }

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      // :data-aos="dataAos"
      // @click="navigateToDetails"
    >
      <div className="relative">
        <img src={image} alt="title" className="w-full h-56 object-cover" />
        <div
          v-if="badge"
          className="absolute top-4 right-4 bg-black text-white text-sm font-medium px-3 py-1 rounded-full"
        >
          {badge}
        </div>
      </div>

      <div className="p-6">
        <div v-if="restaurant" className="text-sm text-gray-500 mb-2">
          {restaurant}
        </div>
        <h3 className="text-xl font-bold mb-4">{title}</h3>

        <div className="flex items-center space-x-2 mb-4">
          <span
            v-if="oldPrice && oldPrice > newPrice"
            className="text-gray-500 line-through"
          >
            {oldPrice} ₸
          </span>
          <span className="text-black font-bold text-xl">{newPrice} ₸</span>
          <span className="text-gray-700 text-sm">
            /
            {perPerson
              ? "на персону"
              : `на ${peopleCount} ${pluralize(peopleCount)}`}
          </span>
        </div>

        <ul className="space-y-2 mb-6">
          <li
            v-for="(item, index) in description"
            //   :key="index"
            className="flex items-start"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-700">
              {
                // getLocalized(item, "description")
              }
            </span>
          </li>
        </ul>

        <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
          {t("buttons.book_table")}
        </button>
      </div>
    </div>
  );
}
