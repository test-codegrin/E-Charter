"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

// Define a type for slides
interface Slide {
  id: number;
  title: string;
  image: string;
  price: number;
  doors: number;
  passengers: number;
  luggage?: number;
  ac?: boolean;
}

const slides: Slide[] = [
  { id: 1, title: "XUV 3XO", image: "/homePage/XUV-3XO.png", price: 219, doors: 4, passengers: 4 },
  { id: 2, title: "SCORPIO-N", image: "/homePage/SCORPIO-N.png", price: 249, doors: 4, passengers: 4 },
  { id: 3, title: "XUV700", image: "/homePage/XUV700.png", price: 279, doors: 4, passengers: 4 },
  { id: 4, title: "THAR", image: "/homePage/Thar.png", price: 299, doors: 4, passengers: 4 },
  { id: 5, title: "XUV 3XO", image: "/homePage/XUV-3XO.png", price: 219, doors: 4, passengers: 4 },
  { id: 6, title: "SCORPIO-N", image: "/homePage/SCORPIO-N.png", price: 249, doors: 4, passengers: 7, luggage: 3, ac: true },
  { id: 7, title: "XUV700", image: "/homePage/XUV700.png", price: 279, doors: 4, passengers: 4 },
  { id: 8, title: "THAR", image: "/homePage/Thar.png", price: 299, doors: 4, passengers: 4 },
];

const Fleet: FC = () => {
  const [slidePadding, setSlidePadding] = useState<string>("px-4");

  // Refs
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setSlidePadding("px-2");
      else if (window.innerWidth < 1024) setSlidePadding("px-3");
      else setSlidePadding("px-4");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Attach buttons after render
  useEffect(() => {
    if (
      swiperRef.current &&
      swiperRef.current.params &&
      swiperRef.current.params.navigation
    ) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1780px] py-10 relative">
        <p className="text-[#3DBEC8] text-base font-bold text-center">
          ∗ Our Fleets
        </p>
        <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[44px] text-[#040401] mx-auto leading-snug text-center font-bold max-w-[600px] mt-2">
          Explore our perfect and extensive fleet
        </h2>
        <p className="text-base text-[#616161] mx-auto leading-[27.2px] text-center font-semibold max-w-[600px] pt-4">
          We offer tailored rental solutions designed to fit every need—from
          personal to professional travel. Choose the service that best suits
          your journey.
        </p>

        <div className="relative mt-12">
          {/* Swiper */}
          <Swiper
            modules={[Autoplay, Navigation]}
            loop={true}
            autoplay={{ delay: 1800, disableOnInteraction: false }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 12, centeredSlides: true },
              640: { slidesPerView: 1.2, spaceBetween: 16 },
              768: { slidesPerView: 1.5, spaceBetween: 20 },
              1024: { slidesPerView: 2, spaceBetween: 24 },
              1280: { slidesPerView: 3, spaceBetween: 24 },
              1536: { slidesPerView: 3.5, spaceBetween: 28 },
              1780: { slidesPerView: 4, spaceBetween: 32 },
            }}
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div
                  className={`h-[400px] w-full mx-auto rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 ${slidePadding}`}
                >
                  {/* Car Image */}
                  <div className="h-[140px] flex items-center justify-center mt-6">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="max-h-full max-w-[90%] object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold mt-2 px-4 line-clamp-1">
                    {slide.title}
                  </h3>

                  {/* Features */}
                  <div className="px-4 mt-4 border-b border-gray-400 h-[90px] space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img src="/homePage/door.svg" alt="Doors" className="w-5 h-5" loading="lazy" />
                        <span className="text-sm text-gray-600">Doors</span>
                      </div>
                      <span className="text-sm font-medium">{slide.doors}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img src="/homePage/passanger.svg" alt="Passengers" className="w-5 h-5" loading="lazy" />
                        <span className="text-sm text-gray-600">Passengers</span>
                      </div>
                      <span className="text-sm font-medium">{slide.passengers}</span>
                    </div>
                  </div>

                  {/* Price & Button */}
                  <div className="px-4">
                    <div className="flex justify-between items-center border-t border-gray-100 pt-5 ">
                      <div>
                        <span className="text-xl font-bold">${slide.price}</span>
                        <span className="text-sm text-gray-500 ml-1">/day</span>
                      </div>
                      <button className="w-10 h-10 rounded-full bg-[#3DBEC8] hover:bg-[#35a7b0] flex items-center justify-center text-white transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <button
              ref={prevRef}
              className="custom-prev w-10 h-10 rounded-full bg-[#3DBEC8] text-white flex items-center justify-center hover:bg-[#35a7b0] transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              ref={nextRef}
              className="custom-next w-10 h-10 rounded-full bg-[#3DBEC8] text-white flex items-center justify-center hover:bg-[#35a7b0] transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fleet;
