// MapCard.tsx - Updated with dates below locations
"use client";

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
  // Format datetime for display
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
    } catch (error) {
      return "Invalid date";
    }
  };

  // Create route visualization based on trip type
  const renderRouteVisualization = () => {
    if (tripType === "multi" && multiStops.length > 0) {
      return (
        <div className="flex items-center mt-2 md:mt-3 md:mx-[15px]">
          {/* Pickup point */}
          <div className="bg-[#C0FFED] w-4 h-4 md:w-5 md:h-5 rounded-full flex justify-center items-center flex-shrink-0">
            <div className="bg-[#1FC091] w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" />
          </div>

          {/* Final destination */}
          <div className="flex-1 border-b-2 border-gray-200" />
          <div className="bg-[#FFD1D1] w-4 h-4 md:w-5 md:h-5 rounded-full flex justify-center items-center flex-shrink-0">
            <div className="bg-[#D21313] w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" />
          </div>
        </div>
      );
    }

    // Default single/return trip visualization
    return (
      <div className="flex items-center mt-2 md:mt-3 md:mx-[15px]">
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

  // Create location labels and dates for multi-stop trips

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

      // Dynamic grid columns based on number of locations

      return (
        <div className="relative flex flex-col sm:flex-row sm:justify-between items-start mt-1 md:mt-2 flex-wrap">
          <div className="absolute top-1.5 sm:w-[calc(100%-50px)] left-1/2 -translate-x-1/2 h-1 bg-primary-gray/30 z-[-1]" />
          {allLocations.map((item, index) => {
            // Truncate location name to 10 characters
            const truncatedLocation = item.location.length > 10 
              ? item.location.substring(0, 10) + "..." 
              : item.location;
      
            return (
              <div
                key={index}
                className="flex flex-row sm:flex-col items-center text-center"
              >
                {/* Dot above location */}
                <div className="flex items-center mb-2">
                  {/* Dot */}
                  <div
                    className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex justify-center items-center flex-shrink-0 ${
                      index === 0
                        ? "bg-[#C0FFED]" // First index - green
                        : index === allLocations.length - 1
                        ? "bg-[#FFD1D1]" // Last index - red
                        : "bg-[#FFF4CC]" // Middle indices - yellow
                    }`}
                  >
                    <div
                      className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${
                        index === 0
                          ? "bg-[#1FC091]" // First index - green
                          : index === allLocations.length - 1
                          ? "bg-[#D21313]" // Last index - red
                          : "bg-[#FFB800]" // Middle indices - yellow
                      }`}
                    />
                  </div>
                </div>
      
                {/* Location name - truncated to 10 characters */}
                <p
                  className="text-xs md:text-sm font-medium md:font-semibold px-1 whitespace-nowrap"
                  title={item.location} // Full location name on hover
                >
                  {truncatedLocation}
                </p>
      
                {/* Date/Time below location */}
                <p className="text-[10px] md:text-xs text-gray-500 md:text-[#9C9C9C] mt-0.5 whitespace-nowrap">
                  {index === allLocations.length - 1 ? "Arrival time" : formatDateTime(item.date)}
                </p>
              </div>
            );
          })}
        </div>
      );
        
    }

    // Default single/return trip labels with dates
    return (
      <div className="mt-1 md:mt-2">
        {/* Location names */}
        <div className="flex justify-between text-sm md:text-base font-medium md:font-semibold">
          <p className="truncate max-w-[40%]">{pickupLocation || "Pickup"}</p>
          <p className="truncate max-w-[40%] text-right">
            {dropoffLocation || "Dropoff"}
          </p>
        </div>
        {/* Date/Time row */}
        <div className="flex justify-between text-xs md:text-sm text-gray-500 md:text-[#9C9C9C] mt-0.5">
          <p className="truncate max-w-[40%]">
            {formatDateTime(pickupDateTime)}
          </p>
          <p className="truncate max-w-[40%] text-right">
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

      {/* Map Controls Overlay */}
      <div className="bg-white shadow-sm md:shadow-md rounded-md md:rounded-lg px-3 py-2 md:px-4 md:py-3 absolute bottom-10 md:bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-[95%] max-w-[1177px]">
        {/* Top Row - Icons */}
        <div className=" hidden sm:flex justify-between items-center">
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
            className="md:mr-[15px]"
          />
        </div>

        {/* Dynamic Route Visualization */}
        {tripType !== "multi" && renderRouteVisualization()}

        {/* Dynamic Location Labels with Dates */}
        {renderLocationLabels()}
      </div>
    </div>
  );
};

export default MapCard;
