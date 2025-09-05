"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PersonCounter from "../../components/bookservice/PersonCounter";
import MapCard from "../../components/bookservice/MapCard";
import StopCard from "../../components/bookservice/StopCard";
import Button from "../../components/ui/Button";
import Inputs from "../../components/ui/Inputs";

interface Stop {
  location: string;
  date: string;
}

interface ReturnTrip {
  location: string;
  date: string;
}

const STORAGE_KEY = "tripDataV1";

const PlanJourney = () => {
  const router = useRouter();

  const [tripType, setTripType] = useState<"single" | "return" | "multi">(
    "return"
  );
  const [persons, setPersons] = useState<number>(1);
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [dropoffLocation, setDropoffLocation] = useState<string>("");
  const [pickupDateTime, setPickupDateTime] = useState<string>("");
  const [dropoffDateTime, setDropoffDateTime] = useState<string>("");
  const [multiStops, setMultiStops] = useState<Stop[]>([]);
  const [returnTrip, setReturnTrip] = useState<ReturnTrip>({
    location: "",
    date: "",
  });

  // ✅ Load saved form data (from Hero or previous step)
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const data = JSON.parse(raw);

      if (data.tripType) setTripType(data.tripType);
      if (typeof data.persons === "number") setPersons(data.persons);
      if (data.pickupLocation) setPickupLocation(data.pickupLocation);
      if (data.dropoffLocation) setDropoffLocation(data.dropoffLocation);
      if (data.pickupDateTime) setPickupDateTime(data.pickupDateTime);
      if (data.dropoffDateTime) setDropoffDateTime(data.dropoffDateTime);
      if (Array.isArray(data.multiStops)) setMultiStops(data.multiStops);
      if (data.returnTrip) setReturnTrip(data.returnTrip);
    } catch (e) {
      console.error("Error parsing saved trip data:", e);
    }
  }, []);

  // ✅ Clear data ONLY on page refresh (not on Next.js navigation)
  useEffect(() => {
    const clearOnRefresh = () => {
      localStorage.removeItem(STORAGE_KEY);
    };
    window.addEventListener("beforeunload", clearOnRefresh);
    return () => window.removeEventListener("beforeunload", clearOnRefresh);
  }, []);

  // Add stop
  const handleAddStop = (index?: number) => {
    const updated = [...multiStops];
    if (typeof index === "number") {
      updated.splice(index + 1, 0, { location: "", date: "" });
    } else {
      updated.push({ location: "", date: "" });
    }
    setMultiStops(updated);
  };

  // Update stop
  const handleUpdateStop = (index: number, data: Stop) => {
    const updated = [...multiStops];
    updated[index] = data;
    setMultiStops(updated);
  };

  // Remove stop
  const handleRemoveStop = (index: number) => {
    const updated = [...multiStops];
    updated.splice(index, 1);
    setMultiStops(updated);
  };

  // Handle trip type change
  const handleTripTypeChange = (value: "single" | "return" | "multi") => {
    setTripType(value);
    if (value === "multi" && multiStops.length === 0) {
      setMultiStops([{ location: "", date: "" }]);
    }
    if (value !== "multi") {
      setMultiStops([]);
    }
  };

  // ✅ Save current state into localStorage
  const saveTripData = () => {
    try {
      if (typeof window !== "undefined") {
        const data = {
          tripType,
          persons,
          pickupLocation,
          dropoffLocation,
          pickupDateTime,
          dropoffDateTime,
          multiStops,
          returnTrip,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (e) {
      console.error("Failed to save trip data:", e);
    }
  };

  // ✅ Next button handler
  const handleNext = () => {
    saveTripData();
    router.push("/services/page3");
  };

  return (
    <section className="w-full max-w-[1320px] mx-auto mt-[75px]  px-4 sm:px-6 md:px-4 2xl:px-[2px] bg-white">
      <div className="flex flex-col xl:flex-row lg:flex-col max-w-screen-3xl mx-auto px-4 sm:px-0 md:px-0 py-6 md:py-10 lg:py-10 lg:gap-8 xl:gap-10">
        {/* Left Panel */}
        <div className="w-full 2xl:w-[580px] xl:w-[600px] sm:max-w-[573px] mx-auto md:w-[580px]">
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center cursor-pointer mb-4 text-[#3DC1C4] hover:text-[#2da8ab] font-medium transition-colors duration-200"
          >
            <i className="fa-solid fa-arrow-left-long mr-2" />
            Back
          </button>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Plan Your Journey
          </h1>
          <p className="mt-2 text-base sm:text-lg text-gray-600">
            Create your perfect travel itinerary with our premium chauffeur
            service
          </p>

          {/* Accordion */}
          <details className="group mt-6 md:mt-8" open>
            <summary className="flex justify-between items-center py-4 cursor-pointer select-none list-none">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Itinerary
              </h2>
              <div className="flex items-center gap-2 sm:gap-4">
                <select
                  value={tripType}
                  onChange={(e) =>
                    handleTripTypeChange(
                      e.target.value as "single" | "return" | "multi"
                    )
                  }
                  className="border-2 w-[153px] border-[#E5E5E5] bg-white text-sm font-medium rounded-full px-4 py-2 focus:outline-none transition-all duration-100"
                >
                  <option value="single">Single Trip</option>
                  <option value="return">Round-Trip</option>
                  <option value="multi">Multi Stop</option>
                </select>
                <i className="fa-solid fa-chevron-down transition-transform duration-200 group-open:rotate-180" />
              </div>
            </summary>

            {/* Pickup Section */}
            <div className="border border-gray-200 rounded-2xl p-4 sm:p-6 mt-4 bg-[#FCFCFC] space-y-4 sm:space-y-6">
              <div className="sm:flex flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3DC1C4] flex justify-center items-center">
                    <img
                      src="/images/Mask group.png"
                      alt="pickup"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg text-[#3DC1C4] font-semibold">
                    Pickup
                  </h3>
                </div>
                <div className="sm:flex flex flex-wrap items-center gap-3">
                  <PersonCounter value={persons} onChange={setPersons} />
                  {tripType === "multi" && (
                    <button
                      onClick={() => handleAddStop()}
                      className="text-white font-semibold bg-[#3DBEC8] w-[119px] h-[36px] rounded-full"
                    >
                      + Add Stop
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="flex items-center gap-2 sm:gap-3">
                    <img
                      src="/images/Mask group1.png"
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      alt="location"
                    />
                    <Inputs
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      placeholder="Pickup Location"
                      className="w-full bg-transparent focus:outline-none text-sm placeholder-gray-400"
                      name="Pickup Location"
                    />
                  </label>
                  <div className="border-b border-gray-300" />
                </div>
                <div>
                  <label className="flex items-center gap-3 w-full sm:w-1/2">
                    <img
                      src="/images/Clock.png"
                      alt="date-time"
                      className="w-6 h-6 shrink-0"
                      loading="lazy"
                    />
                    <Inputs
                      name="Pickup Date & Time"
                      type="datetime-local"
                      value={pickupDateTime}
                      onChange={(e) => setPickupDateTime(e.target.value)}
                      className="w-full bg-transparent text-sm text-[#9C9C9C] focus:outline-none"
                    />
                  </label>
                  <div className="border-b border-gray-300" />
                </div>
              </div>
            </div>

            {/* Multi Stops */}
            {tripType === "multi" && multiStops.length > 0 && (
              <div className="space-y-4 mt-4">
                {multiStops.map((stop, index) => (
                  <StopCard
                    key={index}
                    id={index}
                    location={stop.location}
                    date={stop.date}
                    onAdd={() => handleAddStop(index)}
                    onRemove={() => handleRemoveStop(index)}
                    onChange={(id, data) =>
                      handleUpdateStop(id as number, data)
                    }
                  />
                ))}
              </div>
            )}

            {/* Dropoff Section */}
            {(tripType === "single" ||
              tripType === "return" ||
              tripType === "multi") && (
              <div className="border bg-[#FCFCFC] border-gray-200 rounded-2xl p-4 sm:p-6 mt-6 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3DC1C4] flex justify-center items-center">
                    <img
                      src="/images/Dropoff.png"
                      alt="dropoff"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#3DC1C4]">
                    Dropoff
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="flex items-center gap-2 sm:gap-3">
                      <img
                        src="/images/Mask group1.png"
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        alt="location"
                      />
                      <Inputs
                        name="Dropoff Location"
                        type="text"
                        value={dropoffLocation}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                        placeholder="Dropoff Location"
                        className="w-full bg-transparent focus:outline-none py-1 sm:py-2 text-sm sm:text-base placeholder-gray-400"
                      />
                    </label>
                    <div className="border-b border-gray-300" />
                  </div>
                </div>
              </div>
            )}

            {/* Return Section (only in round trip) */}
            {tripType === "return" && (
              <div className="border bg-[#FCFCFC] border-gray-200 rounded-2xl p-4 sm:p-6 mt-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3DC1C4] flex justify-center items-center">
                    <img
                      src="/images/Mask group.png"
                      alt="return"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#3DC1C4]">
                    Return
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 sm:gap-3">
                      <img
                        src="/images/Mask group1.png"
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        alt="location"
                      />
                      <Inputs
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="Pickup Location"
                        className="w-full bg-transparent focus:outline-none text-sm placeholder-gray-400"
                        name="Pickup Location"
                      />
                    </label>
                    <div className="border-b border-gray-300" />
                  </div>
                  <div>
                    {tripType === "return" && (
                      <div className="col-span-1 sm:col-span-1">
                        <label className="flex items-center gap-3 w-full  ">
                          <img
                            src="/images/Clock.png"
                            alt="return-date-time"
                            className="w-6 h-6 shrink-0"
                          />
                          <Inputs
                            name="Return Date & Time"
                            type="datetime-local"
                            value={dropoffDateTime}
                            onChange={(e) => setDropoffDateTime(e.target.value)}
                            className="w-full bg-transparent text-sm text-[#9C9C9C] focus:outline-none"
                          />
                        </label>
                      </div>
                    )}
                    <div className="border-b border-gray-300" />
                  </div>
                </div>
              </div>
            )}
          </details>

          <div className="border-t border-gray-200 my-6 md:my-8" />

          {/* Next Button */}
          <Button label="Next" onClick={handleNext} size="full" />
        </div>

        {/* Right Panel */}
        <div className="w-full lg:mx-auto lg:w-[100%] xl:w-[60%] 2xl:w-[70%] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 rounded-xl overflow-hidden">
          <MapCard
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
          />
        </div>
      </div>
    </section>
  );
};

export default PlanJourney;
