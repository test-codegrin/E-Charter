// MapCard.tsx - Show middle dots without labels, reveal on hover
"use client";

import { IMAGES_ASSETS } from "@/app/constants/ImageConstant";
import Image from "next/image";
import React from "react";

interface Stop {
  location: string;
  date: string;
}

interface MapCardProps {
  pickupLocation?: string;
  dropoffLocation?: string;
  multiStops?: Stop[];
  tripType?: "single" | "return" | "multi";
  pickupDateTime?: string;
  returnDateTime?: string;
}

const MapCard: React.FC<MapCardProps> = ({
  pickupLocation,
  dropoffLocation,
  multiStops = [],
  tripType = "single",
  pickupDateTime,
  returnDateTime,
}) => {
  // Format datetime
  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return "Not set";
    try {
      const date = new Date(dateTimeString);
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      return date.toLocaleDateString("en-US", options);
    } catch {
      return "Invalid date";
    }
  };

  // Route visualization for single/return
  const renderRouteVisualization = () => {
    return (
      <div className="flex items-center w-full mt-2 md:mt-3">
        <div className="bg-[#C0FFED] w-4 h-4 md:w-5 md:h-5 rounded-full flex justify-center items-center flex-shrink-0">
          <div className="bg-[#1FC091] w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" />
        </div>
        <div className="flex-grow border-b-2 border-gray-200" />
        <div className="bg-[#FFD1D1] w-4 h-4 md:w-5 md:h-5 rounded-full flex justify-center items-center flex-shrink-0">
          <div className="bg-[#D21313] w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" />
        </div>
      </div>
    );
  };

  const renderLocationLabels = () => {
    if (tripType === "multi" && multiStops.length > 0) {
      const allLocations = [
        { location: pickupLocation || "Pickup", date: pickupDateTime },
        ...multiStops.map((stop) => ({
          location: stop.location || "Stop",
          date: stop.date,
        })),
        { location: dropoffLocation || "Dropoff", date: undefined },
      ];
  
      const tooMany = allLocations.length > 5;
  
      return (
        <div className="relative flex flex-col sm:flex-row sm:justify-between items-start mt-1 md:mt-2 flex-wrap">
          <div className="absolute top-2 sm:w-[calc(100%-50px)] left-1/2 -translate-x-1/2 h-0.5 bg-primary-gray/30 z-[-1]" />
  
          {allLocations.map((item, index) => {
            const truncatedLocation =
              item.location.length > 10
                ? item.location.substring(0, 10) + "..."
                : item.location;
  
            const isFirst = index === 0;
            const isLast = index === allLocations.length - 1;
  
            return (
              <div
                key={index}
                className={`flex flex-row sm:flex-col ${
                  isFirst ? "sm:items-start" : isLast ? "sm:items-end" : "sm:items-center"
                } text-center relative group`}
              >
                {/* Dot */}
                <div className="flex items-center mb-2 cursor-pointer">
                  <div
                    className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex justify-center items-center flex-shrink-0 ${
                      isFirst
                        ? "bg-[#C0FFED]"
                        : isLast
                        ? "bg-[#FFD1D1]"
                        : "bg-[#FFF4CC]"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${
                        isFirst
                          ? "bg-[#1FC091]"
                          : isLast
                          ? "bg-[#D21313]"
                          : "bg-[#FFB800]"
                      }`}
                    />
                  </div>
                </div>
  
                {/* Labels */}
                {tooMany && !isFirst && !isLast ? (
                  <>
                    {/* Desktop/Tablet → Tooltip on hover */}
                    <div className="hidden sm:block">
                      <div className="hidden group-hover:block absolute top-8 left-1/2 -translate-x-1/2 bg-white shadow-lg border border-gray-200 rounded-md p-2 w-40 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="text-xs font-medium">{item.location}</p>
                        <p className="text-[10px] text-gray-500">
                          {formatDateTime(item.date)}
                        </p>
                      </div>
                    </div>
  
                    {/* Mobile → Always show full label */}
                    <div className="flex flex-row sm:hidden text-center">
                      <p
                        className="text-xs md:text-sm font-medium md:font-semibold px-1 whitespace-nowrap"
                        title={item.location}
                      >
                        {item.location}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">
                        {isLast ? "Arrival time" : formatDateTime(item.date)}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p
                      className="text-sm ml-2 font-medium md:font-semibold whitespace-nowrap"
                      title={item.location}
                    >
                      {truncatedLocation}
                    </p>
                    <p className="text-xs ml-2 text-gray-500 mt-0.5 whitespace-nowrap">
                      {isLast ? "Arrival time" : formatDateTime(item.date)}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      );
    }
  
    // Default for single/return
    return (
      <div className="mt-2">
        <div className="flex justify-between text-sm  font-medium md:font-semibold">
          <p className="truncate max-w-[40%] whitespace-nowrap">{pickupLocation || "Pickup"}</p>
          <p className="truncate max-w-[40%] text-right  whitespace-nowrap">
            {dropoffLocation || "Dropoff"}
          </p>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-0.5">
          <p className="truncate max-w-[40%] whitespace-nowrap">{formatDateTime(pickupDateTime)}</p>
          <p className="truncate max-w-[40%] text-right whitespace-nowrap">
            {tripType === "return"
              ? formatDateTime(returnDateTime)
              : "Arrival time"}
          </p>
        </div>
      </div>
    );
  };
  

  return (
    <div className="relative w-full max-h-[877px] lg:mt-[0] mt-[30px] h-full">
      {/* Map */}
      <div className="relative w-full h-full rounded-lg md:rounded-xl overflow-hidden">
        <Image
          src="/images/map.png"
          alt="map"
          fill
          className="object-cover rounded-xl"
          priority={false}
        />
      </div>

      {/* Overlay */}
      <div className="bg-white shadow-sm md:shadow-md rounded-md md:rounded-lg px-3 py-2 md:px-4 md:py-3 absolute bottom-10 md:bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-[95%] max-w-[1177px]">
        {/* Top icons */}
        <div className="hidden sm:flex justify-between items-center">
          <Image src={IMAGES_ASSETS.CAR} alt="car" width={40} height={24}  />
          <Image src={IMAGES_ASSETS.LOCATION} alt="pin" width={20} height={20}  />
        </div>

        {/* Route */}
        {tripType !== "multi" && renderRouteVisualization()}

        {/* Labels */}
        {renderLocationLabels()}
      </div>
    </div>
  );
};

export default MapCard;
