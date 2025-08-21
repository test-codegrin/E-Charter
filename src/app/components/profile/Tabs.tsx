"use client";

import { useState } from "react";
import Personal from "../profile/Personal";
import Payment from "../profile/Payment";
import Journy from "../profile/Journy";
import Password from "../profile/Password";


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
      <div className="flex gap-6 border-b border-[#DBDBDB] text-lg font-medium">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={` ${
              activeTab === tab.key
                ? "text-[#3DBEC8] pt-[]"
                : "text-gray-600"
            }`}
          >
            {tab.label}
            <p 
              className={`2xl:w-[1116px]${
                activeTab === tab.key
                  ? "text-[#3DBEC8] border-b-2 border-[#3DBEC8]"
                  : "text-gray-600"
              }`}
            ></p>
          </button>
        ))}
      </div>

      {/* PERSONAL INFO TAB */}
      {activeTab === "personal" && (
        <div className="mt-6">
          <Personal />
        </div>
      )}

      {/* PAYMENT TAB */}
      {activeTab === "payment" && (
        <div className="mt-6">
          <Payment />
        </div>
      )}

      {/* JOURNEY TAB */}
      {activeTab === "journey" && (
        <div className="mt-6">
          <Journy />
        </div>
      )}

      {/* PASSWORD TAB */}
      {activeTab === "password" && (
        <div className="mt-6">
          <Password />
        </div>
      )}
    </div>
  );
}
