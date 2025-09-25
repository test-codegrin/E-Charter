// app/quality/page.tsx
"use client";

import React from "react";

function Quality() {
  return (
    <div className="px-4 lg:px-0 max-w-[1320px] lg:w-[960px] md:w-[704px] xl:w-full w-full mx-auto mt-16 sm:mt-20">
      <div className="max-w-[1500px] w-full mx-auto">
        {/* Section Title */}
        <p className="text-primary text-sm sm:text-base font-bold text-center">
          ∗ Why Choose Us
        </p>
        <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[44px] text-[#040401] mx-auto leading-snug text-center font-bold max-w-[650px] mt-2">
          Unmatched Quality and Service for Your Needs
        </h2>

        {/* Content Section */}
        <div className="flex flex-col xl:flex-row justify-between items-center mt-10 gap-10 lg:gap-16">
          {/* Left Services */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="w-full max-w-[422px] border-b border-gray-200 flex my-6">
              <img
                src="/images/Extensive.png"
                alt="Extensive Fleet"
                className="h-[50px] w-[50px] object-contain"
              />
              <div className="ms-6 text-center sm:text-left">
                <p className="text-[18px] sm:text-[20px] font-semibold">
                  Extensive Fleet Options
                </p>
                <p className="text-sm sm:text-base pb-4 sm:pb-5 font-medium pt-2 text-[#616161]">
                  Choose from a wide range of luxury vehicles tailored to suit your style, comfort, and travel needs.
                </p>
              </div>
            </div>

            <div className="w-full max-w-[422px] flex">
              <img
                src="/images/Customer.png"
                alt="Customer Focused"
                className="h-[50px] w-[50px] object-contain"
              />
              <div className="ms-6 text-center sm:text-left">
                <p className="text-[18px] sm:text-[20px] font-semibold">
                  Customer-Focused Experience
                </p>
                <p className="text-sm sm:text-base font-medium pt-2 text-[#616161]">
                  We’re dedicated to ensuring a smooth, personalized, and hassle-free journey from start to finish.
                </p>
              </div>
            </div>
          </div>

          {/* Middle Image */}
          <div className="w-full max-w-[500px] lg:max-w-[600px]">
            <img
              src="/images/Quality.png"
              alt="Quality"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Right Services */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="w-full max-w-[422px] border-b border-gray-200 flex my-6">
              <img
                src="/images/Convenient.png"
                alt="Convenient Locations"
                className="h-[50px] w-[50px] object-contain"
              />
              <div className="ms-6 text-center sm:text-left">
                <p className="text-[18px] sm:text-[20px] font-semibold">
                  Convenient Locations
                </p>
                <p className="text-sm sm:text-base pb-4 sm:pb-5 font-medium pt-2 text-[#616161]">
                  With multiple hubs across the city, we’re always just around the corner—ready when you need us.
                </p>
              </div>
            </div>

            <div className="w-full max-w-[422px] flex">
              <img
                src="/images/Reliability.png"
                alt="Reliability & Safety"
                className="h-[50px] w-[50px] object-contain"
              />
              <div className="ms-6 text-center sm:text-left">
                <p className="text-[18px] sm:text-[20px] font-semibold">
                  Reliability and Safety
                </p>
                <p className="text-sm sm:text-base font-medium pt-2 text-[#616161]">
                  Travel confidently with our well-maintained fleet and trusted chauffeurs who prioritize your safety.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quality;
