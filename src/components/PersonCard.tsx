import Image, { type StaticImageData } from "next/image";

interface Props {
  img: string | StaticImageData;
  name: string;
  job: string;
  about: string;
}

export function PersonCard({ img, name, job, about }: Props) {
  return (
    <div className="bg-white rounded-[30px] shadow-md overflow-hidden max-w-sm">
      <div className="relative w-full h-60">
        <Image src={img} alt="dish" fill className=" object-cover" />
      </div>
      <div className="p-5">
        <h2 className="text-2xl font-bold mb-1">{name}</h2>
        <p className="text-lg font-mono">{job}</p>
        <p className="text-gray-400 text-sm mb-3">{about}</p>
      </div>
    </div>
  );
}
