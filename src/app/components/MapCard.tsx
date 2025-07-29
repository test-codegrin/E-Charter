'use client';

import Image from "next/image";
import React from "react";

interface MapCardProps {
  pickupLocation?: string;
  dropoffLocation?: string;
}

const MapCard: React.FC<MapCardProps> = ({ pickupLocation, dropoffLocation }) => {
  return (
    <div className="relative w-full h-full">
      {/* Map Image */}
      <Image 
        src="/images/map.png" 
        alt="map"
        fill
        className="object-cover rounded-lg md:rounded-xl"
        priority
      />

      {/* Map Controls Overlay */}
      <div className="bg-white shadow-sm md:shadow-md rounded-md md:rounded-lg px-3 py-2 md:px-4 md:py-3 absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-[95%] max-w-[1177px]">
        {/* Top Row - Icons */}
        <div className="flex justify-between items-center">
          <Image 
            src="/images/Car.png" 
            alt="car"
            width={40}
            height={24}
            className="rounded-sm md:rounded-md"
          />
          <Image 
            src="/images/Location.png" 
            alt="pin"
            width={20}
            height={20}
            className="mr-2 md:mr-[15px]"
          />
        </div>

        {/* Route Visualization */}
        <div className="flex items-center mt-2 md:mt-3 md:mx-[15px]">
          <div className="bg-[#C0FFED] w-4 h-4 md:w-5 md:h-5 rounded-full flex justify-center items-center flex-shrink-0">
            <div className="bg-[#1FC091] w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" />
          </div>
          <div className="flex-grow border-b-2 border-gray-200" />
          <div className="bg-[#FFD1D1] w-4 h-4 md:w-5 md:h-5 rounded-full flex justify-center items-center flex-shrink-0">
            <div className="bg-[#D21313] w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" />
          </div>
        </div>

        {/* Location Labels */}
        <div className="flex justify-between text-sm md:text-base mt-1 md:mt-2 font-medium md:font-semibold">
          <p className="truncate max-w-[40%]">{pickupLocation || 'Calgary'}</p>
          <p className="truncate max-w-[40%] text-right">{dropoffLocation || 'Edmonton'}</p>
        </div>

        {/* Time Labels */}
        <div className="flex justify-between text-xs md:text-sm text-gray-500 md:text-[#9C9C9C]">
          <p className="truncate max-w-[40%]">June 19 01:30 AM</p>
          <p className="truncate max-w-[40%] text-right">June 19 02:30 AM</p>
        </div>
      </div>
    </div>
  );
};

export default MapCard;
