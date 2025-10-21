import { useTranslation } from "react-i18next";

export function DishInfo() {
  const { t } = useTranslation();

  //   function getLocalized(item, field) {
  // 	const lang = locale.value.toLowerCase();
  // 	return item[`${field}_${lang}`] || item[`${field}_ru`]; // fallback to ru
  //   }
  const selectedDish = {};

  return (
    <div className="relative bg-white w-[550px] shadow-xl flex flex-col items-start rounded-lg gap-5 py-9 px-10 m-auto">
      <img
        src="../assets/close.svg"
        className="absolute top-4 right-4 w-8 h-8 cursor-pointer"
        alt=""
        //   @click="emit('closeDishInfoModal')"
      />
      <div>
        <div className="text-2xl font-bold">{t("DishInfo.info")}</div>
      </div>

      <div className="flex flex-col gap-4 w-full border-t border-b border-[#afafaf] pt-5 pb-5">
        <div className="font-bold text-xl">
          {/* {getLocalized(selectedDish, "name")} */}
        </div>
        <div className="text-base">
          {/* {getLocalized(selectedDish, "description")} */}
        </div>
        <div className="font-bold text-lg">{selectedDish.price} ₸</div>
      </div>
      <div className="flex flex-col gap-4 w-full border-b border-[#afafaf] pb-5">
        <div className="font-bold text-xl">{t("DishInfo.dish_value")}</div>
        <div className="flex gap-4 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="font-bold">
              {selectedDish.calories} {t("DishInfo.kcal")}
            </div>
            <span>{t("DishInfo.calories")}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="font-bold">
              {selectedDish.proteins} {t("DishInfo.grams")}
            </div>
            <span>{t("DishInfo.protein")}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="font-bold">
              {selectedDish.fats} {t("DishInfo.grams")}
            </div>
            <span>{t("DishInfo.fat")}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="font-bold">
              {selectedDish.carbohydrates} {t("DishInfo.grams")}
            </div>
            <span>{t("DishInfo.carbohydrates")}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full border-b border-[#afafaf] pb-5">
        <div className="font-bold text-xl">{t("restaurant")}</div>
        <span className="text-[#9D9D9D]">
          {selectedDish.restaurant_details.name}
        </span>
      </div>
    </div>
  );
}
