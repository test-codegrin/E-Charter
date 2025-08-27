"use client";
import React, { JSX, useState } from "react";
import { useRouter } from "next/navigation";

type TripType = "single" | "round" | "multi";

export default function Hero(): JSX.Element {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TripType>("single");
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [dropoffLocation, setDropoffLocation] = useState<string>("");
  const [pickupDate, setPickupDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");
  const [personCount, setPersonCount] = useState<number>(1);
  const [luggageCount, setLuggageCount] = useState<number>(1);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!agreeTerms) {
      alert("Please agree to the terms before continuing.");
      return;
    }
    router.push("/page1");
  };

  return (
    <div className="flex w-full mt-[80px] sm:px-0 px-3 max-w-[1760px] mx-auto relative">
      <div className="w-full max-w-[1760px] mx-auto rounded-4xl bg-[url('/images/BG-Car.png')] bg-cover bg-center bg-no-repeat pt-10 md:pt-[140px] pb-16 md:pb-[100px] lg:min-h-[900px] xl:min-h-[1000px]">
        {/* Text Section */}
        <div className="flex flex-col items-center text-center px-4">
          <p className="text-[#3DBEC8] text-sm md:text-base">
            ∗ Welcome To e CHARTER
          </p>
          <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[74px] leading-tight lg:leading-[95px] px-4 max-w-[90%] md:max-w-[1008px] mx-auto mt-4">
            Looking to save more on your rental car?
          </h1>
          <p className="text-white text-sm md:text-[18px] max-w-[90%] sm:max-w-[725px] mx-auto mt-4">
            Whether you're planning a weekend getaway, a business trip, or just
            need a reliable ride for the day, we offer a wide range of vehicles
            to suit your needs.
          </p>
        </div>

        {/* Booking Box */}
        <div className="w-full max-w-[1310px] mx-auto px-4 lg:px-6 xl:px-0 lg:absolute lg:bottom-32 lg:left-1/2 lg:-translate-x-1/2">
          <div className="bg-white w-full h-auto rounded-2xl md:rounded-[30px] mt-12 md:mt-[160px] lg:mt-0 shadow-lg px-4 md:px-8 py-6">
              {/* Tabs + Counters + Button */}
            <div className="flex flex-wrap items-center gap-3 border-b-2 border-gray-200 pb-4">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 sm:gap-6">
                <button
                  className={`px-3 2xl:px-0 py-2 text-sm 2xl:w-[221px] 2xl:h-[35px] sm:text-base font-semibold`}
                  onClick={() => setActiveTab("single")}
                >
                  Single Trip
                  <p className={`2xl:w-[221px] ${
                    activeTab === "single"
                        ? "text-[#3DBEC8] border-b-2 sm:pt-[22px] border-[#3DBEC8]"
                      : "text-gray-600"
                  }`}></p>
                </button>
                <button
                  className={`px-3 2xl:px-0 py-2 text-sm 2xl:w-[221px] 2xl:h-[35px] sm:text-base font-semibold `}
                  onClick={() => setActiveTab("round")}
                >
                  Round-Trip
                  <p className={`2xl:w-[221px] ${
                    activeTab === "round"
                      ? "text-[#3DBEC8] border-b-2 sm:pt-[22px] border-[#3DBEC8]"
                      : "text-gray-600"
                  }`}></p>
                </button>
                <button
                  className="px-3 2xl:px-0 py-2 text-sm 2xl:w-[221px] 2xl:h-[35px] sm:text-base font-semibold hover:text-[#3DBEC8]"
                  onClick={() => {
                    setActiveTab("multi")
                    router.push("/services/page2");
                  }}
                >
                  Multi Stop
                   <p className={` ${
                    activeTab === "multi"
                      ? "text-[#3DBEC8] border-b-2 2xl:pt-[22px] border-[#3DBEC8]"
                      : "text-gray-600"
                  }`}></p>
                </button>
              </div>

              {/* Counters + Submit */}
              <div className="flex flex-wrap items-center gap-3 ml-auto">
                {/* Person */}
                <div className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full w-fit">
                  <span className="text-sm sm:text-base font-medium">
                    Person
                  </span>
                  <button
                    onClick={() => setPersonCount(Math.max(1, personCount - 1))}
                    className="w-6 h-6 flex items-center justify-center bg-[#3DBEC8] text-white rounded-full"
                  >
                    <i className="fa-solid fa-minus text-xs" />
                  </button>
                  <span className="min-w-[20px] text-center">{personCount}</span>
                  <button
                    onClick={() => setPersonCount(personCount + 1)}
                    className="w-6 h-6 flex items-center justify-center bg-[#3DBEC8] text-white rounded-full"
                  >
                    <i className="fa-solid fa-plus text-xs" />
                  </button>
                </div>

                {/* Luggage */}
                <div className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full w-fit">
                  <span className="text-sm sm:text-base font-medium">
                    Luggage
                  </span>
                  <button
                    onClick={() =>
                      setLuggageCount(Math.max(0, luggageCount - 1))
                    }
                    className="w-6 h-6 flex items-center justify-center bg-[#3DBEC8] text-white rounded-full"
                  >
                    <i className="fa-solid fa-minus text-xs" />
                  </button>
                  <span className="min-w-[20px] text-center">{luggageCount}</span>
                  <button
                    onClick={() => setLuggageCount(luggageCount + 1)}
                    className="w-6 h-6 flex items-center justify-center bg-[#3DBEC8] text-white rounded-full"
                  >
                    <i className="fa-solid fa-plus text-xs" />
                  </button>
                </div>

                {/* Button */}
                <button
                  onClick={handleSubmit}
                  className="bg-[#3DBEC8] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#36acb5] text-sm sm:text-base"
                >
                  Get Quote
                </button>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pt-4">
              {/* Pickup */}
              <div className="flex items-center border-b border-gray-300">
                <img
                  src="/images/Mask group1.png"
                  className="w-5 h-5 ml-2 sm:w-6 sm:h-6"
                  alt="pickup"
                />
                <input
                  type="text"
                  placeholder="Pickup Location"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="flex-1 p-2 focus:outline-none text-sm sm:text-base"
                />
              </div>

              {/* Dropoff */}
              <div className="flex items-center border-b border-gray-300">
                <img
                  src="/images/Drop.png"
                  className="w-5 h-5 ml-2 sm:w-6 sm:h-6"
                  alt="dropoff"
                />
                <input
                  type="text"
                  placeholder="Drop Off Location"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  className="flex-1 p-2 focus:outline-none text-sm sm:text-base"
                />
              </div>

              {/* Pickup Date */}
              <div className="flex items-center border-b border-gray-300">
                <img
                  src="/images/PickupDate.png"
                  className="w-5 h-5 ml-2 sm:w-6 sm:h-6"
                  alt="pickup-date"
                />
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="flex-1 p-2 focus:outline-none text-sm sm:text-base"
                />
              </div>

              {/* Return Date (round-trip only) */}
              {activeTab === "round" && (
                <div className="flex items-center border-b border-gray-300">
                  <img
                    src="/images/PickupDate.png"
                    className="w-5 h-5 ml-2 sm:w-6 sm:h-6"
                    alt="return-date"
                  />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="flex-1 p-2 focus:outline-none text-sm sm:text-base"
                  />
                </div>
              )}
            </div>  

            {/* Checkbox */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="agree"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 border-2 border-[#3DBEC8] cursor-pointer"
              />
              <label
                htmlFor="agree"
                className="text-sm text-[#3DBEC8] cursor-pointer"
              >
                Add Stop
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
