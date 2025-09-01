"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/ui/Button";
import Inputs from "../../components/ui/Inputs";

function Page5() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiration: "",
    securityCode: "",
    address: "",
    adaCompliant: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleReserveClick = () => {
    const { name, cardNumber, expiration, securityCode, address } = formData;

    if (!name || !cardNumber || !expiration || !securityCode || !address) {
      alert("Please fill in all required fields.");
      return;
    }

    alert("Your trip has been booked successfully!");
    router.push("/");
  };

  return (
    <div className="mt-[70px] px-4 sm:px-6 md:px-4 2xl:px-2 md:max-h-[1150px] max-w-[1760px] mx-auto">
      <div className="bg-white text-gray-900 min-h-screen">
        <div className="max-w-7xl sm:w-[573px] lg:w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-3xl sm:text-4xl xl:ml-[85px] font-bold 2xl:ml-[90px] mb-10">
            Your trip is ready to book!
          </p>

          <div className="flex flex-col align-center justify-center lg:flex-row gap-6 lg:gap-8">
            {/* Payment Info */}
            <div className="bg-[#FCFCFC] md:w-[586px] pt-6 pb-8 px-6 sm:px-8 border border-[#DBDBDB] rounded-2xl">
              <p className="text-lg sm:text-xl font-medium">
                Payment Information
              </p>

              <div className="mt-6 space-y-6">
                <div>
                  <Inputs
                    name="Name on Card"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Name"
                    className="text-sm w-full bg-transparent focus:border-[#3DC1C4] focus:outline-none"
                  />
                  <div className="border-b border-[#DBDBDB] mt-2"></div>
                </div>

                <div className="mt-8">
                  <p className="text-lg font-medium">Card Number</p>
                  <Inputs
                    name="Card Number"
                    type="text"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="Enter card number"
                    className="text-sm mt-2 w-full bg-transparent focus:border-[#3DC1C4] focus:outline-none"
                  />
                  <div className="border-b border-[#DBDBDB] mt-2"></div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex-1">
                    <p className="text-lg font-medium">Expiration</p>
                    <Inputs
                      type="text"
                      name="expiration"
                      value={formData.expiration}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="text-sm mt-2 w-full bg-transparent focus:border-[#3DC1C4] focus:outline-none"
                    />
                    <div className="border-b border-[#DBDBDB] mt-2"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-medium">Security Code</p>
                    <Inputs
                      type="text"
                      name="securityCode"
                      value={formData.securityCode}
                      onChange={handleChange}
                      placeholder="CVV"
                      className="text-sm mt-2 w-full bg-transparent focus:border-[#3DC1C4] focus:outline-none"
                    />
                    <div className="border-b border-[#DBDBDB] mt-2"></div>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-lg font-medium">Address</p>
                  <Inputs
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    className="text-sm mt-2 w-full bg-transparent focus:border-[#3DC1C4] focus:outline-none"
                  />
                  <div className="border-b border-[#DBDBDB] mt-2"></div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <Inputs
                    type="checkbox"
                    name="adaCompliant"
                    checked={formData.adaCompliant}
                    onChange={handleChange}
                    className="w-5 h-5 border border-[#D9D9D9] rounded-sm"
                  />
                  <label className="text-sm sm:text-base text-[#0D0D0D]">
                    ADA standards Compliant
                  </label>
                </div>
              </div>

              <div className="mt-8">
                {/* Reserve Now */}
                <Button
                  label="Reserve Now"
                  onClick={handleReserveClick}
                  size="full"
                />
              </div>

              <p className="text-sm text-center mt-4 text-[#0D0D0D]">
                By reserving, you agree to our Terms & Conditions
              </p>
            </div>

            {/* Booking Summary */}
            <div className="lg:w-[40%] bg-[#FCFCFC] xl:w-[35%] border border-[#DBDBDB] rounded-2xl p-6 lg:sticky lg:top-4 lg:self-start">
              <div className="flex justify-between items-center">
                <p className="text-lg text-[#040401] sm:text-xl font-medium">
                  Booking Summary
                </p>
                <p className="text-sm sm:text-base text-[#6C6C6C]">
                  Quote #1238307
                </p>
              </div>
              <div className="border-b border-[#DBDBDB] my-4"></div>

              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex text-[#0D0D0D] justify-between">
                  <p>Base fare (1x Sprinter)</p>
                  <p>$1,528.19</p>
                </div>
                <div className="flex text-[#0D0D0D] justify-between">
                  <p>Our service fee</p>
                  <p>$45.85</p>
                </div>
                <div className="border-b border-[#DBDBDB] my-4"></div>
                <div className="flex text-[#0D0D0D] justify-between font-medium text-base sm:text-lg">
                  <p>Total (USD)</p>
                  <p>$1,574.04</p>
                </div>
              </div>

              <div className="bg-[#F6F6F6] rounded-xl text-center py-4 mt-6">
                <p className="font-medium text-[#000000] text-base">Due now</p>
                <p className="font-bold text-xl text-[#000000] sm:text-2xl mt-2">
                  $1,574.04
                </p>
              </div>

              <div className="flex justify-between items-center mt-6">
                <p className="font-medium text-lg">Round trip</p>
                <button className="text-base font-medium underline underline-offset-1 text-[#00A6F2] hover:underline cursor-pointer">
                  Edit trip
                </button>
              </div>

              <div className="flex justify-between mt-4 text-sm sm:text-base text-[#000000]">
                <p>Trip to Weehawken</p>
                <p>Passengers × 2</p>
              </div>

              <div className="mt-6">
                <img
                  src="/images/suv2.png"
                  alt="SUV Vehicle"
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
            </div>
          </div>

          {/* Why Choose Section */}
          <div className="mt-20 text-center">
            <p className="text-4xl font-bold">Why Choose eCharter?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
            <div className="border bg-[#FCFCFC] border-[#DBDBDB] rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-200">
              <img
                src="/images/Support.png"
                alt="Support"
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4"
              />
              <p className="text-lg font-semibold">24/7 Support</p>
              <p className="text-base mt-2 text-gray-600">
                Our award-winning customer support is here for you.
              </p>
            </div>

            <div className="border bg-[#FCFCFC] border-[#DBDBDB] rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-200">
              <img
                src="/images/Live-Tracker.png"
                alt="Live Tracking"
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4"
              />
              <p className="text-lg font-semibold">Live tracking</p>
              <p className="text-base mt-2 text-gray-600">
                Real-time bus tracking from the first day of your trip.
              </p>
            </div>

            <div className="border bg-[#FCFCFC] border-[#DBDBDB] rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-200 md:col-span-2 lg:col-span-1">
              <img
                src="/images/Price.png"
                alt="Unbeatable Prices"
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4"
              />
              <p className="text-lg font-semibold">Unbeatable prices</p>
              <p className="text-base mt-2 text-gray-600">
                Largest marketplace for charter buses in Canada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page5;
