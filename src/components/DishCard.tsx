import Image from "next/image";

interface Props {
  img: string;
  title: string;
  restaurant: string;
  category: string;
  price: number;
}

export function DishCard({ img, title, restaurant, category, price }: Props) {
  return (
    <div className="bg-white rounded-[30px] shadow-md overflow-hidden max-w-sm cursor-pointer flex flex-col h-full">
      <Image
        src={img}
        alt="dish"
        width={400}
        height={240}
        className="w-full h-60 object-cover"
      />

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1 max-sm:text-xl">{title}</h2>
          <p className="text-lg font-mono max-sm:text-base">{restaurant}</p>
          <p className="text-gray-400 text-sm">{category}</p>
        </div>

        <div className="pt-4">
          <p className="text-2xl font-semibold max-sm:text-xl">{price} ₸</p>
        </div>
      </div>
    </div>
  );
}
