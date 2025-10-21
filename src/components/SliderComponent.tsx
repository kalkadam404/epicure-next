import type { StaticImageData } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useState } from "react";

interface Props {
  imageSrc?: (string | StaticImageData)[];
  title?: string;
  description?: string;
  height?: string;
}

export default function SliderComponent({
  imageSrc,
  title,
  description,
  height = "16/9",
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div
      className={` relative aspect-[${height}]  max-sm:-mt-6 max-sm:aspect-[3/4]`}
    >
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        speed={1000}
        loop={true}
        className="w-auto"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        modules={[Autoplay]}
        pagination={{ clickable: true }}
      >
        {imageSrc?.map((img, i) => (
          <SwiperSlide key={i}>
            <div
              className={`h-150 relative w-full aspect-[${height}] overflow-hidden max-sm:aspect-[3/4]`}
            >
              <Image
                src={img}
                alt={`Slider Image- ${i}`}
                fill
                className="object-cover rounded-3xl max-sm:rounded-none transition-transform duration-900 ease-in-out"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {title && (
        <div className="absolute bottom-8 left-8 text-white font-semibold drop-shadow-lg flex flex-col gap-2 w-2/5 rounded-xl  p-6 backdrop-blur-sm border border-white/20 bg-white/10 max-sm:w-auto max-sm:bottom-2.5 max-sm:mx-2 max-sm:inset-x-2 z-10">
          <div className="text-3xl max-sm:text-2xl ">{title}</div>
          <div className="text-xl font-medium max-sm:text-base">
            {description}
          </div>
          <div className=" flex items-center gap-4 mt-4">
            {imageSrc?.map((_, i) => (
              <div
                key={i}
                className={`h-[3px] rounded-4xl transition-all duration-500 ${
                  i === activeIndex
                    ? "bg-white w-24 max-sm:w-16"
                    : "bg-white/40 w-10 max-sm:w-8"
                }`}
              />
            ))}
          </div>
        </div>
      )}
      {!title && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
          {imageSrc?.map((_, i) => (
            <div
              key={i}
              className={`h-[3px] rounded-4xl transition-all duration-500 ${
                i === activeIndex
                  ? "bg-white w-24 max-sm:w-16"
                  : "bg-white/40 w-10 max-sm:w-8"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
