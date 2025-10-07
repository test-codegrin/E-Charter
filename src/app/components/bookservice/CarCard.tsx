"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import { IMAGES_ASSETS } from "@/app/constants/ImageConstant";
import { ROUTES } from "@/app/constants/RoutesConstant";

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
  onReserve?: () => void; // Add optional callback prop
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
  onReserve, // Destructure the callback
}) => {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  // Determine image source with fallback
  const getImageSrc = () => {
    // If image load failed or image is empty/null, use fallback
    if (imgError || !image || image.trim() === "") {
      return IMAGES_ASSETS.TEMP_CAR;
    }

    // If image starts with http/https, use it directly (API images)
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // Otherwise, assume it's a local image in /images/ folder
    return `/images/${image}`;
  };

  // Handle image load error
  const handleImageError = () => {
    console.warn(`Failed to load image: ${image}. Using fallback.`);
    setImgError(true);
  };

  // Handle reserve button click
  const handleReserveClick = () => {
    // Call the onReserve callback if provided
    if (onReserve) {
      onReserve();
    }
    router.push(ROUTES.PAYMENT);
  };

  return (
    <div className="w-full">
      <div className="bg-[#FCFCFC] border border-[#DBDBDB] rounded-2xl px-4 sm:px-6 pt-6 sm:pt-[37px] pb-6 flex flex-col lg:flex-col xl:flex-row gap-6 w-full mx-auto">
        {/* Image Section */}
        <div className="lg:w-full xl:w-[525px] flex justify-center items-center bg-gray-50 rounded-lg">
          <img
            src={getImageSrc()}
            alt={title || "Car"}
            onError={handleImageError}
            className="w-full h-auto max-h-48 object-contain opacity-50"
            loading="lazy"
          />
        </div>

        {/* Content Section */}
        <div className="lg:w-full flex flex-col md:flex-row gap-6">
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

            {/* Update Button to use onClick instead of href */}
            <Button onClick={handleReserveClick} label="Reserve" href={ROUTES.PAYMENT} size="full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
