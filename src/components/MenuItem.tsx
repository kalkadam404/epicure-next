interface Props {
  img: string;
  title: string;
  category: string;
  price: number;
  onClick?: () => void;
}

export function MenuItem({ img, title, category, price, onClick }: Props) {
  return (
    <div 
      className="bg-white rounded-[20px] shadow-md overflow-hidden max-w-sm cursor-pointer flex flex-col hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <img src={img} alt="dish" className="w-full h-40 object-cover" />

      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-xl font-bold mb-1">{title}</h2>
        <p className="text-gray-400 text-sm mb-3">{category}</p>

        <div className="mt-auto">
          <p className="text-lg font-medium">{price} ₸</p>
        </div>
      </div>
    </div>
  );
}
