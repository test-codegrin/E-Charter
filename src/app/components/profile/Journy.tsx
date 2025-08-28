// File: src/app/my-journey/page.tsx
"use client";

import { useState } from "react";
import Inputs from "../ui/Inputs";

type Tab = "personal" | "payment" | "journey" | "password";

type Trip = {
  id: number;
  pickup: string;
  dropoff: string;
  departureDate: string;
  returnDate: string;
  status: string;
  color: string;
};

export default function MyJourneyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("journey");

  const tabs = [
    { key: "personal", label: "Personal Info" },
    { key: "payment", label: "Payment Method" },
    { key: "journey", label: "My Journey" },
    { key: "password", label: "Password" },
  ];

  const [trips, setTrips] = useState<Trip[]>([
    { id: 1, pickup: "", dropoff: "", departureDate: "", returnDate: "", status: "Pending", color: "bg-[#FBBF244D] text-[#F59E0B]" },
    { id: 2, pickup: "", dropoff: "", departureDate: "", returnDate: "", status: "Cancelled", color: "bg-[#EF44444D] text-[#EF4444]" },
    { id: 3, pickup: "", dropoff: "", departureDate: "", returnDate: "", status: "Completed", color: "bg-[#10B9814D] text-[#10B981]" },
  ]);

  const handleTripChange = (
    id: number,
    field: keyof Trip,
    value: string
  ) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === id ? { ...trip, [field]: value } : trip
      )
    );
  };

  return (
    <div className="w-full max-w-[1760px] mx-auto">
      {/* Tabs Navigation */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as Tab)}
            className={`pb-2 text-lg font-semibold ${
              activeTab === tab.key
                ? "text-[#3DBEC8] border-b-2 border-[#3DBEC8]"
                : "text-gray-500 hover:text-[#3DBEC8]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Journey Tab */}
      {activeTab === "journey" && (
        <div>
          <h2 className="text-[22px] font-semibold text-cyan-500 mb-4">
            My Journey
          </h2>

          <div className="space-y-4">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="border border-[#DBDBDB] rounded-lg bg-white p-4 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                {/* Trip Info */}
                <div className="flex flex-col gap-4">
                  <p className="font-bold text-lg">Single Trip</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Pickup */}
                    <div className="w-[206px]">
                      <label className="text-lg font-semibold text-black">
                        Pickup Location
                      </label>
                      <Inputs
                        type="text"
                        name="pickup"
                        value={trip.pickup}
                        placeholder="Enter Location"
                        onChange={(e) =>
                          handleTripChange(trip.id, "pickup", e.target.value)
                        }
                        className="mt-1 w-full focus:outline-none text-sm border-b border-gray-300"
                      />
                    </div>

                    {/* Dropoff */}
                    <div className="w-[206px]">
                      <label className="text-lg font-semibold text-black">
                        Drop Off Location
                      </label>
                      <Inputs
                        type="text"
                        name="dropoff"
                        value={trip.dropoff}
                        placeholder="Enter Location"
                        onChange={(e) =>
                          handleTripChange(trip.id, "dropoff", e.target.value)
                        }
                        className="mt-1 w-full focus:outline-none text-sm border-b border-gray-300"
                      />
                    </div>

                    {/* Departure Date */}
                    <div className="w-[206px]">
                      <label className="text-lg font-semibold text-black">
                        Departure Date
                      </label>
                      <Inputs
                        type="date"
                        name="departureDate"
                        value={trip.departureDate}
                        onChange={(e) =>
                          handleTripChange(trip.id, "departureDate", e.target.value)
                        }
                        className="mt-1 w-[180px] focus:outline-none text-sm border-b border-gray-300"
                      />
                    </div>

                    {/* Return Date */}
                    <div className="w-[206px]">
                      <label className="text-lg font-semibold text-black">
                        Return Date
                      </label>
                      <Inputs
                        type="date"
                        name="returnDate"
                        value={trip.returnDate}
                        onChange={(e) =>
                          handleTripChange(trip.id, "returnDate", e.target.value)
                        }
                        className="mt-1 w-[180px] focus:outline-none text-sm border-b border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`mt-4 md:mt-0 w-[119px] h-[36px] flex items-center justify-center rounded-full text-base font-semibold self-start md:self-center ${trip.color}`}
                >
                  {trip.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personal Info */}
      {activeTab === "personal" && (
        <div className="mt-6 text-gray-600">Personal Info content here...</div>
      )}

      {/* Payment */}
      {activeTab === "payment" && (
        <div className="mt-6 text-gray-600">Payment Method content here...</div>
      )}

      {/* Password */}
      {activeTab === "password" && (
        <div className="mt-6 text-gray-600">Password content here...</div>
      )}
    </div>
  );
}
