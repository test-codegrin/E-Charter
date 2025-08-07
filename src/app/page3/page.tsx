// app/page3/page.tsx (or app/next-page/page.tsx)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PersonCounter from "../components/PersonCounter";
import StopCard from "../components/StopCard";
import MapCard1 from "../components/MapCard1";
import Link from "next/link"; 

interface Stop {
  id: string;
  location: string;
  date: string;
}

export default function Page3() {
  const router = useRouter();
  const [tripType, setTripType] = useState<"single" | "return" | "multi">("multi");
  const [persons, setPersons] = useState<number>(0);
  const [stops, setStops] = useState<Stop[]>([
    { id: crypto.randomUUID(), location: "", date: "" },
  ]);

  const addStop = () =>
    setStops((prev) => [
      ...prev,
      { id: crypto.randomUUID(), location: "", date: "" },
    ]);

  const removeStop = (id: string | number) =>
    setStops((prev) => prev.filter((s) => s.id !== id));

  const updateStop = (id: string | number, data: { location: string; date: string }) =>
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));

  return (
    <section className="flex flex-col xl:flex-row min-h-screen lg:flex-col w-full sm:px-6 lg:px-8 xl:px-11 p-3 py-6">
      <div className="w-full 2xl:w-[580px] xl:w-[573px]  sm:max-w-[573px] mx-auto scroll-bar 2xl:ml-[0px] md:mx-auto md:w-[580px] lg:py-0">
        <button
          onClick={() => router.back()}
          className="flex items-center cursor-pointer mb-4 text-[#3DC1C4] hover:text-[#2da8ab] transition-colors"
        >
          <i className="fa-solid fa-arrow-left-long ml-2 mr-2" />
          <span className="text-sm sm:text-base">Back</span>
        </button>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Plan Your Journey
        </h1>
        <p className="mt-2 text-base sm:text-lg text-gray-600">
          Create your perfect travel itinerary with our premium chauffeur service
        </p>

        <details className="group w-full lg:w-[580px] mt-6 lg:mt-8" open>
          <summary className="flex flex-wrap items-center justify-between gap-3 py-4 select-none cursor-pointer">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Itinerary</h2>
            <div className="flex items-center gap-2 sm:gap-4">
              <select
                value={tripType}
                onChange={(e) =>
                  setTripType(e.target.value as "single" | "return" | "multi")
                }
                className="border-2 border-[#E5E5E5] bg-transparent rounded-full text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 sm:py-2"
              >
                <option value="single">Single Trip</option>
                <option value="return">Round‑Trip</option>
                <option value="multi">Multi Stop</option>
              </select>
              <i className="fa-solid fa-chevron-down w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-open:rotate-180" />
            </div>
          </summary>

          {/* Pickup Section */}
          <div className="border bg-[#FCFCFC] border-gray-200 2xl:w-[580px] w-full rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="md:flex flex-wrap items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3DC1C4] flex items-center justify-center">
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
              <div className="flex items-center gap-3">
                <PersonCounter value={persons} onChange={setPersons} />
                <button
                  onClick={addStop}
                  className="px-6 mt-[10px] md:mt-[0] sm:px-4 py-2 bg-[#3DC1C4] hover:bg-[#2da8ab] text-white text-xs sm:text-sm font-medium rounded-full"
                >
                  + Add Stop
                </button>
              </div>
            </div>
            <div className="grid gap-4 sm:gap-6 mt-3 sm:mt-5 sm:grid-cols-2">
              <div>
                <label className="flex items-center gap-2 sm:gap-3 w-full">
                  <img
                    src="/images/Mask group1.png"
                    alt="loc"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                  <input
                    type="text"
                    placeholder="Pickup Location"
                    className="w-full bg-transparent focus:border-[#3DC1C4] focus:outline-none py-1 sm:py-2 text-sm sm:text-base"
                  />
                </label>
                <div className="border-b border-gray-300" />
              </div>
              <div>
                <label className="flex items-center gap-2 sm:gap-3 w-full">
                  <img
                    src="/images/Clock.png"
                    alt="time"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                  <input
                    type="datetime-local"
                    className="w-full bg-transparent focus:border-[#3DC1C4] text-[#9C9C9C] py-1 sm:py-2 text-sm sm:text-base"
                  />
                </label>
                <div className="border-b border-gray-300" />
              </div>
            </div>
          </div>

          {/* Stop Cards */}
          <div className="space-y-4 lg:w-[580px] sm:space-y-6 mt-6 sm:mt-8">
            {stops.map((s) => (
              <StopCard
                key={s.id}
                {...s}
                onChange={updateStop}
                onRemove={removeStop}
                onAdd={addStop}
              />
            ))}
          </div>

          {/* Dropoff Section */}
          <div className="border bg-[#FCFCFC] border-gray-200 lg:w-[580px] w-full mt-6 sm:mt-8 rounded-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3DC1C4] flex items-center justify-center">
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
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <div>
                <label className="flex items-center gap-2 sm:gap-3 w-full">
                  <img
                    src="/images/Mask group1.png"
                    alt="loc"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                  <input
                    type="text"
                    placeholder="Dropoff Location"
                    className="w-full bg-transparent focus:border-[#3DC1C4] focus:outline-none py-1 sm:py-2 text-sm sm:text-base"
                  />
                </label>
                <div className="border-b border-gray-300" />
              </div>
              <div>
                <label className="flex items-center gap-2 sm:gap-3 w-full">
                  <img
                    src="/images/Clock.png"
                    alt="time"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                  <input
                    type="datetime-local"
                    className="w-full bg-transparent focus:border-[#3DC1C4] focus:outline-none py-1 sm:py-2 text-sm sm:text-base"
                  />
                </label>
                <div className="border-b border-gray-300" />
              </div>
            </div>
            <div className="bg-[#E5E5E5] text-center rounded-full py-2 sm:py-3 mt-4">
              <p className="text-xs sm:text-sm font-semibold">
                Arrives on Thursday, June 19 at 02:30 AM
              </p>
            </div>
          </div>
        </details>

        <div className="border-b border-1 mt-[20px] mb-[20px] md:w-[580px] border-gray-300" />

        {/* Trip Details Accordion */}
          <details className="md:w-[580px] w-full overflow-hidden" open>
            <summary className="flex items-center justify-between gap-4 cursor-pointer select-none">
              <h2 className="text-xl sm:text-2xl font-bold">Trip Details</h2>
              <i className="fa-solid fa-chevron-down w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="border-1 bg-[#FCFCFC] border-[#DBDBDB] mt-4 rounded-2xl p-5 space-y-6">
              {/* Trip Name */}
              <div>
                <p className="font-medium text-lg text-[#040401]">Trip Name</p>
                <input
                  type="text"
                  placeholder="Round trip"
                  className="text-sm text-[#333] mt-2 focus:border-[#3DC1C4] focus:outline-none w-full"
                />
                <div className="border-b border-[#DBDBDB] mt-4"></div>
              </div>

              {/* Luggage & Event Types */}
              <div className="flex flex-col md:flex-row md:gap-4 gap-6">
                <div className="w-full md:w-1/2">
                  <p className="font-medium text-lg text-[#040401]">Luggage</p>
                  <input
                    type="text"
                    placeholder="2"
                    className="text-sm mt-2 focus:border-[#3DC1C4] focus:outline-none w-full"
                  />
                  <div className="border-b border-[#DBDBDB] mt-4"></div>
                </div>
                <div className="w-full md:w-1/2">
                  <p className="font-medium text-lg text-[#040401]">Event Types</p>
                  <input
                    type="text"
                    placeholder="Personal"
                    className="text-sm text-[#333] focus:border-[#3DC1C4] focus:outline-none mt-2 w-full"
                  />
                  <div className="border-b border-[#DBDBDB] mt-4"></div>
                </div>
              </div>

              {/* Accessible Vehicle */}
              <div>
                <p className="font-medium text-lg text-[#040401] mb-3">Accessible Vehicle</p>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-6 h-6 border border-[#D9D9D9] rounded-sm accent-[#3DC1C4]"
                  />
                  <p className="text-sm lg:w-[350px]">ADA standards Compliant</p>
                  <img src="/images/wheel-chair.png" alt="wheelchair" className="w-[39px] h-[39px] lg:ml-auto" />
                </div>
              </div>
            </div>
          </details>

        <Link href="/page4">
          <button className="w-full max-w-[573px] h-12 mt-6 bg-[#3DBEC8] text-white font-bold text-sm rounded-full hover:bg-[#35aab1] transition-colors">
            Next
          </button>
        </Link>
      </div>

      {/* Map side */}
      <div className="w-full 2xl:ml-[30px] lg:w-full mt-[20px] xl:h-[877px] 2xl:w-full h-[877px] sm:h-[500px] md:h-[600px] lg:h-[calc(100vh-3rem)] overflow-hidden lg:sticky rounded-2xl lg:top-6">
        <MapCard1 />
      </div>
    </section>
  );
}