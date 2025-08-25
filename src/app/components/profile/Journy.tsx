"use client";

import { useState } from "react";

type Tab = "personal" | "payment" | "journey" | "password";

export default function MyJourneyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("journey");

  const tabs = [
    { key: "personal", label: "Personal Info" },
    { key: "payment", label: "Payment Method" },
    { key: "journey", label: "My Journey" },
    { key: "password", label: "Password" },
  ];

  const trips = [
    { id: 1, status: "Pending", color: "bg-[#FBBF244D] text-[#F59E0B]" },
    { id: 2, status: "Cancelled", color: "bg-[#EF44444D] text-[#EF4444]" },
    { id: 3, status: "Completed", color: "bg-[#10B9814D] text-[#10B981]" },
  ];

  return (
    <div className="w-full max-w-6xl">

      {/* My Journey */}
      {activeTab === "journey" && (
        <div>
          <h2 className="text-[22px] font-semibold text-cyan-500 mb-4">
            My Journey
          </h2>

          <div className="space-y-4">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="border border-[#DBDBDB] rounded-lg bg-[#FFFFFF] p-4 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                {/* Trip Info */}
                <div className="flex flex-col gap-4">
                  <p className="font-bold text-lg">Singal Trip</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="w-[206.39px] h-[62.19px] border-r-2 sm:ml-[0] border-[#ECECEC]">
                      <label className="text-lg font-semibold text-[#000000]">
                        Pickup Location
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Location"
                        className="mt-1 w-full focus:outline-none text-sm"
                      />
                    </div>

                    <div className="w-[206.39px] h-[62.19px] border-r-2 border-[#ECECEC] sm:ml-[20px]">
                      <label className="text-lg font-semibold text-[#000000]">
                        Drop Off Location
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Location"
                        className="mt-1 w-full focus:outline-none text-sm"
                      />
                    </div>

                    <div className="w-[206.39px] h-[62.19px] border-r-2 border-[#ECECEC] sm:ml-[20px]">
                      <label className="text-lg font-semibold text-[#000000]">
                        Departure Date
                      </label>
                      <input
                        type="date"
                        className="mt-1 w-[180px] focus:outline-none text-sm"
                      />
                    </div>

                    <div className="w-[206.39px] h-[62.19px] border-r-2 border-[#ECECEC] sm:ml-[20px]">
                      <label className="text-lg font-semibold text-[#000000]">
                        Return Date
                      </label>
                      <input
                        type="date"
                        className="mt-1 w-[180px] focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`mt-4 md:mt-[40px] w-[119px] h-[36px] pt-[5px] pl-[25px] inline-flex rounded-full text-base font-semibold self-start md:self-center ${trip.color}`}
                >
                  {trip.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {activeTab === "personal" && (
        <div className="mt-6 text-gray-600">Personal Info content here...</div>
      )}
      {activeTab === "payment" && (
        <div className="mt-6 text-gray-600">Payment Method content here...</div>
      )}
      {activeTab === "password" && (
        <div className="mt-6 text-gray-600">Password content here...</div>
      )}
    </div>
  );
}
