"use client";

import React, { FC } from "react";

const Choice: FC = () => {
  return (
    <div className="max-w-[1920px] px-4 md:px-6 lg:px-8 py-16">
      <div className="max-w-[1464px] mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-10">
        {/* Image Section */}
        <div className="w-full lg:w-[650px] flex justify-center">
          <img
            src="/homePage/choice.png"
            alt="Choice"
            className="w-3/4 md:w-2/3 lg:w-full h-auto object-contain mx-auto"
          />
        </div>

        {/* Text Content */}
        <div className="w-full lg:w-[814px] flex justify-center">
          <div className="w-full max-w-[671px]">
            <p className="text-base font-semibold text-[#3DBEC8] mb-2">
              ∗ About Us
            </p>
            <p className="text-[28px] md:text-[36px] lg:text-[44px] font-bold leading-tight">
              Your go-to choice for affordable &amp; safe car rentals
            </p>
            <p className="text-base font-medium text-left leading-[27.2px] mt-4 md:max-w-[545px]">
              Experience the freedom of travel with our wide range of
              well-maintained vehicles, unbeatable prices, and friendly service.
              Whether you're heading to a business meeting or planning a weekend
              getaway, we’ve got the perfect ride for you.
            </p>

            {/* Feature 1 */}
            <div className="flex mt-8 items-start">
              <img
                src="/homePage/reservation.svg"
                alt="Reservation"
                className="w-12 h-12"
              />
              <div className="ml-6">
                <p className="text-[18px] md:text-[20px] font-bold">
                  Fast &amp; Hassle-Free Reservations
                </p>
                <p className="text-base text-[#616161] font-medium mt-2 md:max-w-[430px]">
                  We’ve streamlined our booking system so you can reserve your
                  vehicle in just a few clicks—anytime, anywhere.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex mt-8 items-start">
              <img
                src="/homePage/flexible.png"
                alt="Flexible"
                className="w-12 h-12"
              />
              <div className="ml-6">
                <p className="text-[18px] md:text-[20px] font-bold">
                  Flexible Pick-Up &amp; Drop-Off Locations
                </p>
                <p className="text-base text-[#616161] font-medium mt-2 md:max-w-[430px]">
                  Pick up your rental from one place and drop it off at another.
                  We offer flexible options that fit your travel needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choice;
