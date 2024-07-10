import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

export default function HeroSlide() {
  const slides = [
    {
      image: "/im1.jpg",
    },
    {
      image: "/im2.jpg",
    },
    {
      image: "/im3.jpg",
    },
    {
      image: "/im4.jpg",
    },
    {
      image: "/im5.jpg",
    },
  ];

  return (
    <div className="relative h-92 w-full flex items-center">
      <div className="ml-auto w-full h-full">
        <Swiper
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative md:h-96 h-full w-full flex items-center">
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="h-96 w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                      The Best Pet's Toys Collection 2024
                    </h2>
                    <p className="text-lg md:text-xl mb-6">
                      Exclusive offer -10% off this week
                    </p>
                    <button className="px-6 py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
