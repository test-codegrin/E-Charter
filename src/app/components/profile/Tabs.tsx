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
      <div className="w-full max-w-[1176px] bg-[#FCFCFC] mt-6 border border-[#DBDBDB] p-4 sm:p-6 rounded-[14px]">
        {/* Tab headers */}
        <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-6 border-b border-[#DBDBDB] text-base sm:text-lg font-medium overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative pb-2 transition whitespace-nowrap ${
                activeTab === tab.key
                  ? "text-primary font-semibold"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
              )}
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
