"use client";
import React, { JSX, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Inputs from "../ui/Inputs";
import { useTrip } from "../../context/tripContext";
import { Icon } from "@iconify/react";
import { ICON_DATA } from "@/app/constants/IconConstants";
import { ROUTES } from "@/app/constants/RoutesConstant";

type TripType = "single" | "round" | "multi";

export default function Hero(): JSX.Element {
  const router = useRouter();
  const { tripData, updateTripData } = useTrip();
  const [activeTab, setActiveTab] = useState<TripType>("single");
  const [isMobile, setIsMobile] = useState(false);
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const [isPersonDropdownOpen, setIsPersonDropdownOpen] = useState(false);
  const [isLuggageDropdownOpen, setIsLuggageDropdownOpen] = useState(false);

  // Local UI states
  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false);
  const [showReturnDateDropdown, setShowReturnDateDropdown] =
    useState<boolean>(false);

  // Separate refs for each dropdown
  const tabDropdownRef = useRef<HTMLDivElement>(null);
  const personDropdownRef = useRef<HTMLDivElement>(null);
  const luggageDropdownRef = useRef<HTMLDivElement>(null);

  // TRIPS configuration
  const TRIPS = [
    {
      id: "single" as TripType,
      label: "Single Trip",
      icon: "/images/single-trip.svg",
      onClick: () => {
        setActiveTab("single");
        setIsTabDropdownOpen(false);
      },
    },
    {
      id: "round" as TripType,
      label: "Round-Trip",
      icon: "/images/round-trip.svg",
      onClick: () => {
        setActiveTab("round");
        setIsTabDropdownOpen(false);
      },
    },
    {
      id: "multi" as TripType,
      label: "Multi Stop",
      icon: "/images/multistop-trip.svg",
      onClick: () => {
        setActiveTab("multi");
        updateTripData({
          tripType: "multi",
          multiStops: [],
        });
        setIsTabDropdownOpen(false);
        router.push(ROUTES.PLAN_JOURNEY);
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
      // Check each dropdown separately
      if (
        tabDropdownRef.current &&
        !tabDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTabDropdownOpen(false);
      }

      if (
        personDropdownRef.current &&
        !personDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPersonDropdownOpen(false);
      }

      if (
        luggageDropdownRef.current &&
        !luggageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLuggageDropdownOpen(false);
      }
    };

    if (isTabDropdownOpen || isPersonDropdownOpen || isLuggageDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTabDropdownOpen, isPersonDropdownOpen, isLuggageDropdownOpen]);

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

    router.push(ROUTES.PLAN_JOURNEY);
  };

  const getActiveTab = () => TRIPS.find((tab) => tab.id === activeTab);

  // Handler functions to prevent dropdown closing
  const handlePersonChange = (newCount: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event bubbling
    updateTripData({ persons: newCount });
  };

  const handleLuggageChange = (newCount: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event bubbling
    updateTripData({ luggageCount: newCount });
  };

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
          <h1 className="text-white font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight px-2 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto mb-4 md:mb-6">
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
            {/* TRIPS + Counters + Button */}
            <div className="flex flex-col lg:flex-row items-center pb-4 justify-between border-b border-primary-gray/50 ">
              <div className="flex flex-col md:flex-row gap-5 items-center sm:items-start">
                {/* TRIPS Dropdown */}
                <div className="relative w-45 lg:w-50" ref={tabDropdownRef}>
                  <button
                    onClick={() => setIsTabDropdownOpen(!isTabDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-primary-gray/10 hover:bg-primary-gray/20 transition-colors duration-300 cursor-pointer rounded-full text-sm font-semibold text-primary-gray"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={getActiveTab()?.icon}
                        alt={getActiveTab()?.label}
                        className="w-6 h-6 color"
                      />
                      <span className="text-black font-medium">
                        {getActiveTab()?.label}
                      </span>
                    </div>
                    <Icon
                      icon={
                        isTabDropdownOpen
                          ? "mdi:chevron-up"
                          : "mdi:chevron-down"
                      }
                      className="w-5 h-5 text-primary"
                    />
                  </button>

                  {isTabDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-primary-gray/30 rounded-xl drop-shadow-2xl z-50">
                      {TRIPS.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={tab.onClick}
                          className={`w-full flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-primary-gray/20 transition-colors first:rounded-t-lg last:rounded-b-lg ${
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
                          {activeTab === tab.id ? (
                            <Icon
                              icon={ICON_DATA.RADIO_ACTIVE}
                              className="w-5 h-5 text-primary ml-auto"
                            />
                          ) : (
                            <Icon
                              icon={ICON_DATA.RADIO_INACTIVE}
                              className="w-5 h-5 text-primary-gray ml-auto"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Person Dropdown */}
                  <div
                    className="relative w-30 md:w-40 lg:w-50"
                    ref={personDropdownRef}
                  >
                    <button
                      onClick={() =>
                        setIsPersonDropdownOpen(!isPersonDropdownOpen)
                      }
                      className="w-full flex items-center justify-between px-4 py-3 bg-primary-gray/10 hover:bg-primary-gray/20 transition-colors duration-300 cursor-pointer rounded-full text-sm font-semibold text-primary-gray"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-black text-xs md:text-sm">
                          {tripData.persons === 1
                            ? ` ${tripData.persons} Person`
                            : ` ${tripData.persons} Persons`}
                        </span>
                      </div>
                      <Icon
                        icon={
                          isPersonDropdownOpen
                            ? "mdi:chevron-up"
                            : "mdi:chevron-down"
                        }
                        className="w-5 h-5 text-primary"
                      />
                    </button>
                    {isPersonDropdownOpen && (
                      <div className="absolute w-fit top-full left-0 right-0 mt-1 bg-white border border-primary-gray/30 rounded-xl drop-shadow-2xl z-50">
                        <div className="flex flex-col lg:flex-row items-center lg:gap-3 px-4 py-3">
                          <p>Persons</p>
                          <div className="flex items-center gap-3 px-4 py-3">
                            <button
                              onClick={(e) =>
                                handlePersonChange(
                                  Math.max(1, tripData.persons - 1),
                                  e
                                )
                              }
                              disabled={tripData.persons === 1}
                              className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center ${
                                tripData.persons === 1
                                  ? "bg-primary-gray"
                                  : "bg-primary"
                              } text-white rounded-full cursor-pointer`}
                            >
                              <i className="fa-solid fa-minus text-xs" />
                            </button>
                            <span className="min-w-[16px] sm:min-w-[20px] text-center text-sm sm:text-base">
                              {tripData.persons}
                            </span>
                            <button
                              onClick={(e) =>
                                handlePersonChange(tripData.persons + 1, e)
                              }
                              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-primary text-white rounded-full"
                            >
                              <i className="fa-solid fa-plus text-xs cursor-pointer" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Luggage Dropdown */}
                  <div
                    className="relative w-30 md:w-40 lg:w-50"
                    ref={luggageDropdownRef}
                  >
                    <button
                      onClick={() =>
                        setIsLuggageDropdownOpen(!isLuggageDropdownOpen)
                      }
                      className="w-full flex items-center justify-between px-4 py-3 bg-primary-gray/10 hover:bg-primary-gray/20 transition-colors duration-300 cursor-pointer rounded-full text-sm font-semibold text-primary-gray"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-black text-xs md:text-sm">
                          {tripData.luggageCount === 1
                            ? ` ${tripData.luggageCount} Luggage`
                            : ` ${tripData.luggageCount} Luggages`}
                        </span>
                      </div>
                      <Icon
                        icon={
                          isLuggageDropdownOpen
                            ? "mdi:chevron-up"
                            : "mdi:chevron-down"
                        }
                        className="w-5 h-5 text-primary"
                      />
                    </button>
                    {isLuggageDropdownOpen && (
                      <div className="absolute w-fit top-full left-0 right-0 mt-1 bg-white border border-primary-gray/30 rounded-xl drop-shadow-2xl z-50">
                        <div className="flex flex-col lg:flex-row items-center lg:gap-3 px-4 py-3">
                          <p>Luggage</p>

                          <div className="flex items-center gap-3 px-4 py-3">
                            <button
                              onClick={(e) =>
                                handleLuggageChange(
                                  Math.max(1, tripData.luggageCount - 1),
                                  e
                                )
                              }
                              disabled={tripData.luggageCount === 1}
                              className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center ${
                                tripData.luggageCount === 1
                                  ? "bg-primary-gray"
                                  : "bg-primary"
                              } text-white rounded-full cursor-pointer`}
                            >
                              <i className="fa-solid fa-minus text-xs " />
                            </button>
                            <span className="min-w-[16px] sm:min-w-[20px] text-center text-xs sm:text-base">
                              {tripData.luggageCount}
                            </span>
                            <button
                              onClick={(e) =>
                                handleLuggageChange(
                                  tripData.luggageCount + 1,
                                  e
                                )
                              }
                              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-primary text-white rounded-full"
                            >
                              <i className="fa-solid fa-plus text-xs cursor-pointer" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button
                label="Get Quote"
                onClick={handleSubmit}
                variant="primary"
                className="text-xs hidden lg:block mb-2 sm:mb-0 mt-4 lg:mt-0 sm:text-sm min-w-fit sm:min-w-fit"
                size="sm"
              />
            </div>
            {/* Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 py-3 md:py-4">
              {(activeTab === "single" || activeTab === "round") && (
                <>
                  {/* Pickup */}
                  <div className="flex items-center border border-primary-gray/50 rounded-xl p-1 sm:p-2">
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
                      className="flex-1 p-1 sm:p-2 focus:outline-none border-none bg-transparent text-xs sm:text-sm md:text-base"
                    />
                  </div>

                  {/* Dropoff */}
                  <div className="flex items-center border border-primary-gray/50 rounded-xl p-1 sm:p-2">
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
                      className="flex-1 p-1 sm:p-2 focus:outline-none border-none bg-transparent text-xs sm:text-sm md:text-base"
                    />
                  </div>
                </>
              )}

              {/* Single Trip → Date & Time */}
              {activeTab === "single" && (
                <div className="flex items-center border border-primary-gray/50 rounded-xl p-1 sm:p-2">
                  <Icon
                    icon={ICON_DATA.CALENDAR_PICKUP}
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6  text-primary-gray flex-shrink-0"
                  />

                  <Inputs
                    name="pickupDate"
                    type="datetime-local"
                    value={tripData.pickupDateTime}
                    onChange={(e) =>
                      updateTripData({ pickupDateTime: e.target.value })
                    }
                    className={`flex-1 w-full p-2 border-none rounded-md focus:outline-none ${
                      tripData.pickupDateTime
                        ? "text-black"
                        : "text-primary-gray"
                    } text-xs sm:text-sm md:text-base`}
                  />
                </div>
              )}

              {/* Round Trip → Pickup + Return Date */}
              {activeTab === "round" && (
                <>
                  {/* Pickup Date */}
                  <div className="flex items-center border border-primary-gray/50 rounded-xl p-1 sm:p-2">
                    <Icon
                      icon={ICON_DATA.CALENDAR_PICKUP}
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6  text-primary-gray flex-shrink-0"
                    />

                    <Inputs
                      name="pickupDate"
                      type="datetime-local"
                      value={tripData.pickupDateTime}
                      onChange={(e) =>
                        updateTripData({ pickupDateTime: e.target.value })
                      }
                      className={`flex-1 w-full p-2 border-none rounded-md focus:outline-none ${
                        tripData.pickupDateTime
                          ? "text-black"
                          : "text-primary-gray"
                      } text-xs sm:text-sm md:text-base`}
                    />
                  </div>

                  {/* Return Date */}
                  <div className="flex items-center border border-primary-gray/50 rounded-xl p-1 sm:p-2">
                    <Icon
                      icon={ICON_DATA.CALENDAR_RETURN}
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6  text-primary-gray flex-shrink-0"
                    />

                    <Inputs
                      name="returnDate"
                      type="datetime-local"
                      value={tripData.returnDateTime}
                      min={tripData.pickupDateTime || ""} // ensures return >= pickup
                      onChange={(e) => {
                        if (
                          tripData.pickupDateTime &&
                          e.target.value < tripData.pickupDateTime
                        ) {
                          alert("Return date/time cannot be before pickup!");
                          return;
                        }
                        updateTripData({ returnDateTime: e.target.value });
                      }}
                      className={`flex-1 w-full p-2 border-none rounded-md focus:outline-none ${
                        tripData.returnDateTime
                          ? "text-black"
                          : "text-primary-gray"
                      } text-xs sm:text-sm md:text-base`}
                    />
                  </div>
                </>
              )}
            </div>
            {/* Multi Stop Button */}
            <div className="flex items-center justify-between">
              <Button
                label="Add Stop"
                onClick={() => {
                  setActiveTab("multi");
                  updateTripData({
                    tripType: "multi",
                    multiStops: [{ location: "", date: "" }],
                  });
                  setIsTabDropdownOpen(false);
                  // Add focus parameter to URL
                  router.push(`${ROUTES.PLAN_JOURNEY}?focusStop=true`);
                }}
                variant="primary"
                className="text-xs block sm:text-sm min-w-fit sm:min-w-fit"
                size="sm"
              />
              <Button
                label="Get Quote"
                onClick={handleSubmit}
                variant="primary"
                className="text-xs block lg:hidden sm:text-sm min-w-fit sm:min-w-fit"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
