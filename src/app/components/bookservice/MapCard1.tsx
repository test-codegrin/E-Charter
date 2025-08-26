"use client";
import Image from "next/image";
import React from "react";

const MapCard1 = () => {
  return (
    <div className="relative w-full h-full ">
      {/* Map Image */}
      <div className="relative w-full h-full rounded-lg md:rounded-xl overflow-hidden">
        <Image
          src="/images/map.png"
          alt="map"
          fill
          className="object-cover rounded-xl"
          priority={false}
        />
      </div>

      {/* Route Info Card */}
      <div className="bg-white shadow-md rounded-lg px-3 sm:px-4 py-3 absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 w-[92%] sm:w-[95%] max-w-[1177px]">
        {/* Icons Row */}
        <div className="flex justify-between items-center">
          <Image
            src="/images/Car.png"
            alt="car"
            width={50}
            height={30}
            className="w-8 h-5 sm:w-10 sm:h-6 md:w-[50px] md:h-[30px]"
          />
          <Image
            src="/images/Location.png"
            alt="pin"
            width={20}
            height={20}
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
        </div>

        {/* Route Progress */}
        <div className="flex items-center mt-2 md:mt-3 ml-3 sm:ml-[22px]">
          <div className="bg-[#C0FFED] w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shrink-0">
            <div className="bg-[#1FC091] w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full"></div>
          </div>
          <div className="flex-grow border-b-2 border-[#D9D9D9]"></div>
          <div className="bg-[#1FADC0] w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-[10px] md:h-[10px] rounded-full shrink-0"></div>
          <div className="flex-grow border-b-2 border-[#D9D9D9]"></div>
          <div className="bg-[#FFD1D1] w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shrink-0">
            <div className="bg-[#D21313] w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full"></div>
          </div>
        </div>

        {/* Locations */}
        <div className="flex justify-between text-xs sm:text-sm md:text-base mt-1 md:mt-2 font-semibold">
          <p className="truncate max-w-[30%]">Calgary</p>
          <p className="truncate max-w-[30%] mx-2 sm:ml-12 ml-[38px]">Red Deer</p>
          <p className="truncate max-w-[30%] text-right">Edmonton</p>
        </div>

        {/* Times */}
        <div className="flex justify-between text-[10px] sm:text-xs md:text-sm text-[#9C9C9C] mt-1">
          <p className="truncate max-w-[33%]">June 19 at 01:30 AM</p>
          <p className="truncate max-w-[33%] text-center">June 19 at 02:00 AM</p>
          <p className="truncate max-w-[33%] text-right">June 19 at 02:30 AM</p>
        </div>
      </div>
    </div>
  );
};

export default MapCard1;
