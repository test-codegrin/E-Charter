"use client";

import { useState } from "react";
import PersonCounter from "../components/PersonCounter";
import MapCard from "../components/MapCard";
import StopCard from "../components/StopCard";    
import Link from "next/link";



interface Stop {
  location: string;
  date: string;
}

const PlanJourney: React.FC = () => {
  const [tripType, setTripType] = useState<"single" | "return" | "multi">("single");
  const [persons, setPersons] = useState<number>(1);
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [dropoffLocation, setDropoffLocation] = useState<string>("");
  const [pickupDateTime, setPickupDateTime] = useState<string>("");
  const [dropoffDateTime, setDropoffDateTime] = useState<string>("");
  const [multiStops, setMultiStops] = useState<Stop[]>([]);

  const handleAddStop = (index?: number) => {
    const updated = [...multiStops];
    if (typeof index === "number") {
      updated.splice(index + 1, 0, { location: "", date: "" });
    } else {
      updated.push({ location: "", date: "" });
    }
    setMultiStops(updated);
  };


  

  const handleUpdateStop = (index: number, data: Stop) => {
    const updated = [...multiStops];
    updated[index] = data;
    setMultiStops(updated);
  };

  const handleRemoveStop = (index: number) => {
    const updated = [...multiStops];
    updated.splice(index, 1);
    setMultiStops(updated);
  };

  return (
    <section className="flex flex-col xl:flex-row lg:flex-col max-w-screen-3xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-6 md:py-10 lg:py-12 lg:gap-8 xl:gap-10">
      {/* Left Panel */}
      <div className="scroll-bar md:mx-auto md:w-[580px] lg:w-[580px] xl:w-[50%] 2xl:w-[580px] h-auto lg:h-[calc(100vh-80px)] lg:overflow-y-auto xl:pr-0 lg:pr-4">
        <button className="flex items-center cursor-pointer mb-4 text-[#3DC1C4] hover:text-[#2da8ab] font-medium transition-colors duration-200">
          <i className="fa-solid fa-arrow-left-long mr-2" />
          Back
        </button>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Plan Your Journey</h1>
        <p className="mt-2 text-base sm:text-lg text-gray-600">
          Create your perfect travel itinerary with our premium chauffeur service
        </p>

        {/* Accordion */}
        <details className="group mt-6 md:mt-8" open>
          <summary className="flex justify-between items-center py-4 cursor-pointer select-none list-none">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Itinerary</h2>
            <div className="flex items-center gap-2 sm:gap-4">
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value as "single" | "return" | "multi")}
                className="border-2 border-gray-200 pr-2 bg-white text-sm font-medium rounded-full px-4 py-2 focus:border-[#3DC1C4] focus:outline-none transition-all duration-200"
              >
                <option value="single">Single Trip</option>
                <option value="return">Round-Trip</option>
                <option value="multi">Multi Stop</option>
              </select>
              <i className="fa-solid fa-chevron-down transition-transform duration-200 group-open:rotate-180" />
            </div>
          </summary>

          {/* Pickup Section */}
          <div className="border border-gray-200 rounded-2xl p-4 sm:p-6 mt-4 space-y-4 sm:space-y-6">
            <div className="md:flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3DC1C4] flex justify-center items-center flex-shrink-0">
                  <img src="/images/Mask group.png" alt="pickup" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-base sm:text-lg text-[#3DC1C4] font-semibold">Pickup</h3>
              </div>
              <div className="flex items-center gap-3">
                <PersonCounter value={persons} onChange={setPersons} />
                {tripType === "multi" && multiStops.length === 0 && (
                  <button
                    type="button"
                    onClick={() => handleAddStop()}
                    className="px-6 mt-[10px] md:mt-[0] sm:px-4 py-[10px] sm:py-2 bg-[#3DC1C4] hover:bg-[#2da8ab] text-white text-xs sm:text-sm font-medium rounded-full transition-colors duration-200"
                  >
                    + Add Stop
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="flex items-center gap-2 sm:gap-3">
                  <img src="/images/Mask group1.png" className="w-5 h-5 sm:w-6 sm:h-6" alt="location" />
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Pickup Location"
                    className="w-full bg-transparent focus:outline-none py-1 sm:py-2 text-sm sm:text-base placeholder-gray-400"
                  />
                </label>
                <div className="border-b border-gray-300" />
              </div>
              <div>
                <label className="flex items-center gap-2 sm:gap-3">
                  <img src="/images/Clock.png" className="w-5 h-5 sm:w-6 sm:h-6" alt="time" />
                  <input
                    type="datetime-local"
                    value={pickupDateTime}
                    onChange={(e) => setPickupDateTime(e.target.value)}
                    className="w-full bg-transparent focus:outline-none text-gray-500 py-1 sm:py-2 text-sm sm:text-base"
                  />
                </label>
                <div className="border-b border-gray-300" />
              </div>
            </div>
          </div>

          {/* Multi Stops */}
          {tripType === "multi" &&
            multiStops.map((stop, index) => (
              <StopCard
                key={index}
                id={index}
                location={stop.location}
                date={stop.date}
                onAdd={() => handleAddStop(index)}
                onRemove={() => handleRemoveStop(index)}
                onChange={(id, data) => handleUpdateStop(id as number, data)}
              />
            ))}

          {/* Dropoff Section */}
          {(tripType === "return" || tripType === "multi") && (
            <div className="border border-gray-200 rounded-2xl p-4 sm:p-6 mt-6 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3DC1C4] flex justify-center items-center flex-shrink-0">
                  <img src="/images/Dropoff.png" alt="dropoff" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-[#3DC1C4]">Dropoff</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="flex items-center gap-2 sm:gap-3">
                    <img src="/images/Mask group1.png" className="w-5 h-5 sm:w-6 sm:h-6" alt="location" />
                    <input
                      type="text"
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      placeholder="Dropoff Location"
                      className="w-full bg-transparent focus:outline-none py-1 sm:py-2 text-sm sm:text-base placeholder-gray-400"
                    />
                  </label>
                  <div className="border-b border-gray-300" />
                </div>
                <div>
                  <label className="flex items-center gap-2 sm:gap-3">
                    <img src="/images/Clock.png" className="w-5 h-5 sm:w-6 sm:h-6" alt="time" />
                    <input
                      type="datetime-local"
                      value={dropoffDateTime}
                      onChange={(e) => setDropoffDateTime(e.target.value)}
                      className="w-full bg-transparent focus:outline-none text-gray-500 py-1 sm:py-2 text-sm sm:text-base"
                    />
                  </label>
                  <div className="border-b border-gray-300" />
                </div>
              </div>
            </div>
          )}
        </details>

        <div className="border-t border-gray-200 my-6 md:my-8" />
        <Link href="/page2">
          <button className="w-full max-w-[573px] h-12 mt-6 bg-[#3DBEC8] text-white font-bold text-sm rounded-full hover:bg-[#35aab1] transition-colors">
            Next
          </button>
        </Link>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:mx-auto lg:w-[100%] xl:w-[60%] 2xl:w-[65%] 2xl:flex h-[400px] sm:h-[500px] md:h-[600px] lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 rounded-xl overflow-hidden">
        <MapCard pickupLocation={pickupLocation} dropoffLocation={dropoffLocation} />
      </div>
    </section>
  );
};

export default PlanJourney;
