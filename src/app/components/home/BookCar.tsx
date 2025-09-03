"use-client";
import React, { FC } from "react";
import Button from "../ui/Button";


const BookCar: FC = () => {
  return (
    <>
      <div className="mt-11 flex justify-center">
        <div className="h-auto lg:h-[569px] w-full max-w-[1480px] flex items-center">
          <div className="lg:h-[365px] w-full lg:w-[1480px] rounded-4xl bg-[#21211D] flex flex-col md:flex-col lg:flex-row items-center p-6 lg:p-0">
            {/* Image - shown first on md/sm, hidden on lg */}
            <div className="w-full flex justify-center order-1 md:order-1 lg:hidden mb-6">
              <img 
                src="/homePage/book-car.png" 
                alt="Car ready to book" 
                className="h-auto max-h-[300px] md:max-h-[400px]" 
              />
            </div>

            {/* Text content */}
            <div className="lg:h-[265px] w-full lg:w-[500px] mx-auto lg:mx-18 text-center lg:text-left order-2 md:order-2 lg:order-1">
              <p className="text-3xl lg:text-[44px] text-[#FFFFFF] font-bold">
                Ready to hit the road? Book your car today!
              </p>
              <p className="text-base text-[#FFFFFF] font-medium leading-[27px] mt-4">
                Our friendly customer service team is here to help. Contact us
                anytime for support and inquiries.
              </p>
              <Button label="Contact Us" href="/contactus" size="md" variant="primary" className="mt-6 md:mt-8" />
            </div>

            {/* Image - shown only on lg screens */}
            <div className="hidden lg:flex lg:justify-center lg:items-center lg:order-2">
              <img 
                src="/homePage/book-car.png" 
                alt="Car ready to book" 
                className="z-20 h-[569px] mt-[-60px]" 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookCar; 