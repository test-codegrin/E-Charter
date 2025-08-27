// app/quality/page.tsx
"use client";

import React from "react";

function Quality() {

  return (
    <div className="px-4 max-w-[1760px] w-full mx-auto mt-[80px]">
      <div className="max-w-[1500px] w-full mx-auto">
        {/* Section Title */}
        <p className="text-[#3DBEC8] text-base font-bold text-center">
          ∗ Why Choose Us
        </p>
        <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[44px] text-[#040401] mx-auto leading-snug text-center font-bold max-w-[600px] mt-2">
          Unmatched Quality and Service for Your Needs
        </h2>

        {/* Content Section */}
        <div className="flex lg:flex-row justify-between items-center mt-10 gap-10">
          {/* Left Services */}
          <div className="flex flex-col items-start">
            <div className="w-full max-w-[422px] border-b border-gray-200 flex my-6">
              <img src="/images/Extensive.png" alt="Extensive Fleet" className="h-[50px]" />
              <div className="ms-6">
                <p className="text-[20px] font-semibold">Extensive Fleet Options</p>
                <p className="text-base pb-[20px] font-semibold pt-2 text-[#616161] text-left">
                  Choose from a wide range of luxury vehicles tailored to suit your style, comfort, and travel needs.
                </p>
              </div>
            </div>
            
            <div className="w-full max-w-[422px] flex">
              <img src="/images/Customer.png" alt="Customer Focused" className="h-[50px]" />
              <div className="ms-6">
                <p className="text-[20px] font-semibold">Customer-Focused Experience</p>
                <p className="text-base font-semibold pt-2 text-[#616161] text-left">
                  We’re dedicated to ensuring a smooth, personalized, and hassle-free journey from start to finish.
                </p>
              </div>
            </div>
          </div>

          {/* Middle Image (only on large screens) */}
          <div className="lg:block">
            <img src="/images/Quality.png" alt="Quality" className="max-w-full" />
          </div>

          {/* Right Services */}
          <div className="flex flex-col items-start">
            <div className="w-full max-w-[422px] border-b border-gray-200 flex my-6">
              <img src="/images/Convenient.png" alt="Convenient Locations" className="h-[50px]" />
              <div className="ms-6">
                <p className="text-[20px] font-semibold">Convenient Locations</p>
                <p className="text-base pb-[20px] font-semibold pt-2 text-[#616161] text-left">
                  With multiple hubs across the city, we’re always just around the corner—ready when you need us.
                </p>
              </div>
            </div>

            <div className="w-full max-w-[422px] flex">
              <img src="/images/Reliability.png" alt="Reliability & Safety" className="h-[50px]" />
              <div className="ms-6">
                <p className="text-[20px] font-semibold">Reliability and Safety</p>
                <p className="text-base font-semibold pt-2 text-[#616161] text-left">
                  Travel confidently with our well-maintained fleet and trusted chauffeurs who prioritize your safety.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};
export default Quality;
