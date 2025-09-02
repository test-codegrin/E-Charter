"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import PersonCounter from "../../components/bookservice/PersonCounter";
import StopCard from "../../components/bookservice/StopCard";
import MapCard1 from "../../components/bookservice/MapCard1";
import Button from "../../components/ui/Button";
import Inputs from "../../components/ui/Inputs";

interface Stop {
  id: string;
  location: string;
  date: string;
}

export default function Page2() {
  const router = useRouter();
  const [tripType, setTripType] = useState<"single" | "return" | "multi">("multi");
  const [persons, setPersons] = useState<number>(1);

  // Pickup & Dropoff & Return
  const [pickup, setPickup] = useState({ location: "", date: "" });
  const [dropoff, setDropoff] = useState({ location: "", date: "" });
  const [returnTrip, setReturnTrip] = useState({ location: "", date: "" });

  // Multi Stops
  const [stops, setStops] = useState<Stop[]>([]);

  // Reset stops when tripType changes
  useEffect(() => {
    if (tripType !== "multi") {
      setStops([]); // clear stops for single/return
    } else if (stops.length === 0) {
      setStops([{ id: uuidv4(), location: "", date: "" }]);
    }
  }, [tripType]);

  const addStop = () =>
    setStops((prev) => [...prev, { id: uuidv4(), location: "", date: "" }]);

  const removeStop = (id: string | number) =>
    setStops((prev) => prev.filter((s) => s.id !== id));

  const updateStop = (
    id: string | number,
    data: { location: string; date: string }
  ) =>
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));

  return (
    <section className="w-full 2xl:max-h-[1000px] px-4 sm:px-6 md:px-4 2xl:px-[0px] mt-[75px] max-w-[1760px] mx-auto bg-white">
      <div className="flex flex-col xl:flex-row lg:flex-col max-w-screen-3xl mx-auto py-6 md:py-10 lg:gap-8 xl:gap-10">
        {/* Left Panel */}
        <div className="w-full 2xl:w-[580px] xl:w-[600px] sm:max-w-[573px] mx-auto md:w-[580px]">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center cursor-pointer mb-4 text-[#3DC1C4] hover:text-[#2da8ab] font-medium transition-colors"
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
                    setTripType(e.target.value as "single" | "return" | "multi")
                  }
                  className="border-2 w-[153px] border-[#E5E5E5] bg-white text-sm font-medium rounded-full px-4 py-2 focus:outline-none"
                >
                  <option value="single">Single Trip</option>
                  <option value="return">Round-Trip</option>
                  <option value="multi">Multi Stop</option>
                </select>
                <i className="fa-solid fa-chevron-down transition-transform duration-200 group-open:rotate-180" />
              </div>
            </summary>

            {/* Pickup Section */}
            <div className="border border-gray-200 rounded-2xl p-4 sm:p-6 mt-4 bg-[#FCFCFC] space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4">
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
                <div className="flex flex-wrap items-center gap-3">
                  <PersonCounter value={persons} onChange={setPersons} />
                  {tripType === "multi" && (
                    <button
                      onClick={addStop}
                      className="text-[#FFFFFF] font-semibold bg-[#3DBEC8] w-[119px] h-[36px] rounded-full"
                    >
                      + Add Stop
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-3">
                    <img
                      src="/images/Mask group1.png"
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      alt="location"
                    />
                    <Inputs
                      name="Pickup Location"
                      type="text"
                      placeholder="Pickup Location"
                      value={pickup.location}
                      onChange={(e) =>
                        setPickup((p) => ({ ...p, location: e.target.value }))
                      }
                      className="w-full bg-transparent focus:outline-none py-2 text-sm sm:text-base placeholder-gray-400"
                    />
                  </label>
                  <div className="border-b border-gray-300" />
                </div>
                <div>
                  <label className="flex items-center gap-3">
                    <img
                      src="/images/Clock.png"
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      alt="time"
                    />
                    <Inputs
                      name="Pickup Date & Time"
                      type="datetime-local"
                      value={pickup.date}
                      onChange={(e) =>
                        setPickup((p) => ({ ...p, date: e.target.value }))
                      }
                      className="w-full bg-transparent focus:outline-none text-gray-500 py-2 text-sm sm:text-base"
                    />
                  </label>
                  <div className="border-b border-gray-300" />
                </div>
              </div>
            </div>

            {/* Multi Stops */}
            {tripType === "multi" &&
              stops.map((s) => (
                <StopCard
                  key={s.id}
                  {...s}
                  onChange={updateStop}
                  onRemove={removeStop}
                  onAdd={addStop}
                />
              ))}

            {/* Dropoff Section */}
            {(tripType === "single" || tripType === "return" || tripType === "multi") && (
              <div className="border bg-[#FCFCFC] border-gray-200 rounded-2xl p-4 sm:p-6 mt-6 space-y-6">
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

                <div className="grid grid-cols-1">
                  <div>
                    <label className="flex items-center gap-3">
                      <img
                        src="/images/Mask group1.png"
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        alt="location"
                      />  
                      <Inputs
                        name="Dropoff Location"
                        type="text"
                        placeholder="Dropoff Location"
                        value={dropoff.location}
                        onChange={(e) =>
                          setDropoff((d) => ({ ...d, location: e.target.value }))
                        }
                        className="w-full bg-transparent focus:outline-none py-2 text-sm sm:text-base placeholder-gray-400"
                      />
                    </label>
                    <div className="border-b border-gray-300" />
                  </div>
                  {/* {tripType !== "single" && (
                    <div>
                      <label className="flex items-center gap-3">
                        <img
                          src="/images/Clock.png"
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          alt="time"
                        />
                        <Inputs
                          name="Dropoff Date & Time"
                          type="datetime-local"
                          value={dropoff.date}
                          onChange={(e) =>
                            setDropoff((d) => ({ ...d, date: e.target.value }))
                          }
                          className="w-full bg-transparent focus:outline-none text-gray-500 py-2 text-sm sm:text-base"
                        />
                      </label>
                      <div className="border-b border-gray-300" />
                    </div>
                  )} */}
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
                    <label className="flex items-center gap-3">
                      <img
                        src="/images/Mask group1.png"
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        alt="location"
                      />
                      <Inputs
                        name="Return Location"
                        type="text"
                        placeholder="Return Location"
                        value={returnTrip.location}
                        onChange={(e) =>
                          setReturnTrip((r) => ({ ...r, location: e.target.value }))
                        }
                        className="w-full bg-transparent focus:outline-none py-2 text-sm sm:text-base placeholder-gray-400"
                      />
                    </label>
                    <div className="border-b border-gray-300" />
                  </div>
                  <div>
                    <label className="flex items-center gap-3">
                      <img
                        src="/images/Clock.png"
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        alt="time"
                      />
                      <Inputs
                        name="Return Date & Time"
                        type="datetime-local"
                        value={returnTrip.date}
                        onChange={(e) =>
                          setReturnTrip((r) => ({ ...r, date: e.target.value }))
                        }
                        className="w-full bg-transparent focus:outline-none text-gray-500 py-2 text-sm sm:text-base"
                      />
                    </label>
                    <div className="border-b border-gray-300" />
                  </div>
                </div>
              </div>
            )}
          </details>

          <div className="border-t border-gray-200 my-8" />
          {/* Next Button */}
          <Button label="Next" href="/services/page3" size="full" />
        </div>

        {/* Right Panel */}
        <div className="w-full max-h-[877px] lg:mx-auto xl:w-[60%] 2xl:w-[70%] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 rounded-xl overflow-hidden">
          <MapCard1 />
        </div>
      </div>
    </section>
  );
}
