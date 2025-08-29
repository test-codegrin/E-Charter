// app/page3/page.tsx (or app/next-page/page.tsx)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PersonCounter from "../../components/bookservice/PersonCounter";
import StopCard from "../../components/bookservice/StopCard";
import MapCard1 from "../../components/bookservice/MapCard1";
import Button from "../../components/ui/Button";
import Inputs from "../../components/ui/Inputs";
import Input from "../../components/ui/Inputs";

// ✅ Fallback ID generator (instead of crypto.randomUUID)
function generateId() {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

interface Stop {
  id: string;
  location: string;
  date: string;
}

export default function Page3() {
  const router = useRouter();
  const [tripType, setTripType] = useState<"single" | "return" | "multi">(
    "multi"
  );

  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [persons, setPersons] = useState<number>(1);
  const [stops, setStops] = useState<Stop[]>([
    { id: generateId(), location: "", date: "" }, // ✅ fixed
  ]);

  const addStop = () =>
    setStops((prev) => [
      ...prev,
      { id: generateId(), location: "", date: "" }, // ✅ fixed
    ]);

  const removeStop = (id: string | number) =>
    setStops((prev) => prev.filter((s) => s.id !== id));

  const updateStop = (
    id: string | number,
    data: { location: string; date: string }
  ) =>
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));

  return (
    <section className="w-full mt-[75px] md:max-h-[977px] max-w-[1760px] mx-auto bg-white">
      {/* Main Content */}
      <div className="flex flex-col xl:flex-row lg:flex-col max-w-screen-3xl mx-auto px-4 sm:px-0 py-6 md:py-10 lg:py-10 lg:gap-8 xl:gap-10">
        {/* Left Panel */}
        <div className="w-full max-h-[877px] overflow-scroll 2xl:w-[580px] xl:w-[600px] sm:max-w-[573px] mx-auto scroll-bar 2xl:ml-[0px] md:mx-auto md:w-[580px] lg:py-0">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
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
                    setTripType(e.target.value as "single" | "return" | "multi")
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
              <div className="md:flex flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3DC1C4] flex justify-center items-center flex-shrink-0">
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
                  {tripType === "multi" && (
                    <button
                      onClick={() => addStop()}
                      className="text-[#FFFFFF] font-semibold bg-[#3DBEC8] w-[119px] h-[36px] rounded-full"
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
                      name="Pickup Location"
                      type="text"
                      placeholder="Pickup Location"
                      className="w-full bg-transparent focus:outline-none py-1 sm:py-2 text-sm sm:text-base placeholder-gray-400" 
                      onChange={handleChange}                    
                    />
                  </label>
                  <div className="border-b border-gray-300" />
                </div>
                <div>
                  <label className="flex items-center gap-2 sm:gap-3">
                    <img
                      src="/images/Clock.png"
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      alt="time"
                    />
                    <Inputs
                      name="Pickup Date & Time"
                      type="datetime-local"
                      className="w-full bg-transparent focus:outline-none text-gray-500 py-1 sm:py-2 text-sm sm:text-base" 
                      onChange={handleChange}                   
                    />
                  </label>
                  <div className="border-b border-gray-300" />
                </div>
              </div>
            </div>

            {/* Multi Stops */}
            {stops.map((s) => (
                <StopCard
                  key={s.id}
                  {...s}
                  onChange={updateStop}
                  onRemove={removeStop}
                  onAdd={addStop}
                />
              ))}

            {/* Dropoff Section */}
            {(tripType === "return" || tripType === "multi") && (
              <div className="border bg-[#FCFCFC] border-gray-200 rounded-2xl p-4 sm:p-6 mt-6 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3DC1C4] flex justify-center items-center flex-shrink-0">
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
                  <div>
                    <label className="flex items-center gap-2 sm:gap-3">
                      <img
                        src="/images/Mask group1.png"
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        alt="location"
                      />
                      <Inputs
                        name="Dropoff Location"
                        type="text"
                        placeholder="Dropoff Location"
                        className="w-full bg-transparent focus:outline-none py-1 sm:py-2 text-sm sm:text-base placeholder-gray-400" 
                        onChange={handleChange}                    
                      />
                    </label>
                    <div className="border-b border-gray-300" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 sm:gap-3">
                      <img
                        src="/images/Clock.png"
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        alt="time"
                      />
                      <Inputs
                        name="Dropoff Date & Time"
                        type="datetime-local"
                        className="w-full bg-transparent focus:outline-none text-gray-500 py-1 sm:py-2 text-sm sm:text-base" 
                        onChange={handleChange}                      
                      />
                    </label>
                    <div className="border-b border-gray-300" />
                  </div>
                </div>
              </div>
            )}
          </details>

          <div className="border-t border-gray-200 my-6 md:my-8" />

          {/* Trip Details Accordion */}
          <details className="md:w-[550px] w-full overflow-hidden" open>
            <summary className="flex items-center justify-between gap-4 cursor-pointer select-none">
              <h2 className="text-xl sm:text-2xl font-bold">Trip Details</h2>
              <i className="fa-solid fa-chevron-down transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="border-1 bg-[#FCFCFC] border-[#DBDBDB] mt-4 rounded-2xl p-5 space-y-6">
              {/* Trip Name */}
              <div>
                <p className="font-medium text-lg text-[#040401]">Trip Name</p>
                <Inputs
                  name="Trip Name"
                  type="text"
                  placeholder="Round trip"
                  className="text-sm text-[#333] mt-2 focus:border-[#3DC1C4] focus:outline-none w-full" 
                  onChange={handleChange}                
                />
                <div className="border-b border-[#DBDBDB] mt-4"></div>
              </div>

              {/* Luggage & Event Types */}
              <div className="flex flex-col md:flex-row md:gap-4 gap-6">
                <div className="w-full md:w-1/2">
                  <p className="font-medium text-lg text-[#040401]">Luggage</p>
                  <Inputs
                    name="Luggage"
                    type="text"
                    placeholder="2"
                    className="text-sm mt-2 focus:border-[#3DC1C4] focus:outline-none w-full" 
                    onChange={handleChange}                  
                  />
                  <div className="border-b border-[#DBDBDB] mt-4"></div>
                </div>
                <div className="w-full md:w-1/2">
                  <p className="font-medium text-lg text-[#040401]">
                    Event Types
                  </p>
                  <Inputs
                    name="Event Types"
                    type="text"
                    placeholder="Personal"
                    className="text-sm text-[#333] focus:border-[#3DC1C4] focus:outline-none mt-2 w-full" 
                    onChange={handleChange}                  
                  />
                  <div className="border-b border-[#DBDBDB] mt-4"></div>
                </div>
              </div>

              {/* Accessible Vehicle */}
              <div>
                <p className="font-medium text-lg text-[#040401] mb-3">
                  Accessible Vehicle
                </p>
                <div className="flex items-center gap-3">
                  <Inputs
                    name="Accessible Vehicle"
                    type="checkbox"
                    className="w-6 h-6 border border-[#D9D9D9] rounded-sm accent-[#3DC1C4]" onChange={handleChange}                  
                  />
                  <p className="text-sm lg:w-[350px]">
                    ADA standards Compliant
                  </p>
                  <img
                    src="/images/Wheel-chair.png"
                    alt="wheelchair"
                    className="w-[39px] h-[39px] lg:ml-auto"
                  />
                </div>
              </div>
            </div>
          </details>

          <div className="mt-[20px]">
            {/* Next Buttons */}
            <Button label="Next" href="/services/page4" size="full" />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full max-h-[877px] lg:mx-auto xl:w-[60%] 2xl:w-[70%] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 rounded-xl overflow-hidden">
          <MapCard1 />
        </div>
      </div>
    </section>
  );
}
