"use client";
import React, { JSX, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Inputs from "../ui/Inputs";
import { useTrip } from "../../context/tripContext";

type TripType = "single" | "round" | "multi";

export default function Hero(): JSX.Element {
  const router = useRouter();
  const { tripData, updateTripData } = useTrip();
  const [activeTab, setActiveTab] = useState<TripType>("single");
  const [isMobile, setIsMobile] = useState(false);

  // Local UI states
  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false);
  const [showReturnDateDropdown, setShowReturnDateDropdown] =
    useState<boolean>(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

  return (
    <div className="flex w-full mt-16 md:mt-20 px-4 sm:px-6 md:px-8 lg:px-8 xl:px-0 2xl:px-0 max-w-screen-2xl mx-auto relative">
      <div className="w-full mx-auto rounded-3xl lg:rounded-4xl bg-[url('/images/BG-Car.png')] bg-cover bg-center bg-no-repeat pt-8 md:pt-28 lg:pt-32 xl:pt-36 pb-12 md:pb-16 lg:pb-20 xl:pb-24 min-h-[600px] sm:min-h-[700px] md:min-h-[800px] lg:min-h-[900px] xl:min-h-[1000px]">
        {/* Text Section */}
        <div className="flex flex-col items-center text-center px-4 sm:px-6 md:px-8">
          <p className="text-[#3DBEC8] text-xs sm:text-sm md:text-base lg:text-lg">
            ∗ Welcome To e CHARTER
          </p>
          <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-tight md:leading-snug lg:leading-tight xl:leading-relaxed px-2 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto mt-2 md:mt-4">
            Looking to save more on your rental car?
          </h1>
          <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto mt-3 md:mt-4 lg:mt-5">
            Whether you're planning a weekend getaway, a business trip, or just
            need a reliable ride for the day, we offer a wide range of vehicles
            to suit your needs.
          </p>
        </div>

        {/* Booking Box */}
        <div className="w-full max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 lg:absolute lg:bottom-20 xl:bottom-24 2xl:bottom-32 lg:left-1/2 lg:-translate-x-1/2 mt-8 md:mt-12 lg:mt-0">
          <div className="bg-white w-full h-auto rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
            {/* Tabs + Counters + Button */}
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 md:gap-4 border-b border-gray-200 pb-3 md:pb-4 2xl:pb-2.5">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-5 w-full sm:w-auto">
                <button
                  className="px-3 2xl:px-0 py-2 text-sm 2xl:w-[121px] 2xl:h-[35px] sm:text-base font-semibold"
                  onClick={() => setActiveTab("single")}
                >
                  Single Trip
                  <p
                    className={` ${
                      activeTab === "single"
                        ? "text-[#3DBEC8] border-b-2 2xl:pt-[22px] border-[#3DBEC8]"
                        : "text-gray-600"
                    }`}
                  ></p>
                </button>

                <button
                  className="px-3 2xl:px-0 py-2 text-sm 2xl:w-[221px] 2xl:h-[35px] sm:text-base font-semibold"
                  onClick={() => setActiveTab("round")}
                >
                  Round-Trip
                  <p
                    className={` ${
                      activeTab === "round"
                        ? "text-[#3DBEC8] border-b-2 2xl:pt-[22px] border-[#3DBEC8]"
                        : "text-gray-600"
                    }`}
                  ></p>
                </button>

                <button
                  className={`px-3 py-2 text-sm sm:text-sm md:text-base font-medium ${
                    activeTab === "multi" ? "text-[#3DBEC8]" : "text-gray-600"
                  }`}
                  onClick={() => {
                    setActiveTab("multi");
                    updateTripData({
                      tripType: "multi",
                      multiStops: [],
                    });
                    router.push("/services/page2");
                  }}
                >
                  Multi Stop
                  <p
                    className={` ${
                      activeTab === "multi"
                        ? "text-[#3DBEC8] border-b-2 2xl:pt-[22px] border-[#3DBEC8]"
                        : "text-gray-600"
                    }`}
                  ></p>
                  <div
                    className={`h-0.5 mt-1 ${
                      activeTab === "multi" ? "bg-[#3DBEC8]" : "bg-transparent"
                    }`}
                  ></div>
                </button>
              </div>

              {/* Counters + Submit */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 ml-0 xl:ml-auto w-full sm:w-auto justify-between sm:justify-end">
                {/* Person */}
                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 border border-gray-300 rounded-full w-fit">
                  <span className="text-xs sm:text-sm font-medium">Person</span>
                  <button
                    onClick={() =>
                      updateTripData({
                        persons: Math.max(1, tripData.persons - 1),
                      })
                    }
                    className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-[#3DBEC8] text-white rounded-full"
                  >
                    <i className="fa-solid fa-minus text-xs" />
                  </button>
                  <span className="min-w-[16px] sm:min-w-[20px] text-center text-xs sm:text-sm">
                    {tripData.persons}
                  </span>
                  <button
                    onClick={() =>
                      updateTripData({ persons: tripData.persons + 1 })
                    }
                    className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-[#3DBEC8] text-white rounded-full"
                  >
                    <i className="fa-solid fa-plus text-xs" />
                  </button>
                </div>

                {/* Luggage */}
                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 border border-gray-300 rounded-full w-fit">
                  <span className="text-xs sm:text-sm font-medium">
                    Luggage
                  </span>
                  <button
                    onClick={() =>
                      updateTripData({
                        luggageCount: Math.max(1, tripData.luggageCount - 1),
                      })
                    }
                    className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-[#3DBEC8] text-white rounded-full"
                  >
                    <i className="fa-solid fa-minus text-xs" />
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
                    className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-[#3DBEC8] text-white rounded-full"
                  >
                    <i className="fa-solid fa-plus text-xs" />
                  </button>
                </div>

                {/* Button */}
                <Button
                  label="Get Quote"
                  onClick={handleSubmit}
                  variant="primary"
                  className="text-xs sm:text-sm"
                  size="sm"
                />
              </div>
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pt-3 md:pt-4">
              {/* Pickup */}
              <div className="flex items-center border-b border-gray-300 py-1 sm:py-2">
                <img
                  src="/images/Mask group1.png"
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-1 sm:ml-2"
                  alt="pickup"
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
                <img
                  src="/images/Drop.png"
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-1 sm:ml-2"
                  alt="dropoff"
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
                <div className="relative flex items-center border-b border-gray-300 py-1 sm:py-2">
                  <img
                    src="/images/PickupDate.png"
                    alt="date"
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-1 sm:ml-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                    className="w-full text-[#9C9C9C] flex items-center justify-between px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm md:text-base"
                  >
                    {tripData.pickupDateTime
                      ? tripData.pickupDateTime
                      : "Departure Date"}
                    <i className="fa-solid fa-calendar ml-1 sm:ml-2 text-[#3DBEC8] text-xs sm:text-sm" />
                  </button>

                  {showDateDropdown && (
                    <div className="absolute z-10 top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 sm:p-4 w-full max-w-xs sm:max-w-sm">
                      <Inputs
                        name="pickupDate"
                        type="datetime-local"
                        value={tripData.pickupDateTime}
                        onChange={(e) =>
                          updateTripData({ pickupDateTime: e.target.value })
                        }
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                      />
                      <div className="mt-3 flex justify-end">
                        <Button
                          label="Done"
                          onClick={() => setShowDateDropdown(false)}
                          variant="primary"
                          className="text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Round Trip → Pickup + Return Date */}
              {activeTab === "round" && (
                <>
                  {/* Pickup Date */}
                  <div className="relative flex items-center border-b border-gray-300 py-1 sm:py-2">
                    <img
                      src="/images/PickupDate.png"
                      alt="pickup-date"
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-1 sm:ml-2"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDateDropdown(!showDateDropdown)}
                      className="w-full flex items-center justify-between text-[#9C9C9C] px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm md:text-base"
                    >
                      {tripData.pickupDateTime
                        ? tripData.pickupDateTime
                        : "Departure Date"}
                      <i className="fa-solid fa-calendar ml-1 sm:ml-2 text-[#3DBEC8] text-xs sm:text-sm" />
                    </button>

                    {showDateDropdown && (
                      <div className="absolute z-10 top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 sm:p-4 w-full max-w-xs sm:max-w-sm">
                        <Inputs
                          name="pickupDate"
                          type="datetime-local"
                          value={tripData.pickupDateTime}
                          onChange={(e) =>
                            updateTripData({ pickupDateTime: e.target.value })
                          }
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                        />
                        <div className="mt-3 flex justify-end">
                          <Button
                            label="Done"
                            onClick={() => setShowDateDropdown(false)}
                            variant="primary"
                            className="text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Return Date */}
                  <div className="relative flex items-center border-b border-gray-300 py-1 sm:py-2">
                    <img
                      src="/images/PickupDate.png"
                      alt="return-date"
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-1 sm:ml-2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowReturnDateDropdown(!showReturnDateDropdown)
                      }
                      className="w-full flex items-center justify-between text-[#9C9C9C] px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm md:text-base"
                    >
                      {tripData.returnDateTime
                        ? tripData.returnDateTime
                        : "Return Date"}
                      <i className="fa-solid fa-calendar ml-1 sm:ml-2 text-[#3DBEC8] text-xs sm:text-sm" />
                    </button>

                    {showReturnDateDropdown && (
                      <div className="absolute z-10 top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 sm:p-4 w-full max-w-xs sm:max-w-sm">
                        <Inputs
                          name="returnDate"
                          type="datetime-local"
                          value={tripData.returnDateTime}
                          onChange={(e) =>
                            updateTripData({ returnDateTime: e.target.value })
                          }
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                        />
                        <div className="mt-3 flex justify-end">
                          <Button
                            label="Done"
                            onClick={() => setShowReturnDateDropdown(false)}
                            variant="primary"
                            className="text-xs"
                          />
                        </div>
                      </div>
                    )}
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
