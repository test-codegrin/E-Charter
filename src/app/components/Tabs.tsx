"use client";

import { useState } from "react";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { key: "personal", label: "Personal Info" },
    { key: "payment", label: "Payment Method" },
    { key: "journey", label: "My Journey" },
    { key: "password", label: "Password" },
  ];

  return (
    <div className="w-full max-w-[1176px] bg-[#FCFCFC] mt-6 border border-[#DBDBDB] p-6 rounded-[14px]">
      {/* Tab headers */}
      <div className="flex gap-6 border-b pb-2 text-lg font-medium">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`${
              activeTab === tab.key ? "text-[#3DBEC8]" : "text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "personal" && (
        <div className="mt-4">
          <h3 className="text-[22px] font-semibold text-[#3DBEC8] mb-4">
            Personal Info
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="text-lg text-[#040401] font-medium">First Name</p>
              <p className="border-b mt-[15px]"></p>
            </div>
            <div>
              <p className="text-lg text-[#040401] font-medium">Last Name</p>
              <p className="border-b mt-[15px]"></p>
            </div>
            <div>
              <p className="text-lg text-[#040401] font-medium">Email Address</p>
              <p className="border-b mt-[15px]"></p>
            </div>
            <div>
              <p className="text-lg text-[#040401] font-medium">Phone Number</p>
              <p className="border-b mt-[15px]"></p>
            </div>
            <div>
              <p className="text-lg text-[#040401] font-medium">City</p>
              <p className="border-b mt-[15px]"></p>
            </div>
            <div>
              <p className="text-lg text-[#040401] font-medium">Zip Cord</p>
              <p className="border-b mt-[15px]"></p>
            </div>
            <div className="col-span-2">
              <p className="text-lg text-[#040401] font-medium">Address</p>
              <p className="border-b mt-[15px]"></p>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button className="bg-[#3DBEC8] font-bold text-base text-[#FFFFFF] px-6 py-2 rounded-full">
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
