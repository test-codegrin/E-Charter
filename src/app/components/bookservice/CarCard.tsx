"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
interface CarCardProps {
  title: string;
  subtitle: string;
  image: string;
  passengers: number;
  mileage: string;
  fuel: string;
  location: string;
  price: string;
  features: string[];
}

const CarCard: React.FC<CarCardProps> = ({
  title,
  subtitle,
  image,
  passengers,
  mileage,
  fuel,
  location,
  price,
}) => {
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="bg-[#FCFCFC] border border-[#DBDBDB] rounded-2xl px-4 sm:px-6 pt-6 sm:pt-[37px] pb-6 flex flex-col lg:flex-col xl:flex-row gap-6 w-full mx-auto">
        {/* Image Section */}
        <div className="lg:w-[100%] xl:w-[525px] flex justify-center items-center">
          <img
            src={`/images/${image}`}
            alt={title}
            className="w-full h-auto max-h-48 object-contain"
          />
        </div>

        {/* Content Section */}
        <div className="lg:w-[100%] flex flex-col md:flex-row gap-6">
          {/* Car Details */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>
              <p className="text-sm sm:text-base text-[#616161]">{subtitle}</p>
            </div>

            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <img
                  src="/images/Passanger.png"
                  alt="Passengers"
                  className="w-5 h-5"
                />
                <span className="text-[#616161]">Passengers {passengers}</span>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src="/images/Mileage.png"
                  alt="Mileage"
                  className="w-5 h-5"
                />
                <span className="text-[#616161]">{mileage}</span>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src="/images/Diesel.png"
                  alt="Fuel type"
                  className="w-5 h-5"
                />
                <span className="text-[#616161]">{fuel}</span>
              </div>

              <div className="flex items-start gap-2">
                <img
                  src="/images/Map1.png"
                  alt="Location"
                  className="w-5 h-5 mt-1"
                />
                <p className="text-sm text-[#616161] leading-[1.7]">
                  {location}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing and Reservation */}
          <div className="md:w-60 flex flex-col gap-4 sm:gap-6">
            <div className="text-center border-b border-[#DBDBDB] pb-4">
              <p className="font-semibold text-[#616161] text-sm sm:text-base">
                Free Cancellation
              </p>
              <p className="text-[#3DC1C4] text-xs sm:text-sm">
                Free Cancellation · Online Check‑in · Pay at Pick‑Up
              </p>
            </div>

            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold">Total {price}</p>
            </div>  

            <Button label="Reserve" href="/services/page5" size="full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
