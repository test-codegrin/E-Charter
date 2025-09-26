"use client";

import React, { FC } from "react";

const Choice: FC = () => {
  return (
    <section className="w-full lg:w-[960px] md:w-[704px] xl:w-full mx-auto mt-[80px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center gap-8 md:gap-10 lg:gap-12 xl:gap-16">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src="/homePage/choice.png"
            alt="Choice"
            className="w-full max-w-md md:max-w-lg lg:max-w-full h-auto object-contain"
          />
        </div>

        {/* Text Content */}
        <div className="w-full lg:w-1/2">
          <div className="w-full max-w-2xl mx-auto lg:mx-0">
            <p className="text-base font-semibold text-primary mb-2 md:mb-3">
              ∗ About Us
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight sm:leading-tight md:leading-tight">
              Your go-to choice for affordable &amp; safe car rentals
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed mt-4 md:mt-6">
              Experience the freedom of travel with our wide range of
              well-maintained vehicles, unbeatable prices, and friendly service.
              Whether you're heading to a business meeting or planning a weekend
              getaway, we've got the perfect ride for you.
            </p>

            {/* Feature 1 */}
            <div className="flex mt-6 md:mt-8 items-start">
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                <img
                  src="/homePage/reservation.svg"
                  alt="Reservation"
                  className="w-8 h-8 md:w-10 md:h-10"
                />
              </div>
              <div className="ml-4 md:ml-6">
                <h3 className="text-lg md:text-xl font-bold">
                  Fast &amp; Hassle-Free Reservations
                </h3>
                <p className="text-sm md:text-base text-gray-600 font-medium mt-1 md:mt-2">
                  We've streamlined our booking system so you can reserve your
                  vehicle in just a few clicks—anytime, anywhere.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex mt-6 md:mt-8 items-start">
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                <img
                  src="/homePage/flexible.png"
                  alt="Flexible"
                  className="w-8 h-8 md:w-10 md:h-10"
                />
              </div>
              <div className="ml-4 md:ml-6">
                <h3 className="text-lg md:text-xl font-bold">
                  Flexible Pick-Up &amp; Drop-Off Locations
                </h3>
                <p className="text-sm md:text-base text-gray-600 font-medium mt-1 md:mt-2">
                  Pick up your rental from one place and drop it off at another.
                  We offer flexible options that fit your travel needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Choice;
