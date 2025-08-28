"use client";
import React, { FC } from "react";
import Button from "../ui/Button";

const BookCar: FC = () => {
  return (
    <section className="w-full mt-[80px] max-w-[1760px] mx-auto flex justify-center">
      <div className="w-full max-w-[1480px]">
        <div className="w-full rounded-2xl md:rounded-3xl lg:rounded-4xl bg-[#21211D] flex flex-col lg:flex-row items-center p-6 md:p-8 lg:p-12 xl:p-16">
          {/* Text content - order changes based on screen size */}
          <div className="w-full lg:w-1/2 text-center lg:text-left lg:pr-8 xl:pr-12 order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] text-white font-bold leading-tight sm:leading-tight md:leading-tight lg:leading-tight">
              Ready to hit the road? Book your car today!
            </h2>
            <p className="text-sm sm:text-base text-white font-medium leading-relaxed mt-4 md:mt-6 max-w-xl lg:max-w-none mx-auto lg:mx-0">
              Our friendly customer service team is here to help. Contact us
              anytime for support and inquiries.
            </p>
            <Button label="Contact Us" href="/contactus" size="md" variant="primary" className="mt-6 md:mt-8" />
          </div>

          {/* Image container */}
          <div className="w-full lg:w-1/2 flex justify-center items-center order-1 lg:order-2 mb-6 lg:mb-0">
            <img
              src="/homePage/book-car.png"
              alt="Car ready to book"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookCar;