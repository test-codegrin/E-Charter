// pages/page4.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import PickupDropForm from "../../components/bookservice/PickupDropForm";
import OffersCard from "../../components/bookservice/OffersCard";
import CarCard from "../../components/bookservice/CarCard";
import { useTrip } from "../../context/tripContext";
import { ICON_DATA } from "@/app/constants/IconConstants";
import { ROUTES } from "@/app/constants/RoutesConstant";

const ReserveCar = () => {
  const router = useRouter();
  const { tripData } = useTrip();

  // Format date and time helper
  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return "Not set";
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format trip type helper
  const formatTripType = (type: string) => {
    switch (type) {
      case "single":
        return "Single Trip";
      case "round":
        return "Round Trip";
      case "multi":
        return "Multi Stop";
      default:
        return type;
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-4 2xl:px-2 max-w-[1320px] mx-auto mt-[70px] bg-white">
      <div className="bg-white sm:w-[500px] md:w-[600px] lg:w-full text-black min-h-screen w-full p-4 sm:p-6 lg:p-8 xl:p-12.5 2xl:px-0 mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push(ROUTES.PLAN_JOURNEY)}
          className="flex items-center cursor-pointer mb-6 text-primary hover:text-primary-dark font-medium transition-colors duration-200"
        >
          <Icon icon="mdi:arrow-left" className="mr-2 w-5 h-5" />
          Back to Journey Planning
        </button>

        {/* Trip Details Summary Section */}
        <div className="mb-8 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Icon
                icon="mdi:map-marker-path"
                className="text-primary w-7 h-7"
              />
              Trip Summary
            </h2>
            <button
              onClick={() => router.push(ROUTES.PLAN_JOURNEY)}
              className="text-sm text-primary hover:text-primary-dark font-semibold underline transition-colors"
            >
              Edit Trip
            </button>
          </div>

          {/* Trip Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Trip Type */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon icon="mdi:routes" className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Trip Type</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatTripType(tripData.tripType)}
                  </p>
                </div>
              </div>
            </div>

            {/* Passengers */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon
                    icon="mdi:account-group"
                    className="text-primary w-5 h-5"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Passengers
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {tripData.persons}{" "}
                    {tripData.persons === 1 ? "Person" : "People"}
                  </p>
                </div>
              </div>
            </div>

            {/* Luggage */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon
                    icon="mdi:bag-suitcase"
                    className="text-primary w-5 h-5"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Luggage</p>
                  <p className="text-sm font-bold text-gray-900">
                    {tripData.luggageCount}{" "}
                    {tripData.luggageCount === 1 ? "Bag" : "Bags"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Locations and Times */}
          <div className="space-y-4">
            {/* Pickup, Stops, and Dropoff in flex row */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              {/* Pickup */}
              <div className="bg-white rounded-lg p-4 border-l-4 border-l-primary border border-gray-200 w-full flex flex-col h-full">
                <div className="flex items-start gap-3 h-full">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Icon
                      icon="mdi:map-marker"
                      className="text-white w-5 h-5"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col h-full">
                    <p className="text-xs text-gray-500 font-semibold mb-1">
                      PICKUP
                    </p>
                    <p className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
                      {tripData.pickupLocation || "Not set"}
                    </p>
                    <div className="flex flex-row gap-1 text-xs text-gray-600 mt-auto">
                      <p className="font-medium">Pickup Date-Time:</p>
                      <span className="font-normal">
                        {formatDateTime(tripData.pickupDateTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-Stop Locations (if any) */}
              {tripData.tripType === "multi" &&
                tripData.multiStops.length > 0 && (
                  <div className="flex flex-col gap-4 w-full">
                    {tripData.multiStops.map((stop, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-4 border-l-4 border-l-orange-400 border border-gray-200 flex flex-col h-full"
                      >
                        <div className="flex items-start gap-3 h-full">
                          <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col h-full">
                            <p className="text-xs text-gray-500 font-semibold mb-1">
                              STOP {index + 1}
                            </p>
                            <p className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
                              {stop.location || "Not set"}
                            </p>
                            {stop.date && (
                              <div className="flex flex-col gap-1 text-xs text-gray-600 mt-auto">
                                <p className="font-medium">Stop Date-Time:</p>
                                <span className="font-normal">
                                  {formatDateTime(stop.date)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* Dropoff */}
              <div className="bg-white rounded-lg p-4 border-l-4 border-l-primary border border-gray-200 w-full flex flex-col h-full">
                <div className="flex items-start gap-3 h-full">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Icon
                      icon="mdi:flag-checkered"
                      className="text-white w-5 h-5"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col h-full">
                    <p className="text-xs text-gray-500 font-semibold mb-1">
                      DROPOFF
                    </p>
                    <p className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
                      {tripData.dropoffLocation || "Not set"}
                    </p>
                    {tripData.tripType === "round" &&
                      tripData.returnDateTime && (
                        <div className="flex flex-row gap-1 text-xs text-gray-600 mt-auto">
                          <p className="font-medium">Return Date-Time:</p>
                          <span className="font-normal">
                            {formatDateTime(tripData.returnDateTime)}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          {(tripData.tripName ||
            tripData.eventType ||
            tripData.accessibleVehicle) && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                {tripData.tripName && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-gray-200">
                    <p className="text-xs font-medium text-gray-700">Trip Name</p>
                    <p className="text-xs font-medium text-gray-700">
                      {tripData.tripName}
                    </p>
                  </div>
                )}
                {tripData.eventType && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-gray-200">
                    <Icon
                      icon={ICON_DATA.CALENDAR}
                      className="text-primary w-4 h-4"
                    />
                    <span className="text-xs font-medium text-gray-700 capitalize">
                      {tripData.eventType}
                    </span>
                  </div>
                )}
                {tripData.accessibleVehicle && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-gray-200">
                    <Icon
                      icon={ICON_DATA.WHEELCHAIR}
                      className="text-primary w-4 h-4"
                    />
                    <span className="text-xs font-medium text-gray-700">
                      Accessible Vehicle
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Route Summary */}
          {tripData.routeSummary && (
            <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-around gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:map-marker-distance"
                    className="w-5 h-5 text-primary"
                  />
                  <div>
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="text-sm font-bold text-gray-800">
                      {(tripData.tripType === "round"
                        ? tripData.routeSummary.roundTripDropLengthInMeters /
                          1000
                        : tripData.routeSummary.lengthInMeters / 1000
                      ).toFixed(1)}{" "}
                      km
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:clock-fast"
                    className="w-5 h-5 text-primary"
                  />
                  <div>
                    <p className="text-xs text-gray-500">Travel Time</p>
                    <p className="text-sm font-bold text-gray-800">
                      {(() => {
                        const hours = Math.floor(
                          tripData.tripType === "round"
                            ? tripData.routeSummary
                                .roundTripDropTravelTimeInSeconds / 3600
                            : tripData.routeSummary.travelTimeInSeconds / 3600
                        );
                        const minutes = Math.floor(
                          (tripData.tripType === "round"
                            ? tripData.routeSummary
                                .roundTripDropTravelTimeInSeconds % 3600
                            : tripData.routeSummary.travelTimeInSeconds %
                              3600) / 60
                        );
                        return hours > 0
                          ? `${hours}h ${minutes}m`
                          : `${minutes} min`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 2xl:gap-0">
          {/* Offers Column */}
          <div className="flex flex-col gap-6 w-full lg:max-w-sm lg:top-4">
            <OffersCard
              title="Weekend Special"
              date="19‑05‑2025 to 25‑05‑2025"
              image="Weekend.png"
              description="Perfect for weekend getaways! Book any car for 2 days and get the 3rd day absolutely free."
              features={[
                "Valid for all car categories",
                "Free additional driver",
                "GPS navigation included",
                "Flexible pickup locations",
              ]}
              link="/"
            />

            <OffersCard
              title="Long‑Term Rentals"
              date="Save More, Rent Longer"
              image="Longterm.png"
              description="Planning an extended stay? Our monthly rental packages offer significant savings and added convenience."
              features={[
                "Up to 40% savings",
                "Flexible terms",
                "GPS navigation included",
                "Free maintenance",
              ]}
              link="/"
            />
          </div>

          {/* Cars Column */}
          <div className="2xl:ml-[30px] flex flex-col gap-6 xl:gap-8">
            <CarCard
              title="SCORPIO‑N"
              subtitle="The Big Daddy of SUVs"
              image="suv2.png"
              passengers={7}
              fuel="Diesel"
              mileage="Limited Mileage"
              location="Mercury Car Rentals Priv Ltd floor16, Premch, Row House 214, Ahmedabad, India 380054"
              price="$219"
              features={[
                "Automatic Transmission",
                "Air Conditioning",
                "Bluetooth",
                "Child Seat Available",
              ]}
            />

            <CarCard
              title="XUV700"
              subtitle="The Smart Beast of SUVs"
              image="Xuv700.png"
              passengers={4}
              fuel="Diesel"
              mileage="Limited Mileage"
              location="Mercury Car Rentals Priv Ltd floor16, Premch, Row House 214, Ahmedabad, India 380054"
              price="$219"
              features={[
                "Automatic Transmission",
                "Premium Sound System",
                "360° Camera",
                "Panoramic Sunroof",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReserveCar;
