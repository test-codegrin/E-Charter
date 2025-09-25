"use client";
import React, { JSX, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Inputs from "../ui/Inputs";
import { useTrip } from "../../context/tripContext";
import { Icon } from "@iconify/react";
import { ICON_DATA } from "@/app/constants/IconConstants";

type TripType = "single" | "round" | "multi";

export default function Hero(): JSX.Element {
  const router = useRouter();
  const { tripData, updateTripData } = useTrip();
  const [activeTab, setActiveTab] = useState<TripType>("single");
  const [isMobile, setIsMobile] = useState(false);
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);

  // Local UI states
  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false);
  const [showReturnDateDropdown, setShowReturnDateDropdown] =
    useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tabs configuration
  const tabs = [
    {
      id: "single" as TripType,
      label: "Single Trip",
      icon: "/images/Single-Trip.png",
      onClick: () => {
        setActiveTab("single");
        setIsTabDropdownOpen(false);
      },
    },
    {
      id: "round" as TripType,
      label: "Round-Trip",
      icon: "/images/Round-Trip.png",
      onClick: () => {
        setActiveTab("round");
        setIsTabDropdownOpen(false);
      },
    },
    {
      id: "multi" as TripType,
      label: "Multi Stop",
      icon: "/images/Multi-Stop.png",
      onClick: () => {
        setActiveTab("multi");
        updateTripData({
          tripType: "multi",
          multiStops: [],
        });
        setIsTabDropdownOpen(false);
        router.push("/services/page2");
      },
    },
  ];

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 621);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsTabDropdownOpen(false);
      }
    };

    if (isTabDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTabDropdownOpen]);

  const handleSubmit = () => {
    // Validation
    if (!tripData.pickupLocation || !tripData.dropoffLocation) {
      alert("Please enter both pickup and drop-off locations.");
      return;
    }
    if (
      activeTab === "round" &&
      (!tripData.pickupDateTime || !tripData.returnDateTime)
    ) {
      alert("Please select both pickup and return dates.");
      return;
    }
    if (activeTab === "single" && !tripData.pickupDateTime) {
      alert("Please select a departure date.");
      return;
    }

    // Update trip type in context
    updateTripData({
      tripType: activeTab === "round" ? "return" : activeTab,
    });

    router.push("/services/page1");
  };

  const getActiveTab = () => tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-8 xl:px-0 2xl:px-0">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img
          src="/images/BG-Car.png"
          alt="Background"
          className="w-full h-full object-cover bg-black"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-screen-2xl mx-auto mt-16 md:mt-20">
        {/* Text Section */}
        <div className="flex flex-col items-center text-center px-4 sm:px-6 md:px-8 mb-8 md:mb-12 lg:mb-16">
          <p className="text-primary text-sm md:text-base lg:text-lg font-medium mb-2 md:mb-3">
            ∗ Welcome To e CHARTER
          </p>
          <h1 className="text-white font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight md:leading-snug lg:leading-tight xl:leading-relaxed px-2 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto mb-4 md:mb-6">
            Looking to save more on your rental car?
          </h1>
          <p className="text-white text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto">
            Whether you're planning a weekend getaway, a business trip, or just
            need a reliable ride for the day, we offer a wide range of vehicles
            to suit your needs.
          </p>
        </div>

        {/* Booking Box */}
        <div className="w-full max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mt-8 md:mt-12 lg:mt-0">
          <div className="bg-white w-full h-auto rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
            {/* Tabs + Counters + Button */}
            <div className="flex flex-col gap-4 lg:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-3 md:pb-4 2xl:pb-2.5">
              {/* Mobile Dropdown */}
              {isMobile ? (
                <div className="relative w-full" ref={dropdownRef}>
                  <button
                    onClick={() => setIsTabDropdownOpen(!isTabDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3  border border-primary-gray/70 rounded-lg text-sm font-semibold text-primary-gray"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={getActiveTab()?.icon}
                        alt={getActiveTab()?.label}
                        className="w-5 h-5"
                      />
                      <span className="text-primary">
                        {getActiveTab()?.label}
                      </span>
                    </div>
                    <Icon
                      icon={
                        isTabDropdownOpen
                          ? "mdi:chevron-up"
                          : "mdi:chevron-down"
                      }
                      className="w-5 h-5 text-primary-gray"
                    />
                  </button>

                  {isTabDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-primary-gray/50 rounded-lg shadow-lg z-50">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={tab.onClick}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                            activeTab === tab.id
                              ? "text-primary bg-primary/5"
                              : "text-primary-gray"
                          }`}
                        >
                          <img
                            src={tab.icon}
                            alt={tab.label}
                            className="w-5 h-5"
                          />
                          <span>{tab.label}</span>
                          {activeTab === tab.id && (
                            <Icon
                              icon="mdi:check"
                              className="w-5 h-5 text-primary ml-auto"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Desktop Tabs */
                <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-5 w-full sm:w-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`px-5 flex justify-center items-center gap-3 py-2 hover:bg-primary-gray/10 rounded-full cursor-pointer text-sm sm:text-base font-semibold relative ${
                        activeTab === tab.id
                          ? "text-primary"
                          : "text-primary-gray"
                      }`}
                      onClick={tab.onClick}
                    >
                      <img src={tab.icon} alt={tab.label} className="w-5 h-5" />
                      <div className="text-center">{tab.label}</div>
                      {activeTab === tab.id && (
                        <div className="absolute bottom-[-11px] left-0 w-full h-0.5 bg-primary"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Counters + Submit */}
              <div className="flex md:mt-4 sm:mt-0 lg:mt-0  items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                {/* Person */}
                <div className="flex w-1/2 sm:flex-row flex-col items-center gap-2 sm:gap-2 px-2 sm:px-3 py-1 border border-primary-gray/50 rounded-xl sm:rounded-full">
                  <span className="text-xs sm:text-sm font-medium">Person</span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() =>
                        updateTripData({
                          persons: Math.max(1, tripData.persons - 1),
                        })
                      }
                      className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-primary text-white rounded-full"
                    >
                      <i className="fa-solid fa-minus text-xs cursor-pointer" />
                    </button>
                    <span className="min-w-[16px] sm:min-w-[20px] text-center text-xs sm:text-sm">
                      {tripData.persons}
                    </span>
                    <button
                      onClick={() =>
                        updateTripData({ persons: tripData.persons + 1 })
                      }
                      className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-primary text-white rounded-full"
                    >
                      <i className="fa-solid fa-plus text-xs cursor-pointer" />
                    </button>
                  </div>
                </div>

                {/* Luggage */}
                <div className="flex w-1/2 sm:flex-row flex-col items-center gap-2 sm:gap-2 px-2 sm:px-3 py-1 border border-primary-gray/50 rounded-xl sm:rounded-full">
                 
                    <span className="text-xs sm:text-sm font-medium">
                      Luggage
                    </span>
                    <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() =>
                        updateTripData({
                          luggageCount: Math.max(1, tripData.luggageCount - 1),
                        })
                      }
                      className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-primary text-white rounded-full"
                    >
                      <i className="fa-solid fa-minus text-xs cursor-pointer" />
                    </button>
                    <span className="min-w-[16px] sm:min-w-[20px] text-center text-xs sm:text-sm">
                      {tripData.luggageCount}
                    </span>
                    <button
                      onClick={() =>
                        updateTripData({
                          luggageCount: tripData.luggageCount + 1,
                        })
                      }
                      className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-primary text-white rounded-full"
                    >
                      <i className="fa-solid fa-plus text-xs cursor-pointer" />
                    </button>
                  </div>
                </div>

               {/* Button */}
                <Button
                  label="Get Quote"
                  onClick={handleSubmit}
                  variant="primary"
                  className="text-xs hidden sm:block sm:text-sm w-full sm:min-w-fit"
                  size="sm"
                />
              </div>
              <Button
                  label="Get Quote"
                  onClick={handleSubmit}
                  variant="primary"
                  className="text-xs block sm:hidden sm:text-sm w-full sm:min-w-fit"
                  size="sm"
                />
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 pt-3 md:pt-4">
              {/* Pickup */}
              <div className="flex items-center border-b border-gray-300 py-1 sm:py-2">
                <Icon
                  icon={ICON_DATA.HOME}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-1 sm:ml-2 text-primary-gray"
                />
                <Inputs
                  name="pickup"
                  type="text"
                  placeholder="Pickup Location"
                  value={tripData.pickupLocation}
                  onChange={(e) =>
                    updateTripData({ pickupLocation: e.target.value })
                  }
                  className="flex-1 p-1 sm:p-2 focus:outline-none text-xs sm:text-sm md:text-base"
                />
              </div>

              {/* Dropoff */}
              <div className="flex items-center border-b border-gray-300 py-1 sm:py-2">
                <Icon
                  icon={ICON_DATA.DROP_LOCATION}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-1 sm:ml-2 text-primary-gray"
                />
                <Inputs
                  name="dropoff"
                  type="text"
                  placeholder="Drop Off Location"
                  value={tripData.dropoffLocation}
                  onChange={(e) =>
                    updateTripData({ dropoffLocation: e.target.value })
                  }
                  className="flex-1 p-1 sm:p-2 focus:outline-none text-xs sm:text-sm md:text-base"
                />
              </div>

              {/* Single Trip → Date & Time */}
              {activeTab === "single" && (
                <div className="relative flex items-center border-b border-gray-300 py-1 sm:py-2 gap-2">
                  <Icon
                    icon={ICON_DATA.CALENDAR_PICKUP}
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-gray flex-shrink-0"
                  />
                  <div className="flex-1">
                    <Inputs
                      name="pickupDate"
                      type="datetime-local"
                      value={tripData.pickupDateTime}
                      onChange={(e) =>
                        updateTripData({ pickupDateTime: e.target.value })
                      }
                      className={`w-full p-2 border-none rounded-md focus:outline-none ${
                        tripData.pickupDateTime
                          ? "text-black"
                          : "text-primary-gray"
                      } text-xs sm:text-sm md:text-base`}
                    />
                  </div>
                </div>
              )}

              {/* Round Trip → Pickup + Return Date */}
              {activeTab === "round" && (
                <>
                  {/* Pickup Date */}
                  <div className="relative flex items-center border-b border-gray-300 py-1 sm:py-2 gap-2">
                    <Icon
                      icon={ICON_DATA.CALENDAR_PICKUP}
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-gray flex-shrink-0"
                    />
                    <div className="flex-1">
                      <Inputs
                        name="pickupDate"
                        type="datetime-local"
                        value={tripData.pickupDateTime}
                        onChange={(e) =>
                          updateTripData({ pickupDateTime: e.target.value })
                        }
                        className={`w-full p-2 border-none rounded-md focus:outline-none ${
                          tripData.pickupDateTime
                            ? "text-black"
                            : "text-primary-gray"
                        } text-xs sm:text-sm md:text-base`}
                      />
                    </div>
                  </div>

                  {/* Return Date */}
                  <div className="relative flex items-center border-b border-gray-300 py-1 sm:py-2 gap-2">
                    <Icon
                      icon={ICON_DATA.CALENDAR_RETURN}
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-gray flex-shrink-0"
                    />
                    <div className="flex-1">
                      <Inputs
                        name="returnDate"
                        type="datetime-local"
                        value={tripData.returnDateTime}
                        onChange={(e) =>
                          updateTripData({ returnDateTime: e.target.value })
                        }
                        className={`w-full p-2 border-none rounded-md focus:outline-none ${
                          tripData.returnDateTime
                            ? "text-black"
                            : "text-primary-gray"
                        } text-xs sm:text-sm md:text-base`}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
